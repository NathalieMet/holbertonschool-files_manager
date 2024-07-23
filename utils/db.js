import { MongoClient, ObjectId } from 'mongodb';

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || '27017';
    const database = process.env.DB_DATABASE || 'files_manager';
    this.mongoClient = new MongoClient(`mongodb://${host}:${port}/${database}`, { useUnifiedTopology: true });
    this.isConnectionAlive = false;

    this.mongoClient.connect()
      .then(() => {
        this.isConnectionAlive = true;
      })
      .catch((err) => {
        console.error('Failed to connect to MongoDB', err);
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

  async createUser(email, password) {
    if (!this.isAlive()) {
      return -1;
    }

    const hashedPassword = sha1(password);
    const document = { email, password: hashedPassword };

    const collection = this.mongoClient.db().collection('users');
    const result = await collection.insertOne(document);

    return result.insertedId;
  }

  async findUserByEmail(email) {
    if (!this.isAlive()) {
      return null;
    }

    const collection = this.mongoClient.db().collection('users');
    const user = await collection.findOne({ email }, { projection: { _id: 1, email: 1, password: 1 } });
    return user;
  }

  async findUserById(id) {
    if (!this.isAlive()) {
      return null;
    }

    const collection = this.mongoClient.db().collection('users');
    const user = await collection.findOne({ _id: new ObjectId(id) }, { projection: { _id: 1, email: 1 } });
    return user;
  }
}

const dbClient = new DBClient();
export default dbClient;
