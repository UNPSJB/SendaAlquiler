import DashboardLayout, {
    DashboardLayoutBigTitle,
} from '@/modules/dashboard/DashboardLayout';

const Page = () => {
    return (
        <DashboardLayout
            header={<DashboardLayoutBigTitle>Configuración</DashboardLayoutBigTitle>}
        />
    );
};

export default Page;
