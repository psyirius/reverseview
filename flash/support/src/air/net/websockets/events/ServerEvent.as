package air.net.websockets.events {
import flash.events.Event;

public class ServerEvent extends Event {
    public static const SERVER_BOUND_SUCCESS:String = "SERVER_BOUND_SUCCESS";

    public function ServerEvent(kind:String) {
        super(kind);
    }
}
}
