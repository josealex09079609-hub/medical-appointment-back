import { SQSEvent } from 'aws-lambda';
import { MySQLRepository } from '../db/MySQLRepository';
import { EventBridgePublisher } from '../../application/services/EventBridgePublisher';

const mysqlRepo = new MySQLRepository();
const eb = new EventBridgePublisher();

export const handler = async (event: SQSEvent) => {
  for (const record of event.Records) {
    const payload = JSON.parse(record.body);
    try {
      // Guardar en MySQL
      await mysqlRepo.insertAppointment({
        appointmentId: payload.appointmentId,
        insuredId: payload.insuredId,
        scheduleId: payload.scheduleId,
        countryISO: payload.countryISO,
        status: 'completed',
        createdAt: payload.createdAt
      });

      // Publicar evento de conformidad
      await eb.publish(process.env.EVENT_BUS_NAME || 'default', {
        appointmentId: payload.appointmentId,
        status: 'completed'
      });
    } catch (err) {
      console.error('Error procesando SQS_PE record', err);
    }
  }
};
