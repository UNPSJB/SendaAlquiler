import { formatDateTimeHr } from '@/modules/dayjs/utils';
import { formatDateTime } from '@/modules/dayjs/utils';

import { EmployeeByIdTabComponentProps } from './page';

const EmployeeByIdDetailsTab: React.FC<EmployeeByIdTabComponentProps> = ({
    employee,
}) => {
    return (
        <div className="space-y-8 pt-8">
            <div>
                <h2 className="mb-1 text-xl font-bold">Información Básica</h2>

                <ul className="space-y-2">
                    <li>
                        <b>Correo: </b>
                        {employee.user.email}
                    </li>
                    <li>
                        <b>Fecha incorporación: </b>
                        {formatDateTime(employee.user.dateJoined)}
                    </li>
                </ul>
            </div>

            <div>
                <h2 className="mb-1 text-xl font-bold">Estado</h2>
                <ul className="space-y-2">
                    <li>
                        <b>Activo: </b>
                        {employee.user.isActive ? 'Sí' : 'No'}
                    </li>
                    <li>
                        <b>Última sesión: </b>{' '}
                        {employee.user.lastLogin === null
                            ? 'Nunca inició sesión'
                            : formatDateTimeHr(employee.user.lastLogin)}
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default EmployeeByIdDetailsTab;
