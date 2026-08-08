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

export function isValidCpf(value: string) {
  const cpf = onlyDigits(value);

  if (
    cpf.length !== 11 ||
    /^(\d)\1{10}$/.test(cpf)
  ) {
    return false;
  }

  function calculateDigit(baseLength: number) {
    let sum = 0;

    for (let index = 0; index < baseLength; index += 1) {
      sum +=
        Number(cpf[index]) *
        (baseLength + 1 - index);
    }

    const remainder = (sum * 10) % 11;

    return remainder === 10 ? 0 : remainder;
  }

  const firstDigit = calculateDigit(9);

  if (firstDigit !== Number(cpf[9])) {
    return false;
  }

  const secondDigit = calculateDigit(10);

  return secondDigit === Number(cpf[10]);
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
        alphaNumericValue(char) *
          weights[index],
      0,
    );

  const rest = sum % 11;

  return rest === 0 || rest === 1
    ? 0
    : 11 - rest;
}

export function isValidCnpj(value: string) {
  const cnpj = normalizeCnpj(value);

  if (cnpj.length !== 14) {
    return false;
  }

  // Legacy numeric CNPJ.
  if (/^\d{14}$/.test(cnpj)) {
    if (/^(\d)\1{13}$/.test(cnpj)) {
      return false;
    }

    const firstDigit = classicCnpjDigit(
      cnpj.slice(0, 12),
      [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2],
    );

    const secondDigit = classicCnpjDigit(
      `${cnpj.slice(0, 12)}${firstDigit}`,
      [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2],
    );

    return (
      firstDigit === Number(cnpj[12]) &&
      secondDigit === Number(cnpj[13])
    );
  }

  // New alphanumeric format:
  // the first 12 positions may contain A-Z / 0-9,
  // while the two check digits remain numeric.
  if (!/^[A-Z0-9]{12}\d{2}$/.test(cnpj)) {
    return false;
  }

  const firstDigit = alphaNumericCnpjDigit(
    cnpj.slice(0, 12),
    [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2],
  );

  const secondDigit = alphaNumericCnpjDigit(
    `${cnpj.slice(0, 12)}${firstDigit}`,
    [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2],
  );

  return (
    firstDigit === Number(cnpj[12]) &&
    secondDigit === Number(cnpj[13])
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

export function isStrongEnoughPassword(
  password: string,
) {
  const checks = passwordChecks(password);

  return Object.values(checks).every(Boolean);
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}
