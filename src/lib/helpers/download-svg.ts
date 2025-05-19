import { saveAs } from "file-saver";

export const downloadSvg = (
  svgElement: SVGSVGElement,
  filename: string,
  trueLogoDataUrl: string | null = null,
) => {
  if (!svgElement) {
    console.error("SVG element is null or undefined.");
    return;
  }

  const serializer = new XMLSerializer();
  let source = serializer.serializeToString(svgElement);

  if (trueLogoDataUrl) {
    // Regular expression to find the href or xlink:href attribute within an <image> tag
    // Capture:
    // $1: The initial part of the <image> tag until just before href="..." or xlink:href=".... " (includes the attribute name and opening quotation mark)
    // $2: The current value of the attribute (the temporary blob URL) - THIS WILL BE REPLACED
    // $3: The closing quotation mark (' or ")
    // $4: The final part of the <image> tag (remaining attributes, closing >)
    const imageHrefRegex =
      /(<\s*image[^>]*?\s(?:href|xlink:href)=(?:['"]))([^'"]*)(?:['"])([^>]*?>)/; // Handles single or double quotation marks

    if (imageHrefRegex.test(source)) {
      // Replace $2 (the current value) with trueLogoDataUrl
      // source = source.replace(imageHrefRegex, `$1${trueLogoDataUrl}$3$4`);

      // regex to capture and replace the value
      // $1: (<image... attributes before href/xlink:href=)
      // $2: (['"]) opening quote
      // $3: ([^'"]*) the value
      // $4: (['"]) closing quote
      // $5: ([^>]*?>) rest of tag
      const imageHrefValueCaptureRegex =
        /(<\s*image[^>]*?\s(?:href|xlink:href)=)(['"])([^'"]*)(['"])([^>]*?>)/;

      if (imageHrefValueCaptureRegex.test(source)) {
        // Replace the value ($3) with trueLogoDataUrl
        source = source.replace(
          imageHrefValueCaptureRegex,
          `$1$2${trueLogoDataUrl}$4$5`,
        );
      } else {
        console.warn(
          "SVG <image> tag with href or xlink:href attribute not found in expected format for value replacement.",
          { source },
        );
      }
    } else {
      console.warn(
        "SVG <image> tag with href or xlink:href attribute not found during download. Logo might be missing.",
        { source },
      );
    }
  }

  // Ensure xmlns is present...
  if (!source.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
    source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
  }
  // Add xmlns:xlink if needed
  if (
    trueLogoDataUrl &&
    !source.match(/^<svg[^>]+xmlns:xlink="http:\/\/www\.w3\.org\/1999\/xlink"/)
  ) {
    source = source.replace(
      /^<svg/,
      '<svg xmlns:xlink="http://www.w3.org/1999/xlink"',
    );
  }

  // Clean up the inline style attribute on the root <svg>
  const styleAttrRegex = /<svg([^>]*)\sstyle="([^"]*)"([^>]*)>/; // Regex to find the style="...". Capture: (before the style), (value of the style), (after the style)
  const match = source.match(styleAttrRegex);

  if (match) {
    const beforeStyleAttrs = match[1]; // Attributes before the style
    const styleValue = match[2]; // Value of the style attribute
    const afterStyleAttrs = match[3]; // Attributes after the style

    const declarations = styleValue.split(";").map((s) => s.trim());

    const filteredDeclarations = declarations.filter((decl) => {
      if (!decl) return false;
      const [prop] = decl.split(":");
      const cleanProp = prop.trim();
      // Remove position, top, left. Keep other styles if any.
      return !["position", "top", "left"].includes(cleanProp);
    });

    const newStyleValue = filteredDeclarations.join("; ");

    source = source.replace(styleAttrRegex, (_match, p1, p2, p3) => {
      const trimmedBefore = p1.trim();
      const trimmedAfter = p3.trim();

      const attrParts = [];
      if (trimmedBefore) attrParts.push(trimmedBefore); // Add attributes before style
      if (newStyleValue) attrParts.push(`style="${newStyleValue}"`); // Add new style if not empty
      if (trimmedAfter && trimmedAfter !== ">") attrParts.push(trimmedAfter); // Add attributes after style, avoiding adding only '>'

      // Join attribute parts with a space, if there are attributes
      const allAttributesString = attrParts.join(" ");

      // Rebuild <svg> tag. Add a space after <svg only if there are attributes.
      // Add the closing '>'
      return `<svg${allAttributesString ? " " + allAttributesString : ""}>`;
    });
  }

  const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
  saveAs(blob, filename);
};
