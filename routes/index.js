import express from 'express';
import AppController from '../controllers/AppController.js';

const app = express.Router();

app.get('/status', (req, res) => {
  AppController.getStatus(req, res);
});

app.get('/stats', (req, res) => {
  AppController.getStats(req, res);
});

export default app;
