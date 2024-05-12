import DashboardLayout from '@/modules/dashboard/DashboardLayout';
import { CustomerFormEditor } from '@/modules/editors/customer/customer-form-editor';

const Page = () => {
    return (
        <DashboardLayout>
            <CustomerFormEditor />
        </DashboardLayout>
    );
};

export default Page;
