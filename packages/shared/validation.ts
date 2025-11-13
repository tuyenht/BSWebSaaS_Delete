export type ValidatorType = 'required' | 'email' | 'minLength' | 'maxLength';

export type ValidatorRule =
  | { type: 'required' }
  | { type: 'email' }
  | { type: 'minLength'; value: number }
  | { type: 'maxLength'; value: number };

export type ValidationSchema = Record<string, ValidatorRule[]>;

export type FieldErrorCode =
  | 'REQUIRED'
  | 'INVALID_EMAIL'
  | 'MIN_LENGTH'
  | 'MAX_LENGTH';

export type FieldError = {
  code: FieldErrorCode;
  params?: Record<string, string | number>;
};

export type ValidationResult = {
  isValid: boolean;
  errors: Record<string, FieldError | undefined>;
};

function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string' && value.trim() === '') return true;
  return false;
}

function isEmail(value: string): boolean {
  // simple email pattern, đủ dùng cho UI
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function validate(
  schema: ValidationSchema,
  values: Record<string, any>,
): ValidationResult {
  const errors: Record<string, FieldError | undefined> = {};

  for (const [field, rules] of Object.entries(schema)) {
    const value = values[field];

    for (const rule of rules) {
      if (rule.type === 'required') {
        if (isEmpty(value)) {
          errors[field] = { code: 'REQUIRED' };
          break;
        }
      }

      if (rule.type === 'email') {
        if (!isEmpty(value) && !isEmail(String(value))) {
          errors[field] = { code: 'INVALID_EMAIL' };
          break;
        }
      }

      if (rule.type === 'minLength') {
        const len = String(value ?? '').length;
        if (len < rule.value) {
          errors[field] = {
            code: 'MIN_LENGTH',
            params: { min: rule.value },
          };
          break;
        }
      }

      if (rule.type === 'maxLength') {
        const len = String(value ?? '').length;
        if (len > rule.value) {
          errors[field] = {
            code: 'MAX_LENGTH',
            params: { max: rule.value },
          };
          break;
        }
      }
    }
  }

  const isValid = Object.values(errors).every((e) => !e);
  return { isValid, errors };
}
