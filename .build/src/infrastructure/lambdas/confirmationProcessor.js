"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const DynamoDBRepository_1 = require("../db/DynamoDBRepository");
const repo = new DynamoDBRepository_1.DynamoDBRepository();
const handler = async (event) => {
    for (const record of event.Records) {
        const payload = JSON.parse(record.body);
        try {
            const appointmentId = payload.detail?.appointmentId || payload.appointmentId;
            const status = payload.detail?.status || payload.status || 'completed';
            await repo.updateStatus(appointmentId, status);
        }
        catch (err) {
            console.error('Error updating status', err);
        }
    }
};
exports.handler = handler;
