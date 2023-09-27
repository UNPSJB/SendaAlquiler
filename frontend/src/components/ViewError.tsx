import clsx from 'clsx';

export type ViewErrorProps = { fullPage?: boolean; white?: boolean } & (
    | {
          heading: string;
          subheading: string;
          children?: never;
      }
    | {
          heading: string;
          subheading: string;
          children?: never;
      }
    | {
          heading: string;
          subheading?: never;
          children: React.ReactElement;
      }
    | {
          heading?: never;
          subheading?: never;
          children?: never;
      }
);

export const ViewError: React.FC<ViewErrorProps> = ({
    heading = '¡Vaya! Parece que algo ha salido mal',
    subheading = 'Vuelve más tarde o refresca la página para intentarlo de nuevo.',
    children,
    fullPage,
}) => (
    <div
        className={clsx(
            'container w-full p-12 text-center',
            fullPage && 'flex min-h-screen flex-col items-center justify-center',
        )}
    >
        <h3 className="mb-2 font-bold">{heading}</h3>

        {subheading && <h4>{subheading}</h4>}

        {children}
    </div>
);

export default ViewError;
