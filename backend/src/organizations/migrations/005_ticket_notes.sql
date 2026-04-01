CREATE TABLE ticket_notes (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id       uuid NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    author_id       uuid NOT NULL,
    author_name     text NOT NULL,
    content         text NOT NULL CHECK (char_length(content) BETWEEN 1 AND 5000),
    created_at      timestamptz NOT NULL DEFAULT now()
  );

  CREATE INDEX ticket_notes_ticket_id_idx ON ticket_notes (ticket_id);