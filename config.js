module.exports = {
    redis: {
        init: params => require('redis').createClient(params),
        default: {
            db: 0,
            port: 6379
        },
        development: {
            host: '127.0.0.1'
        },
        production: {
            db: 1,
            host: '192.168.0.10'
        }
    }
}