const express = require('express');

const app = express();
app.use(express.json());

// Rota de emissão de token (permanece disponível para testes)
const jsonwebtoken = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY || 'edu_learn_secret';

app.get('/token', (req, res) => {
  const user = req.query.user || 'guest';
  const role = req.query.role || 'professor';
  const payload = { sub: user, role };
  const token = jsonwebtoken.sign(payload, SECRET_KEY, { expiresIn: '1h' });
  res.json({ token });
});

// Ação de teste sem JWT: rota aberta, sem middleware de proteção
app.get('/users', (req, res) => {
  res.json([
    {
      id: 1,
      name: 'Alice Silva',
      role: 'professora',
      email: 'alice.silva@edulearn.com',
      dateOfBirth: '12/04/1998',
      cpf: '12345678901',
      department: 'Ciência da Computação',
      salary: 'R$ 4.500,00'
    },
    {
      id: 2,
      name: 'Lucas Reinaldo',
      role: 'professor',
      email: 'lucas.reinaldo@edulearn.com',
      dateOfBirth: '23/11/1985',
      cpf: '98765432100',
      department: 'Matemática',
      salary: 'R$ 6.200,00'
    },
    {
      id: 3,
      name: 'Carla Oliveira',
      role: 'professora',
      email: 'carla.oliveira@edulearn.com',
      dateOfBirth: '30/07/2000',
      cpf: '13579246800',
      department: 'Química',
      salary: 'R$ 5.000,00'
    }
  ]);
});

app.get('/users', (req, res) => {
  const filter = req.query.filter || '';
  db.query("SELECT * FROM users WHERE name LIKE '%" + filter + "%';", (e, r) => res.json(r));
});


// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`EduLearn User Service (teste sem JWT) rodando na porta ${PORT}`);
});
