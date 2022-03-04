const GrowerAccountRepository = require('../repositories/GrowerAccountQueryRepository');
const HttpError = require('../utils/HttpError');
const log = require("loglevel");

const GrowerAccount = ({ id, handle }) =>
  Object.freeze({
    id,
    handle,
  });

const getGrowerAccounts = async (session, filterCriteria = undefined) => {
  log.debug("model");
  log.debug(session);
  const filter = { ...filterCriteria };
  const growerAccountRepository = new GrowerAccountRepository(session);

  const growerAccounts = await growerAccountRepository.getByFilter(filter);
  return {
    growerAccounts: growerAccounts.map((row) => {
      return GrowerAccount({ ...row });
    }),
  };
};

module.exports = {
  getGrowerAccounts
};
