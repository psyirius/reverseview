import {Component, render} from "preact";

interface Toast {
    id: number;
    message: string;
    duration?: number;
    type: 'success' | 'error' | 'info' | 'default';
    header?: string;
    startTime?: number;
    remaining?: number;
    intervalId?: number;
}

interface Props {
    position?:
        | 'top-left'
        | 'top-center'
        | 'top-right'
        | 'bottom-left'
        | 'bottom-center'
        | 'bottom-right';
}

interface State {
    toasts: Toast[];
}

class Toaster extends Component<Props, State> {
    static nextId = 0;

    constructor(props: Props) {
        super(props);

        this.state = {
            toasts: [],
        };
    }

    addToast = (message: string, options?: Partial<Toast>) => {
        const startTime = Date.now();

        const toast: Toast = {
            id: Toaster.nextId++,
            type: 'default',
            message,
            startTime,
            ...options,
            remaining: options?.duration,
        };

        this.setState(
            (prevState) => ({ toasts: [...prevState.toasts, toast] }),
            () => {
                if (toast.duration) {
                    const intervalId = setInterval(() => {
                        this.updateRemainingTime(toast.id);
                    }, 100)
                    this.setState(prevState => ({
                        toasts: prevState.toasts.map(t => t.id === toast.id ? {...t, intervalId} : t)
                    }))
                    setTimeout(() => {
                        this.removeToast(toast.id);
                    }, toast.duration);
                }
            }
        );
    };

    updateRemainingTime = (id: number) => {
        this.setState((prevState) => ({
            toasts: prevState.toasts.map((toast) => {
                if (toast.id === id) {
                    const remaining =  Math.max(0, (toast.duration || 0) - (Date.now() - (toast.startTime || 0)));
                    return { ...toast, remaining };
                }
                return toast;
            }),
        }));
    };

    removeToast = (id: number) => {
        this.setState((prevState) => ({
            toasts: prevState.toasts.filter((toast) => {
                    if(toast.id===id && toast.intervalId){
                        clearInterval(toast.intervalId);
                    }
                    return toast.id !== id;
                }
            ),
        }));
    };

    render() {
        const { position = 'bottom-right' } = this.props;
        return (
            <div class={`toaster ${position}`}>
                {this.state.toasts.map((toast) => (
                    <div
                        key={toast.id}
                        class={`toast-container ${toast.type} toast-enter`}
                    >
                        {toast.header && <div class="toast-header">{toast.header}</div>}
                        <div class="toast-message">{toast.message}</div>
                        {toast.duration &&
                            <div class="progress-bar-container">
                                <div
                                    class="progress-bar"
                                    style={{ width: `${(toast.duration ? (1 - (toast.remaining || 0) / toast.duration) * 100 : 0)}%` }}
                                />
                            </div>
                        }
                        <button
                            class="toast-close-button"
                            onClick={() => this.removeToast(toast.id)}
                        >
                            X
                        </button>
                    </div>
                ))}
            </div>
        );
    }
}

// Helper function to show a toast programmatically
export const toast = (() => {
    let toasterInstance: any = null
    const TOAST_CONTAINER_ID = 'xonner';

    return (message: string, options?: Partial<Toast>) => {
        if (toasterInstance === null) {
            const container = document.getElementById(TOAST_CONTAINER_ID) || (() => {
                const el = document.createElement('div');
                el.id = TOAST_CONTAINER_ID;
                document.body.appendChild(el);
                return el;
            })();

            render(
                <Toaster position="bottom-right" ref={(instance) => {
                    toasterInstance = instance;
                }}/>,
                container
            );
        }

        toasterInstance.addToast(message, options);
    };
})();

export default Toaster;