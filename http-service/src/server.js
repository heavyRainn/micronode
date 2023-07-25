const express = require('express');
const amqp = require('amqplib');

const app = express();

const postMessage = (req, res) => {
  const message = req.body.message;
  sendMessage(message);
  res.send(`Message ${message}`);
};

const getMessage = (req, res) => {
  const message = req.query.message;
  sendMessage(message);
  res.send(`Message ${message}`);
};

app.get('/send', getMessage);
app.post('/send', postMessage);

async function sendMessage(message) {
  try {
    // Подключение к RabbitMQ
    const connection = await amqp.connect('amqp://rabbitmq');

    const channel = await connection.createChannel();

    // Очередь, в которую будут отправляться сообщения
    const queueName = 'message_queue';

    await channel.assertQueue(queueName, { durable: false });

    channel.sendToQueue(queueName, Buffer.from(message));

    console.log(`Sent: ${message}`);

    // Закрываем соединение через полсекунды
    setTimeout(() => connection.close(), 500);
  } catch (error) {
    console.error(error);
  }
}

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});