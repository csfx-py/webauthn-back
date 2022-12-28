require("dotenv").config();

const PORT = process.env.PORT || 5000;
// const HOST = process.env.HOST || "localhost";

const express = require("express");
const app = express();
const session = require("express-session");

const cors = require("cors");
const morgan = require("morgan");

const WebAuthn = require("webauthn");

app.use(
  cors({
    origin: ["https://webauthn-front.vercel.app"],
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan("tiny"));
app.set("trust proxy", 1);
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);

const webauthn = new WebAuthn({
  origin: "https://webauthn-front.vercel.app",
  usernameField: "username",
  userFields: {
    username: "username",
    name: "displayName",
  },
  // store: new LevelAdapter(),
  // OR
  store: {
    put: async (id, value) => {
      console.log(id, value);
    },
    get: async (id) => {
      console.log(id);
    },
    search: async (search) => {
      console.log(search);
    },
    delete: async (id) => {
      console.log(id);
    },
  },
  rpName: "Shreyas Prabhu",
  enableLogging: true,
});

// Mount webauthn endpoints
app.use("/webauthn", webauthn.initialize());

// Endpoint without passport
app.get("/secret", webauthn.authenticate(), (req, res) => {
  res.status(200).json({ status: "ok", message: "Super Secret!" });
});

app.get("/", (req, res) => {
  res.send("Hello");
});

app.listen(PORT, () => {
  console.log(`listening at http://localhosts:${PORT}`);
});
