export class EventBridgePublisher {
  async publish(eventBusName: string, detail: any, detailType = 'appointment.confirmed') {
    console.log('[MOCK EventBridge] Evento publicado:', {
      EventBusName: eventBusName,
      DetailType: detailType,
      Detail: detail
    });
  }
}