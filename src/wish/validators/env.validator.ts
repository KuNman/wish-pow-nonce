import * as Joi from 'joi';

const envValidator = Joi.object({
  WISH_MAX_WORKERS: Joi.number()
    .required(),
});

export default envValidator;
