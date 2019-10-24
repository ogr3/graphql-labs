const Router = require("@koa/router");
const { pokedex } = require("./pokedex.js");
const _ = require("lodash");

function applyRestMiddleware(app) {
  const router = new Router();

  // Return a list of random pokemons
  router.get("/api/random_pokemons/:nr", ctx => {
    const pokemons = _.sampleSize(pokedex, ctx.params.nr);
    console.log("Pokemons", pokemons);
    ctx.body = pokemons;
  });

  app.use(router.routes());
}

exports.applyRestMiddleware = applyRestMiddleware;
