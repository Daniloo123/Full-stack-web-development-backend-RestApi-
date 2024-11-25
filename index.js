
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';

import postRoutes from './routes/posts.js';

const app = express();

const options = {
  "origin": "*",
  "methods": "GET,POST,OPTIONS",
  "preflightContinue": false,
  "optionsSuccessStatus": 200
}

app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
app.use(bodyParser.json({ type: "application/json" }))

app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With,Content-Type, Accept');
  next();
});

//app.use(cors(options));

app.use('/posts', postRoutes);
//app.use('/posts/:id', cors(options_detail), postRoutes);

const CONNECTION_URL = 'mongodb+srv://Danilo:testtest@danilo.md4zkmf.mongodb.net/';
const PORT = process.env.PORT || 8000;

mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`Server Running on Port: http://localhost:${PORT}`)))
  .catch((error) => console.log(`${error} did not connect`));

mongoose.set('useFindAndModify', false);