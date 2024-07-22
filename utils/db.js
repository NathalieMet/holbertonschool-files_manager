import { MongoClient } from 'mongodb';

class DBClient {
    #mongoClient = null;
    #isConnectionAlive = false;

    constructor() {
        const host = process.env.DB_HOST || 'localhost';
        const port = process.env.DB_PORT || '27017';
        const database = process.env.DB_DATABASE || 'files_manager';
        this.#mongoClient = new MongoClient(`mongodb://${host}:${port}/${database}`, { useUnifiedTopology: true });
        this.#mongoClient.connect().then(() => {
            this.#isConnectionAlive = true;
        });
    }

    isAlive() {
        return this.#isConnectionAlive;
    }

    async nbUsers() {
        if (!this.isAlive())
            return -1;
        const collection = this.#mongoClient.db().collection('users');
        const count = await collection.countDocuments();
        return count;
    }

    async nbFiles() {
        if (!this.isAlive())
            return -1;
        const collection = this.#mongoClient.db().collection('files');
        const count = await collection.countDocuments();
        return count;
    }
}
const dbClient = new DBClient();
export default dbClient;
