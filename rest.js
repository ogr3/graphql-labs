const Router = require("@koa/router")

function applyRestMiddleware(app) {
  const router = new Router()

  router.get("/api/test", (ctx, next) => {
    ctx.body = "Testing"
  })

  app.use(router.routes())
}

exports.applyRestMiddleware = applyRestMiddleware
