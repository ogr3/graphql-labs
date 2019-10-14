const Koa = require("koa")
const cors = require("@koa/cors")
const app = new Koa()
const serve = require("koa-static")
const mount = require("koa-mount")
const { applyGraphQLMiddleware } = require("./graphql")
const { applyRestMiddleware } = require("./rest")

app.use(cors())

// Serve images
app.use(mount("/images", serve("./pokemon.json/images")))
app.use(mount("/thumbnails", serve("./pokemon.json/thumbnails")))

applyRestMiddleware(app)
applyGraphQLMiddleware(app)

app.listen(4000)
 console.log(`🚀 Server ready at port 4000`)
