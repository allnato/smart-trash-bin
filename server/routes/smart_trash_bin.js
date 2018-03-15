const express   = require('express');
const router    = express.Router();

router.get('/', (req, res) => {
    res.render('real-time.hbs')
});

module.exports = router;