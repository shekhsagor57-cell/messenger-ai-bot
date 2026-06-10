const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const app = express();
app.use(express.json());

const genAI = new GoogleGenerativeAI("YOUR_GEMINI_API_KEY"); // এখানে আপনার API কী দিন

app.get('/webhook', (req, res) => {
    if (req.query['hub.verify_token'] === 'MY_SECRET_TOKEN') { // এখানে আপনার নিজের দেওয়া টোকেন দিন
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Error, wrong validation token');
    }
});

app.post('/webhook', async (req, res) => {
    const messaging = req.body.entry[0].messaging[0];
    const message = messaging.message.text;
    
    // Gemini AI দিয়ে উত্তর তৈরি
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(message);
    const response = await result.response;
    
    console.log(response.text()); // এখানে মেসেজ রেসপন্স করার কোড বসবে (পরবর্তীতে দিব)
    res.status(200).send('EVENT_RECEIVED');
});

app.listen(process.env.PORT || 3000, () => console.log('Bot is running!'));
