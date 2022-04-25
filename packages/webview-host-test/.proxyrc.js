module.exports = function (app) {
    app.use((req, res, next) => {
        res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp') // or unsafe-eval
        res.setHeader('Cross-Origin-Opener-Policy', 'same-origin')
        next()
    })
}
