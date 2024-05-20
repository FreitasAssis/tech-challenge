import PasswordValidator from "password-validator";
import { cpf, cnpj } from "cpf-cnpj-validator";
import validator from "validator";

export function validEmailOrError(value: string, msg: string) {
  const validate = validator.isEmail(value);
  if (!validate) throw msg;
}

export function validateCPF(value: string) {
  const validate = cpf.isValid(value);
  if (!validate) return false;
  return true;
}

export function validateCNPJ(value: string) {
  const validate = cnpj.isValid(value);
  if (!validate) return false;
  return true;
}

export function validateDocument(value: string, msg: string) {
  const cnpjIsValid = validateCNPJ(value);
  const cpfIsValid = validateCPF(value);
  if (!cnpjIsValid && !cpfIsValid) throw msg;
}

export function notSpecialOrError(value: string, msg: string) {
  const schema = new PasswordValidator();
  if (schema.has().symbols().validate(value)) throw msg;
  if (value.includes("/")) throw msg;
}

export function validatePhone(value: string, msg: string) {
  const phonePattern = /^((?:\+?55)?)([1-9][0-9])(9[0-9]{8})$/;
  if (!phonePattern.test(value)) {
    throw msg;
  }
}

export function validateRandom(value: string, msg: string) {
  const randomPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!randomPattern.test(value)) {
    throw msg;
  }
}

export function validatePixKey(pixKeyType: string, pixKey: string) {
  switch (pixKeyType) {
    case "CPF":
      const cpfIsValid = validateCPF(pixKey);
      if (!cpfIsValid) throw "Invalid CPF";
      break;
    case "CNPJ":
      const cnpjIsValid = validateCNPJ(pixKey);
      if (!cnpjIsValid) throw "Invalid CNPJ";
      break;
    case "EMAIL":
      validEmailOrError(pixKey, "Invalid email");
      break;
    case "TELEFONE":
      validatePhone(pixKey, "Invalid phone");
      break;
    case "CHAVE_ALEATORIA":
      validateRandom(pixKey, "Invalid random key");
      break;
    default:
      throw "Invalid pix_key_type";
  }
}
