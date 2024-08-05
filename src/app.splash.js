rvw.provide("rvw.window").Splash = {
    // private
    __instance: null,
    __exec(show = true) {
        const {
            Screen,
            Rectangle,
            NativeWindowInitOptions,
            NativeWindowSystemChrome,
            NativeWindowType,
            HTMLLoader,
            URLRequest,
        } = air;

        if (show) {
            const mainScreen = Screen.mainScreen;
            const screenBounds = mainScreen.visibleBounds;

            const width/*: number*/ = 540;
            const height/*: number*/ = 140;

            const centeredWindowRect = new Rectangle(
                (screenBounds.left + screenBounds.right - width) / 2,
                (screenBounds.top + screenBounds.bottom - height) / 2,
                width,
                height,
            );

            const options = new NativeWindowInitOptions();
            options.maximizable = false;
            options.minimizable = false;
            options.resizable = false;
            options.transparent = true;
            options.systemChrome = NativeWindowSystemChrome.NONE;
            options.type = NativeWindowType.NORMAL;

            const htmlWindow = HTMLLoader.createRootWindow(
                /* visible: */ true,
                /* windowInitOptions: */ options,
                /* scrollBarsVisible: */ false,
                /* bounds: */ centeredWindowRect,
            );
            htmlWindow.window.nativeWindow.alwaysInFront = true;
            htmlWindow.load(
                new URLRequest("splash.htm")
            );

            this.__instance = htmlWindow;
        } else {
            const instance = this.__instance;
            if (instance != null) {
                instance.window.nativeWindow.close();
                this.__instance = null;
            }
        }
    },
    // public
    show() {
        this.__exec(true);
    },
    close() {
        this.__exec(false);
    }
};