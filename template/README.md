# Express Typescript Boilerplate

A simple boilerplate for building RESTFUL API Server using Express.js and TypeScript.

## 🚀 Getting Started

1. Install Dependencies:

```bash
npm install
```

2. Configuration:
   
Create a .env file in the root of the project and copy the content from .env.example.

3. Start server in development:

```bash
npm run start:dev
```

4. Start server in production:

First, build the project

```bash
npm run build
```

then, run the server using pm2

```bash
npm run start:prod
```

## API Documentation
To access the list of available APIs and their specifications, open Postman and import the files located in the /docs directory.

List of available routes:

**Health routes**:\
`GET /v1/health` - get server's health\

**Auth routes**:\
`POST /v1/auth/register` - register\
`POST /v1/auth/login` - login\
`POST /v1/auth/logout` - logout\
`POST /v1/auth/refresh-tokens` - refresh auth tokens\
`POST /v1/auth/forgot-password` - send reset password email\
`POST /v1/auth/reset-password` - reset password\
`POST /v1/auth/send-verification-email` - send verification email\
`POST /v1/auth/verify-email` - verify email

**User routes**:\
`GET /v1/users` - get all users\
`GET /v1/users/me` - get your profile\
`GET /v1/users/:userId` - get user\