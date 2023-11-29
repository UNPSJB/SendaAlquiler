import Link from 'next/link';

import ChevronLeft from '@/modules/icons/ChevronLeft';

import Button from '@/components/Button';

export type NavigationButtonsCancelProps =
    | {
          onCancel: () => void;
      }
    | {
          cancelHref: string;
      };

type NavigationButtonsProps = {
    isUniqueStep?: boolean;
    isLastStep?: boolean;
    onPrevious?: () => void;
    onNext?: () => void;
    onSubmit: () => void;
} & NavigationButtonsCancelProps;

const Cancel: React.FC<NavigationButtonsCancelProps> = (props) => {
    if ('onCancel' in props) {
        return (
            <button onClick={props.onCancel} className="font-headings text-sm">
                Cancelar
            </button>
        );
    }

    return (
        <Link href={props.cancelHref} className="font-headings text-sm">
            Cancelar
        </Link>
    );
};

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
    isUniqueStep,
    isLastStep,
    onPrevious,
    onNext,
    onSubmit,
    ...cancelProps
}) => {
    if (isUniqueStep || !isLastStep) {
        return (
            <div className="mt-auto flex items-center justify-end space-x-16 border-t border-gray-200 py-6">
                <Cancel {...cancelProps}>Cancelar</Cancel>

                <Button onClick={isUniqueStep ? onSubmit : onNext}>
                    {isUniqueStep ? 'Guardar' : 'Siguiente'}
                </Button>
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

            <div className="flex items-center justify-end space-x-16">
                <Cancel {...cancelProps}>Cancelar</Cancel>

                <Button onClick={onSubmit}>Guardar</Button>
            </div>
        </div>
    );
};

export default NavigationButtons;
