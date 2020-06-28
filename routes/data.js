const router = require('express').Router();
const { getData } = require('../controllers/data')
 
router.get('/', getData);

module.exports=router;