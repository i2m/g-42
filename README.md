## G-42

To run project in `development` mode:

### Start your PostgreSQL instance
- Inside `g-42-backend` folder
- Check and update variables inside `.env` file
- If you use Apple `container`:
  * Run `$ container image pull docker.io/postgres:latest`
  * Run `$ container run --name postgres --detach --rm --env-file .env postgres:latest`

### Start Backend service:
- Inside `g-42-backend` folder
- Check and update variables inside `.env` file
- Run `$ npm install`
- Run `$ npm run dev`

### Start Fronted service:
- Inside `g-42-fronted` folder
- Run `$ npm install`
- Run `$ npm run dev`
