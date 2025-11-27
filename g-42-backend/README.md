## Available Scripts

In the project directory, you can run:

### `npm run dev`
To start the app in dev mode

### `npm start`
For production mode

## Available Api
```
[REST API]

POST /api/v1/rounds/create - create a new round
GET /api/v1/rounds/list - get all rounds
GET /api/v1/rounds/find/:roundId - get round detailed info
POST /api/v1/rounds/tap/:roundId - make a tap on the goose
GET /api/v1/rounds/myScore/:roundId - get current logged in user score in round
GET /api/v1/rounds/winner/:roundId - get round winner

POST /api/v1/users/login - login user
POST /api/v1/users/me - get logged in user info
POST /api/v1/users/logout - logout user

[WEBSOCKET]

/websocket/rounds - send a tap on the goose
                  - receive current user score in round

```
