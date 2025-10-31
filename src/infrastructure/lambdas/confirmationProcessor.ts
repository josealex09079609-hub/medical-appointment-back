import { SQSEvent } from 'aws-lambda';
import { DynamoDBRepository } from '../db/DynamoDBRepository';

const repo = new DynamoDBRepository();

export const handler = async (event: SQSEvent) => {
  for (const record of event.Records) {
    const payload = JSON.parse(record.body);
    try {
      const appointmentId = payload.detail?.appointmentId || payload.appointmentId;
      const status = payload.detail?.status || payload.status || 'completed';
      await repo.updateStatus(appointmentId, status);
    } catch (err) {
      console.error('Error updating status', err);
    }
  }
};
