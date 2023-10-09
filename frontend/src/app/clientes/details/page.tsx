'use client';

import { useState } from 'react';

import { Client, ClientsQuery } from '@/api/graphql';
import { useClients } from '@/api/hooks';
import { PropsWithChildren } from 'react';

import DashboardLayout from '@/modules/dashboard/DashboardLayout';
import FetchedDataRenderer from '@/components/FetchedDataRenderer';
import FetchStatusMessageWithButton from '@/components/FetchStatusMessageWithButton';
import FetchStatusMessageWithDescription from '@/components/FetchStatusMessageWithDescription';

// const client: Pick<Client, 'firstName' | 'lastName' | 'email' | 'dni' | 'phoneCode' | 'phoneNumber'> = {
const client: Omit<Client, 'id' | 'locality'> & {
    city: string;
    state: string;
    postalCode: string;
} = {
    firstName: 'Ignacio',
    lastName: 'Toro',
    email: 'lawea@gmail.com',
    dni: "4000000",
    phoneCode: "2804",
    phoneNumber: "408912",
    houseNumber: "31",
    houseUnit: "-",

    streetName: "Gales",
    city: "Trelew",
    state: "Chubut",
    postalCode: "9140"
};

const Circle: React.FC<PropsWithChildren> = ({ children }) => {
    return <span className='text-white text-3xl font-bold bg-[#36E270] rounded-full h-22 w-22 px-7 py-6 flex items-center justify-center mt-8'>{children}</span>;
};

const UL: React.FC<PropsWithChildren> = ({ children }) => {
    return <ul className='mt-8 '>{children}</ul>;
};

const LI: React.FC<PropsWithChildren> = ({ children }) => {
    return <li className='my-2'>{children}</li>;
};

const SN: React.FC<PropsWithChildren> = ({ children }) => {
    return <span className='font-bold'>{children}</span>;
};

const Page = () => {
    const [activeTab, setActiveTab] = useState(0);
    const tabs = [
        { name: 'Detalles', index: 0, isActive: activeTab === 0 },
        { name: 'Compras', index: 1, isActive: activeTab === 1 },
        { name: 'Contratos', index: 2, isActive: activeTab === 2 },
    ];

    return (
        <DashboardLayout title={`Clientes > ${client.firstName} ${client.lastName}`}>
            <div className="flex  flex-1 flex-col">
                <header className="pl-10 border-b">
                    <div className='flex items-center'>
                        <Circle>IG</Circle>
                        <div className='pl-6'>
                            <h1 className="mt-10 text-xl font-bold my-2">{client.firstName} {client.lastName}</h1>
                            <p>{client.email}</p>
                        </div>
                    </div>
                    <nav className="mt-10 font-bold text-[#8B8B8B]">
                        {tabs.map((tab) => (
                            <button
                                key={tab.index}
                                onClick={() => {
                                    setActiveTab(tab.index);
                                }}
                                className={`pb-2 mr-8 ${tab.isActive ? 'text-[#4253F0] border-b border-[#4253F0] -mb-1' : ''}`}
                            >
                                {tab.name}
                            </button>
                        ))}
                    </nav>
                </header>
                <div className="flex-1 bg-gray-100 px-0">
                    <section className="pl-10 ">
                        {activeTab === 0 && (
                            <>
                                <UL>
                                    <h1 className='font-bold mb-3 text-xl'>Información Básica</h1>
                                    <LI><SN>Correo: </SN>{client.email}</LI>
                                    <LI><SN>Telefono: </SN>{client.phoneCode}{client.phoneNumber}</LI>
                                    <LI><SN>Dni: </SN>{client.dni}</LI>
                                </UL>
                                <UL>
                                    <h1 className='font-bold mb-3 text-xl'>Ubicación</h1>
                                    <LI><SN>Provincia: </SN>{client.state}</LI>
                                    <LI><SN>Ciudad: </SN>  {client.city}</LI>
                                    <LI><SN>Codigo Postal: </SN> {client.postalCode}</LI>
                                    <LI><SN>Calle: </SN> {client.streetName}</LI>
                                    <LI><SN>N° de Casa: </SN> {client.houseNumber}</LI>
                                    <LI><SN>Apartamento, habitación, unidad, etc: </SN> {client.houseUnit}</LI>

                                </UL>
                            </>
                        )}
                        {activeTab === 1 && (
                            <h1>
                                Compras
                            </h1>
                        )}
                        {activeTab === 2 && (
                            <h1>
                                Contratos
                            </h1>
                        )}
                    </section>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Page;
