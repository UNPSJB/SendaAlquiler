import Link from 'next/link';

import ChevronLeft from '@/modules/icons/ChevronLeft';

import { Button } from '@/components/ui/button';

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
            <Button variant="link" onClick={props.onCancel}>
                Cancelar
            </Button>
        );
    }

    return (
        <Button variant="link" asChild>
            <Link href={props.cancelHref} className="font-headings text-sm">
                Cancelar
            </Link>
        </Button>
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
            <div className="mt-auto flex items-center justify-end space-x-6 border-t border-gray-200 px-8 py-3">
                <Cancel {...cancelProps}>Cancelar</Cancel>

                <Button onClick={isUniqueStep ? onSubmit : onNext}>
                    {isUniqueStep ? 'Guardar' : 'Siguiente'}
                </Button>
            </div>
        );
    }

    return (
        <div className="mt-auto flex justify-between border-t border-gray-200 px-8 py-3">
            <Button
                variant="link"
                onClick={onPrevious}
                className="flex items-center space-x-3 font-headings text-sm"
            >
                <ChevronLeft /> <span>Atrás</span>
            </Button>

            <div className="flex items-center justify-end space-x-6">
                <Cancel {...cancelProps}>Cancelar</Cancel>

                <Button onClick={onSubmit}>Guardar</Button>
            </div>
        </div>
    );
};

export default NavigationButtons;
