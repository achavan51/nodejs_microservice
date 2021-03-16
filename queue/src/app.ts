import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cors from 'cors';
import { errorHandler, NotFoundError, currentUser } from '@*****/common';
import { newQueueRouter } from './routes/new';
import { showQueueRouter } from './routes/show'
import { indexQueueRouter } from './routes/index';
import { updateQueueRouter } from './routes/update';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cors());

app.use(currentUser);
app.use(newQueueRouter);
app.use(showQueueRouter);
app.use(indexQueueRouter);
app.use(updateQueueRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
