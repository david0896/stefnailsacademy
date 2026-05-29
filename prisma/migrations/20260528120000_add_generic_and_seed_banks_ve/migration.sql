-- Fase 13.2: tabla genérica de catálogos + seed con bancos VE (códigos SUDEBAN)
-- Aditiva e idempotente:
--   - CREATE TABLE / CREATE INDEX usan IF NOT EXISTS
--   - INSERTs usan ON CONFLICT DO NOTHING contra @@unique([category, code])

CREATE TABLE IF NOT EXISTS "generics" (
    "id"         TEXT NOT NULL,
    "category"   TEXT NOT NULL,
    "code"       TEXT NOT NULL,
    "label"      TEXT NOT NULL,
    "order"      INTEGER NOT NULL DEFAULT 0,
    "active"     BOOLEAN NOT NULL DEFAULT true,
    "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"  TIMESTAMP(3) NOT NULL,
    CONSTRAINT "generics_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "generics_category_code_key"
    ON "generics"("category", "code");

CREATE INDEX IF NOT EXISTS "generics_category_active_idx"
    ON "generics"("category", "active");

-- Seed: bancos venezolanos vigentes (SUDEBAN). El orden numérico sigue el
-- código SUDEBAN; en la UI se ordena por "order" → "label".
INSERT INTO "generics" ("id", "category", "code", "label", "order", "active", "updatedAt") VALUES
    ('gen_bank_ve_0102', 'BANK_VE', '0102', 'Banco de Venezuela',                       102, true, CURRENT_TIMESTAMP),
    ('gen_bank_ve_0104', 'BANK_VE', '0104', 'Venezolano de Crédito',                    104, true, CURRENT_TIMESTAMP),
    ('gen_bank_ve_0105', 'BANK_VE', '0105', 'Mercantil',                                105, true, CURRENT_TIMESTAMP),
    ('gen_bank_ve_0108', 'BANK_VE', '0108', 'BBVA Provincial',                          108, true, CURRENT_TIMESTAMP),
    ('gen_bank_ve_0114', 'BANK_VE', '0114', 'Bancaribe',                                114, true, CURRENT_TIMESTAMP),
    ('gen_bank_ve_0115', 'BANK_VE', '0115', 'Banco Exterior',                           115, true, CURRENT_TIMESTAMP),
    ('gen_bank_ve_0128', 'BANK_VE', '0128', 'Banco Caroní',                             128, true, CURRENT_TIMESTAMP),
    ('gen_bank_ve_0134', 'BANK_VE', '0134', 'Banesco',                                  134, true, CURRENT_TIMESTAMP),
    ('gen_bank_ve_0137', 'BANK_VE', '0137', 'Sofitasa',                                 137, true, CURRENT_TIMESTAMP),
    ('gen_bank_ve_0138', 'BANK_VE', '0138', 'Banco Plaza',                              138, true, CURRENT_TIMESTAMP),
    ('gen_bank_ve_0146', 'BANK_VE', '0146', 'Bangente',                                 146, true, CURRENT_TIMESTAMP),
    ('gen_bank_ve_0151', 'BANK_VE', '0151', 'BFC Banco Fondo Común',                    151, true, CURRENT_TIMESTAMP),
    ('gen_bank_ve_0156', 'BANK_VE', '0156', '100% Banco',                               156, true, CURRENT_TIMESTAMP),
    ('gen_bank_ve_0157', 'BANK_VE', '0157', 'DelSur',                                   157, true, CURRENT_TIMESTAMP),
    ('gen_bank_ve_0163', 'BANK_VE', '0163', 'Banco del Tesoro',                         163, true, CURRENT_TIMESTAMP),
    ('gen_bank_ve_0166', 'BANK_VE', '0166', 'Banco Agrícola de Venezuela',              166, true, CURRENT_TIMESTAMP),
    ('gen_bank_ve_0168', 'BANK_VE', '0168', 'Bancrecer',                                168, true, CURRENT_TIMESTAMP),
    ('gen_bank_ve_0169', 'BANK_VE', '0169', 'Mi Banco',                                 169, true, CURRENT_TIMESTAMP),
    ('gen_bank_ve_0171', 'BANK_VE', '0171', 'Banco Activo',                             171, true, CURRENT_TIMESTAMP),
    ('gen_bank_ve_0172', 'BANK_VE', '0172', 'Bancamiga',                                172, true, CURRENT_TIMESTAMP),
    ('gen_bank_ve_0174', 'BANK_VE', '0174', 'Banplus',                                  174, true, CURRENT_TIMESTAMP),
    ('gen_bank_ve_0175', 'BANK_VE', '0175', 'Banco Bicentenario del Pueblo',            175, true, CURRENT_TIMESTAMP),
    ('gen_bank_ve_0177', 'BANK_VE', '0177', 'Banfanb',                                  177, true, CURRENT_TIMESTAMP),
    ('gen_bank_ve_0191', 'BANK_VE', '0191', 'BNC Banco Nacional de Crédito',            191, true, CURRENT_TIMESTAMP)
ON CONFLICT ("category", "code") DO NOTHING;
