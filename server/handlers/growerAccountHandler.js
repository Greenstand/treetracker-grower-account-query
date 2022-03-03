const log = require('loglevel');
const Joi = require('joi');

const {
  getGrowerAccounts
} = require('../services/GrowerAccountService');

const HttpError = require('../utils/HttpError');

const getGrowerAccountsQuerySchema = Joi.alternatives().try(
    Joi.object({
      organization_id : Joi.string().uuid(),
      region_id: Joi.string().uuid().allow(null)
    }),
    Joi.object({
      organization_id: Joi.string().uuid().allow(null),
      region_id: Joi.string().uuid()
    })
  );


const growerAccountsGet = async (req, res, _next) => {
  try {
    await getGrowerAccountsQuerySchema.validateAsync(req.params, {
      abortEarly: false,
    });
    const growerAccounts = await getGrowerAccounts({
      organization_id: req.params.organization_id,
      region_id: req.params.region_id 
    });
    res.send(messages[0]);
    res.end();
  } catch (e) {
    log.error(e);
    _next(e);
  }
};

module.exports = {
  growerAccountsGet
};
