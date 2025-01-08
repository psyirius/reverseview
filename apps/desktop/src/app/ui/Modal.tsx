import {Component} from "preact";
import {createPortal} from 'preact/compat';

// classList polyfill: https://github.com/eligrey/classList.js

interface Props {
    isOpen: boolean;
    onClose: () => void;
    children: any;
    title?: string;
    width?: string;
    zIndex?: number;
    height?: string;
}

interface State {
}

class Modal extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.isOpen && !prevProps.isOpen) {
            this.addClass(document.body, 'modal-open')
        } else if (!this.props.isOpen && prevProps.isOpen) {
            this.removeClass(document.body, 'modal-open')
        }
    }

    componentWillUnmount() {
        if (this.props.isOpen) {
            this.removeClass(document.body, 'modal-open')
        }
    }

    addClass = (element: HTMLElement, className: string) => {
        if (element && element.className) {
            const classes = element.className.split(' ');
            if (classes.indexOf(className) === -1) {
                classes.push(className);
                element.className = classes.join(' ');
            }
        } else {
            element.className = className
        }
    };

    removeClass = (element: HTMLElement, className: string) => {
        if (element && element.className) {
            const classes = element.className.split(' ');
            const index = classes.indexOf(className);
            if (index !== -1) {
                classes.splice(index, 1);
                element.className = classes.join(' ');
            }
        }
    };

    handleBackdropClick = (event: any) => {
        if (event.target === event.currentTarget) {
            this.props.onClose();
        }
    };

    render() {
        const {isOpen, onClose, children, title, height, width = '80%', zIndex = 1001} = this.props;

        if (!isOpen) return null;

        return createPortal(
            <div class="x-u-i mdl" style={{ zIndex }}>
                <div class="modal-backdrop" onClick={this.handleBackdropClick}>
                    <div class="modal" style={{ width, height }}>
                        <div class="modal-header">
                            {title && <h2 class="modal-title">{title}</h2>}
                            <button class="modal-close-button" onClick={onClose}>
                                <i class="ui times circle icon"></i>
                            </button>
                        </div>
                        <div class="modal-content">
                            {children}
                        </div>
                    </div>
                </div>
            </div>,
            document.body
        );
    }
}

export default Modal;