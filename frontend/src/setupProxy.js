// Proxy delle chiamate API attraverso il dev server del frontend.
// Il browser chiama sempre /api sullo stesso origin con cui apre la pagina
// (localhost, IP della LAN o dominio pubblico tdash.islab.di.unimi.it): qui
// le richieste vengono inoltrate al backend sulla rete interna di Docker.
// Cosi non serve esporre pubblicamente la porta 3001 ne gestire CORS.
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: process.env.BACKEND_URL || "http://backend:3001",
      changeOrigin: true,
      pathRewrite: { "^/api": "" },
    })
  );
};
