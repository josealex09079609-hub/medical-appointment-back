"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAppointmentsByInsuredUseCase = void 0;
class GetAppointmentsByInsuredUseCase {
    constructor(repo) {
        this.repo = repo;
    }
    async execute(insuredId) {
        return await this.repo.findByInsuredId(insuredId);
    }
}
exports.GetAppointmentsByInsuredUseCase = GetAppointmentsByInsuredUseCase;
