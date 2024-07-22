import { MongoClient } from 'mongodb';
import { createHash } from 'crypto';

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || '27017';
    const database = process.env.DB_DATABASE || 'files_manager';
    this.mongoClient = new MongoClient(`mongodb://${host}:${port}/${database}`, { useUnifiedTopology: true });
    this.isConnectionAlive = false;
    this.mongoClient.connect().then(() => {
      this.isConnectionAlive = true;
    });
  }

  isAlive() {
    return this.isConnectionAlive;
  }

  async nbUsers() {
    if (!this.isAlive()) {
      return -1;
    }
    const collection = this.mongoClient.db().collection('users');
    const count = await collection.countDocuments();
    return count;
  }

  async nbFiles() {
    if (!this.isAlive()) {
      return -1;
    }
    const collection = this.mongoClient.db().collection('files');
    const count = await collection.countDocuments();
    return count;
  }

  async doesUserExist(email) {
    if (!this.isAlive()) {
      return false;
    }

    const collection = this.mongoClient.db().collection('users');
    const user = await collection.findOne({'email': email});

    return user != null;
  }

  async createUser(email, password) {
    if (!this.isAlive()) {
      return -1;
    }

    const hash = createHash('sha1');
    hash.update(password);

    const document = {
      'email': email,
      'password': hash.digest('hex')
    }

    const collection = this.mongoClient.db().collection('users');
    const result = await collection.insertOne(document);

    return result.insertedId;
  }
}
const dbClient = new DBClient();
export default dbClient;
