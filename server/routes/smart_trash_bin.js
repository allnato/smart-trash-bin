const express   = require('express');
const router    = express.Router();

router.get('/', (req, res) => {
    res.send("Smart Trash Bin Web App");
});

module.exports = router;