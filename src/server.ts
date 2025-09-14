import app from './app';
import { env } from './config/env';

const PORT = parseInt(env.port, 10);
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});
