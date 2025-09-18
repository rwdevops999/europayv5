# STOP the server

as su run

```bash
ps aux | grep postgres
```

result contains:

/Applications/Postgres.app/Contents/Versions/17/bin/postgres -D /Users/rudiwelter/Library/Application Support/Postgres/var-17 -p 5432 -c shared_preload_libraries=auth_permission_dialog -c auth_permission_dialog.dialog_executable_path=/Applications/Postgres.app/Contents/MacOS/PostgresPermissionDialog

SERVER: /Applications/Postgres.app/Contents/Versions/17/bin/postgres
DATA: /Users/rudiwelter/Library/Application Support/Postgres/var-17

STOPPING THE SERVER:

/Applications/Postgres.app/Contents/Versions/17/bin/pg_ctl -D /Users/rudiwelter/Library/Application\ Support/Postgres/var-17 stop -m fast

Check Apple System Services > PostgreSQL

We don't see the server anymore

# RESTART the server

/Applications/Postgres.app/Contents/Versions/17/bin/pg_ctl -D /Users/rudiwelter/Library/Application\ Support/Postgres/var-17 restart

Check Apple System Services > PostgreSQL

We see the server (again)
