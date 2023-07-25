const amqp = require('amqplib');

async function receiveMessage() {
  try {
     // Подключение к RabbitMQ 
    const connection = await amqp.connect('amqp://rabbitmq');
    const channel = await connection.createChannel();

    // Очередь, из которой будем получать сообщения
    const queueName = 'message_queue'; 

    await channel.assertQueue(queueName, { durable: false });

    console.log('Connected. Waiting for messages...');

    channel.consume(queueName, (message) => {
      console.log(`Received: ${message.content.toString()}`);
    }, { noAck: true });
  } catch (error) {
    console.error(error);
  }
}

setTimeout(() => {
  receiveMessage();
}, 10000);

