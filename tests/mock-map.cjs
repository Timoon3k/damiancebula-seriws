/** Keep rendering checks deterministic and avoid contacting Google. */
module.exports = target => target.route('https://www.google.com/maps**', route => route.fulfill({
  status:200,
  contentType:'text/html; charset=utf-8',
  body:'<!doctype html><html lang="pl"><title>Testowa mapa</title><body><main><h1>Mapa testowa</h1><p>Lokalna atrapa zewnętrznej mapy.</p></main></body></html>',
}));
