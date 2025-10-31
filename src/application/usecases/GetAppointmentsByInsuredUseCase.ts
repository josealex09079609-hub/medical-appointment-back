import { IAppointmentRepository } from '../../domain/repositories/IAppointmentRepository';

export class GetAppointmentsByInsuredUseCase {
  constructor(private repo: IAppointmentRepository) {}

  async execute(insuredId: string) {
    return await this.repo.findByInsuredId(insuredId);
  }
}
