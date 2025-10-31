// createTable.js
const AWS = require("aws-sdk");

AWS.config.update({
  region: "us-east-1",
  accessKeyId: "fake",
  secretAccessKey: "fake",
  endpoint: "http://localhost:8001" //
});

const dynamodb = new AWS.DynamoDB();

const params = {
  TableName: "AppointmentTable",
  AttributeDefinitions: [
    { AttributeName: "appointmentId", AttributeType: "S" },
    { AttributeName: "insuredId", AttributeType: "S" }
  ],
  KeySchema: [
    { AttributeName: "appointmentId", KeyType: "HASH" }
  ],
  GlobalSecondaryIndexes: [
    {
      IndexName: "insuredIdIndex",
      KeySchema: [{ AttributeName: "insuredId", KeyType: "HASH" }],
      Projection: { ProjectionType: "ALL" },
      ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
    }
  ],
  BillingMode: "PAY_PER_REQUEST"
};

dynamodb.createTable(params, (err, data) => {
  if (err) {
    console.error("Error creando la tabla:", err.message);
  } else {
    console.log("Tabla creada correctamente:", data.TableDescription.TableName);
  }
});