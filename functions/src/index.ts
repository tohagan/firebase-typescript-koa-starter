import * as functions from 'firebase-functions';

import Koa from "koa";
import cors from "@koa/cors";
import { Middleware } from "./middleware"

const app = new Koa();

app.use(cors({
  origin: '*',
  credentials: true,
  keepHeadersOnError: true
}));

app.use(Middleware.fbRewriteFix('/api')); // fix Firebase rewrite quirks
app.use(Middleware.appHeaders);
app.use(Middleware.errorMapper);

app.on('error', (err, ctx) => {
  console.log(err);
});

import apiRouter from './api'

app.use(apiRouter.routes());
app.use(apiRouter.allowedMethods());

// "/api" included in hosting rewrite rules.
export const api = functions
  // .region('europe-west1') // Defaults to 'us-central1'
  // .runWith({ memory: '1GB', timeoutSeconds: 120 })
  .https.onRequest(app.callback() as any); // Converts a Koa app into a Firebase function

export const langs = functions.https.onRequest((req: any, res: any) => {
  const acceptLangs: string = req.headers['accept-language'] || 'en';
  const result = acceptLangs
  .split(',')
  .reduce((obj: {[lang: string]: number}, lang: string) => {
    const parts = lang.split(';');
    obj[parts[0]] = parseFloat(parts.length > 1 ? parts[1].replace('q=', '') : '1');
    return obj;
  }, {});

  res.send(result);
});