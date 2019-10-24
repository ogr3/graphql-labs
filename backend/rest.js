const Router = require("@koa/router");
const { pokedex } = require("./pokedex.js");
const _ = require("lodash");

function applyRestMiddleware(app) {
  const router = new Router();

  // Return a list of random pokemons
  router.get("/api/random_pokemons/:nr", ctx => {
    ctx.body = _.sampleSize(pokedex, ctx.params.nr);
  });

  app.use(router.routes());
}

exports.applyRestMiddleware = applyRestMiddleware;
