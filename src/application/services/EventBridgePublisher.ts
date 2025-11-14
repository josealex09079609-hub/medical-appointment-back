import { EventBridgeClient, PutEventsCommand } from "@aws-sdk/client-eventbridge";

export class EventBridgePublisher {
  private client: EventBridgeClient;

  constructor() {
    this.client = new EventBridgeClient({
      region: process.env.AWS_REGION || "us-east-1",
    });
  }

  async publish(eventBusName: string, detail: any, detailType = "appointment.confirmed") {
    const busName = eventBusName || process.env.EVENT_BUS_NAME || "default";

    const command = new PutEventsCommand({
      Entries: [
        {
          EventBusName: busName,
          Source: "medical.appointments",
          DetailType: detailType,
          Detail: JSON.stringify(detail),
        },
      ],
    });

    try {
      const response = await this.client.send(command);
      console.log("[EventBridge] Evento publicado:", JSON.stringify(response));
    } catch (err) {
      console.error("[EventBridge] Error publicando evento:", err);
      throw err;
    }
  }
}