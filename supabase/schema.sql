-- Esquema para App Bangla - Administración Equipo Fútbol

-- Jugadores
CREATE TABLE IF NOT EXISTS jugadores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  email TEXT,
  telefono TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Estado de pago (cuotas)
CREATE TABLE IF NOT EXISTS pagos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  jugador_id UUID REFERENCES jugadores(id) ON DELETE CASCADE,
  mes TEXT NOT NULL,
  ano INTEGER NOT NULL,
  estado TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'pagado')),
  monto DECIMAL(10,2) DEFAULT 0,
  fecha_pago TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(jugador_id, mes, ano)
);

-- Indumentaria (números de camiseta por partido)
CREATE TABLE IF NOT EXISTS indumentaria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  jugador_id UUID REFERENCES jugadores(id) ON DELETE CASCADE,
  partido_a INTEGER,
  partido_b INTEGER,
  partido_c INTEGER,
  pantalon BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(jugador_id)
);

-- Tesorería - Movimientos
CREATE TABLE IF NOT EXISTS movimientos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo TEXT NOT NULL CHECK (tipo IN ('ingreso', 'egreso')),
  concepto TEXT NOT NULL,
  monto DECIMAL(10,2) NOT NULL,
  categoria TEXT,
  jugador_id UUID REFERENCES jugadores(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para rendimiento
CREATE INDEX IF NOT EXISTS idx_pagos_jugador ON pagos(jugador_id);
CREATE INDEX IF NOT EXISTS idx_indumentaria_jugador ON indumentaria(jugador_id);
CREATE INDEX IF NOT EXISTS idx_movimientos_tipo ON movimientos(tipo);
