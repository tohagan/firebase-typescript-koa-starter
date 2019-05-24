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
  // Choose a region other than the default us-central1
  // .region('europe-west1')
  // Increased memory, decreased timeout (compared to defaults)
  // .runWith({ memory: '1GB', timeoutSeconds: 120 })
  .https.onRequest(app.callback() as any);

export const langs = functions.https.onRequest((req: any, res: any) => {
  const lang = req.headers['accept-language'] || 'en';
  res.send(lang);
});
