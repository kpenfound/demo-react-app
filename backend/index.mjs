import { setUser, getUser, deleteUser } from './database.mjs';
import express from 'express';
import uuid4 from 'uuid4';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());
const port = 3000;

// Create
app.post('/users', async (req, res) => {
  let id = uuid4();
  let user = req.body;
  user.id = id;
  await setUser(id, user);

  res.send(user);
});

// Read
app.get('/users/:id', async (req, res) => {
  let user = await getUser(req.params['id']);
  res.send(user);
});

// Update
app.patch('/users/:id', async (req, res) => {
  let id = req.params['id'];
  let user = req.body;
  user.id = id;
  await setUser(id, user);

  res.send(user);
});

// Delete
app.delete('/users/:id', async (req, res) => {
  let id = req.params['id'];
  let deleted = await deleteUser(id);
  res.send({ deleted: deleted });
});

app.listen(port, () => {
  console.log(`User API listening on port ${port}`);
});
