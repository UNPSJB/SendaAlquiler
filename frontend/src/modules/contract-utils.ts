import {
    ContractHistoryStatusChoices,
    ProductServiceBillingTypeChoices,
} from '@/api/graphql';

export const contractStatusToText = (status: ContractHistoryStatusChoices) => {
    switch (status) {
        case ContractHistoryStatusChoices.Activo:
            return 'Activo';
        case ContractHistoryStatusChoices.Cancelado:
            return 'Cancelado';
        case ContractHistoryStatusChoices.ConDeposito:
            return 'Con depósito';
        case ContractHistoryStatusChoices.DevolucionExitosa:
            return 'Devolución exitosa';
        case ContractHistoryStatusChoices.DevolucionFallida:
            return 'Devolución fallida';
        case ContractHistoryStatusChoices.Finalizado:
            return 'Finalizado';
        case ContractHistoryStatusChoices.Pagado:
            return 'Pagado';
        case ContractHistoryStatusChoices.Presupuestado:
            return 'Presupuestado';
        case ContractHistoryStatusChoices.Vencido:
            return 'Vencido';
        default:
            return status;
    }
};

type CalculateContractProductItemSubtotal = {
    days: number;
    unitPricePerDay: number;
    allocations: {
        quantity: number;
    }[];
};

export const calculateContractProductItemSubtotal = ({
    days,
    unitPricePerDay,
    allocations,
}: CalculateContractProductItemSubtotal) => {
    const quantity = allocations.reduce(
        (acc, allocation) => acc + allocation.quantity,
        0,
    );
    const subtotal = days * unitPricePerDay * quantity;
    return subtotal;
};

type CalculateContractProductItemTotal = {
    days: number;
    unitPricePerDay: number;
    discount: number;
    allocations: {
        quantity: number;
    }[];
};

export const calculateContractProductItemTotal = ({
    days,
    unitPricePerDay,
    discount,
    allocations,
}: CalculateContractProductItemTotal) => {
    const subtotal = calculateContractProductItemSubtotal({
        days,
        unitPricePerDay,
        allocations,
    });
    const totalWithDiscount = subtotal - discount;
    return totalWithDiscount;
};

type CalculateContractServiceItemSubtotal = {
    unitPrice: number;
    billingType: ProductServiceBillingTypeChoices;
    billingPeriod: number;
    days: number;
};

export const calculateContractServiceItemSubtotal = ({
    unitPrice,
    billingType,
    billingPeriod,
    days,
}: CalculateContractServiceItemSubtotal) => {
    if (billingType === ProductServiceBillingTypeChoices.OneTime) {
        return unitPrice;
    }

    if (billingType === ProductServiceBillingTypeChoices.Custom) {
        return unitPrice * (days / billingPeriod);
    }

    if (billingType === ProductServiceBillingTypeChoices.Weekly) {
        return unitPrice * (days / 7);
    }

    if (billingType === ProductServiceBillingTypeChoices.Monthly) {
        return unitPrice * (days / 30);
    }

    return 0;
};

type CalculateContractServiceItemTotal = {
    unitPrice: number;
    discount: number;
    billingType: ProductServiceBillingTypeChoices;
    billingPeriod: number;
    days: number;
};

export const calculateContractServiceItemTotal = ({
    unitPrice,
    discount,
    billingType,
    billingPeriod,
    days,
}: CalculateContractServiceItemTotal) => {
    const subtotal = calculateContractServiceItemSubtotal({
        unitPrice,
        billingType,
        billingPeriod,
        days,
    });
    const totalWithDiscount = subtotal - discount;
    return totalWithDiscount;
};
