import {render} from "preact";
import {useEffect, useState} from "preact/hooks";
import Modal from "@app/ui/Modal";

function AlertBox({ open, onCancel, onOk, title, message }) {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setIsOpen(open);
    }, [open]);

    return (
        <Modal
            title={title}
            isOpen={isOpen}
            onClose={onCancel}
            zIndex={9999}
            width="320px"
        >
            <div class="ui form">
                <div class="field">
                    <label>{message}</label>
                </div>

                <div class="ui basic buttons">
                    <button class="ui primary icon button" tabIndex={0} onClick={() => onOk()}>
                        OK
                    </button>
                    <button class="ui secondary icon button" tabIndex={0} onClick={() => onCancel()}>
                        Cancel
                    </button>
                </div>
            </div>
        </Modal>
    );
}

let promptContainer = null; // Keep track of the container

function showPrompt({ title, message, onOk, onCancel }) {
    // Create a container element if it doesn't exist
    if (!promptContainer) {
        promptContainer = document.createElement('div');
        promptContainer.id = 'prompt-container'; // For easy targeting
        document.body.appendChild(promptContainer);
    }

    const handleOk = () => {
        onOk?.();
        removePrompt();
    };

    const handleCancel = () => {
        onCancel?.();
        removePrompt();
    };

    render(
        <AlertBox
            title={title}
            message={message}
            onOk={handleOk}
            onCancel={handleCancel}
            open={true}
        />,
        promptContainer
    );
}

function removePrompt() {
    if (promptContainer) {
        render(null, promptContainer); // Unmount the component
    }
}

export { showPrompt };