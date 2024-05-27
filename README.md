<p align="center">
<img alt="Next.js and Supabase Starter Kit - the fastest way to build apps with Next.js and Supabase" src="https://github.com/aybeedee/movie-web-app/assets/75930195/ac94eb22-cd16-447a-88fd-677c418eeb03">
</p>
<h1 align="center">CMDb - Movie Database Web App</h1>
<h3 align="center">Preview live at <a href="https://cmdb-movies.netlify.app/">cmdb-movies.netlify.app</a></h1>

<p align="center">
View a large collection of movies and reviews. Sign up to add your own.
</p>

<p align="center">
  <a href="#local-setup"><strong>Local Setup</strong></a> ·
  <a href="#tech"><strong>Tech</strong></a> ·
  <a href="#containerization"><strong>Containerization</strong></a> ·
  <a href="#deployment"><strong>Deployment</strong></a> ·
  <a href="#progress"><strong>Progress</strong></a>
</p>
<br/>

## Local Setup

### Using Docker

- navigate to root `cd movie-web-app`
- build and run with compose `docker-compose up --build`
>[!NOTE]
Run `docker-compose down --volumes` after stopping -potentially helps avoid postgres seed/init issues

### Without Docker

- Frontend:

  - commands:
    `cd frontend`
    `npm install`
    `npm run dev`
  - envars:
    - VITE_BACKEND_URL=`http://[yourhost]:[backendport]`

- Backend:
  - commands:
    `cd backend`
    `npm install`
    `npm start`
  - envars:
    - POSTGRES_DATABASE=yourdatabase
    - POSTGRES_USERNAME=yourusername
    - POSTGRES_PASSWORD=yourpassword
    - POSTGRES_HOST=yourhost
    - POSTGRES_PORT=dbport
    - JWT_SECRET=yoursecret
    - JWT_EXPIRES_IN=1h
    - PORT=backendport

## Tech

- Backend
  - TypeScript
  - Node.js
  - Express.js
  - PostgreSQL
  - Sequelize
  - class-validator
  - jwt
- Frontend
  - TypeScript
  - React.js
  - Vite
  - React Router
  - TailwindCSS
  - Axios
  - shadcn ui

## Containerization

- Docker
- Docker Compose

## Deployment

- Frontend - Netlify
- Backend - Render
- DB - Render

## Progress

- [x] Frontend init, boilerplate, structure
- [x] Backend init, boilerplate, structure
- [x] Frontend routing
- [x] Postgres schema
- [x] DB Integration
- [x] ORM Setup, Model generation
- [x] Auth module
- [x] Auth UI, end to end functionality
- [x] Movie module
- [x] Review module
- [x] Integration
- [x] Dockerization
- [x] Deployment
- [x] Testing - Frontend
- [ ] (WIP) Testing - Backend
- [ ] (WIP) Refactoring, Styling Improvements, Bugs
