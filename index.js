const express = require('express');const axios = require('axios');const { GoogleGenerativeAI } = require("@google/generative-ai");
const app = express();app.use(express.json());
// কোডের ভেতরে কি-গুলো না লিখে আমরা এগুলো ভেরসেল থেকে নেবconst GEMINI_API_KEY = process.env.GEMINI_API_KEY; const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;const VERIFY_TOKEN = "my_secret_123";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
app.get('/webhook', (req, res) => {    if (req.query['hub.verify_token'] === VERIFY_TOKEN) {        res.send(req.query['hub.challenge']);    } else {        res.send('Error, wrong token');    }});
app.post('/webhook', async (req, res) => {    const data = req.body;    if (data.object === 'page') {        data.entry.forEach(async (entry) => {            const webhook_event = entry.messaging[0];            const senderId = webhook_event.sender.id;            const messageText = webhook_event.message.text;
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });            const result = await model.generateContent(messageText);            const aiResponse = result.response.text();
            await axios.post(`https://graph.facebook.com/v12.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`, {                recipient: { id: senderId },                message: { text: aiResponse }            });        });        res.status(200).send('EVENT_RECEIVED');    }});
app.listen(process.env.PORT || 3000, () => console.log('Bot is running!'));
