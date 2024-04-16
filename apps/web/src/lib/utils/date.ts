import { format } from 'date-fns';
import { nb } from 'date-fns/locale';

export type Dateish = string | Date | number;

export const formatDate = (date: Dateish) => {
	return format(new Date(date), 'EEEE. dd. MMMM', { locale: nb });
};

export const time = (date: Dateish) => {
	return format(new Date(date), 'HH:mm', { locale: nb });
};
