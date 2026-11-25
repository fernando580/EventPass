const db = require('../config/db');

const SedeModel = {
  getAll: async () => {
    const res = await db.query('SELECT * FROM sedes');
    return res.rows;
  },
  getById: async (id) => {
    const res = await db.query('SELECT * FROM sedes WHERE id = $1', [id]);
    return res.rows[0];
  },
  create: async ({ nombre, direccion, ciudad, capacidad_total }) => {
    const res = await db.query(
      'INSERT INTO sedes (nombre, direccion, ciudad, capacidad_total) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre, direccion, ciudad, capacidad_total]
    );
    return res.rows[0];
  },
  update: async (id, { nombre, direccion, ciudad, capacidad_total }) => {
    const res = await db.query(
      'UPDATE sedes SET nombre = $1, direccion = $2, ciudad = $3, capacidad_total = $4 WHERE id = $5 RETURNING *',
      [nombre, direccion, ciudad, capacidad_total, id]
    );
    return res.rows[0];
  },
  delete: async (id) => {
    const res = await db.query('DELETE FROM sedes WHERE id = $1 RETURNING *', [id]);
    return res.rows[0];
  }
};

module.exports = SedeModel;