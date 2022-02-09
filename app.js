const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const AWS = require('aws-sdk');

AWS.config.update({region: 'us-east-1'});
const sqs = new AWS.SQS();

const app = express();
app.use(express.json());

dotenv.config({
  path: path.join(__dirname, './.env')
});

app.listen(8000, () => {
  console.log(`Listening port 8000`);
});

//Add a message to SQS
app.post('/addMessage', async(req, res) => {
  try {
    const params = {
      MessageBody: req.body.MessageBody,
      QueueUrl: process.env.SQS_URL
    };
    const result = await sqs.sendMessage(params).promise();
    res.send(result)
  } catch (error) {
    console.log(error);
    throw error;
  }  
});

//Receive a message to SQS
app.get('/getMessage', async(req, res) => {
  try {
    const params = {
      QueueUrl: process.env.SQS_URL
    };
    const result = await sqs.receiveMessage(params).promise();
    res.send(result)
  } catch (error) {
    console.log(error);
    throw error;
  }  
});


