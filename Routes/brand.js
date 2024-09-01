const express = require('express');
const router = express.Router();
//middlewares
// const { authCheck, adminCheck } = require('../middlewares/auth');
//controller
const { create, read, update, remove, list } = require('../Controlles/brand');

router.post('/brand', create);
router.get('/brands', list);
router.get('/brand/:slug', read);
router.put('/brand/:slug', update);
router.delete('/brand/:slug', remove);

module.exports = router;
