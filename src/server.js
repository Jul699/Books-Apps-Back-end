
//3220302
//Irfan Juliana
const Hapi = require('@hapi/hapi');
const routes = require('./routes');

const init = async () => {
    const server = Hapi.server({
        port: 3003,
        host: process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost',
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    });

    server.route(routes);

    // Tangani event 'clientError'
    server.listener.on('clientError', (err, socket) => {
        console.error('Error pada koneksi client:', err);
        // Hancurkan socket yang terkait
        socket.destroy(err);
    });

    try {
        await server.start();
        console.log(`Server berjalan pada ${server.info.uri}`);
    } catch (error) {
        console.error('Gagal memulai server Hapi:', error);
    }
};

init();
