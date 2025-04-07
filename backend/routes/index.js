var express = require("express");
const passport = require("../middleware/passport");
const { isEmployee, isCustomer } = require("../middleware/auth");
var router = express.Router();
const { sql, poolPromise } = require("../model/dbConfig");

/* GET home page. */
router.get("/", async function (req, res, next) {
  try {
    const query = `SELECT TOP 8 * FROM MONAN ORDER BY MaMon DESC`;
    const pool = await poolPromise;
    const result = await pool.request().query(query);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    console.log(result.recordset);
    return res.status(200).json(result.recordset);
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Unexpected Error" });
  }
});

router.post("/login", function (req, res, next) {
  passport.authenticate("local", function (err, user, info) {
    if (err) return next(err);

    if (!user) return res.status(401).json({ message: "Unauthorized" });

    req.logIn(user, (err) => {
      if (err) {
        console.log(err);
        return next(err);
      }

      return res.json({ message: "Logged in", user: user });
    });
  })(req, res, next);
});

router.post("/signup", function (req, res, next) {
  passport.authenticate("local-signup", function (err, user, info) {
    if (err) return next(err);

    if (!user) return res.status(401).json({ message: info.message  });

    // Successfully signed up
    return res.status(200).json({ message: 'Đăng kí thành công!' });

  })(req, res, next);
});

router.get("/logout", function (req, res, next) {
  req.logout((err) => {
    req.session.destroy();
    if (err) {
      console.log(err);
      return next(err);
    }
  });
});

module.exports = router;
