import {
    fx_rights_t,
    fx_status_t,
    fx_txid_t,
    fx_signals_t,
    FX_RIGHT_NONE,
    Status,
    Signal,
    fx_koid_t,
    u32,
    FX_KOID_INVALID
} from '@meshx-org/fiber-kernel-types'
import { Dispatcher } from './dispatcher'
import { KernelHandle } from './handle'
import Denque from 'denque'
import { ProcessDispatcher } from './process_dispatcher'

const kWarnPendingMessageCount = 80
const kMaxPendingMessageCount = 100

function isKernelGeneratedTxid(txid: fx_txid_t): boolean {
    return false
}

class PeerHolder {}
class MessagePacket {
    public getTxid(): fx_txid_t {
        return 0
    }
    public setTxid(txid: fx_txid_t) {}
}

class MessageWaiter {
    public cancel(status: fx_status_t) {}
    public deliver(msg: MessagePacket) {}
    public getTxid(): fx_txid_t {
        return 0
    }
    public setTxid(txid: fx_txid_t) {}
}

type Option<T> = T | null

abstract class PeerDispatcher extends Dispatcher {
    protected peer_has_closed_: boolean = false
    private peer_: typeof this | null = null

    public initPeer(peer: typeof this) {
        this.peer_ = peer
    }

    public peer(): typeof this | null {
        return this.peer_
    }
}

export class ChannelDispatcher extends PeerDispatcher {
    private waiters_: Array<MessageWaiter> = []
    private messages_: Denque<any> = new Denque()
    private owner_: fx_koid_t = FX_KOID_INVALID
    private max_message_count_: u32 = 0

    protected on_handle_count_zero(): void {
        // (3A) Abort any waiting Call operations
        // because we've been canceled by reason
        // of our local handle going away.
        // Remove waiter from list.
        while (this.waiters_.length !== 0) {
            let waiter = this.waiters_.shift()
            waiter!.cancel(Status.ERR_CANCELED)
        }
    }

    public set_owner(new_owner: fx_koid_t): void {
        // Testing for FX_KOID_INVALID is an optimization so we don't
        // pay the cost of grabbing the lock when the endpoint moves
        // from the process to channel; the one that we must get right
        // is from channel to new owner.
        if (new_owner == FX_KOID_INVALID) {
            return
        }

        this.owner_ = new_owner
    }

    // This method should never acquire |get_lock()|.  See the comment at |channel_lock_| for details.
    public read(
        owner: fx_koid_t,
        msg_size_: u32,
        msg_handle_count_: u32,
        may_discard: boolean
    ): [fx_status_t, Option<MessagePacket>] {
        const max_size = msg_size_
        const max_handle_count = msg_handle_count_

        if (owner != this.owner_) {
            return [Status.ERR_BAD_HANDLE, null]
        }

        if (this.messages_.isEmpty()) {
            return [this.peer_has_closed_ ? Status.ERR_PEER_CLOSED : Status.ERR_SHOULD_WAIT, null]
        }

        const msg_size = this.messages_.peekFront().data_size()
        const msg_handle_count = this.messages_.peekFront().num_handles()
        let status: fx_status_t = Status.OK

        if (msg_size > max_size || msg_handle_count > max_handle_count) {
            if (!may_discard) {
                return [Status.ERR_BUFFER_TOO_SMALL, null]
            }

            status = Status.ERR_BUFFER_TOO_SMALL
        }

        const msg = this.messages_.shift()

        if (this.messages_.isEmpty()) {
            this.clearSignals(Signal.CHANNEL_READABLE)
        }

        return [status, msg]
    }

    public write(owner: fx_koid_t, msg: MessagePacket): fx_status_t {
        // Failing this test is only possible if this process has two threads racing:
        // one thread is issuing channel_write() and one thread is moving the handle
        // to another process.
        if (owner != this.owner_) {
            return Status.ERR_BAD_HANDLE
        }

        if (!this.peer()) {
            return Status.ERR_PEER_CLOSED
        }

        if (this.peer()!.tryWriteToMessageWaiter(msg)) {
            return Status.OK
        }

        this.peer()!.writeSelf(msg)

        return Status.OK
    }

