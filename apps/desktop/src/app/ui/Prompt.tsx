import {render} from "preact";
import {useEffect, useState} from "preact/hooks";
import Modal from "@app/ui/Modal";

function AlertBox({ open, onCancel, onOk, title, message, showInput, input = undefined }) {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState(input);

    useEffect(() => {
        setIsOpen(open);
    }, [open]);

    useEffect(() => {
        setInputValue(input);
    }, [input]);

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

                    {showInput && (
                        <input type="text" value={inputValue} onChange={(e) => {
                            setInputValue(e.currentTarget.value)
                        }} />
                    )}
                </div>

                <div class="ui basic buttons">
                    <button class="ui primary icon button" tabIndex={0} onClick={() => onOk(inputValue)}>
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

function showPrompt({ title, message, onOk, onCancel, showInput = false, input = undefined }) {
    // Create a container element if it doesn't exist
    if (!promptContainer) {
        promptContainer = document.createElement('div');
        promptContainer.id = 'prompt-container'; // For easy targeting
        document.body.appendChild(promptContainer);
    }

    const handleOk = (value?: any) => {
        onOk?.(value);
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
            showInput={showInput}
            input={input}
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