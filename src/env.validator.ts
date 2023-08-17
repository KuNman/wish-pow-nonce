import * as Joi from 'joi';

const envValidator = Joi.object({
  ENV: Joi.string()
    .valid('local', 'production', 'develop', 'staging', 'master')
    .default('local')
    .required(),
  PORT: Joi.number()
    .required(),
});

export default envValidator;
