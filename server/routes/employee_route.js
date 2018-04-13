const express   = require('express');
const router     = express.Router();

// Real-time Employee Activity
router.get('/real-time', (req, res) => {
    res.render('real_time_activity.hbs');
});

router.get('/emp-list', (req, res) => {
    res.render('emp_list.hbs');
});

module.exports = router;