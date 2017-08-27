module.exports = async (ctx, next) => {
  Object.keys(ctx.query).forEach((key) => {
    if (key.includes('_')) {
      const camelKey = key.replace(/_([a-z])/g, (_, p) => p.toUpperCase());
      ctx.query[camelKey] = ctx.query[key];
      delete ctx.query[key];
    }
  });
  await next();
};
