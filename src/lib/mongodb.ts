import { MongoClient } from 'mongodb';

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

/**
 * Returns a connected MongoClient promise.
 * Throws a clear error at call-time (not import-time) when MONGODB_URI is missing,
 * so other parts of the module (e.g. dev-mode test-user shortcuts) can still run.
 */
function getClientPromise(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    return Promise.reject(
      new Error('MONGODB_URI is not set. Add it to .env.local and restart the server.')
    );
  }

  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
      const client = new MongoClient(uri);
      global._mongoClientPromise = client.connect();
    }
    return global._mongoClientPromise!;
  }

  const client = new MongoClient(uri);
  return client.connect();
}

const clientPromise: Promise<MongoClient> = getClientPromise();

export default clientPromise;
