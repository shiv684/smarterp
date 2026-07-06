const pool = require("../config/db");
const PDFDocument = require("pdfkit");

const generateInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const company_id = req.headers["company-id"];

    // Get voucher details
    const voucher = await pool.query(
      `SELECT sv.*, c.name as customer_name, c.mobile as customer_mobile, c.address as customer_address
       FROM sales_vouchers sv
       LEFT JOIN customers c ON sv.customer_id = c.id
       WHERE sv.id = $1 AND sv.company_id = $2`,
      [id, company_id]
    );

    if (voucher.rows.length === 0) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    // Get company details
    const company = await pool.query(
      "SELECT * FROM companies WHERE id = $1",
      [company_id]
    );

    // Get voucher items
    const items = await pool.query(
      `SELECT si.*, i.name as item_name, i.unit, i.gst_percent
       FROM sales_items si
       LEFT JOIN items i ON si.item_id = i.id
       WHERE si.sales_voucher_id = $1`,
      [id]
    );

    const voucherData = voucher.rows[0];
    const companyData = company.rows[0];
    const itemsData = items.rows;

    // Create PDF
    const doc = new PDFDocument({ margin: 50, size: "A4" });

    // Set response headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice-${voucherData.invoice_no}.pdf`
    );

    doc.pipe(res);

    // ─── COMPANY HEADER ───
    doc
      .fontSize(18)
      .font("Helvetica-Bold")
      .text(companyData.name.toUpperCase(), 50, 50, { align: "center" });

    doc
      .fontSize(9)
      .font("Helvetica")
      .text(companyData.address, 50, 75, { align: "center" })
      .text(`GST: ${companyData.gst_number}`, 50, 88, { align: "center" });

    // ─── DIVIDER ───
    doc
      .moveTo(50, 105)
      .lineTo(550, 105)
      .stroke();

    // ─── INVOICE TITLE ───
    doc
      .fontSize(13)
      .font("Helvetica-Bold")
      .text("TAX INVOICE", 50, 112, { align: "center" });

    // ─── DIVIDER ───
    doc
      .moveTo(50, 130)
      .lineTo(550, 130)
      .stroke();

    // ─── INVOICE + CUSTOMER DETAILS ───
    const detailsTop = 140;

    // Left side - Invoice details
    doc
      .fontSize(10)
      .font("Helvetica-Bold")
      .text("Invoice No:", 50, detailsTop)
      .font("Helvetica")
      .text(voucherData.invoice_no, 130, detailsTop);

    doc
      .font("Helvetica-Bold")
      .text("Date:", 50, detailsTop + 18)
      .font("Helvetica")
      .text(new Date(voucherData.date).toLocaleDateString("en-IN"), 130, detailsTop + 18);

    doc
      .font("Helvetica-Bold")
      .text("Payment:", 50, detailsTop + 36)
      .font("Helvetica")
      .text(voucherData.payment_type.toUpperCase(), 130, detailsTop + 36);

    // Right side - Customer details
    doc
      .font("Helvetica-Bold")
      .text("Bill To:", 320, detailsTop)
      .font("Helvetica")
      .text(voucherData.customer_name, 320, detailsTop + 18)
      .text(voucherData.customer_mobile || "", 320, detailsTop + 36)
      .text(voucherData.customer_address || "", 320, detailsTop + 54);

    // ─── DIVIDER ───
    doc
      .moveTo(50, detailsTop + 80)
      .lineTo(550, detailsTop + 80)
      .stroke();

    // ─── ITEMS TABLE HEADER ───
    const tableTop = detailsTop + 92;

    doc
      .fontSize(10)
      .font("Helvetica-Bold")
      .text("#", 50, tableTop)
      .text("Item Name", 75, tableTop)
      .text("Qty", 270, tableTop)
      .text("Rate", 320, tableTop)
      .text("GST%", 390, tableTop)
      .text("Total", 460, tableTop);

    doc
      .moveTo(50, tableTop + 15)
      .lineTo(550, tableTop + 15)
      .stroke();

    // ─── ITEMS ROWS ───
    let y = tableTop + 25;

    itemsData.forEach((item, index) => {
      const gstAmount = (item.quantity * item.rate * item.gst_percent) / 100;
      const total = item.quantity * item.rate + gstAmount;

      doc
        .fontSize(10)
        .font("Helvetica")
        .text(index + 1, 50, y)
        .text(`${item.item_name} (${item.unit})`, 75, y)
        .text(item.quantity, 270, y)
        .text(`Rs.${parseFloat(item.rate).toFixed(2)}`, 320, y)
        .text(`${item.gst_percent}%`, 390, y)
        .text(`Rs.${total.toFixed(2)}`, 460, y);

      y += 22;
    });

    // ─── ITEMS DIVIDER ───
    doc
      .moveTo(50, y)
      .lineTo(550, y)
      .stroke();

    y += 12;

    // ─── TOTALS ───
    const subtotal = parseFloat(voucherData.total_amount) - parseFloat(voucherData.gst_amount);

    doc
      .fontSize(10)
      .font("Helvetica")
      .text("Subtotal:", 370, y)
      .text(`Rs.${subtotal.toFixed(2)}`, 460, y);

    y += 18;

    doc
      .text("GST Amount:", 370, y)
      .text(`Rs.${parseFloat(voucherData.gst_amount).toFixed(2)}`, 460, y);

    y += 18;

    doc
      .moveTo(350, y)
      .lineTo(550, y)
      .stroke();

    y += 10;

    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .text("Grand Total:", 370, y)
      .text(`Rs.${parseFloat(voucherData.total_amount).toFixed(2)}`, 460, y);

    // ─── FOOTER ───
    const footerY = 750;

    doc
      .moveTo(50, footerY)
      .lineTo(550, footerY)
      .stroke();

    doc
      .fontSize(9)
      .font("Helvetica")
      .text("Thank you for your business!", 50, footerY + 10, { align: "center" })
      .text("This is a computer generated invoice.", 50, footerY + 22, { align: "center" });

    // ─── FINALIZE PDF ───
    doc.end(); // ← Ye missing tha!

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { generateInvoice };