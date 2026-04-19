import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'Match' })
export class MatchConstraint implements ValidatorConstraintInterface {
  validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> | boolean {
    const [relatedProperty] = validationArguments.constraints;
    const relatedValue = validationArguments.object[relatedProperty];
    return value === relatedValue;
  }
  defaultMessage(validationArguments?: ValidationArguments): string {
    return `${validationArguments.property} must match ${validationArguments.constraints[0]}`;
  }
}
export function Match(property: string, validationOptions?: ValidationOptions) {
  return (obj: any, propName: string) => {
    registerDecorator({
      validator: MatchConstraint,
      target: obj.constructor,
      propertyName: propName,
      constraints: [property],
      options: validationOptions,
    });
  };
}
