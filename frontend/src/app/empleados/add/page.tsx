import DashboardLayout from '@/modules/dashboard/DashboardLayout';
import { EmployeeFormEditor } from '@/modules/editors/employee/employee-form-editor';

const Page = () => {
    return (
        <DashboardLayout>
            <EmployeeFormEditor />
        </DashboardLayout>
    );
};

export default Page;
