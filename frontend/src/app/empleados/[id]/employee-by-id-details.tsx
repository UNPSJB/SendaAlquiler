import { format } from 'date-fns';

import { EmployeeByIdTabComponentProps } from './page';

export const EmployeeByIdDetailsTab: React.FC<EmployeeByIdTabComponentProps> = ({
    employee,
}) => {
    return (
        <div className="space-y-6 pb-12 pt-6">
            <div className="space-y-4">
                <div>
                    <h2 className="mb-2  font-bold">Información Básica</h2>
                    <div className="space-y-2">
                        <p className=" text-sm">Correo: {employee.user.email}</p>
                        <p className=" text-sm">
                            Fecha incorporación:{' '}
                            {format(new Date(employee.user.dateJoined), 'dd/MM/yyyy')}
                        </p>
                    </div>
                </div>

                <div>
                    <h2 className="mb-2  font-bold">Estado</h2>
                    <div className="space-y-2">
                        <p className=" text-sm">
                            Activo: {employee.user.isActive ? 'Sí' : 'No'}
                        </p>
                        <p className=" text-sm">
                            Última sesión:{' '}
                            {employee.user.lastLogin === null
                                ? 'Nunca inició sesión'
                                : employee.user.lastLogin}
                        </p>
                    </div>
                </div>
            </div>

            <div>
                <h2 className="mb-2  font-bold">Sucursales</h2>
                <div className="space-y-2">
                    {employee.offices.map((office) => (
                        <div
                            key={office.id}
                            className="space-y-2 rounded border bg-white p-3"
                        >
                            <p className=" text-sm">Nombre: {office.name}</p>
                            <p className=" text-sm">Localidad: {office.locality.name}</p>
                            <p className=" text-sm">Estado: {office.locality.state}</p>
                            <p className=" text-sm">
                                Código postal: {office.locality.postalCode}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
