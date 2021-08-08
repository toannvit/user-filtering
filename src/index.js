const Express = require("express");
const db = require("./models/db");
const userService = require("./services/users");

const bootstrap = () => {
  const app = Express();
  const port = 3000;

  db.connect();

  app.get("/", async (req, res) => {
    try {
      const users = await userService.getUsers(req);
      res.json(users);
    } catch (error) {
      console.log(error);
      res.sendStatus(500).statusMessage("Internal Server Error");
    }
  });

  app.listen(3000, () => console.log(`Server is listening on port ${port}`));
};

bootstrap();
