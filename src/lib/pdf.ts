import jsPDF from "jspdf";
import autoTable, { applyPlugin } from "jspdf-autotable";

export async function createPDF(
  reportTitle: string,
  tableHeaders: string[],
  tableRows: string[][],
): Promise<ArrayBuffer> {
  applyPlugin(jsPDF);
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text(reportTitle, 14, 22);

  autoTable(doc, {
    head: [tableHeaders],
    body: tableRows,
    startY: 30,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [87, 67, 188] },
  });

  return doc.output("arraybuffer");
}
