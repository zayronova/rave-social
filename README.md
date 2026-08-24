# Rave Social

Rave Social is an independent Facebook-style social-network application built with Next.js, React, Prisma and TypeScript.

## Development

```bash
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

Open `http://localhost:3000`.

## Production

Configure `DATABASE_URL` and the authentication/session environment variables required by the application on your deployment platform. Then run:

```bash
npm install
npx prisma generate
npm run build
npm start
```

## Health check

`GET /api/health` verifies that the application can reach its database.

## Main features

- Accounts and profiles
- Social feed
- Posts, likes, comments and shares
- Following
- Pages and groups
- Stories
- Search
- Notifications
- Messenger
- Reporting and admin moderation

This is an independent platform and is not affiliated with or operated by Meta/Facebook.

Never commit production secrets to GitHub; use environment variables on the deployment platform.
