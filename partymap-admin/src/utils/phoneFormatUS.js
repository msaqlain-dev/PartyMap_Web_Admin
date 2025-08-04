export const formatPhoneNumberUS = (phoneNumber) => {
  const cleaned = ("" + phoneNumber).replace(/\D/g, "");

  if (cleaned.length === 11 && cleaned.startsWith("1")) {
    const countryCode = cleaned[0];
    const areaCode = cleaned.slice(1, 4);
    const centralOfficeCode = cleaned.slice(4, 7);
    const lineNumber = cleaned.slice(7, 11);

    return `+${countryCode} (${areaCode}) ${centralOfficeCode}-${lineNumber}`;
  } else {
    return "Invalid phone number";
  }
};

