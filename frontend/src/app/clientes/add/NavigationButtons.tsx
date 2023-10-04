import ChevronLeft from '@/modules/icons/ChevronLeft';

import Button from '@/components/Button';

type NavigationButtonsProps = {
    isUniqueStep?: boolean;
    isLastStep?: boolean;
    onPrevious?: () => void;
    onNext?: () => void;
    onCancel: () => void;
    onSubmit: () => void;
};

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
    isUniqueStep,
    isLastStep,
    onPrevious,
    onNext,
    onCancel,
    onSubmit,
}) => {
    if (isUniqueStep) {
        return (
            <div className="mt-auto flex justify-end space-x-16 border-t border-gray-200 py-6">
                <button onClick={onCancel} className="font-headings text-sm">
                    Cancelar
                </button>
                <Button onClick={onSubmit}>Guardar</Button>
            </div>
        );
    }

    if (!isLastStep) {
        return (
            <div className="mt-auto flex justify-end space-x-16 border-t border-gray-200 py-6">
                <button onClick={onCancel} className="font-headings text-sm">
                    Cancelar
                </button>
                <Button onClick={onNext}>Siguiente</Button>
            </div>
        );
    }

    return (
        <div className="mt-auto flex justify-between border-t border-gray-200 py-6">
            <button
                onClick={onPrevious}
                className="flex items-center space-x-3 font-headings text-sm"
            >
                <ChevronLeft /> <span>Atrás</span>
            </button>

            <div className="flex justify-end space-x-16">
                <button className="font-headings text-sm" onClick={onCancel}>
                    Cancelar
                </button>
                <Button onClick={onSubmit}>Guardar</Button>
            </div>
        </div>
    );
};

export default NavigationButtons;
