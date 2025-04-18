export function getCountryName(countryCode: string): string {
  try {
    const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
    return regionNames.of(countryCode) || countryCode;
  } catch (error) {
    console.error("Error getting country name for:", countryCode, error);
    return countryCode;
  }
}
