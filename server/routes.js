const express = require('express');
const { handlerWrapper } = require('./utils/utils');

const router = express.Router();
const {
  growerAccountsGet,
} = require('./handlers/growerAccountHandler');

router.get('/grower_accounts', handlerWrapper(growerAccountsGet));

module.exports = router;
