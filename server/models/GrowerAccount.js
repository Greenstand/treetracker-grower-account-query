const log = require("loglevel");
const GrowerAccountRepository = require('../repositories/GrowerAccountQueryRepository');

const GrowerAccount = (
  {
    id,
    handle,
    first_name,
    last_name,
    image_url,
    image_rotation,
    first_registration_at,
    organization_id,
    person_id
  }) =>
  Object.freeze({
    id,
    handle,
    first_name,
    last_name,
    image_url,
    image_rotation,
    first_registration_at,
    organization_id,
    person_id
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
