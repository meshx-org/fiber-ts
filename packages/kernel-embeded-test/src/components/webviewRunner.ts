interface IWebviewComponent {
    id: number
}

interface IWebviewComponentProvider {
    onCreate(created: IWebviewComponent): Promise<void>
    onDestroy(): Promise<void>
}

export const webviewComponentProvider = {
    onCreate: data => {},
    onDestroy: () => {}
}

async function webviewComponentRunner() {
    webviewComponentProvider.onCreate({ id: 123 })
}
