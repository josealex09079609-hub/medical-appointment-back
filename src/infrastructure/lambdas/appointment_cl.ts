import { SQSEvent } from 'aws-lambda';
import { MySQLRepository } from '../db/MySQLRepository';
import { EventBridgePublisher } from '../../application/services/EventBridgePublisher';

const mysqlRepo = new MySQLRepository();
const eb = new EventBridgePublisher();

export const handler = async (event: SQSEvent) => {
  console.log("📩 Received SQS Event (CL):", JSON.stringify(event));

  for (const record of event.Records) {
    try {
      const body = JSON.parse(record.body);

      let payload;

      // 🟨 Caso SNS → SQS (el más común)
      if (body.Message) {
        payload = JSON.parse(body.Message);
      } 
      // 🟦 Caso SQS directo
      else {
        payload = body;
      }

      console.log("[CL] Payload FINAL:", payload);

      await mysqlRepo.insertAppointment({
        appointmentId: payload.appointmentId,
        insuredId: payload.insuredId,
        scheduleId: payload.scheduleId,
        countryISO: payload.countryISO,
        status: "completed",
        createdAt: payload.createdAt
      });

      await eb.publish(process.env.EVENT_BUS_NAME || "default", {
        appointmentId: payload.appointmentId,
        status: "completed"
      });

      console.log("✅ Procesado appointment CL:", payload.appointmentId);

    } catch (err) {
      console.error("❌ Error procesando SQS_CL record:", err);
    }
  }
};

