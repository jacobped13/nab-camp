import { env } from '@env';
import { serve } from '@hono/node-server';
import { app } from './app';

const port = env.PORT;

serve(
  {
    fetch: app.fetch,
    port: port,
  },
  () => {
    console.log(`Server is running on port ${port}`);
  }
);
