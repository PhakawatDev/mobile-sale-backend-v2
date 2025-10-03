import { buildApp } from './app';
import { config } from './config';

const app = buildApp();
const port = config.app.port;

app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
});
