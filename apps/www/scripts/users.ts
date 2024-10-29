import { createDatabase } from '../src/lib/db/drizzle';
import { type D1Database } from '@cloudflare/workers-types';
import { getPlatformProxy } from 'wrangler';
import { faker } from '@faker-js/faker';
import { nanoid } from 'nanoid';
import { users } from '../src/lib/db/schema';

type Env = {
  DB: D1Database;
};

const main = async () => {
  const { env } = await getPlatformProxy<Env>({
    configPath: './apps/www/wrangler.toml',
    persist: {
      path: './apps/www/.wrangler/state/v3'
    }
  });
  const db = createDatabase(env.DB);
  const fakeUsers = Array.from({ length: 100 }, () => ({
    id: nanoid(),
    email: faker.internet.email(),
    name: faker.person.fullName(),
    role: 'normal'
  }));

  for (const user of fakeUsers) {
    await db.insert(users).values(user);
  }
};

main()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
