import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import mongoose from "mongoose";
import { errorHandler, NotFoundError } from "@*****/common";
import { natsWrapper } from "./nats-wrapper";
import config from "config";
import cors from "cors";

import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import { emailVerifyRouter } from "./routes/verify";
import { recordRouter } from "./routes/record";
import { updateRouter } from "./routes/update";
import { registerRouter } from "./routes/register";

const app = express();
app.set("trust proxy", true);
app.disable('x-powered-by');
app.use(json());
app.use(cors());

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);
app.use(emailVerifyRouter);
app.use(recordRouter);
app.use(updateRouter);
app.use(registerRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

// TODO; bind to config as default/dev/test/prod
const nats = true;
// const natsClientId = config.get("NATS_CLIENT_ID");
// const jwtKey = config.get("jwtKey");

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }

  if (nats) {
    if (!process.env.NATS_CLIENT_ID) {
      throw new Error("NATS_CLIENT_ID must be defined");
    }
    if (!process.env.NATS_URL) {
      throw new Error("NATS_URL must be defined");
    }
    if (!process.env.NATS_CLUSTER_ID) {
      throw new Error("NATS_CLUSTER_ID must be defined");
    }

    try {
      connectToNats(
        process.env.NATS_CLUSTER_ID,
        process.env.NATS_CLIENT_ID,
        process.env.NATS_URL
      );
    } catch (err) {
      console.error(err);
    }
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log("Connected to MongoDb");
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log("Listening on port 3000!!!!!!!!");
  });
};

function connectToNats(clusterId: string, clientId: string, url: string) {
  natsWrapper.connect(clusterId, clientId, url).then(() => {
    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed!");
      process.exit();
    });
    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());
  });
}

start();
