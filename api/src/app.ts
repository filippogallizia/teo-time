import cors from 'cors';
import express from 'express';

import { runEveryDay } from './helpers/cronJobs';
import { apiErrorHandler } from './services/ErrorService';

require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const db = require('./database/models/db');
const { NODE_ENV } = process.env;
export const ENDPOINT = NODE_ENV === 'test' ? '/api' : '/';

app.use(cors());

// custom body parser to handle specific requirements from the stripe webook endpoints

app.use((req, res, next) => {
  // TODO -> change endpoint url to the one used in production
  if (req.originalUrl === '/payments/webhook') {
    next();
  } else {
    express.json()(req, res, next);
  }
});

db.sequelize
  .sync({ force: false })
  .then(() => {
    // chronJob to delete past bookings
    runEveryDay(db);
    const RootRoutes = require('./routes/index');
    app.use(ENDPOINT, RootRoutes());

    console.log('Drop and Resync Dbasssssxs');
  })
  .catch((e: any) => console.log(e, 'caralho'));

// Express error handlers

app.use(apiErrorHandler);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
