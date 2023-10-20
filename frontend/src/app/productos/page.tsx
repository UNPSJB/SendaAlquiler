import DashboardLayout, {
    DashboardLayoutBigTitle,
} from '@/modules/dashboard/DashboardLayout';

import Button from '@/components/Button';

const Page = () => {
    return (
        <DashboardLayout
            header={
                <div className="flex items-center justify-between">
                    <DashboardLayoutBigTitle>Productos</DashboardLayoutBigTitle>

                    <Button href="/productos/add">+ Añadir producto</Button>
                </div>
            }
        />
    );
};

export default Page;
