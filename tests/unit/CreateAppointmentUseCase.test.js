"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CreateAppointmentUseCase_1 = require("../../src/application/usecases/CreateAppointmentUseCase");
const SNSPublisher_1 = require("../../src/application/services/SNSPublisher");
class InMemoryRepo {
    constructor() {
        this.items = [];
    }
    async save(appointment) { this.items.push(appointment); }
    async updateStatus() { }
    async findByInsuredId(insuredId) { return this.items.filter(i => i.insuredId === insuredId); }
}
test('CreateAppointmentUseCase saves and publishes', async () => {
    const repo = new InMemoryRepo();
    const sns = new SNSPublisher_1.SNSPublisher();
    sns.publish = jest.fn().mockResolvedValue(undefined);
    const useCase = new CreateAppointmentUseCase_1.CreateAppointmentUseCase(repo, sns);
    const appt = await useCase.execute({ insuredId: '00001', scheduleId: 100, countryISO: 'PE' });
    expect(appt).toHaveProperty('appointmentId');
    expect(repo.items.length).toBe(1);
    expect(sns.publish.mock.calls.length).toBe(1);
});
