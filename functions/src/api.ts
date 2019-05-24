import Router from "koa-router";
const router = new Router();

router.get('/langs', async (ctx, next) => {
  const lang = ctx.headers['accept-language'] || 'en';
  ctx.body = lang;
});

export default router;