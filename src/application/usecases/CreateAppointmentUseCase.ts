import { IAppointmentRepository } from '../../domain/repositories/IAppointmentRepository';
import { Appointment } from '../../domain/entities/Appointment';
import * as uuid from 'uuid';
import { SNSPublisher } from '../services/SNSPublisher';

export class CreateAppointmentUseCase {
  constructor(
    private repo: IAppointmentRepository,
    private snsPublisher: SNSPublisher
  ) {}

  async execute(payload: { insuredId: string; scheduleId: number; countryISO: 'PE' | 'CL' }) {
    const appointment: Appointment = {
      appointmentId: uuid.v4(),
      insuredId: payload.insuredId,
      scheduleId: payload.scheduleId,
      countryISO: payload.countryISO,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    await this.repo.save(appointment);
    await this.snsPublisher.publish(appointment);

    return appointment;
  }
}
