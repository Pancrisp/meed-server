# meed-server
This is the backend API server for MEED

## Development
After cloning the repository, install project dependencies by running:
``` bash
$ npm install
```

**Configuring environment variables**

Create a copy of `.env.example` and rename it to `.env` and fill in the username and password fields with the database credentials.
```
MLAB_USER=
MLAB_PASS=
JWT_SECRET_KEY=
API_KEY=
```

To start server, run:
``` bash
$ npm start # server at http://localhost:5000
```
**Nodemon** listens for changes and restarts the server when necessary.

**Morgan** will log HTTP requests into console.

## Deployment
Automatic deploys are set up on Heroku. Any new commits pushed to `dev` branch will trigger the build process.
