/* eslint-disable no-restricted-syntax */

import { System } from 'packages/fiber-sdk/src'
import { webviewComponents } from './atoms'

async function wasmComponentRunner() {}

async function flowComponentRunner() {}

async function componentManager() {
    for await (const iterator of object) {
    }
}

async function rootProcess() {
    const { status, handle } = await System.processCreate(1, 'component-manager', componentManager)

    if (status === 0) await System.processStart(handle!, 0)
}
