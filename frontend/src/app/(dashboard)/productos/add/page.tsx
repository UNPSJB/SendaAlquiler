import DashboardLayout from '@/modules/dashboard/DashboardLayout';
import { ProductFormEditor } from '@/modules/editors/product/product-form-editor';

const Page = () => {
    return (
        <DashboardLayout>
            <ProductFormEditor />
        </DashboardLayout>
    );
};

export default Page;
