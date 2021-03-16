import express from "express";
import mongoose from "mongoose";
// import "express-async-errors";
import { json } from "body-parser";
// import cookieSession from "cookie-session";
import { errorHandler, NotFoundError } from "@*****/common";
import { natsWrapper } from './nats-wrapper';

import { ExpertAccountCreatedListener } from "./events/listeners/expert-account-created-listener";
// import { currentUserRouter } from './routes/current-user';

const app = express();
app.set("trust proxy", true);
app.use(json());
// app.use(
//   cookieSession({
//     signed: false,
//     secure: true,
//   })
// );

// app.use(currentUserRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

// const migration = require("./services/migration")

const start = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }

  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined');
  }
  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL must be defined');
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined');
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    })
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    new ExpertAccountCreatedListener(natsWrapper.client).listen();

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log('Connected to MongoDb');

    app.listen(3000, () => {
      console.log("Listening on port 3000!!!!!!");
    });
  } catch (err) {
    console.error('err!:', err);
  }

};

start();