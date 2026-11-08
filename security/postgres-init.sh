#!/bin/sh
set -eu

case "${APP_DB_PASSWORD:-}" in
  ""|*[!a-fA-F0-9]*)
    echo "APP_DB_PASSWORD must be a non-empty hexadecimal secret." >&2
    exit 1
    ;;
esac

psql \
  --set=ON_ERROR_STOP=1 \
  --set=app_password="$APP_DB_PASSWORD" \
  --set=database_name="$POSTGRES_DB" \
  --set=owner_name="$POSTGRES_USER" \
  --username "$POSTGRES_USER" \
  --dbname "$POSTGRES_DB" <<'SQL'
CREATE ROLE mtm_runtime LOGIN PASSWORD :'app_password';
GRANT CONNECT ON DATABASE :"database_name" TO mtm_runtime;
GRANT USAGE ON SCHEMA public TO mtm_runtime;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO mtm_runtime;
GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA public TO mtm_runtime;
ALTER DEFAULT PRIVILEGES FOR ROLE :"owner_name" IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO mtm_runtime;
ALTER DEFAULT PRIVILEGES FOR ROLE :"owner_name" IN SCHEMA public
  GRANT USAGE, SELECT, UPDATE ON SEQUENCES TO mtm_runtime;
SQL