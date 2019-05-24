import Koa from "koa";

const pkg = require("../package.json");
type Ctx = Koa.ParameterizedContext;
type Next = () => Promise<any>;

export class Middleware {

  // Firebase hosting rewrite rules fail to remove route path prefix
  public static fbRewriteFix(prefix: string) {
    return (ctx: Ctx, next: Next) => {
      console.log(ctx.url);
      if (ctx.url.startsWith(prefix)) {
        const orig = ctx.url;
        ctx.url = ctx.url.replace(prefix, '');
        return next().then(() => {
          ctx.url = orig;
        });
      }

      return next();
    }
  }

  // public static async fbRewriteFix(ctx: Ctx, next: Next) {
  //   if (ctx.url.startsWith('/api')) {
  //     ctx.url = ctx.url.replace('/api', '');
  //   }
  //   await next();
  // };

  public static async appHeaders(ctx: Ctx, next: Next) {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    // console.log(`${ctx.method} ${ctx.url} - ${ms}`);
    ctx.set('X-app-version', pkg.version);
    ctx.set('X-response-time', `${ms}ms`);
    ctx.set('X-ctx-url', ctx.url || 'Unknown');
    ctx.set('X-ctx-original-url', ctx.originalUrl || 'Unknown');
    ctx.set('X-req-url', ctx.req.url || 'Unknown');
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



