import 'dotenv/config';

import compression from 'compression';
import cors from 'cors';
import express from 'express';

import { URL_SERVER } from './config/constants/constants';
import { isProduction } from './config/environment/environment';
import db from './database/models/db';
import { runEveryDay } from './helpers/cronJobs';
import { apiErrorHandler } from './services/errorService/ErrorService';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(compression());
console.log(isProduction, 'isProduction');
console.log(URL_SERVER, 'URL_SERVER');
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
    app.use(URL_SERVER, RootRoutes());
    app.use(apiErrorHandler);
    console.log('Drop and Resync Dbasssssxs');
  })
  .catch((e: any) => console.log(e, 'caralho'));

// Express error handlers

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
