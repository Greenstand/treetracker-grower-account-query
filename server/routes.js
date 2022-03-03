const express = require('express');
const { handlerWrapper } = require('./utils/utils');

const router = express.Router();
const {
  growerAccountsGet,
} = require('./handlers/growerAccountHandler');

router.get('/grower_account', handlerWrapper(growerAccountsGet));

module.exports = router;
