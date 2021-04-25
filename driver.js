'use strict';

const { Consumer } = require('sqs-consumer');
const { Producer } = require('sqs-producer');

const producer = Producer.create({
  queueUrl: `https://sqs.us-west-2.amazonaws.com/246670725523/vendor-deliveries`,
  region: `us-west-2`
});

const app = Consumer.create({
  queueUrl: 'https://sqs.us-west-2.amazonaws.com/246670725523/packages.fifo',
  handleMessage: async (message) => {
    if (message.Body) {
      setInterval(async () => {
        try {
          message.Body = JSON.parse(message.Body);
          message.Body.Message = JSON.parse(message.Body.Message);

          let newOrder = {
            id: message.Body.Message.id,
            body: message.Body.Message.body
          }

          // update the vendor SQS queue with a new 'delivered event'
          const res = await producer.send(newOrder);

          console.log('------------------Order Delivered!------------------');
          console.log('Order Delivered:', newOrder);
        } catch (e) {
          console.error(e);
        }
      }, 5000);
    }
  }
});

app.start();
