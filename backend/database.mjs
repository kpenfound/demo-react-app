import { createClient } from 'redis';

const client = await connect();

async function connect() {
  let host = process.env.REDIS_HOST;
  const client = createClient({
    url: `redis://${host}:6379`,
  });

  client.on('error', (err) => console.log('Redis Client Error', err));

  await client.connect();
  return client;
}

async function setUser(id, user) {
  await client.hSet(id, user);
}

async function getUser(id) {
  return await client.hGetAll(id);
}

async function deleteUser(id) {
  return await client.del(id);
}

export { setUser, getUser, deleteUser };
