import { MongoClient, type MongoClientOptions } from 'mongodb';

const uri = process.env.MONGODB_URI!;
const options: MongoClientOptions = {};

const globalWithMongo = global as typeof globalThis & {
  _mongoClient?: MongoClient;
};

function getClient(): MongoClient {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI 環境変数が設定されていません');
  }

  if (process.env.NODE_ENV === 'development') {
    // 開発環境ではHMR時にコネクションが増えないようグローバルに保持
    if (!globalWithMongo._mongoClient) {
      globalWithMongo._mongoClient = new MongoClient(uri, options);
    }
    return globalWithMongo._mongoClient;
  }

  return new MongoClient(uri, options);
}

// Auth.js の MongoDBAdapter は MongoClient インスタンスを受け取る
// ビルド時にはダミークライアントを返して MongoParseError を回避
const client =
  process.env.MONGODB_URI && process.env.MONGODB_URI.startsWith('mongodb')
    ? getClient()
    : (new Proxy({} as MongoClient, {
        get(_, prop) {
          if (prop === 'db') {
            return () => {
              throw new Error('MONGODB_URI が未設定です');
            };
          }
          return undefined;
        },
      }) as MongoClient);

export default client;
