import { PropsWithChildren } from 'react';

import { formatDateTimeHr } from '@/modules/dayjs/utils';
import { formatDateTime } from '@/modules/dayjs/utils';

import { EmployeeByIdTabComponentProps } from './page';

const UL: React.FC<PropsWithChildren> = ({ children }) => {
    return <ul className="mt-8 ">{children}</ul>;
};

const LI: React.FC<PropsWithChildren> = ({ children }) => {
    return <li className="my-2">{children}</li>;
};

const EmployeeByIdDetailsTab: React.FC<EmployeeByIdTabComponentProps> = ({
    employee,
}) => {
    return (
        <>
            <UL>
                <h1 className="mb-3 text-xl font-bold">Información Básica</h1>
                <LI>
                    <b>Correo: </b>
                    {employee.user.email}
                </LI>
                <LI>
                    <b>Fecha incorporación: </b>
                    {formatDateTime(employee.user.dateJoined)}
                </LI>
            </UL>
            <UL>
                <h1 className="mb-3 text-xl font-bold">Estado</h1>
                <LI>
                    <b>Activo: </b>
                    {employee.user.isActive ? 'Sí' : 'No'}
                </LI>
                <LI>
                    <b>Última sesión: </b>{' '}
                    {employee.user.lastLogin === null
                        ? 'Nunca inició sesión'
                        : formatDateTimeHr(employee.user.lastLogin)}
                </LI>
            </UL>
        </>
    );
};

export default EmployeeByIdDetailsTab;
