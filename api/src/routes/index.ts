const express = require('express');
const router = express.Router();

import routes from './routes';
const app = express();

app.use('/', routes);
// Home page route.
//router.get('/', function (req: any, res: any) {
//  res.send('Wiki home page');
//});

export default router;
