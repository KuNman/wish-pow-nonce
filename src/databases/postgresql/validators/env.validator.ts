import * as Joi from 'joi';
import stringValidator from './string.validator';

const envValidator = Joi.object({
  DB_HOST: stringValidator(),
  DB_PORT: stringValidator(),
  DB_USERNAME: stringValidator(),
  DB_PASSWORD: stringValidator(),
  DB_DATABASE: stringValidator(),
  DB_IS_SSL: Joi.string()
    .valid('true', 'false')
    .required(),
});

export default envValidator;
