import DashboardLayout, {
    DashboardLayoutBigTitle,
} from '@/modules/dashboard/DashboardLayout';

const Page = () => {
    return (
        <DashboardLayout
            header={<DashboardLayoutBigTitle>Productos</DashboardLayoutBigTitle>}
        />
    );
};

export default Page;
