import Koa from "koa";

const pkg = require("../package.json");
type Ctx = Koa.ParameterizedContext;
type Next = () => Promise<any>;

export class Middleware {

  public static async appHeaders(ctx: Ctx, next: Next) {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    // console.log(`${ctx.method} ${ctx.url} - ${ms}`);
    ctx.set('X-App-Version', pkg.version);
    ctx.set('X-Response-Time', `${ms}ms`);
    ctx.set('X-Server-Url', ctx.req.url || 'Unknown');
  };

  public static async errorMapper(ctx: Ctx, next: Next) {
    try {
      await next();
    } catch (err) {
      ctx.status = err.status || 500;
      ctx.body = err.message;
      ctx.app.emit('error', err, ctx);
    }
  }

  public static async geoip(ctx: Ctx) {
    ctx.$geoip = {
      ip: ctx.headers["x-appengine-user-ip"],
      country: ctx.headers["x-appengine-country"],
      region: ctx.headers["x-appengine-region"],
      city: ctx.headers["x-appengine-city"],
      citylatlong: ctx.headers["x-appengine-citylatlong"]
    }
  }

}



