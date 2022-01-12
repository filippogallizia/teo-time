import cors from 'cors';
import express from 'express';

import { runEveryDay } from './helpers/cronJobs';
import mainRoutes from './routes/routes';
import { apiErrorHandler } from './services/ErrorService';

require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const db = require('./database/models/db');
const { NODE_ENV } = process.env;
export const ENDPOINT = NODE_ENV === 'test' ? '/api' : '/';

app.use(cors());
app.use(express.json());
app.use(ENDPOINT, mainRoutes);

db.sequelize
  .sync({ force: false })
  .then(() => {
    // chronJob to delete past bookings
    runEveryDay(db);
    console.log('Drop and Resync Dbasssssxs');
  })
  .catch((e: any) => console.log(e));

// Express error handlers

app.use(apiErrorHandler);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
