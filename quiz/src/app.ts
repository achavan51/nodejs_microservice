import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cors from "cors";
import { errorHandler, NotFoundError, currentUser } from "@*****/common";
import { newQuizRouter } from "./routes/new";
import { showQuizRouter } from "./routes/show";
import { indexQuizRouter } from "./routes/index";
import { updateQuizRouter } from "./routes/update";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(cors());

app.use(currentUser);
app.use(newQuizRouter);
app.use(showQuizRouter);
// app.use(indexQuizRouter);
app.use(updateQuizRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
