import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cors from 'cors';

import { errorHandler, NotFoundError, currentUser } from '@*****/common';
import { createSkillRouter } from './routes/new';
import { showSkillRouter } from './routes/show'
import { indexSkillRouter } from './routes/index'
import { trainingRouter } from './routes/training'
import { updateSkillRouter } from './routes/update';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cors());

app.use(currentUser);
app.use(showSkillRouter);
app.use(indexSkillRouter);
app.use(createSkillRouter);
app.use(updateSkillRouter);
app.use(trainingRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
