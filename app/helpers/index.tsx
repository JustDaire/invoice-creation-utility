import { InvoiceForm } from "@/types";
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable'

export function generatePdf(data: InvoiceForm) {
    console.log("Generating invoice:", JSON.stringify(data));
    console.log("Generating invoice:", data);
    console.log("Company:", Object.values(data.company).filter(a => a !== ""));

    const companyColumn = Object.values(data.company).filter(a => a !== "");
    const clientColumn = Object.values(data.client).filter(a => a !== "");

    const pdf = new jsPDF();
    // pdf.text('Hello world!', 10, 10);
    // pdf.table(10, 10, [companyColumn, clientColumn], ['company', 'client'], { autoSize: true });
    // pdf.autoTable({
    //     body: body,
    //     startY: 70,
    //     theme: 'grid',
    //              })


    const docWidth = pdf.internal.pageSize.width;
    const docHeight = pdf.internal.pageSize.height;

    var colorBlack = "#000000";
    var colorGray = "#4d4e53";

    let currentHeight = 15;
    const pdfConfig = {
        headerTextSize: 20,
        subHeaderTextSize: 16,
        labelTextSize: 12,
        fieldTextSize: 10,
        lineHeight: 6,
        subLineHeight: 4,
        page: 1,
    };

    const addFooters = (doc: jsPDF) => {
        // const pageCount = doc.internal.getNumberOfPages()
        const pageCount = doc.getNumberOfPages()
      
        // doc.setFont('helvetica', 'italic')
        doc.setFontSize(8)
        for (var i = 1; i <= pageCount; i++) {
          doc.setPage(i)

          doc.text('Legal boilerplate that will be ignored by everyone', 10, 287, {
            align: 'left'
          })
          doc.text('Page ' + String(i) + ' of ' + String(pageCount), doc.internal.pageSize.width - 10, 287, {
            align: 'right'
          })
        }
      }


    // Company details
    pdf.setFontSize(pdfConfig.subHeaderTextSize);
    for (let i = 0; i < companyColumn.length; i++) {
        if (i > 0) {
            pdf.setFontSize(pdfConfig.labelTextSize);
        }
        pdf.text(companyColumn[i], docWidth - 10, currentHeight, {align: "right"});
        currentHeight += pdfConfig.lineHeight;
    }

    pdf.line(10, currentHeight, docWidth - 10, currentHeight);

    currentHeight += pdfConfig.lineHeight;

    let clientHeightStart = currentHeight + 4;
    currentHeight += pdfConfig.lineHeight;

    // Client details
    pdf.setFontSize(pdfConfig.subHeaderTextSize);
    for (let i = 0; i < clientColumn.length; i++) {
        if (i > 0) {
            pdf.setFontSize(pdfConfig.labelTextSize);
        }
        pdf.text(clientColumn[i], 10, currentHeight, {align: "left"});
        currentHeight += pdfConfig.lineHeight;
    }

    // Invoice dates
    pdf.setFontSize(pdfConfig.subHeaderTextSize);
    // pdf.setTextColor(colorBlack);
    pdf.text(data.invoiceNumber, docWidth - 10, clientHeightStart, {align: "right"});
    clientHeightStart += pdfConfig.lineHeight;
    pdf.setFontSize(pdfConfig.labelTextSize);
    pdf.text("Invoice date: " + data.invoiceDate, docWidth - 10, clientHeightStart, {align: "right"});
    clientHeightStart += pdfConfig.lineHeight;
    pdf.text("Payment due date: " + data.invoiceDueDate, docWidth - 10, clientHeightStart, {align: "right"});


    // pdf.table(10, 10, [companyColumn, clientColumn], ['company', 'client'], { autoSize: true });

    function tableRow(data: any) {
        return [data.description, data.quantity, data.unitPrice, data.total];
    }

    const tableData = [];
    for (let i = 0; i < data.items.length; i++) {
        tableData.push(tableRow(data.items[i]));
    }

    autoTable(pdf, {
        head: [['Description', 'Price', 'Quantity', 'Total']],
        body: tableData,
        startY: currentHeight,
        tableWidth: pdf.internal.pageSize.getWidth() - 20,
        margin: { left: 10 },
        didDrawPage: (d) => console.log(d!.cursor!.y),
    })

    // Set new currentHeight after table render
    currentHeight = (pdf as any).lastAutoTable.finalY + 6;

    pdf.line(docWidth - 50, currentHeight, docWidth - 10, currentHeight);
    currentHeight += pdfConfig.lineHeight + 2;

    // Subtotals
    pdf.setFontSize(pdfConfig.subHeaderTextSize);
    pdf.text("Subtotal:", docWidth - 25, currentHeight, {align: "right"});
    pdf.text(String(data.subtotal), docWidth - 10, currentHeight, {align: "right"});

    currentHeight += pdfConfig.lineHeight + 2;

    // Tax
    pdf.text("VAT:", docWidth - 25, currentHeight, {align: "right"});
    pdf.text(String(data.subtotal), docWidth - 10, currentHeight, {align: "right"});

    currentHeight += pdfConfig.lineHeight + 2;

    // Total
    pdf.text("Total:", docWidth - 25, currentHeight, {align: "right"});
    pdf.text(String(data.total), docWidth - 10, currentHeight, {align: "right"});

    currentHeight += pdfConfig.lineHeight;

    pdf.line(10, currentHeight, docWidth - 10, currentHeight);

    currentHeight += pdfConfig.lineHeight + 2;

    // Notes
    pdf.setFontSize(pdfConfig.subHeaderTextSize);
    pdf.text("Notes:", 10, currentHeight, {align: "left"});
    currentHeight += pdfConfig.lineHeight;
    pdf.setFontSize(pdfConfig.labelTextSize);
    pdf.text(data.description, 10, currentHeight, {align: "left", maxWidth: docWidth - 20});

    addFooters(pdf);
    pdf.save(data.invoiceNumber + '.pdf');
}