const router = require('express').Router();

const {auth} = require('../middlewares/Auth');
const {registration} = require('../controllers/registration');
const {logIn} = require('../controllers/logIn');
const {resetPassword,forgetPassword} = require('../controllers/forgetPassword');
const {transfer} = require('../controllers/transferAmount');
const {getAllUserDetails,getSingleUserDetails} = require('../controllers/fetchUserDetails');

router.post('/transfer',auth,transfer);
router.post('/login',logIn);
router.post('/registration',registration);

router.get('/get/users/details',getAllUserDetails);
router.get('/get/user/details',getSingleUserDetails);

module.exports = router;