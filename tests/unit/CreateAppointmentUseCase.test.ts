import { CreateAppointmentUseCase } from '../../src/application/usecases/CreateAppointmentUseCase';
import { IAppointmentRepository } from '../../src/domain/repositories/IAppointmentRepository';
import { SNSPublisher } from '../../src/application/services/SNSPublisher';

class InMemoryRepo implements IAppointmentRepository {
  items: any[] = [];
  async save(appointment: any) { this.items.push(appointment); }
  async updateStatus() { /* no-op */ }
  async findByInsuredId(insuredId: string) { return this.items.filter(i => i.insuredId === insuredId); }
}

test('CreateAppointmentUseCase saves and publishes', async () => {
  const repo = new InMemoryRepo();
  const sns = new SNSPublisher();
  sns.publish = jest.fn().mockResolvedValue(undefined);

  const useCase = new CreateAppointmentUseCase(repo, sns);
  const appt = await useCase.execute({ insuredId: '00001', scheduleId: 100, countryISO: 'PE' });

  expect(appt).toHaveProperty('appointmentId');
  expect(repo.items.length).toBe(1);
  expect((sns.publish as jest.Mock).mock.calls.length).toBe(1);
});
