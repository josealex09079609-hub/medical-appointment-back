# 🩺 Medical Appointment Backend

Backend serverless para gestión de citas médicas, desarrollado con **Node.js + TypeScript + AWS Serverless Framework**.  
Incluye integración con **DynamoDB Local**, **SQS**, **SNS**, y **EventBridge** (simulados en entorno local).

---

## 🚀 Tecnologías principales

- **Node.js** 18+
- **TypeScript**
- **Serverless Framework**
- **AWS SDK v2**
- **DynamoDB Local (Docker)**
- **SQS / SNS / EventBridge mocks**
- **MySQL (opcional, para colas confirmadas)**

---

## 🧩 Arquitectura
src/
├── application/
│ ├── usecases/
│ └── services/
├── domain/
│ ├── entities/
│ └── repositories/
└── infrastructure/
├── db/
├── lambdas/
└── aws/

- **CreateAppointmentUseCase**: crea una cita médica.
- **DynamoDBRepository**: persistencia de citas.
- **SNSPublisher** y **EventBridgePublisher**: publicación de eventos.
- **Handlers Lambda**: exponen endpoints HTTP y SQS handlers.

---

## ⚙️ Requisitos previos

Asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (v18 o superior)
- [npm](https://www.npmjs.com/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [Serverless Framework](https://www.serverless.com/framework/docs/getting-started/)

```bash
npm install -g serverless
##Crea tabla en Dynamo
node createTable.js