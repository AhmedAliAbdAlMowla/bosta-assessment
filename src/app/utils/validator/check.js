const Joi = require("joi");

/**
 * @desc     Validate create check
 * @returns  Result after validate check
 */
module.exports.create = (check) => {
  const schema = Joi.object({
    name: Joi.string().max(50).min(2).required(),
    url: Joi.string().required(),
    protocal: Joi.string().max(5).min(4).required(),
    path:Joi.string(),
    port: Joi.number().empty(""),
    webhook:Joi.string(),
    interval: Joi.number(),
    timeout: Joi.number(),
    threshold: Joi.number(),
    authUserName :Joi.string(),
    authPassword:Joi.string(),
    assertStatusCode:Joi.string(),
    tags:Joi.array().items(Joi.string()) 
  });

  return schema.validate(check);
};

/**
 * @desc     Validate update check
 * @returns  Result after validate check
 */
module.exports.update = (check) => {
    const schema = Joi.object({
        pause: Joi.boolean(),
        name: Joi.string().max(50).min(2),
        url: Joi.string(),
        protocal: Joi.string().max(5).min(4),
        path:Joi.string(),
        port: Joi.number().empty(""),
        webhook:Joi.string(),
        interval: Joi.number(),
        timeout: Joi.number(),
        threshold: Joi.number(),
        authUserName :Joi.string(),
        authPassword:Joi.string(),
        assertStatusCode:Joi.string(),
        tags:Joi.array().items(Joi.string()) 
  });
  return schema.validate(check);
};

