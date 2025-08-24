CREATE TABLE "user" (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    feide_id TEXT UNIQUE,
    role TEXT NOT NULL DEFAULT 'normal',
    additional_beers INTEGER NOT NULL DEFAULT 0,
    alt_email TEXT,
    phone TEXT,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE "group" (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT
);

CREATE TABLE users_groups (
    user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    group_id TEXT NOT NULL REFERENCES "group"(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, group_id)
);

CREATE TABLE event (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    date TIMESTAMPTZ NOT NULL
);

CREATE TABLE shift (
    id TEXT PRIMARY KEY,
    event_id TEXT NOT NULL REFERENCES event(id) ON DELETE CASCADE,
    start_at TIMESTAMPTZ NOT NULL,
    end_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE user_shift (
    user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    shift_id TEXT NOT NULL REFERENCES shift(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ,
    is_beer_claimed BOOLEAN NOT NULL DEFAULT FALSE,
    status TEXT NOT NULL DEFAULT 'accepted',
    PRIMARY KEY (user_id, shift_id)
);

CREATE TABLE producer (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    image_id TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE TABLE product_type (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE TABLE product (
    id TEXT PRIMARY KEY,
    sku TEXT,
    name TEXT NOT NULL,
    description TEXT,
    is_sold_out BOOLEAN NOT NULL DEFAULT FALSE,
    ordinary_price INTEGER NOT NULL,
    student_price INTEGER NOT NULL,
    internal_price INTEGER NOT NULL,
    credits INTEGER,
    volume REAL,
    alcohol_content REAL,
    variants TEXT,
    image_id TEXT,
    producer_id TEXT REFERENCES producer(id),
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE TABLE product_product_types (
    product_id TEXT NOT NULL REFERENCES product(id) ON DELETE CASCADE,
    product_type_id TEXT NOT NULL REFERENCES product_type(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, product_type_id)
);

CREATE TABLE claimed_credit (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES "user"(id),
    product_id TEXT NOT NULL,
    credit_cost INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE contact_submission (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    ip_address TEXT
);

CREATE TABLE image (
    id TEXT PRIMARY KEY,
    filename TEXT NOT NULL,
    size INTEGER NOT NULL,
    type TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE invitation (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    claimed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX invitation_email_idx ON invitation (email);

CREATE TABLE notification (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    body TEXT,
    archived_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_user_id ON notification (user_id);

CREATE INDEX idx_notifications_archived_at ON notification (archived_at);

CREATE TABLE session (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_claimed_credits_user_id ON claimed_credit (user_id);

CREATE INDEX idx_shifts_event_id ON shift (event_id);

CREATE INDEX idx_products_producer_id ON product (producer_id);

CREATE INDEX idx_products_name ON product (name);

CREATE INDEX idx_sessions_user_id ON session (user_id);