import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();
const app = express();

const configuration = new Configuration({
    apiKey: process.env.OPEN_AI_API
})

const openai = new OpenAIApi(configuration);

app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
    console.log('loaded')
    res.status(200).send({
        message: "Hello welcome to node server"
    });
})

app.post("/", async (req, res) => {
    console.log("data posted");
    console.log(req.body);
    try {
        const prompt = req.body.prompt;

        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${prompt}`,
            temperature: 0,
            max_tokens: 3000,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0
        });

        res.status(200).send({
            bot: response.data.choices[0].text
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            error
        })
    }
})

app.listen(process.env.PORT, (req, res) => {
    console.log(`Server started at ${process.env.PORT}`)
})
