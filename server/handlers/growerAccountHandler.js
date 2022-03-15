const log = require('loglevel');
const Joi = require('joi');

const {
  getGrowerAccounts
} = require('../services/GrowerAccountService');

const getGrowerAccountsQuerySchema = Joi.alternatives().try(
    Joi.object({
      author: Joi.bool(),
      organization_id : Joi.string().uuid(),
      region_id: Joi.string().uuid().allow(null)
    }),
    Joi.object({
      author: Joi.bool(),
      organization_id: Joi.string().uuid().allow(null),
      region_id: Joi.string().uuid()
    })
  );


const growerAccountsGet = async (req, res, _next) => {
  try {
    await getGrowerAccountsQuerySchema.validateAsync(req.params, {
      abortEarly: false,
    });
    const growerAccounts = await getGrowerAccounts(req.query);
    res.send(growerAccounts);
    res.end();
  } catch (e) {
    log.error(e);
    _next(e);
  }
};

module.exports = {
  growerAccountsGet
};
