package {
    import flash.display.Sprite;

    import flash.display.NativeWindow;
    import flash.display.NativeWindowInitOptions;
    import flash.display.NativeWindowRenderMode;
    import flash.display.NativeWindowSystemChrome;
    import flash.display.NativeWindowType;
    import flash.events.KeyboardEvent;
    import flash.events.NativeWindowBoundsEvent;
    import flash.ui.Keyboard;

    public class AppEntry extends Sprite {
        public function AppEntry() {
            trace("AppEntry: Hello, World!");

            var initOptions:NativeWindowInitOptions = new NativeWindowInitOptions();

            initOptions.systemChrome = NativeWindowSystemChrome.STANDARD;
            initOptions.type = NativeWindowType.NORMAL;
            initOptions.resizable = true;
    //        initOptions.transparent = true;
            initOptions.maximizable = true;
            initOptions.minimizable = true;
            initOptions.renderMode = NativeWindowRenderMode.DIRECT;

            var newWindow:NativeWindow = new NativeWindow(initOptions);

            newWindow.stage.addEventListener(KeyboardEvent.KEY_DOWN, function(event:KeyboardEvent):void {
                if (event.keyCode == Keyboard.ESCAPE) {
                    newWindow.close();
                }
            });

            newWindow.addEventListener(NativeWindowBoundsEvent.RESIZE, onWindowResize);

            newWindow.activate();
        }

        private function onWindowResize(event:NativeWindowBoundsEvent):void {
            trace("AppEntry: Window Move!");
        }
    }
}