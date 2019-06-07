import Router from "koa-router";
const router = new Router();

router.get('/langs', async (ctx) => {
  // Example: 'en;en-US,q=0.9;fr,q=0.8'
  const acceptLangs = ctx.headers['accept-language'] || 'en';
  // Example: { 'en': 1, 'en-US':: 0.9, 'fr': 0.8 }
  const result = acceptLangs
    .split(',')
    .reduce((obj: {[lang: string]: number}, lang: string) => {
      const parts = lang.split(';');
      obj[parts[0]] = parseFloat(parts.length > 1 ? parts[1].replace('q=', '') : '1');
      return obj;
    }, {});
  ctx.body = result;
});

export default router;