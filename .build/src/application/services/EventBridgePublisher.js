"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventBridgePublisher = void 0;
class EventBridgePublisher {
    async publish(eventBusName, detail, detailType = 'appointment.confirmed') {
        console.log('[MOCK EventBridge] Evento publicado:', {
            EventBusName: eventBusName,
            DetailType: detailType,
            Detail: detail
        });
    }
}
exports.EventBridgePublisher = EventBridgePublisher;
