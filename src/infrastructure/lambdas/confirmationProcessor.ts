import { SQSEvent } from "aws-lambda";
import { DynamoDBRepository } from "../db/DynamoDBRepository";

const repo = new DynamoDBRepository();

export const handler = async (event: SQSEvent) => {
  console.log("📩 Received ConfirmationProcessor event:", JSON.stringify(event));

  for (const record of event.Records) {
    try {
      let raw = record.body;
      let payload: any = {};

      // 🟦 Caso 1: JSON directo
      if (isJson(raw)) {
        payload = JSON.parse(raw);
      } else {
        // 🟨 Caso 2: SNS → SQS wrapper
        const wrapper = JSON.parse(raw);

        if (wrapper.Message) {
          raw = wrapper.Message;
        }

        if (isJson(raw)) {
          payload = JSON.parse(raw);
        }
      }

      console.log("🔍 Payload después de parse:", payload);

      // 🟧 Caso 3: EventBridge messages → detail es un string
      if (payload.detail && typeof payload.detail === "string") {
        payload.detail = JSON.parse(payload.detail);
      }

      const appointmentId =
        payload.detail?.appointmentId || payload.appointmentId;

      const status =
        payload.detail?.status || payload.status || "completed";

      if (!appointmentId) {
        console.error("❌ No appointmentId in message:", payload);
        continue;
      }

      console.log(`🔄 Updating appointment ${appointmentId} => ${status}`);

      await repo.updateStatus(appointmentId, status);

      console.log("✅ Status updated");

    } catch (err) {
      console.error("❌ Error updating status:", err);
    }
  }
};

// Utilidad: validar JSON
function isJson(value: string): boolean {
  try {
    JSON.parse(value);
    return true;
  } catch {
    return false;
  }
}
