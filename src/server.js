
//3220302
//Irfan Juliana
const Hapi = require('@hapi/hapi');
const routes = require('./routes')

const init = async () => {
    const server = Hapi.server({
        port: 3003,
        host: process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost',
        routes:{
            cors:{
                origin: ['*'],
            },
        },
    })

    server.route(routes)

    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`)
}

init()