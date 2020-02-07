import express from "express";
import bodyParser from "body-parser";
import { restart } from "nodemon";

const PORT = 8090;
const app = express();

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use("/api/v1/users/:id", function(req, res, next) {
  if (req.params.hasOwnProperty("id") && !isNaN(parseInt(req.params.id))) {
    next();
  } else {
    console.log("Request is invalid!");
    res.status(400).send({ error: "User id should be a number" });
  }
});

// Error handling for uncaught exceptions
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Internal server error");
});

app
  .route("/api/v1/users/:id")
  .get(function(req, res) {
    res.status(200).send({
      userId: parseInt(req.params.id),
      firstName: "John",
      lastName: "Wick",
      age: 45
    });
  })
  .delete(function(req, res) {
    let userId = parseInt(req.params.id);
    res.status(204).send();
  })
  .put(function(req, res) {
    let userId = parseInt(req.params.id);
    const { firstName, lastName, age } = req.body;
    const ageInt = parseInt(age);
    if (firstName && lastName && ageInt) {
      res.status(200).send({
        userId: userId,
        firstName: firstName,
        lastName: lastName,
        age: ageInt
      });
    } else {
      res.status(400).send({
        error: "The payload is wrong!"
      });
    }
  });

app.post(
  "/api/v1/users",
  (req, res, next) => {
    const { firstName, lastName, age } = req.body;
    let ageInt = parseInt(age);
    if (firstName && lastName && ageInt) {
      next();
    } else {
      res.status(400).send({
        error: "The payload is wrong!"
      });
    }
  },
  (req, res) => {
    const randomUserId = Math.floor(Math.random() * 65536);
    res.status(201).send({
      userId: randomUserId,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      age: parseInt(req.body.age)
    });
  }
);

app.get("/api/v1/users", (req, res, next) => {
  res.status(200).send({
    users: [
      { userId: 1, firstName: "John", lastName: "Wick", age: 45 },
      { userId: 2, firstName: "Kasra", lastName: "Mp", age: 30 }
    ]
  });
});

app.listen(PORT, () => {
  console.log("Server has started");
});