    public writeSelf(msg: MessagePacket): void {
        // Once we've acquired the channel_lock_ we're going to make a copy of the previously active
        // signals and raise the READABLE signal before dropping the lock.  After we've dropped the lock,
        // we'll notify observers using the previously active signals plus READABLE.
        //
        // There are several things to note about this sequence:
        //
        // 1. We must hold channel_lock_ while updating the stored signals (RaiseSignalsLocked) to
        // synchronize with thread adding, removing, or canceling observers otherwise we may create a
        // spurious READABLE signal (see NoSpuriousReadableSignalWhenRacing test).
        //
        // 2. We must release the channel_lock_ before notifying observers to ensure that Read can execute
        // concurrently with NotifyObserversLocked, which is a potentially long running call.
        //
        // 3. We can skip the call to NotifyObserversLocked if the previously active signals contained
        // READABLE (because there can't be any observers still waiting for READABLE if that signal is
        // already active).
        let previous_signals: fx_signals_t = 0

        {
            this.messages_.push(msg)
            previous_signals = this.raiseSignals(Signal.CHANNEL_READABLE)
            const size = this.messages_.size()

            if (size > this.max_message_count_) {
                this.max_message_count_ = size
            }

            // TODO(cpu): Remove this hack. See comment in kMaxPendingMessageCount definition.
            if (size >= kWarnPendingMessageCount) {
                if (size == kWarnPendingMessageCount) {
                    const process = ProcessDispatcher.getCurrent()
                    const pname = process.getName()

                    console.log(
                        'KERN: warning! channel (%zu) has %zu messages (%s) (write).\n',
                        this.getKoid(),
                        size,
                        pname
                    )
                } else if (size > kMaxPendingMessageCount) {
                    const process = ProcessDispatcher.getCurrent()

                    const pname = process.getName()

                    console.log(
                        'KERN: channel (%zu) has %zu messages (%s) (write). Raising exception.\n',
                        this.getKoid(),
                        size,
                        pname
                    )

                    // Thread.Current-SignalPolicyException(ZX_EXCP_POLICY_CODE_CHANNEL_FULL_WRITE, 0u);
                    // kcounter_add(channel_full, 1);
                }
            }
        }

        // Don't bother waking observers if Signal.CHANNEL_READABLE was already active.
        if ((previous_signals & Signal.CHANNEL_READABLE) == 0) {
            this.notifyObservers(previous_signals | Signal.CHANNEL_READABLE)
        }
    }

    private tryWriteToMessageWaiter(msg: MessagePacket): boolean {
        if (this.waiters_.length === 0) {
            return false
        }
        // If the far side has "call" waiters waiting for replies, see if this message's txid matches one
        // of them.  If so, deliver it.  Note, because callers use a kernel generated txid we can skip
        // checking the list if this message's txid isn't kernel generated.
        const txid: fx_txid_t = msg.getTxid()
        if (!isKernelGeneratedTxid(txid)) {
            return false
        }

        for (let waiter of this.waiters_) {
            // (3C) Deliver message to waiter.
            // Remove waiter from list.
            if (waiter.getTxid() == txid) {
                this.waiters_.splice(this.waiters_.indexOf(waiter), 1)
                waiter.deliver(msg)
                return true
            }
        }
        return false
    }

    private notifyObservers(signals: fx_signals_t) {}
    private raiseSignals(signals: fx_signals_t): fx_signals_t {
        return 0
    }
    private clearSignals(signals: u32) {}

    private constructor(holder: PeerHolder) {
        super()
    }

    protected static default_rights(): fx_rights_t {
        return FX_RIGHT_NONE
    }

    static create(): [Status, KernelHandle<ChannelDispatcher>, KernelHandle<ChannelDispatcher>, fx_rights_t] {
        let holder0 = new PeerHolder()
        let holder1 = holder0

        const handle0 = new KernelHandle(new ChannelDispatcher(holder0))
        const handle1 = new KernelHandle(new ChannelDispatcher(holder1))

        handle0.dispatcher().initPeer(handle1.dispatcher())
        handle1.dispatcher().initPeer(handle0.dispatcher())

        const rights = ChannelDispatcher.default_rights()

        return [Status.OK, handle0, handle1, rights]
    }
}
