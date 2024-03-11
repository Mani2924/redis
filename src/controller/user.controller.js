const db = require("../../models/index");

const redis = require("redis");

const client = redis.createClient();
await client.connect();

const userModule = {};


userModule.getAllUser = async (req, res, next) => {
  try {
    let users;
    users = await client.get("userList");
    if (users) {
      return res.status(200).json(JSON.parse(users));
    }
    users = await db.User.findAll();
    const userJson = JSON.stringify(users);
    await client.set("userList", userJson);
    res.status(200).json(users);
  } catch (error) {
    res.send("Something went wrong");
  }
};


userModule.getUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    let user;
    user = await client.get("user:" + userId);
    if (user) {
      return res.status(200).json(JSON.parse(user));
    }
    user = await db.User.findByPk(userId);
    if (!user) {
      return res.status(404).send("User Not Found");
    }
    await client.set(`user:${user.id}`, JSON.stringify(user));
    res.status(200).json(user);
  } catch (error) {
    res.send("Something went wrong");
  }
};


userModule.addUser = async (req, res, next) => {
  try {
    const user = await db.User.create(req.body);
    const userJson = JSON.stringify(user);
    client.set(`user:${user.id}`, userJson, (err, reply) => {
      if (err) {
        console.error("Error setting key:", err);
        res.send(err);
        return
      } else {
        res.send(reply);
        return
      }
    });
    res.send("user created successfully");
  } catch (error) {
    res.send("Something went wrong");
  }
};


userModule.updateUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    await db.User.update(req.body, { where: { id: userId } });
    const user = await db.User.findByPk(userId);
    client.set(`user:${user.id}`, JSON.stringify(user));
    res.status(200).send("success");
  } catch (error) {
    res.send("Something went wrong");
  }
};

// delete user
userModule.deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    await db.User.destroy({ where: { id: userId } });
    client.del(`user:${userId}`);
    res.status(200).send("success");
  } catch (error) {
    res.send("Something went wrong");
  }
};


module.exports = userModule;
