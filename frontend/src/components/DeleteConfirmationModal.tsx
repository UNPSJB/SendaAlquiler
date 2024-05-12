import clsx from 'clsx';
import { useEffect, useRef } from 'react';

import Portal from './Portal';
import Spinner from './Spinner/Spinner';

type DeleteConfirmationModalProps = {
    confirmationText: React.ReactNode;
    isDeleting: boolean;
    onCancelClick: () => void;
    onConfirmClick: () => void;
};

const DeleteConfirmationModal = ({
    confirmationText,
    isDeleting,
    onCancelClick,
    onConfirmClick,
}: DeleteConfirmationModalProps) => {
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = ({ target }: { target: EventTarget | null }) => {
            if (
                contentRef.current &&
                target instanceof HTMLElement &&
                !contentRef.current.contains(target as Node)
            ) {
                onCancelClick();
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onCancelClick();
            }
        };

        document.addEventListener('click', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('click', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <Portal>
            <div className="fixed inset-0 z-50">
                <div className="fixed inset-0 bg-black/50"></div>

                <div className="relative">
                    <div className="container flex h-screen items-center justify-center">
                        <div
                            className="mx-auto rounded bg-white px-8 pb-8 pt-4 lg:w-9/12"
                            ref={contentRef}
                        >
                            <div className="mb-4 flex justify-end">
                                <button
                                    disabled={isDeleting}
                                    className={clsx(
                                        'size-3 hover:opacity-50',
                                        isDeleting && 'pointer-events-none opacity-30',
                                    )}
                                    aria-label="Cerrar"
                                    onClick={onCancelClick}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 320 512"
                                    >
                                        <path d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z" />
                                    </svg>
                                </button>
                            </div>

                            <div className="mb-8 text-center">
                                <p className="mb-4 text-lg">{confirmationText}</p>
                                <p className="text-sm text-muted-foreground">
                                    Esta acción es irreversible
                                </p>
                            </div>

                            <div className="flex justify-center space-x-4 text-sm">
                                <button
                                    disabled={isDeleting}
                                    className={clsx(
                                        'min-w-[6rem] rounded-lg border border-black px-3 py-2 font-bold hover:bg-black hover:text-white',
                                        isDeleting && 'pointer-events-none opacity-30',
                                    )}
                                    onClick={onCancelClick}
                                >
                                    Cancelar
                                </button>
                                <button
                                    disabled={isDeleting}
                                    onClick={() => {
                                        if (isDeleting) return;
                                        onConfirmClick();
                                    }}
                                    className={clsx(
                                        'relative min-w-[6rem] rounded-lg bg-red-500 px-3 py-2 font-bold text-white hover:bg-red-300',
                                        isDeleting && 'pointer-events-none',
                                    )}
                                >
                                    <span className={clsx(isDeleting && 'invisible')}>
                                        Sí
                                    </span>

                                    {isDeleting && (
                                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                                            <Spinner className="border-b-black" />
                                        </div>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Portal>
    );
};

export default DeleteConfirmationModal;
