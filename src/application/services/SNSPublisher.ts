export class SNSPublisher {
  private topicArn: string;

  constructor() {
    this.topicArn = process.env.SNS_TOPIC_ARN || 'mock-topic';
  }

  async publish(payload: any) {
    console.log('[MOCK SNS] Mensaje publicado:', {
      topicArn: this.topicArn,
      message: payload
    });
  }
}