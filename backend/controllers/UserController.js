const fs = require("fs");
const crypto = require("crypto");

class UserController {
  async login(req, res) {
    const { username, password } = req.body;
    fs.readFile(`${__dirname}/../data/users.json`, "utf8", (err, data) => {
      if (err) {
        console.log(err);
        return res.status(500).send({ error: "Error reading users.json" });
      }

      const users = JSON.parse(data);
      const user = users.find((user) => user.username === username);

      if (!user) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid username" });
      }

      if (user.password !== password) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid password" });
      }

      // Set the user ID cookie
      res.cookie("userId", user.id, { maxAge: 3600000 });

      req.session.userId = user.id; // Store the user ID in the session
      res.json({
        success: true,
        session: { sessionId: req.session.id },
        user,
        userId: user.id,
      });
    });
  }

  logout(req, res) {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
      } else {
        res.clearCookie();
        res.redirect("http://localhost:3000/");
      }
    });
  }
}

module.exports = UserController;
