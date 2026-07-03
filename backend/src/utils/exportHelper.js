import PDFDocument from "pdfkit";
import Papa from "papaparse";

// Export transactions to CSV
export const generateCSV = (transactions) => {
  const data = transactions.map((t) => ({
    Date: new Date(t.date).toLocaleDateString(),
    Type: t.type,
    Category: t.category,
    Amount: t.amount.toFixed(2),
    Description: t.description || "",
  }));

  return Papa.unparse(data);
};

// Export transactions to PDF
export const generatePDF = (transactions, userName) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      let buffers = [];

      doc.on("data", (chunk) => buffers.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(buffers)));

      // Title
      doc.fontSize(20).font("Helvetica-Bold").text("Transaction Report", { align: "center" });
      doc.fontSize(12).font("Helvetica").text(`User: ${userName}`, { align: "center" });
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, { align: "center" });
      doc.moveDown();

      // Summary
      const totalIncome = transactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);
      const totalExpenses = transactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

      doc.fontSize(11).font("Helvetica-Bold");
      doc.text(`Total Income: ₹${totalIncome.toFixed(2)}`);
      doc.text(`Total Expenses: ₹${totalExpenses.toFixed(2)}`);
      doc.text(`Balance: ₹${(totalIncome - totalExpenses).toFixed(2)}`);
      doc.moveDown();

      // Table header
      doc.fontSize(10).font("Helvetica-Bold");
      doc.text("Date", 50, doc.y, { width: 80 });
      doc.text("Type", 130, doc.y - 15, { width: 60 });
      doc.text("Category", 190, doc.y - 15, { width: 120 });
      doc.text("Amount", 310, doc.y - 15, { width: 80, align: "right" });
      doc.text("Description", 390, doc.y - 15, { width: 100 });
      doc.moveTo(50, doc.y + 5).lineTo(540, doc.y + 5).stroke();
      doc.moveDown();

      // Table rows
      doc.font("Helvetica").fontSize(9);
      transactions.forEach((t) => {
        const y = doc.y;
        doc.text(new Date(t.date).toLocaleDateString(), 50, y, { width: 80 });
        doc.text(t.type, 130, y, { width: 60 });
        doc.text(t.category, 190, y, { width: 120 });
        doc.text(`₹${t.amount.toFixed(2)}`, 310, y, { width: 80, align: "right" });
        doc.text(t.description || "-", 390, y, { width: 100 });
        doc.moveDown(1.5);
      });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};