import { DynamoDB } from 'aws-sdk';
import { IAppointmentRepository } from '../../domain/repositories/IAppointmentRepository';
import { Appointment } from '../../domain/entities/Appointment';

const TABLE = process.env.DYNAMODB_TABLE || 'AppointmentTable';

export class DynamoDBRepository implements IAppointmentRepository {
  private client: DynamoDB.DocumentClient;

  constructor(client?: DynamoDB.DocumentClient) {
    const options: DynamoDB.DocumentClient.DocumentClientOptions &
    DynamoDB.Types.ClientConfiguration = {
    region: process.env.AWS_REGION || 'us-east-1',
  };

  // 👇 Si estamos en modo offline, usar credenciales falsas y endpoint local
  if (process.env.IS_OFFLINE === 'true') {
    options.accessKeyId = 'fake';
    options.secretAccessKey = 'fake';
    options.endpoint = 'http://localhost:8001'; // 🔥 importante si usas Docker con puerto 8001
    console.log('DynamoDB OFFLINE mode enabled ->', options.endpoint);
  }

  console.log('🔧 DynamoDB options:', options);

  this.client = client || new DynamoDB.DocumentClient(options);
  }

  async save(appointment: Appointment): Promise<void> {
    console.log('Guardando appointment en DynamoDB (mock/local):', appointment);

    try {
      await this.client.put({
        TableName: TABLE,
        Item: appointment,
      }).promise();
    } catch (err) {
      console.error('Error al guardar en DynamoDB:', err);
      throw err;
    }
  }

  async updateStatus(appointmentId: string, status: string): Promise<void> {
    console.log(`🔄 Actualizando estado del appointment ${appointmentId} a ${status}`);

    try {
      await this.client.update({
        TableName: TABLE,
        Key: { appointmentId },
        UpdateExpression: 'set #s = :s, updatedAt = :u',
        ExpressionAttributeNames: { '#s': 'status' },
        ExpressionAttributeValues: { ':s': status, ':u': new Date().toISOString() },
      }).promise();
    } catch (err) {
      console.error('Error al actualizar DynamoDB:', err);
      throw err;
    }
  }

  async findByInsuredId(insuredId: string): Promise<Appointment[]> {
    console.log(`Buscando appointments del insuredId: ${insuredId}`);

    try {
      const res = await this.client.query({
        TableName: TABLE,
        IndexName: 'insuredIdIndex',
        KeyConditionExpression: 'insuredId = :i',
        ExpressionAttributeValues: { ':i': insuredId },
      }).promise();

      return (res.Items || []) as Appointment[];
    } catch (err) {
      console.error('Error al consultar DynamoDB:', err);
      return [];
    }
  }
}