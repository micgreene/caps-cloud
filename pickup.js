'use strict';

//3rd part dependencies
const AWS = require('aws-sdk');
const uuid = require('uuid').v4;
const { Producer } = require('sqs-producer');
const faker = require('faker');
const dotenv = require('dotenv');

AWS.config.update({ region: 'us-west-2' });

const sns = new AWS.SNS();
const topic = 'arn:aws:sns:us-west-2:246670725523:pickup.fifo';

//configure environmental variables
dotenv.config();
let STORENAME = process.env.STORENAME;


//create 
// const producer = Producer.create({
//   queueUrl: `https://sqs.us-west-2.amazonaws.com/246670725523/packages.fifo`,
//   region: `us-west-2`
// });

//outlines properties of object for new order details and assign it a new id
function fakeorder() {
  let newOrder = {
    id: uuid(),
    body: {
      storeName: STORENAME,
      time: new Date(),
      customerName: faker.name.findName(),
      address: faker.fake('{{address.streetAddress}}, {{address.cityName}},{{address.stateAbbr}}, {{address.zipCode}}')
    },
    groupId: `Message-Group:${STORENAME}`
  }
  return newOrder;
}

async function setPickup(newOrder) {
  // try {
    // Create publish parameters
    let params = {
      Message: JSON.stringify(newOrder),
      TopicArn: 'arn:aws:sns:us-west-2:246670725523:pickup.fifo',
      MessageGroupId: `Message-Group:${STORENAME}`
    };
    sns.publish(params).promise()
    .then(data => {
      console.log(data);
    })
    .catch(console.error);
}

//every 3 seconds, a new 'pickup' event is created and added to the 'package' queue via AWS SQS
setInterval(async () => {
  try {
    let newOrder = fakeorder();
    //update the package SQS queue with a new 'pickup event'
    newOrder.body = JSON.stringify(newOrder.body);
    setPickup(newOrder);

    console.log('******************New Order!******************');
    console.log('Pickup Added:', newOrder);

  } catch (e) {
    console.error(e);
  }
}, 3000);

