"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const MySQLRepository_1 = require("../db/MySQLRepository");
const EventBridgePublisher_1 = require("../../application/services/EventBridgePublisher");
const mysqlRepo = new MySQLRepository_1.MySQLRepository();
const eb = new EventBridgePublisher_1.EventBridgePublisher();
const handler = async (event) => {
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
        }
        catch (err) {
            console.error('Error procesando SQS_CL record', err);
        }
    }
};
exports.handler = handler;
