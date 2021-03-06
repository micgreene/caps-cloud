# Lab 19 - AWS: Events

Codefellows 401 JavaScript

## Overview
- Using only AWS Services: SQS, SNS, Lambda, create a cloud version of the CAPS system

- **Business Requirements**

- As a business, our primary goal is to increase the visibility on the state of packages in the delivery process.

- We have 2 major clients for this service: Vendors and Drivers. Each need to have full and live visibility into the state of a package as it’s being delivered to a customer

- From the Vendor (store owner) perspective
  - As products are sold that need to be delivered, we need to alert the drivers that a package is ready for pickup/delivery
  - As a driver picks up a package, the store owner should know that the package is now “in transit”
  - Once the driver delivers a package, the store owner should know that the package has been delivered
  - Ideally, these notifications should be visible in real time on any device (screen, app, browser, etc)

- From the Driver’s perspective
  - As stores sell product and need a package delivered, Drivers need an instant notification to pick the package up
  - Drivers need a way to scan a package and alert the vendors that the package is in transit
  - Drivers need a way to scan a package and alert the vendors that the package has been delivered

- From the perspective of our company
  - Essential to this system working is that we have to operate in real time. As things happen with the packages, everyone needs to know at that moment, with a guarantee that every state change is visible even if they are not online
    - We don’t want our clients having to refresh their browser to get the latest status updates
    - We also are aware that they will not always have their browser open, so if they leave & come back it’s imperative that they can the state of things since they last logged in.

- **Required Services**

  - SNS Topic: pickup which will receive all pickup requests from vendors
  - SQS Queue (FIFO): packages which will contain all delivery requests from vendors, in order of receipt.
    - Subscribe this queue to the pickup topic so all pickups are ordered
  - SQS Queue (Standard) for each vendor (named for the vendor) which will contain all delivery notifications from the drivers

 - **Operations**
 
  - *Vendors:*
    - Vendors will post “pickup” messages containing delivery information into the SNS pickup topic
    - { orderId: 1234, customer: "Jane Doe", vendorId: queueArn}
      - Note the queueArn – this refers to the AWS ‘arn’ of the vendor’s specific delivered queue
    - Pickup requests should be moved into a FIFO queue for the drivers automatically
    - Vendors should separately subscribe to their personal SQS queue and periodically poll the queue to see delivery notifications
  - *Drivers:*
    - Drivers will poll the SQS packages queue and retrieve the next delivery order (message)
    - After a time (e.g. 5 seconds), drivers will post a message to the Vendor specific SQS Queue using the queueArn specified in the order object


### Authors

- Mike Greene

### Links and Resources

- local server: http://localhost:3000/
- elastic beanstalk app: http://cloud-server-dev.us-west-2.elasticbeanstalk.com/

### Setup

1. npm i uuid, sqs-producer, sqs-consumer, aws-sdk, faker, dotenv
2. Ensure you have run 'aws configure' in your terminal


#### `.env` requirements (where applicable)

- STORENAME=Frank's-Flowers

#### How to initialize/run your application
 
1. node pickup.js to begin creation of pickup messages every 3 seconds
2. node driver.js to begin processing of pickup messages and creation of delivered messages
3. node vendor.js to begin processing of delivered messages and creation of accepted messages

### Expected Operation
1. pickup.js will post the “pickup” message
  - The order id and customer name are randomized
  - The queueArn must be the arn from the Queue you created for the vendor
2. vendor.js is an SQS Subscriber
  - Connected to the vendor’s queue by using its URL/ARN
3. As drivers deliver, this app will continually poll the queue, retrieve them, and log details out to the console
  - You can disconnect this app, and see deliveries that happened while the app was not running driver.js
4. Connects to the packages queue and gets only the next package
5. Waits a random number of seconds
6. Post a message to the Vendor Queue (using the supplied arn) to alert them of the delivery
7. Repeat until the queue is empty

![Expected Output:](./lab19-screenshot.png)
