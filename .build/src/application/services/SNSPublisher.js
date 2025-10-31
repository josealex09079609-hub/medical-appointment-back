"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SNSPublisher = void 0;
class SNSPublisher {
    constructor() {
        this.topicArn = process.env.SNS_TOPIC_ARN || 'mock-topic';
    }
    async publish(payload) {
        console.log('[MOCK SNS] Mensaje publicado:', {
            topicArn: this.topicArn,
            message: payload
        });
    }
}
exports.SNSPublisher = SNSPublisher;
