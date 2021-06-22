module.exports = (router) => {
  router.get('/v1', function(req, res, next) {
    res.render('index', { title: 'Express' });
  });
}
