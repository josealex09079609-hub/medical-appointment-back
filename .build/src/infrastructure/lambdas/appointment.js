"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
require("source-map-support/register");
const DynamoDBRepository_1 = require("../db/DynamoDBRepository");
const SNSPublisher_1 = require("../../application/services/SNSPublisher");
const CreateAppointmentUseCase_1 = require("../../application/usecases/CreateAppointmentUseCase");
const GetAppointmentsByInsuredUseCase_1 = require("../../application/usecases/GetAppointmentsByInsuredUseCase");
const repo = new DynamoDBRepository_1.DynamoDBRepository();
const sns = new SNSPublisher_1.SNSPublisher();
const handler = async (event) => {
    try {
        // Para httpApi (v2)
        const method = event.requestContext.http.method;
        if (method === 'POST') {
            const body = JSON.parse(event.body || '{}');
            const { insuredId, scheduleId, countryISO } = body;
            if (!insuredId || !scheduleId || !countryISO) {
                return { statusCode: 400, body: JSON.stringify({ message: 'Invalid payload' }) };
            }
            const useCase = new CreateAppointmentUseCase_1.CreateAppointmentUseCase(repo, sns);
            const appointment = await useCase.execute({ insuredId, scheduleId, countryISO });
            return {
                statusCode: 202,
                body: JSON.stringify({
                    message: 'Agendamiento en proceso',
                    appointmentId: appointment.appointmentId
                }),
            };
        }
        if (method === 'GET') {
            const insuredId = event.pathParameters?.insuredId;
            if (!insuredId) {
                return { statusCode: 400, body: JSON.stringify({ message: 'insuredId required' }) };
            }
            const useCase = new GetAppointmentsByInsuredUseCase_1.GetAppointmentsByInsuredUseCase(repo);
            const items = await useCase.execute(insuredId);
            return { statusCode: 200, body: JSON.stringify(items) };
        }
        return { statusCode: 405, body: 'Method Not Allowed' };
    }
    catch (err) {
        console.error(err);
        return { statusCode: 500, body: JSON.stringify({ message: 'Internal error', error: err.message }) };
    }
};
exports.handler = handler;
