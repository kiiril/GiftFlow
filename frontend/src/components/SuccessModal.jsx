import React, {useEffect} from 'react';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';

const SuccessModal = ({
    show,
    title = "Success!",
    message,
    primaryButtonText = "OK",
    secondaryButtonText = "Cancel",
    onPrimaryClick,
    onSecondaryClick,
    showSecondaryButton = false,
    onClose,
    preventClose = false
}) => {
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget && !preventClose && onClose) {
            onClose();
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape' && !preventClose && onClose) {
            onClose();
        }
    };

    useEffect(() => {
        if (show && !preventClose) {
            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        }
    }, [show, preventClose]);

    return (
        show && (
            <div
                className="modal show d-block"
                tabIndex="-1"
                role="dialog"
                onClick={handleBackdropClick}
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header border-0 pb-0">
                            <h5 className="modal-title text-success fw-bold">
                                <i className="bi bi-check-circle-fill me-2"></i>
                                {title}
                            </h5>
                            {!preventClose && onClose && (
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={onClose}
                                    aria-label="Close"
                                ></button>
                            )}
                        </div>
                        <div className="modal-body pt-2">
                            <p className="mb-0 text-muted">
                                {message}
                            </p>
                        </div>
                        <div className="modal-footer border-0 pt-0">
                            <div className={`d-flex gap-3 w-100 ${showSecondaryButton ? 'justify-content-between' : 'justify-content-end'}`}>
                                {showSecondaryButton && (
                                    <SecondaryButton
                                        text={secondaryButtonText}
                                        onClick={onSecondaryClick}
                                        className="flex-grow-1"
                                    />
                                )}
                                <PrimaryButton
                                    text={primaryButtonText}
                                    onClick={onPrimaryClick}
                                    className={showSecondaryButton ? "flex-grow-1" : ""}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    );
};

export default SuccessModal;
