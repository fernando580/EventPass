-- =====================================================
-- EVENTPASS - Base de datos PostgreSQL
-- Script de creación y datos iniciales
-- =====================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabla de roles
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

-- 2. Tabla de categorías de eventos
CREATE TABLE IF NOT EXISTS categorias_evento (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

-- 3. Tabla de sedes
CREATE TABLE IF NOT EXISTS sedes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(150) NOT NULL,
    direccion VARCHAR(200) NOT NULL,
    ciudad VARCHAR(100) NOT NULL,
    capacidad_total INTEGER NOT NULL
);

-- 4. Tabla de espacios asociados a una sede
CREATE TABLE IF NOT EXISTS espacios_sede (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sede_id UUID NOT NULL REFERENCES sedes(id),
    nombre VARCHAR(150) NOT NULL,
    capacidad INTEGER NOT NULL
);

-- =====================================================
-- DATOS INICIALES
-- =====================================================

-- Roles
INSERT INTO roles (nombre)
SELECT datos.nombre
FROM (VALUES
    ('Asistente'),
    ('Organizador'),
    ('Admin Sede'),
    ('Supervisor de eventos')
) AS datos(nombre)
WHERE NOT EXISTS (
    SELECT 1 FROM roles WHERE roles.nombre = datos.nombre
);

-- Categorías
INSERT INTO categorias_evento (nombre)
SELECT datos.nombre
FROM (VALUES
    ('Concierto'),
    ('Teatro'),
    ('Deporte')
) AS datos(nombre)
WHERE NOT EXISTS (
    SELECT 1 FROM categorias_evento
    WHERE categorias_evento.nombre = datos.nombre
);

-- Sede inicial
INSERT INTO sedes (nombre, direccion, ciudad, capacidad_total)
SELECT
    'Arena Cañaveralejo',
    'Calle 5 # 38-00',
    'Cali',
    15000
WHERE NOT EXISTS (
    SELECT 1 FROM sedes
    WHERE nombre = 'Arena Cañaveralejo'
);

-- Espacio inicial asociado a la sede
INSERT INTO espacios_sede (sede_id, nombre, capacidad)
SELECT
    sedes.id,
    'Escenario Principal',
    10000
FROM sedes
WHERE sedes.nombre = 'Arena Cañaveralejo'
AND NOT EXISTS (
    SELECT 1 FROM espacios_sede
    WHERE espacios_sede.sede_id = sedes.id
    AND espacios_sede.nombre = 'Escenario Principal'
);

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================
