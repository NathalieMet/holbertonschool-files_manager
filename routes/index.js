import express from 'express';
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';

const app = express.Router();
app.use(express.json());

app.get('/status', (req, res) => {
  AppController.getStatus(req, res);
});

app.get('/stats', (req, res) => {
  AppController.getStats(req, res);
});

app.post('/users', (req, res) => {
  UsersController.postNew(req, res);
});

export default app;
