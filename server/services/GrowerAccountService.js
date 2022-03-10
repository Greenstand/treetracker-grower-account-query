const Session = require('../models/Session');
const GrowerAccount = require('../models/GrowerAccount');

const getGrowerAccounts = async (filter) => {
  const session = new Session();
  return GrowerAccount.getGrowerAccounts(session, filter);
};

const getGrowerAccountsCount = async (filter) => {
  const session = new Session();
  return GrowerAccount.getGrowerAccountsCount(session, filter);
};

module.exports = {
  getGrowerAccounts,
  getGrowerAccountsCount,
};
