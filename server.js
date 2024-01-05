const express = require("express")
const mongoose = require("mongoose");
const { MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT, REDIS_URL, SESSION_SECRET, REDIS_PORT } = require("./config/config");
const app = express();
const redis = require("redis");
const session = require("express-session");
const cors = require("cors");

let RedisStore = require("connect-redis").default;
let redisClient = redis.createClient({ url: 'redis://redis:6379'});
redisClient.connect();

const port = process.env.PORT || 3000;

const postRouter = require("./routes/postRoutes");
const userRouter = require("./routes/userRoutes");

const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

mongoose.connect(mongoURL)
.then(() => console.log("connected!"))
.catch((error) => console.log(error))

app.enable("trust proxy");

app.use(session({
  store: new RedisStore({client: redisClient}),
  secret: SESSION_SECRET,
  cookie: {
    secure: false,
    resave: false,
    saveUninitialized: false,
    httpOnly: true,
    maxAge: 60000
  }
}));

app.use(cors())

app.use(express.json());

app.get('/api/v1', (req, res) => {
  res.send('Hello Docker image');
  console.log("yeah it ran");
});

app.use("/api/v1/posts", postRouter);
app.use("/api/v1/users", userRouter);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });