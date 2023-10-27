'use client';

import DashboardLayout, {
    DashboardLayoutBigTitle,
} from '@/modules/dashboard/DashboardLayout';

const Home = () => {
    return (
        <DashboardLayout
            header={<DashboardLayoutBigTitle>Dashboard</DashboardLayoutBigTitle>}
        />
    );
};

export default Home;
