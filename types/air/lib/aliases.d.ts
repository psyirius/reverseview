declare global {
  namespace air {
    type URLRequest = runtime.flash.net.URLRequest;

    enum NativeWindowSystemChrome {
      ALTERNATE = 'alternate',
      NONE = 'none',
      STANDARD = 'standard',
    }

    enum NativeWindowType {
      LIGHTWEIGHT = 'lightweight',
      NORMAL = 'normal',
      UTILITY = 'utility',
    }

    // // workers
    // interface Worker {}
    // interface WorkerDomain {}
    // interface WorkerState {}
    // interface MessageChannelState {}
    // interface Condition {}
    // interface Mutex {}

    // functions
    function trace(... arguments: any[]): void;

    function navigateToURL(request: URLRequest, window?: string): void;

    function sendToURL(request: URLRequest): void;

    // // file
    // interface File {}
    // interface FileStream {}
    // interface FileMode {}

    // interface StorageVolumeInfo {}

    // // events
    // interface ActivityEvent {}
    // interface AsyncErrorEvent {}
    // interface BrowserInvokeEvent {}
    // interface DataEvent {}
    // interface DRMAuthenticateEvent {}
    // interface DRMStatusEvent {}
    // interface ErrorEvent {}
    // interface Event {}
    // interface EventDispatcher {}
    // interface FileListEvent {}
    // interface HTTPStatusEvent {}
    // interface IOErrorEvent {}
    // interface InvokeEvent {}
    // interface InvokeEventReason {}
    // interface NetStatusEvent {}
    // interface OutputProgressEvent {}
    // interface ProgressEvent {}
    // interface SecurityErrorEvent {}
    // interface StatusEvent {}
    // interface TimerEvent {}
    // interface SampleDataEvent {}
    // interface DatagramSocketDataEvent {}
    // interface DNSResolverEvent {}
    // interface ServerSocketConnectEvent {}
    // interface StorageVolumeChangeEvent {}
    // interface NativeProcessExitEvent {}
    // interface UncaughtErrorEvent {}
    // interface MouseEvent {}

    // // native window
    // interface NativeWindow {}
    // interface NativeWindowDisplayState {}
    // interface NativeWindowInitOptions {}
    // interface NativeWindowSystemChrome {}
    // interface NativeWindowResize {}
    // interface NativeWindowType {}

    // interface NativeWindowBoundsEvent {}
    // interface NativeWindowDisplayStateEvent {}

    // // geometry
    // interface Point {}
    // interface Rectangle {}
    // interface Matrix {}

    // ...
    const File: any;
    const Screen: any;
    const Rectangle: any;
    const HTMLLoader: any;
    const URLRequest: any;
    const SourceViewer: any;
    const NativeWindowInitOptions: any;
  }
}

export = air;
