"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamoDBRepository = void 0;
const aws_sdk_1 = require("aws-sdk");
const TABLE = process.env.DYNAMODB_TABLE || 'AppointmentTable';
class DynamoDBRepository {
    constructor(client) {
        const options = {
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
        this.client = client || new aws_sdk_1.DynamoDB.DocumentClient(options);
    }
    async save(appointment) {
        console.log('Guardando appointment en DynamoDB (mock/local):', appointment);
        try {
            await this.client.put({
                TableName: TABLE,
                Item: appointment,
            }).promise();
        }
        catch (err) {
            console.error('Error al guardar en DynamoDB:', err);
            throw err;
        }
    }
    async updateStatus(appointmentId, status) {
        console.log(`🔄 Actualizando estado del appointment ${appointmentId} a ${status}`);
        try {
            await this.client.update({
                TableName: TABLE,
                Key: { appointmentId },
                UpdateExpression: 'set #s = :s, updatedAt = :u',
                ExpressionAttributeNames: { '#s': 'status' },
                ExpressionAttributeValues: { ':s': status, ':u': new Date().toISOString() },
            }).promise();
        }
        catch (err) {
            console.error('Error al actualizar DynamoDB:', err);
            throw err;
        }
    }
    async findByInsuredId(insuredId) {
        console.log(`Buscando appointments del insuredId: ${insuredId}`);
        try {
            const res = await this.client.query({
                TableName: TABLE,
                IndexName: 'insuredIdIndex',
                KeyConditionExpression: 'insuredId = :i',
                ExpressionAttributeValues: { ':i': insuredId },
            }).promise();
            return (res.Items || []);
        }
        catch (err) {
            console.error('Error al consultar DynamoDB:', err);
            return [];
        }
    }
}
exports.DynamoDBRepository = DynamoDBRepository;
