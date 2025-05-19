export const downloadSvg = (svgElement: SVGSVGElement, filename: string) => {
  if (!svgElement) {
    console.error("SVG element is null or undefined.");
    return;
  }

  const serializer = new XMLSerializer();
  let source = serializer.serializeToString(svgElement);

  // Ensure xmlns is present, which is good practice for standalone SVG files
  if (!source.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
    source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
  }
  // Add xmlns:xlink if not present and needed (less common for simple QR codes, but good practice)
  if (
    !source.match(/^<svg[^>]+xmlns:xlink="http:\/\/www\.w3\.org\/1999\/xlink"/)
  ) {
    source = source.replace(
      /^<svg/,
      '<svg xmlns:xlink="http://www.w3.org/1999/xlink"',
    );
  }

  // --- Clean up the inline style attribute ---
  const styleAttrRegex = /<svg([^>]*)\sstyle="([^"]*)"([^>]*)>/;
  const match = source.match(styleAttrRegex);

  if (match) {
    const beforeStyle = match[1]; // e.g., ' width="512" height="512"'
    const styleValue = match[2]; // e.g., 'position: absolute; top: -9999px; left: -9999px; width: 512px; height: 512px;'
    const afterStyle = match[3]; // e.g., '>' or '/>'

    const declarations = styleValue.split(";").map((s) => s.trim());

    // Filter out the unwanted style declarations
    const filteredDeclarations = declarations.filter((decl) => {
      if (!decl) return false;
      const [prop] = decl.split(":");
      const cleanProp = prop.trim();

      return !["position", "top", "left"].includes(cleanProp);
    });

    const newStyleValue = filteredDeclarations.join("; ");

    let newSvgTag;
    if (newStyleValue) {
      // If there are remaining styles, reconstruct the opening tag with the new style attribute
      newSvgTag = `<svg${beforeStyle} style="${newStyleValue}"${afterStyle}>`;
    } else {
      // If all styles were removed, reconstruct the opening tag without the style attribute
      newSvgTag = `<svg${beforeStyle}${afterStyle}>`;
    }

    // Replace the original <svg ... style="..." ...> tag with the new one
    source = source.replace(styleAttrRegex, newSvgTag);
  }
  const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
};
