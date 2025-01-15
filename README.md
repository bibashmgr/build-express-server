# Express Typescript Boilerplate

A simple boilerplate for building RESTFUL API Server using Express.js and TypeScript. This boilerplate is a modified and simplified version of [hagopj13/node-express-boilerplate](https://github.com/hagopj13/node-express-boilerplate) with TypeScript support.

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/bibashmgr/express-ts-boilerplate.git
```

2. Install Dependencies:

```bash
cd express-ts-boilerplate
npm install
```

3. Configuration:
   
   Create a .env file in the root of the project and copy the content from .env.example.

4. Start the development server:

```bash
npm run dev
```

## API Documentation
To access the list of available APIs and their specifications, open Postman and import the files located in the /docs directory.

List of available routes:

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
`POST /v1/users` - create a user\
`GET /v1/users/me` - get your profile\
`GET /v1/users/:userId` - get user\
`PATCH /v1/users/:userId` - update user\
`DELETE /v1/users/:userId` - delete user