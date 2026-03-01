package com.realestatecrm.service;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import com.itextpdf.text.pdf.draw.LineSeparator;
import com.realestatecrm.model.Lead;
import com.realestatecrm.model.LeadStatus;
import com.realestatecrm.repository.LeadRepository;
import com.realestatecrm.repository.PropertyRepository;
import com.realestatecrm.repository.UserRepository;
import com.realestatecrm.model.Role;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class PdfReportService {

    private final LeadRepository leadRepository;
    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;

    private static final Font TITLE_FONT = new Font(Font.FontFamily.HELVETICA, 20, Font.BOLD,
            new BaseColor(30, 58, 138));
    private static final Font SUBTITLE_FONT = new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD,
            new BaseColor(71, 85, 105));
    private static final Font HEADER_FONT = new Font(Font.FontFamily.HELVETICA, 10, Font.BOLD, BaseColor.WHITE);
    private static final Font BODY_FONT = new Font(Font.FontFamily.HELVETICA, 9, Font.NORMAL,
            new BaseColor(30, 41, 59));
    private static final Font SMALL_FONT = new Font(Font.FontFamily.HELVETICA, 8, Font.NORMAL,
            new BaseColor(100, 116, 139));

    public byte[] generateReport() throws DocumentException {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4, 40, 40, 60, 40);
        PdfWriter.getInstance(document, out);
        document.open();

        addTitle(document);
        addSummarySection(document);
        addLeadTable(document);
        addFooter(document);

        document.close();
        log.info("PDF report generated successfully");
        return out.toByteArray();
    }

    private void addTitle(Document document) throws DocumentException {
        Paragraph title = new Paragraph("Real Estate CRM - Lead Report", TITLE_FONT);
        title.setAlignment(Element.ALIGN_CENTER);
        title.setSpacingAfter(5f);
        document.add(title);

        String generated = "Generated on: "
                + LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd MMM yyyy, HH:mm"));
        Paragraph dateLine = new Paragraph(generated, SMALL_FONT);
        dateLine.setAlignment(Element.ALIGN_CENTER);
        dateLine.setSpacingAfter(20f);
        document.add(dateLine);

        LineSeparator line = new LineSeparator();
        line.setLineColor(new BaseColor(30, 58, 138));
        document.add(new Chunk(line));
        document.add(Chunk.NEWLINE);
    }

    private void addSummarySection(Document document) throws DocumentException {
        long totalLeads = leadRepository.count();
        long totalProperties = propertyRepository.count();
        long totalAgents = userRepository.findByRole(Role.AGENT).size();
        long newLeads = leadRepository.findByStatus(LeadStatus.NEW).size();
        long contactedLeads = leadRepository.findByStatus(LeadStatus.CONTACTED).size();
        long closedLeads = leadRepository.findByStatus(LeadStatus.CLOSED).size();

        Paragraph summaryTitle = new Paragraph("Summary", SUBTITLE_FONT);
        summaryTitle.setSpacingAfter(10f);
        document.add(summaryTitle);

        PdfPTable summaryTable = new PdfPTable(3);
        summaryTable.setWidthPercentage(100);
        summaryTable.setSpacingAfter(20f);

        addSummaryCell(summaryTable, "Total Leads", String.valueOf(totalLeads));
        addSummaryCell(summaryTable, "Total Properties", String.valueOf(totalProperties));
        addSummaryCell(summaryTable, "Total Agents", String.valueOf(totalAgents));
        addSummaryCell(summaryTable, "New Leads", String.valueOf(newLeads));
        addSummaryCell(summaryTable, "Contacted Leads", String.valueOf(contactedLeads));
        addSummaryCell(summaryTable, "Closed Leads", String.valueOf(closedLeads));

        document.add(summaryTable);
    }

    private void addSummaryCell(PdfPTable table, String label, String value) {
        PdfPCell cell = new PdfPCell();
        cell.setBorderColor(new BaseColor(226, 232, 240));
        cell.setPadding(10f);
        cell.setBackgroundColor(new BaseColor(241, 245, 249));

        Paragraph labelPara = new Paragraph(label, SMALL_FONT);
        Paragraph valuePara = new Paragraph(value,
                new Font(Font.FontFamily.HELVETICA, 16, Font.BOLD, new BaseColor(30, 58, 138)));

        cell.addElement(labelPara);
        cell.addElement(valuePara);
        table.addCell(cell);
    }

    private void addLeadTable(Document document) throws DocumentException {
        Paragraph tableTitle = new Paragraph("Lead Details", SUBTITLE_FONT);
        tableTitle.setSpacingAfter(10f);
        document.add(tableTitle);

        PdfPTable table = new PdfPTable(6);
        table.setWidthPercentage(100);
        table.setWidths(new float[] { 2f, 2.5f, 2f, 1.5f, 2f, 1.5f });
        table.setSpacingAfter(20f);

        // Headers
        String[] headers = { "Customer Name", "Email", "Phone", "Status", "Property", "Budget" };
        for (String header : headers) {
            PdfPCell headerCell = new PdfPCell(new Phrase(header, HEADER_FONT));
            headerCell.setBackgroundColor(new BaseColor(30, 58, 138));
            headerCell.setPadding(8f);
            headerCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            table.addCell(headerCell);
        }

        // Data
        List<Lead> leads = leadRepository.findAll();
        boolean alternate = false;
        for (Lead lead : leads) {
            BaseColor rowColor = alternate ? new BaseColor(241, 245, 249) : BaseColor.WHITE;
            addLeadRow(table, lead, rowColor);
            alternate = !alternate;
        }

        document.add(table);
        document.add(new Paragraph("Total: " + leads.size() + " lead(s)", SMALL_FONT));
    }

    private void addLeadRow(PdfPTable table, Lead lead, BaseColor bgColor) {
        String[] cells = {
                lead.getCustomerName(),
                lead.getCustomerEmail(),
                lead.getCustomerPhone(),
                lead.getStatus().name(),
                lead.getProperty() != null ? lead.getProperty().getTitle() : "N/A",
                lead.getBudget() != null ? "₹" + lead.getBudget().toPlainString() : "N/A"
        };

        for (String cellValue : cells) {
            PdfPCell cell = new PdfPCell(new Phrase(cellValue, BODY_FONT));
            cell.setBackgroundColor(bgColor);
            cell.setPadding(6f);
            cell.setBorderColor(new BaseColor(226, 232, 240));
            table.addCell(cell);
        }
    }

    private void addFooter(Document document) throws DocumentException {
        document.add(new Chunk(new LineSeparator()));
        Paragraph footer = new Paragraph("Real Estate CRM | Confidential Report | " + LocalDateTime.now().getYear(),
                SMALL_FONT);
        footer.setAlignment(Element.ALIGN_CENTER);
        footer.setSpacingBefore(10f);
        document.add(footer);
    }
}
