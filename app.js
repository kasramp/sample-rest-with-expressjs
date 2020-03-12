import express from "express";
import bodyParser from "body-parser";
import { restart } from "nodemon";
import config from "./config";
import store from "./store";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger/swagger.json";

const PORT = config.web.port;
const app = express();

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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
  res.status(500).send({ error: "Internal server error" });
});

app
  .route("/api/v1/users/:id")
  .get(function(req, res) {
    store
      .getUserById(req.params.id)
      .then(user => res.status(200).send(user))
      .catch(error => res.status(404).send({ error: error.message }));
  })
  .delete(function(req, res) {
    store
      .deleteUserById(req.params.id)
      .then(result => res.status(204).send())
      .catch(error => res.status(400).send({ error: error.message }));
  })
  .put(function(req, res) {
    let userId = parseInt(req.params.id);
    const { firstName, lastName, age } = req.body;
    const ageInt = parseInt(age);
    if (firstName && lastName && ageInt) {
      store
        .updateUser(userId, {
          firstName: firstName,
          lastName: lastName,
          age: ageInt
        })
        .then(result => res.status(200).send(result))
        .catch(error => res.status(404).send({ error: error.message }));
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
    store
      .createUser(req.body.firstName, req.body.lastName, req.body.age)
      .then(createdUser => res.status(201).send(createdUser))
      .catch(error =>
        res.status(500).send({ error: "Unable to insert the user" })
      );
  }
);

app.get("/api/v1/users", (req, res, next) => {
  store.getAllUsers().then(users => res.status(200).send(users));
});

app.listen(PORT, () => {
  console.log("Server has started");
});
