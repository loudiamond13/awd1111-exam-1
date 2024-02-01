import express from 'express';
import dotenv from 'dotenv';
import debug from 'debug';
import { MpgRouter } from './routes/mpg.js';
import { tempConverterRouter } from './routes/convert.js';
import { IncomeTaxRouter } from './routes/income-tax.js';
import { InterestRouter } from './routes/interest.js';

dotenv.config();
const debugServer = debug('app:Server');

const  app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json());
//middleware
app.use('/api/mpg', MpgRouter);
app.use(`/api/temperature`, tempConverterRouter);
app.use(`/api/income-tax`, IncomeTaxRouter);
app.use(`/api/interest`, InterestRouter);

const port = process.env.PORT || 3000;

app.listen(port,()=>{
  debugServer(`Listening on http://localhost:${port}`);
});
