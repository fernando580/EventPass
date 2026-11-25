const db = require('../config/db');

const RolModel = {
  getAll: async () => {
    const res = await db.query('SELECT * FROM roles ORDER BY id ASC');
    return res.rows;
  },
  getById: async (id) => {
    const res = await db.query('SELECT * FROM roles WHERE id = $1', [id]);
    return res.rows[0];
  },
  create: async ({ nombre }) => {
    const res = await db.query(
      'INSERT INTO roles (nombre) VALUES ($1) RETURNING *',
      [nombre]
    );
    return res.rows[0];
  },
  update: async (id, { nombre }) => {
    const res = await db.query(
      'UPDATE roles SET nombre = $1 WHERE id = $2 RETURNING *',
      [nombre, id]
    );
    return res.rows[0];
  },
  delete: async (id) => {
    const res = await db.query('DELETE FROM roles WHERE id = $1 RETURNING *', [id]);
    return res.rows[0];
  }
};

module.exports = RolModel;