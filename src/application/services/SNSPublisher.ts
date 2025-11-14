import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

export class SNSPublisher {
  private topicArn: string;
  private client: SNSClient;

  constructor() {
    this.topicArn = process.env.SNS_TOPIC_ARN || "";
    console.log("[SNS] topicArn usado:", this.topicArn);
    console.log("[SNS] AWS_REGION:", process.env.AWS_REGION);

    this.client = new SNSClient({
      region: process.env.AWS_REGION || "us-east-1",
    });
  }

  async publish(payload: any) {
    if (!this.topicArn) {
      console.error("SNS_TOPIC_ARN no configurado");
      return;
    }

    const command = new PublishCommand({
      TopicArn: this.topicArn,
      Message: JSON.stringify(payload),
      MessageAttributes: {
        countryISO: {
          DataType: "String",
          StringValue: payload.countryISO,
        },
      },
    });

    const response = await this.client.send(command);
    console.log("[SNS] Publicado OK:", response);
  }
}
