const express = require('express');
const jsonwebtoken = require('jsonwebtoken');

const app = express();
app.use(express.json());

// Rota de emissão de token (permanece disponível para testes)
const SECRET_KEY = process.env.SECRET_KEY || 'edu_learn_secret';
app.get('/token', (req, res) => {
  const user = req.query.user || 'guest';
  const role = req.query.role || 'professor';
  const payload = { sub: user, role };
  const token = jsonwebtoken.sign(payload, SECRET_KEY, { expiresIn: '1h' });
  res.json({ token });
});

/**
 * Vulnerabilidade 1: SQL Injection
 * Simula uma consulta que concatena diretamente o input.
 * Exemplo de exploração:
 *   GET /users?filter=' OR '1'='1
 */
app.get('/users', (req, res) => {
  const filter = req.query.filter || '';
  const unsafeQuery = `SELECT * FROM users WHERE name LIKE '%${filter}%';`;
  // Aqui você devolveria o resultado do banco; para fins de demonstração,
  // retornamos o "SQL" gerado.
  res.json({ query: unsafeQuery });
});

/**
 * Vulnerabilidade 2: XSS refletido
 * Exibe o input sem escape, permitindo <script>inject.
 * Exemplo de exploração:
 *   GET /greet?name=<script>alert('XSS')</script>
 */
app.get('/greet', (req, res) => {
  const name = req.query.name || 'visitante';
  res.send(`<h1>Olá, ${name}!</h1>`);
});

/**
 * Vulnerabilidade 3: Command/Code Injection via eval
 * Executa arbitrariamente a expressão JS enviada.
 * Exemplo de exploração:
 *   GET /calc?expr=process.exit()
 */
app.get('/calc', (req, res) => {
  const expr = req.query.expr || '2+2';
  let result;
  try {
    result = eval(expr);
  } catch (e) {
    result = `Erro na expressão: ${e.message}`;
  }
  res.json({ expression: expr, result });
});

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`EduLearn User Service (vulnerável) rodando na porta ${PORT}`);
});
