module.exports = (router) =>{
    router.get('/v1/testAPI', function(req, res, next) {
        res.send('API is working properly');
    });
}
