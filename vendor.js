'use strict';

const { Consumer } = require('sqs-consumer');

const app = Consumer.create({
  queueUrl: 'https://sqs.us-west-2.amazonaws.com/246670725523/vendor-deliveries',
  handleMessage: async (message) => {
    message.Body = JSON.parse(message.Body);
   

    let newOrder = {
      id: message.MessageId,
      body: message.Body
    };

    console.log('------------------Order Accepted!------------------');
    console.log('Order Accepted:', newOrder);
  }
});

app.start();
