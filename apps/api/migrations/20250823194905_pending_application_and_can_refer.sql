CREATE TABLE pending_application (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    feide_id TEXT NOT NULL,
    created_at INTEGER NOT NULL
);

CREATE INDEX pending_application_email_idx ON pending_application (email);

CREATE INDEX pending_application_feide_id_idx ON pending_application (feide_id);

ALTER TABLE
    "user"
ADD
    can_refer boolean DEFAULT true NOT NULL;