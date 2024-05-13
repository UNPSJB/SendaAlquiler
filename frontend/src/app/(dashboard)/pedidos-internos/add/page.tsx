import DashboardLayout from '@/modules/dashboard/DashboardLayout';
import { OrderInternalFormEditor } from '@/modules/editors/order-internal/order-internal-form-editor';

const Page = () => {
    return (
        <DashboardLayout>
            <OrderInternalFormEditor />
        </DashboardLayout>
    );
};

export default Page;
