const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/projects.json',
        createProxyMiddleware({
            target: 'https://www.artstation.com',
            changeOrigin: true,
        })
    );
};