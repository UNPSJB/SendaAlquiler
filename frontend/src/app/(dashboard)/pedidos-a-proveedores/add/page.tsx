import DashboardLayout from '@/modules/dashboard/DashboardLayout';
import { OrderSupplierFormEditor } from '@/modules/editors/order-supplier/order-supplier-form-editor';

const Page = () => {
    return (
        <DashboardLayout>
            <OrderSupplierFormEditor />
        </DashboardLayout>
    );
};

export default Page;
