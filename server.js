const mongoose = require('mongoose');
const app = require('./src/app');
const config = require('./src/app/config');

async function bootstrap() {
    try {
        await mongoose.connect(config.dbURI);
        console.log('Database connected');

        app.listen(config.port, () => {
            console.log(`Server running on port ${config.port}`);
        });
    } catch (err) {
        console.error('Failed to start server', err);
        process.exit(1);
    }
}

bootstrap();