const db = require('../config/db');

const EspacioModel = {
  getAll: async () => {
    const res = await db.query('SELECT * FROM espacios_sede');
    return res.rows;
  },
  getById: async (id) => {
    const res = await db.query('SELECT * FROM espacios_sede WHERE id = $1', [id]);
    return res.rows[0];
  },
  create: async ({ sede_id, nombre, capacidad }) => {
    const res = await db.query(
      'INSERT INTO espacios_sede (sede_id, nombre, capacidad) VALUES ($1, $2, $3) RETURNING *',
      [sede_id, nombre, capacidad]
    );
    return res.rows[0];
  },
  update: async (id, { sede_id, nombre, capacidad }) => {
    const res = await db.query(
      'UPDATE espacios_sede SET sede_id = $1, nombre = $2, capacidad = $3 WHERE id = $4 RETURNING *',
      [sede_id, nombre, capacidad, id]
    );
    return res.rows[0];
  },
  delete: async (id) => {
    const res = await db.query('DELETE FROM espacios_sede WHERE id = $1 RETURNING *', [id]);
    return res.rows[0];
  }
};

module.exports = EspacioModel;