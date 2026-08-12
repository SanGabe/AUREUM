export function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

export function normalizeCnpj(value: string) {
  return value
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 14);
}

export function formatCpf(value: string) {
  const digits = onlyDigits(value).slice(0, 11);

  return digits
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1-$2");
}

export function formatCnpj(value: string) {
  const cnpj = normalizeCnpj(value);

  if (!cnpj) return "";

  const a = cnpj.slice(0, 2);
  const b = cnpj.slice(2, 5);
  const c = cnpj.slice(5, 8);
  const d = cnpj.slice(8, 12);
  const e = cnpj.slice(12, 14);

  let result = a;

  if (b) result += `.${b}`;
  if (c) result += `.${c}`;
  if (d) result += `/${d}`;
  if (e) result += `-${e}`;

  return result;
}

function classicCnpjDigit(
  base: string,
  weights: number[],
) {
  const sum = base
    .split("")
    .reduce(
      (total, char, index) =>
        total + Number(char) * weights[index],
      0,
    );

  const rest = sum % 11;
  return rest < 2 ? 0 : 11 - rest;
}

function alphaNumericValue(char: string) {
  return char.charCodeAt(0) - 48;
}

function alphaNumericCnpjDigit(
  base: string,
  weights: number[],
) {
  const sum = base
    .split("")
    .reduce(
      (total, char, index) =>
        total +
        alphaNumericValue(char) * weights[index],
      0,
    );

  const rest = sum % 11;
  return rest === 0 || rest === 1
    ? 0
    : 11 - rest;
}

export function isValidCnpj(value: string) {
  const cnpj = normalizeCnpj(value);

  if (cnpj.length !== 14) return false;

  // Legacy numeric CNPJ.
  if (/^\\d{14}$/.test(cnpj)) {
    if (/^(\\d)\\1{13}$/.test(cnpj)) {
      return false;
    }

    const first = classicCnpjDigit(
      cnpj.slice(0, 12),
      [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2],
    );

    const second = classicCnpjDigit(
      `${cnpj.slice(0, 12)}${first}`,
      [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2],
    );

    return (
      first === Number(cnpj[12]) &&
      second === Number(cnpj[13])
    );
  }

  // New alphanumeric format:
  // first 12 positions are A-Z / 0-9 and
  // the two check digits remain numeric.
  if (!/^[A-Z0-9]{12}\\d{2}$/.test(cnpj)) {
    return false;
  }

  const first = alphaNumericCnpjDigit(
    cnpj.slice(0, 12),
    [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2],
  );

  const second = alphaNumericCnpjDigit(
    `${cnpj.slice(0, 12)}${first}`,
    [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2],
  );

  return (
    first === Number(cnpj[12]) &&
    second === Number(cnpj[13])
  );
}

export type PasswordChecks = {
  minimumLength: boolean;
  letter: boolean;
  number: boolean;
  special: boolean;
};

export function passwordChecks(
  password: string,
): PasswordChecks {
  return {
    minimumLength: password.length >= 6,
    letter: /[A-Za-zÀ-ÿ]/.test(password),
    number: /\d/.test(password),
    special: /[^A-Za-zÀ-ÿ0-9\s]/.test(password),
  };
}

export function isStrongEnoughPassword(password: string) {
  const checks = passwordChecks(password);
  return Object.values(checks).every(Boolean);
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}
