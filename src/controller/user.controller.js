const db = require("../../models/index");

const { client } = require("../redis/redis");

const userModule = {};

// get all user
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
    console.log(error);
    res.send("Something went wrong");
  }
};

// get by ID
userModule.getUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    let user;
    user = await client.get("user:" + userId);
    if (user) {
      console.log("from redis");
      return res.status(200).json(JSON.parse(user));
    }
    user = await db.User.findByPk(userId);
    if (!user) {
      return res.status(404).send("User Not Found");
    }
    await client.set(`user:${user.id}`, JSON.stringify(user));
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.send("Something went wrong");
  }
};

// add User
userModule.addUser = async (req, res, next) => {
  try {
    const user = await db.User.create(req.body);
    const userJson = JSON.stringify(user);
    client.set(`user:${user.id}`, userJson, (err, reply) => {
      if (err) {
        console.error("Error setting key:", err);
      } else {
        console.log("Key set successfully:", reply);
      }
    });
    res.send("user created successfully");
  } catch (error) {
    res.send("Something went wrong");
  }
};

// update user
userModule.updateUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    await db.User.update(req.body, { where: { id: userId } });
    const user = await db.User.findByPk(userId);
    client.set(`user:${user.id}`, JSON.stringify(user));
    res.status(200).send("success");
  } catch (error) {
    console.log(error);
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
    console.log(error);
    res.send("Something went wrong");
  }
};

// get by ID using map

// userModule.getUserById = async (req, res, next) => {
//   try {
//     const userId = req.params.id;
//     let user;
//     user = await client.hGetAll("user:" + userId);
//     if (user) {
//       console.log("from redis");
//       return res.status(200).json(user);
//     }
//     user = await db.User.findByPk(userId);
//     if (!user) {
//       return res.status(404).send("User Not Found");
//     }
//     await client.set(`user:${user.id}`, JSON.stringify(user));
//     res.status(200).json(user);
//   } catch (error) {
//     console.log(error);
//     res.send("Something went wrong");
//   }
// };

//   set by id using map

// userModule.addUser = async (req, res, next) => {
//   try {
//     const user = await db.User.create(req.body);
//     const userJson = JSON.stringify(user);
//     await client.hSet(`user:${user.id}`, {
//       name: `${user.firstName} ${user.lastName}`,
//       email: user.email,
//     });
//     res.send("user created successfully");
//   } catch (error) {
//     res.send("Something went wrong");
//   }
// };

module.exports = userModule;
