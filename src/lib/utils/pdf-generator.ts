import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

/**
 * Generate a PDF from markdown-style text
 * Returns a base64-encoded PDF suitable for email attachments
 */
export async function generatePDFFromText(
  title: string,
  content: string,
  metadata?: {
    author?: string;
    subject?: string;
    company?: string;
  }
): Promise<string> {
  try {
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    
    // Set metadata
    pdfDoc.setTitle(title);
    pdfDoc.setAuthor(metadata?.author || 'Agentico');
    pdfDoc.setSubject(metadata?.subject || 'Style Guide');
    pdfDoc.setCreationDate(new Date());
    
    // Load fonts
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    // Page settings
    const pageWidth = 595; // A4 width in points
    const pageHeight = 842; // A4 height in points
    const margin = 50;
    const contentWidth = pageWidth - (margin * 2);
    
    let page = pdfDoc.addPage([pageWidth, pageHeight]);
    let yPosition = pageHeight - margin;
    
    // Helper to add new page if needed
    const checkNewPage = (requiredSpace: number) => {
      if (yPosition - requiredSpace < margin) {
        page = pdfDoc.addPage([pageWidth, pageHeight]);
        yPosition = pageHeight - margin;
      }
    };
    
    // Draw title
    page.drawText(title, {
      x: margin,
      y: yPosition,
      size: 20,
      font: helveticaBold,
      color: rgb(0.15, 0.38, 0.92), // Blue color
    });
    yPosition -= 40;
    
    // Add company name if provided
    if (metadata?.company) {
      page.drawText(`For: ${metadata.company}`, {
        x: margin,
        y: yPosition,
        size: 12,
        font: helveticaFont,
        color: rgb(0.4, 0.4, 0.4),
      });
      yPosition -= 30;
    }
    
    // Add creation date
    const dateStr = new Date().toLocaleDateString('en-AU', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    page.drawText(`Generated: ${dateStr}`, {
      x: margin,
      y: yPosition,
      size: 10,
      font: helveticaFont,
      color: rgb(0.5, 0.5, 0.5),
    });
    yPosition -= 30;
    
    // Draw separator line
    page.drawLine({
      start: { x: margin, y: yPosition },
      end: { x: pageWidth - margin, y: yPosition },
      thickness: 1,
      color: rgb(0.8, 0.8, 0.8),
    });
    yPosition -= 20;
    
    // Process content - strip emojis and special characters that can't be encoded
    const stripEmojis = (text: string): string => {
      // Remove emojis and other non-WinAnsi characters
      return text.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '')
                 .replace(/[^\x00-\xFF]/g, '') // Remove non-ASCII characters
                 .trim();
    };
    
    const cleanContent = stripEmojis(content);
    const lines = cleanContent.split('\n');
    const lineHeight = 16;
    const maxCharsPerLine = 85; // Approximate characters per line
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Skip empty lines but add spacing
      if (trimmedLine === '') {
        yPosition -= lineHeight / 2;
        continue;
      }
      
      // Check if heading (starts with # or is ALL CAPS)
      const isHeading1 = trimmedLine.startsWith('# ');
      const isHeading2 = trimmedLine.startsWith('## ');
      const isHeading3 = trimmedLine.startsWith('### ');
      const isAllCapsHeading = trimmedLine === trimmedLine.toUpperCase() && 
                                trimmedLine.length > 5 && 
                                !trimmedLine.match(/^\d+\./);
      
      let fontSize = 11;
      let font = helveticaFont;
      let textColor = rgb(0, 0, 0);
      let text = trimmedLine;
      
      if (isHeading1) {
        fontSize = 16;
        font = helveticaBold;
        textColor = rgb(0.15, 0.38, 0.92);
        text = trimmedLine.substring(2);
        checkNewPage(lineHeight * 2);
        yPosition -= lineHeight;
      } else if (isHeading2) {
        fontSize = 14;
        font = helveticaBold;
        textColor = rgb(0.2, 0.2, 0.2);
        text = trimmedLine.substring(3);
        checkNewPage(lineHeight * 2);
        yPosition -= lineHeight;
      } else if (isHeading3) {
        fontSize = 12;
        font = helveticaBold;
        text = trimmedLine.substring(4);
        checkNewPage(lineHeight * 2);
      } else if (isAllCapsHeading) {
        fontSize = 13;
        font = helveticaBold;
        textColor = rgb(0.2, 0.2, 0.2);
        checkNewPage(lineHeight * 2);
        yPosition -= lineHeight / 2;
      }
      
      // Handle bullet points
      if (text.startsWith('- ') || text.startsWith('• ') || text.startsWith('* ')) {
        text = '  • ' + text.substring(2);
      }
      
      // Handle numbered lists
      if (text.match(/^\d+\.\s/)) {
        text = '  ' + text;
      }
      
      // Word wrap long lines
      const words = text.split(' ');
      let currentLine = '';
      
      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        
        if (testLine.length > maxCharsPerLine) {
          // Draw current line
          checkNewPage(lineHeight);
          page.drawText(currentLine, {
            x: margin,
            y: yPosition,
            size: fontSize,
            font: font,
            color: textColor,
            maxWidth: contentWidth,
          });
          yPosition -= lineHeight;
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }
      
      // Draw remaining text
      if (currentLine) {
        checkNewPage(lineHeight);
        page.drawText(currentLine, {
          x: margin,
          y: yPosition,
          size: fontSize,
          font: font,
          color: textColor,
          maxWidth: contentWidth,
        });
        yPosition -= lineHeight;
      }
    }
    
    // Add footer on last page
    page.drawText('Generated by Agentico - agentico.com.au', {
      x: margin,
      y: 30,
      size: 8,
      font: helveticaFont,
      color: rgb(0.6, 0.6, 0.6),
    });
    
    // Save and return as base64
    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes).toString('base64');
  } catch (error) {
    throw error;
  }
}

/**
 * Generate style guide PDFs for email attachments
 */
export async function generateStyleGuidePDFs(
  companyName: string,
  companyStyleGuide: string,
  contactStyleGuide: string
): Promise<{
  companyPDF: string;
  contactPDF: string;
}> {
  const [companyPDF, contactPDF] = await Promise.all([
    generatePDFFromText(
      `${companyName} - Company Style Guide`,
      companyStyleGuide,
      {
        author: 'Agentico',
        subject: 'Company Style Guide',
        company: companyName,
      }
    ),
    generatePDFFromText(
      `${companyName} - Contact Style Guide`,
      contactStyleGuide,
      {
        author: 'Agentico',
        subject: 'Contact Style Guide',
        company: companyName,
      }
    ),
  ]);
  
  return { companyPDF, contactPDF };
}

