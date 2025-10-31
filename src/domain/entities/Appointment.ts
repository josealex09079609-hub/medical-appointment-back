export type CountryISO = 'PE' | 'CL';

export interface Appointment {
  appointmentId: string;
  insuredId: string;
  scheduleId: number;
  countryISO: CountryISO;
  status: string;
  createdAt: string;
  updatedAt?: string;
}
