import { Appointment } from '../entities/Appointment';

export interface IAppointmentRepository {
  save(appointment: Appointment): Promise<void>;
  updateStatus(appointmentId: string, status: string): Promise<void>;
  findByInsuredId(insuredId: string): Promise<Appointment[]>;
}
