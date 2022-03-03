const GrowerAccountRepository = require('../repositories/GrowerAccountQueryRepository');
const HttpError = require('../utils/HttpError');

const GrowerAccount = ({ id, handle }) =>
  Object.freeze({
    id,
    handle,
  });

const getGrowerAccounts = async (session, filterCriteria = undefined) => {
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
