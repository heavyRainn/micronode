const amqp = require('amqplib');

async function receiveMessage() {
  try {
    const connection = await amqp.connect('amqp://rabbitmq');
    const channel = await connection.createChannel();

    const queueName = 'message_queue';

    await channel.assertQueue(queueName, { durable: true });

    console.log('Connected. Waiting for messages...');

    channel.consume(queueName, (message) => { console.log(`Получено: ${message.content.toString()}, очередь: ${queueName}`);

    sendMessage(message.content.toString());
    }, { noAck: true });
  } catch (error) {
    console.error(error);
  }
}

async function sendMessage(message) {
  try {
    const connection = await amqp.connect('amqp://rabbitmq');
    const channel = await connection.createChannel();

    const queueName = 'results_queue';
    await channel.assertQueue(queueName, { durable: true });

    channel.sendToQueue(queueName, Buffer.from(message));

    console.log(`Отправлено: ${message}, очередь: ${queueName}`);

    setTimeout(() => connection.close(), 500);
  } catch (error) {
    console.error(error);
  }
}

setTimeout(() => {
  receiveMessage();
}, 13000);

