import * as Joi from 'joi';

const stringValidator = () => Joi
  .string()
  .when('ENV', {
    is: 'local',
    then: Joi.optional()
      .allow(''),
    otherwise: Joi.required(),
  });

export default stringValidator;
