package {
    public class NexController extends EventDispatcher {
        private var extContext:ExtensionContext;

        public function NexController() {
            var extDir:File = ExtensionContext.getExtensionDirectory("com.example.NexController");
            extContext = ExtensionContext.createExtensionContext("com.example.NexController", "channel");
        }

        public function set currentChannel(channelToSet:int):void {
            extContext.call("setDeviceChannel", channelToSet);
        }

        public function get currentChannel():int {
            channel = int (extContext.call("getDeviceChannel"));
            return channel;
        }

        public function dispose (): void {
            extContext.dispose();
            // Clean up other resources this instance uses.
        }
    }
}