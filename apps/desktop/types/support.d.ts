declare global {
    namespace runtime {
        namespace air {
            namespace net {
                namespace websockets {
                    class ClientEntry {}

                    class WebSocket extends flash.events.EventDispatcher {}

                    class WebSocketServer extends flash.events.EventDispatcher {}
                }
            }
        }
    }
}

export = runtime;
