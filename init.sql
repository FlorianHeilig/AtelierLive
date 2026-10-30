CREATE TABLE mesures (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  machine TEXT NOT NULL,
  temperature REAL NOT NULL,
  en_marche BOOLEAN NOT NULL,
  at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_mesures_machine_at ON mesures (machine, at DESC);