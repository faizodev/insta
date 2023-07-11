const express = require('express')
const app = express()
const port = 3000


// use puppeteer to login to the instagram account
const puppeteer = require('puppeteer');
const { instagram } = require('./config');
const fs = require('fs');

console.clear();


app.get('/', (req, res) => {
  res.send('Hello World!')
})

// login to instagram
app.get('/login', async (req, res) => {
  const saveInstagramSession = require('./functions');

  await saveInstagramSession(instagram.username, instagram.password);

  res.send('Login successful!')
});


// explore
app.get('/getApi', async (req, res) => {

  const getApi2 = require('./functions');

  await getApi2();

  res.send('Profile loaded!')
});

app.listen(port, () => {
  // console.log(`listening http://localhost:${port}`)
  console.log(`login:    http://localhost:${port}/login`)
  console.log(`profile:  http://localhost:${port}/getApi`)
})