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
// app.use(Middleware.fbRewriteFix);

app.on('error', (err, ctx) => {
  console.log(err);
});

import apiRouter from './api'

app.use(apiRouter.routes());
app.use(apiRouter.allowedMethods());

// "/api" included in hosting rewrite rules.
export const api = functions
  // .region('europe-west1') // Choose a region other than the default us-central1
  // .runWith({ memory: '1GB', timeoutSeconds: 120 }) // Increased memory, decreased timeout (compared to defaults)
  .https.onRequest(app.callback() as any); // Converts a Koa app into a Firebase function

export const langs = functions.https.onRequest((req: any, res: any) => {
  const lang = req.headers['accept-language'] || 'en';
  res.send(lang);
});
