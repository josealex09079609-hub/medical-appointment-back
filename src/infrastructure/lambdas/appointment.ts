import { APIGatewayProxyEventV2  } from 'aws-lambda';
import 'source-map-support/register';
import { DynamoDBRepository } from '../db/DynamoDBRepository';
import { SNSPublisher } from '../../application/services/SNSPublisher';
import { CreateAppointmentUseCase } from '../../application/usecases/CreateAppointmentUseCase';
import { GetAppointmentsByInsuredUseCase } from '../../application/usecases/GetAppointmentsByInsuredUseCase';

const repo = new DynamoDBRepository();
const sns = new SNSPublisher();

export const handler = async (event: APIGatewayProxyEventV2) => {
  try {
    // Para httpApi (v2)
    const method = event.requestContext.http.method;

    if (method === 'POST') {
      const body = JSON.parse(event.body || '{}');
      const { insuredId, scheduleId, countryISO } = body;

      if (!insuredId || !scheduleId || !countryISO) {
        return { statusCode: 400, body: JSON.stringify({ message: 'Invalid payload' }) };
      }

      const useCase = new CreateAppointmentUseCase(repo, sns);
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

      const useCase = new GetAppointmentsByInsuredUseCase(repo);
      const items = await useCase.execute(insuredId);

      return { statusCode: 200, body: JSON.stringify(items) };
    }

    return { statusCode: 405, body: 'Method Not Allowed' };
  } catch (err: any) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ message: 'Internal error', error: err.message }) };
  }
};