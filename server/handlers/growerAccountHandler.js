const log = require('loglevel');
const Joi = require('joi');

const {
  getGrowerAccounts,
  getGrowerAccountsCount,
} = require('../services/GrowerAccountService');

const getGrowerAccountsQuerySchema = Joi.alternatives()
  .try(
    Joi.object({
      author: Joi.bool(),
      organization_id: Joi.string().uuid(),
      region_id: Joi.string().uuid().allow(null),
    }),
    Joi.object({
      author: Joi.bool(),
      organization_id: Joi.string().uuid().allow(null),
      region_id: Joi.string().uuid(),
    }),
  )
  .required();

const growerAccountsGet = async (req, res, _next) => {
  try {
    await getGrowerAccountsQuerySchema.validateAsync(req.query, {
      abortEarly: false,
    });
    const growerAccounts = await getGrowerAccounts(req.query);
    const growerAccountsCount = await getGrowerAccountsCount(req.query);
    res.send({ grower_accounts: growerAccounts, count: growerAccountsCount });
    res.end();
  } catch (e) {
    log.error(e);
    _next(e);
  }
};

module.exports = {
  growerAccountsGet,
};
