## Available Scripts

In the project directory, you can run:

### `npm run dev`
To start the app in dev mode

### `npm start`
For production mode

## Available Api
```
GET /api/v1/rounds/list - get all rounds
GET /api/v1/rounds/find/:id - get round detailed info
POST /api/v1/rounds/create - create a new round

POST /api/v1/taps/tap/:roundId - make a tap on the goose
GET /api/v1/taps/tap/myScore/:roundId - get logged user score
GET /api/v1/taps/tap/winner/:roundId - get round winner

POST /api/v1/users/login - login user
POST /api/v1/users/me - get logged in user info
POST /api/v1/users/logout - logout user
```
