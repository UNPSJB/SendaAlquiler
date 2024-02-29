import DashboardLayout from '@/modules/dashboard/DashboardLayout';
import { SupplierFormEditor } from '@/modules/editors/supplier/supplier-form-editor';

const Page = () => {
    return (
        <DashboardLayout>
            <SupplierFormEditor />
        </DashboardLayout>
    );
};

export default Page;
