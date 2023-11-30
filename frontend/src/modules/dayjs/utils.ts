import dayjs, { Dayjs } from 'dayjs';

const monthsInSpanish = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
];

export const getMonthNameFromDayjs = (date: Dayjs) => {
    return monthsInSpanish[date.month()];
};

export const getDayNameFromDayjs = (date: Dayjs) => {
    const day = date.day();
    switch (day) {
        case 0:
            return 'Domingo';
        case 1:
            return 'Lunes';
        case 2:
            return 'Martes';
        case 3:
            return 'Miércoles';
        case 4:
            return 'Jueves';
        case 5:
            return 'Viernes';
        case 6:
            return 'Sábado';
        default:
            return '';
    }
};

export const formatContractDateTime = (datetime: string) => {
    const dateTimeDayjs = dayjs(datetime);

    const dateNumber = dateTimeDayjs.get('date');

    const monthName = getMonthNameFromDayjs(dateTimeDayjs);

    const yearNumber = dateTimeDayjs.get('year');

    const timeStr = dateTimeDayjs.format('HH:mm');

    return ` ${dateNumber} de ${monthName} del ${yearNumber} a las ${timeStr}`;
};

export const formatDateTime = (datetime: string) => {
    const dateTimeDayjs = dayjs(datetime);

    const dateNumber = dateTimeDayjs.get('date');

    const monthName = getMonthNameFromDayjs(dateTimeDayjs);

    const yearNumber = dateTimeDayjs.get('year');

    return ` ${dateNumber} de ${monthName} del ${yearNumber} `;
};
