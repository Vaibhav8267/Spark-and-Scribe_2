const Joi = require("joi");

module.exports.postSchema = Joi.object({
  blog: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().allow("", null),
    image: Joi.string().uri().allow("", null),
    content: Joi.string().required(),
    category: Joi.string().required()
  }).required()
});
