const express = require('express');
const amqp = require('amqplib');

const app = express();

const sendMessage = async (req, res) => {
  const message = req.query.message;
  console.log(`Получен HTTP запрос: ${message}`);

  const messageQueue = 'message_queue';
  await sendToRabbitMQ(message, messageQueue);

  const resultsQueue = 'results_queue';
  const result = await waitForResult(message, resultsQueue);
  console.log(`Получен обработанный результат из RabbitMQ: ${result}, очередь: ${resultsQueue}`);

  res.json(`Результат ${result}`);
};

app.get('/send', sendMessage);

async function sendToRabbitMQ(data, queueName) {
  const connection = await amqp.connect('amqp://rabbitmq');
  const channel = await connection.createChannel();
  await channel.assertQueue(queueName, { durable: true });
  channel.sendToQueue(queueName, Buffer.from(data), { persistent: true });
  console.log(`Отослано: ${data}, очередь: ${queueName}`);
}

async function waitForResult(queueName, resultsQueue) {
  const connection = await amqp.connect('amqp://rabbitmq');
  const channel = await connection.createChannel();
  await channel.assertQueue(queueName, { durable: true });
  console.log('Подключено. Ожидание сообщений...');

  return new Promise((resolve) => {
    channel.consume(resultsQueue, (message) => {
      const data = message.content.toString();
      channel.ack(message);
      resolve(data);
    });
  });
}

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});