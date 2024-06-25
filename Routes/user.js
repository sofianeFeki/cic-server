const express = require("express");
const router = express.Router();

router.get("/user", (req, res) => {
  res.json({
    data: "GET request to the user endpoint ",
  });
});

module.exports = router;
