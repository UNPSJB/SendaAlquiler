import DashboardLayout from '@/modules/dashboard/DashboardLayout';
import { LocalityFormEditor } from '@/modules/editors/locality/locality-form-editor';

const Page = () => {
    return (
        <DashboardLayout>
            <LocalityFormEditor />
        </DashboardLayout>
    );
};

export default Page;
