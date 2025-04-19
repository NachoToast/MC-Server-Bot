# MC Server Bot

This is a Discord bot that interacts with the UoA Discords Minecraft server (via RCON) to automatically manage it's whitelist, enabling people to get whitelisted via Discord.

## Discord Application Details

- No privileged gateway intents.
- Needs **bot** scope.
- Needs the **manage roles** and **send messages** permissions.

## Environment Variables

> Most environment variables have descriptions in .env when deemed necessary. Below are just some simple configurations to use depending on your use case.

Docker Setup

```env
DB_HOST=db
DB_PORT=5433:5432
```

Local Dev Setup

```env
DB_HOST=localhost
DB_PORT=5432:5432
```
