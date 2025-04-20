export function removeUtmParams(
  urlString: string | undefined
): string | undefined {
  if (!urlString) {
    return urlString;
  }

  try {
    const parsedUrl = new URL(urlString);
    const searchParams = parsedUrl.searchParams;

    const utmKeys = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
    ];

    let paramsRemoved = false;
    utmKeys.forEach((key) => {
      if (searchParams.has(key)) {
        searchParams.delete(key);
        paramsRemoved = true;
      }
    });

    // To avoid unnecessary object creation and potential format changes.
    return paramsRemoved ? parsedUrl.toString() : urlString;
  } catch (error) {
    console.warn(
      `Invalid URL provided to removeUtmParams: "${urlString}". Error: ${error}`
    );
    return urlString;
  }
}
