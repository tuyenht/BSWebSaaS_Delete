import { getPayload } from 'payload';
import config from '../payload.config.ts';

const secret = process.env.PAYLOAD_SECRET || 'development-secret-change-me';

async function run(): Promise<void> {
  const payloadInstance = await getPayload({
    config,
    secret,
  });

  try {
    await payloadInstance.db.migrate();
    payloadInstance.logger.info?.('✅ Payload migrations completed');
  } finally {
    await payloadInstance.close();
  }
}

run()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Payload migrations failed', err);
    process.exit(1);
  });

