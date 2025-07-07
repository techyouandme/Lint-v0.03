import jsPDF from 'jspdf';
import { AnalysisResult } from './gemini';

export function generateAnalysisReport(
  projectName: string,
  analysis: AnalysisResult,
  userEmail: string
): jsPDF {
  const doc = new jsPDF();
  let yPosition = 20;
  const pageHeight = doc.internal.pageSize.height;
  const pageWidth = doc.internal.pageSize.width;
  const margin = 15;
  const contentWidth = pageWidth - (margin * 2);
  const maxTextWidth = contentWidth - 20;

  // Color palette
  const colors = {
    primary: [59, 130, 246],
    secondary: [147, 51, 234],
    success: [34, 197, 94],
    warning: [245, 158, 11],
    danger: [239, 68, 68],
    white: [255, 255, 255],
    gray: {
      50: [249, 250, 251],
      100: [243, 244, 246],
      200: [229, 231, 235],
      300: [209, 213, 219],
      400: [156, 163, 175],
      500: [107, 114, 128],
      600: [75, 85, 99],
      700: [55, 65, 81],
      800: [31, 41, 55],
      900: [17, 24, 39]
    }
  };

  // Set default font
  doc.setFont('helvetica', 'normal');

  // Helper function to safely encode text and ensure it fits
  const safeText = (text: string, maxLength?: number): string => {
    if (!text) return '';
    let cleanText = text
      .toString()
      .replace(/[^\x20-\x7E]/g, '')
      .replace(/[""]/g, '"')
      .replace(/['']/g, "'")
      .replace(/[–—]/g, '-')
      .replace(/…/g, '...')
      .trim();
    
    if (maxLength && cleanText.length > maxLength) {
      cleanText = cleanText.substring(0, maxLength - 3) + '...';
    }
    
    return cleanText;
  };

  // Helper function to split text to fit within bounds
  const fitText = (text: string, maxWidth: number, fontSize: number = 10): string[] => {
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(safeText(text), maxWidth);
    return lines.map((line: string) => safeText(line));
  };

  // Helper function to add new page if needed
  const checkPageBreak = (height: number) => {
    if (yPosition + height > pageHeight - 30) {
      doc.addPage();
      yPosition = 25;
      addPageHeader();
    }
  };

  // Add page header for subsequent pages
  const addPageHeader = () => {
    // Header background
    doc.setFillColor(...colors.gray[50]);
    doc.rect(0, 0, pageWidth, 20, 'F');
    
    // Project name (truncated if needed)
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.gray[700]);
    doc.text(safeText(projectName, 40), margin, 12);
    
    // Report type
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...colors.gray[500]);
    doc.text('Technical Debt Analysis', pageWidth - margin, 12, { align: 'right' });
    
    // Separator line
    doc.setDrawColor(...colors.primary);
    doc.setLineWidth(0.5);
    doc.line(margin, 16, pageWidth - margin, 16);
    
    yPosition = 30;
  };

  // Professional cover page with enhanced design
  const addCoverPage = () => {
    // Modern gradient header
    doc.setFillColor(...colors.primary);
    doc.rect(0, 0, pageWidth, 80, 'F');
    
    // Gradient overlay effect
    for (let i = 0; i < 20; i++) {
      const alpha = 0.4 - (i * 0.02);
      doc.setFillColor(colors.secondary[0], colors.secondary[1], colors.secondary[2], alpha);
      doc.rect(0, 60 + i, pageWidth, 1, 'F');
    }

    // Enhanced logo design
    const logoX = margin + 20;
    const logoY = 35;
    
    // Logo outer circle
    doc.setFillColor(...colors.white);
    doc.circle(logoX, logoY, 16, 'F');
    
    // Logo inner circle
    doc.setFillColor(...colors.primary);
    doc.circle(logoX, logoY, 12, 'F');
    
    // Logo accent
    doc.setFillColor(...colors.secondary);
    doc.circle(logoX, logoY, 8, 'F');
    
    // Logo text
    doc.setFillColor(...colors.white);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('L', logoX - 4, logoY + 4);

    // Main title - split into two lines for better layout
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.white);
    doc.text('Technical Debt Analysis', logoX + 25, 28);
    
    doc.setFontSize(24);
    doc.text('Report', logoX + 25, 48);

    // Project name with proper truncation
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(255, 255, 255, 0.9);
    const truncatedProjectName = safeText(projectName, 45);
    doc.text(`Project: ${truncatedProjectName}`, logoX + 25, 65);

    // Professional info card with optimized layout
    const cardY = 95;
    const cardHeight = 85;
    
    // Card shadow effect
    doc.setFillColor(0, 0, 0, 0.1);
    doc.roundedRect(margin + 2, cardY + 2, contentWidth, cardHeight, 8, 8, 'F');
    
    // Card background
    doc.setFillColor(...colors.white);
    doc.roundedRect(margin, cardY, contentWidth, cardHeight, 8, 8, 'F');
    doc.setDrawColor(...colors.gray[200]);
    doc.setLineWidth(1);
    doc.roundedRect(margin, cardY, contentWidth, cardHeight, 8, 8, 'D');

    // Card title with accent
    doc.setFillColor(...colors.primary, 0.1);
    doc.rect(margin, cardY, contentWidth, 20, 'F');
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.gray[800]);
    doc.text('Report Overview', margin + 15, cardY + 13);

    // Score circle - properly positioned on the right
    const scoreX = pageWidth - margin - 40;
    const scoreY = cardY + 50;
    const scoreRadius = 25;
    
    // Score shadow
    doc.setFillColor(0, 0, 0, 0.1);
    doc.circle(scoreX + 1, scoreY + 1, scoreRadius, 'F');
    
    // Score background
    doc.setFillColor(...colors.gray[100]);
    doc.circle(scoreX, scoreY, scoreRadius, 'F');
    
    // Score color based on value
    const scoreColor = analysis.overall_debt_score > 70 ? colors.danger :
                      analysis.overall_debt_score > 40 ? colors.warning : colors.success;
    
    doc.setFillColor(...scoreColor);
    doc.circle(scoreX, scoreY, scoreRadius - 3, 'F');
    
    // Score text
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.white);
    doc.text(analysis.overall_debt_score.toString(), scoreX, scoreY + 2, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255, 0.8);
    doc.text('/100', scoreX, scoreY + 15, { align: 'center' });

    // Metadata in compact two-column layout
    const leftColX = margin + 15;
    const rightColX = margin + 15 + (contentWidth / 2.5);
    let metaY = cardY + 35;

    // Left column - compact format
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.gray[700]);
    
    // Generated date
    doc.text('Generated:', leftColX, metaY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...colors.gray[600]);
    const dateText = new Date().toLocaleDateString('en-US', { 
      month: 'short', day: 'numeric', year: 'numeric'
    });
    doc.text(dateText, leftColX + 35, metaY);

    // Analysis engine
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.gray[700]);
    doc.text('Engine:', leftColX, metaY + 12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...colors.gray[600]);
    doc.text('Gemini 2.0 Flash AI', leftColX + 25, metaY + 12);

    // Right column - compact format
    // Generated for
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.gray[700]);
    doc.text('Generated For:', rightColX, metaY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...colors.gray[600]);
    const emailText = safeText(userEmail, 30);
    doc.text(emailText, rightColX + 40, metaY);

    // Files analyzed
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.gray[700]);
    doc.text('Files Analyzed:', rightColX, metaY + 12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...colors.gray[600]);
    doc.text(`${analysis.file_analyses?.length || 0} files`, rightColX + 40, metaY + 12);

    // Assessment indicator - positioned below score
    const assessmentY = cardY + 75;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...scoreColor);
    const qualityText = analysis.overall_debt_score > 70 ? 'High Technical Debt' :
                       analysis.overall_debt_score > 40 ? 'Moderate Technical Debt' : 'Low Technical Debt';
    doc.text(`Assessment: ${qualityText}`, scoreX, assessmentY, { align: 'center' });

    // Professional footer with branding
    const footerY = pageHeight - 25;
    doc.setFillColor(...colors.gray[50]);
    doc.rect(0, footerY - 5, pageWidth, 30, 'F');
    
    doc.setDrawColor(...colors.primary);
    doc.setLineWidth(1);
    doc.line(0, footerY - 5, pageWidth, footerY - 5);
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.primary);
    doc.text('Powered by Lint', pageWidth / 2, footerY + 5, { align: 'center' });
    
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...colors.gray[500]);
    doc.text('Professional Code Analysis Platform', pageWidth / 2, footerY + 12, { align: 'center' });

    doc.addPage();
    yPosition = 25;
  };

  // Section header with proper spacing
  const addSectionHeader = (title: string, subtitle?: string, color: number[] = colors.primary) => {
    checkPageBreak(35);
    
    // Section background
    doc.setFillColor(...colors.gray[50]);
    doc.rect(margin - 2, yPosition - 2, contentWidth + 4, 25, 'F');
    
    // Left accent
    doc.setFillColor(...color);
    doc.rect(margin - 2, yPosition - 2, 3, 25, 'F');
    
    // Title
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...color);
    doc.text(safeText(title, 50), margin + 8, yPosition + 8);
    
    // Subtitle
    if (subtitle) {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...colors.gray[600]);
      const subtitleLines = fitText(subtitle, maxTextWidth - 20, 9);
      doc.text(safeText(subtitleLines[0], 60), margin + 8, yPosition + 18);
    }
    
    yPosition += 30;
  };

  // Executive summary with text fitting
  const addExecutiveSummary = () => {
    if (!analysis.summary) return;
    
    addSectionHeader('Executive Summary', 'Key findings and overall assessment');
    
    const summaryLines = fitText(analysis.summary, maxTextWidth, 10);
    const summaryHeight = summaryLines.length * 5 + 15;
    
    checkPageBreak(summaryHeight);
    
    // Summary card
    doc.setFillColor(...colors.white);
    doc.roundedRect(margin, yPosition, contentWidth, summaryHeight, 4, 4, 'F');
    doc.setDrawColor(...colors.gray[200]);
    doc.setLineWidth(0.5);
    doc.roundedRect(margin, yPosition, contentWidth, summaryHeight, 4, 4, 'D');
    
    // Content
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...colors.gray[700]);
    
    summaryLines.forEach((line: string, index: number) => {
      if (index < 8) { // Limit lines to prevent overflow
        doc.text(safeText(line), margin + 10, yPosition + 12 + (index * 5));
      }
    });
    
    yPosition += summaryHeight + 15;
  };

  // File analysis with proper text fitting
  const addFileAnalysis = () => {
    if (!analysis.file_analyses || analysis.file_analyses.length === 0) return;
    
    const fileCount = Math.min(analysis.file_analyses.length, 6);
    addSectionHeader('File Analysis', `Detailed analysis of ${fileCount} key files`);
    
    analysis.file_analyses.slice(0, 6).forEach((fileAnalysis) => {
      const estimatedHeight = 40 + Math.min(fileAnalysis.issues?.length || 0, 2) * 12;
      checkPageBreak(estimatedHeight);
      
      // File card
      doc.setFillColor(...colors.white);
      doc.roundedRect(margin, yPosition, contentWidth, 30, 4, 4, 'F');
      doc.setDrawColor(...colors.gray[200]);
      doc.setLineWidth(0.5);
      doc.roundedRect(margin, yPosition, contentWidth, 30, 4, 4, 'D');
      
      // File icon
      doc.setFillColor(...colors.primary);
      doc.roundedRect(margin + 8, yPosition + 8, 15, 15, 2, 2, 'F');
      doc.setFillColor(...colors.white);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text('{ }', margin + 15.5, yPosition + 17, { align: 'center' });
      
      // File name (truncated)
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.gray[800]);
      const fileName = safeText(fileAnalysis.file_path, 45);
      doc.text(fileName, margin + 28, yPosition + 15);
      
      // Score badge
      const scoreColor = fileAnalysis.debt_score > 70 ? colors.danger :
                        fileAnalysis.debt_score > 40 ? colors.warning : colors.success;
      
      doc.setFillColor(...scoreColor);
      doc.roundedRect(pageWidth - margin - 45, yPosition + 8, 35, 15, 7, 7, 'F');
      
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.white);
      doc.text(`${fileAnalysis.debt_score}/100`, pageWidth - margin - 27.5, yPosition + 17, { align: 'center' });
      
      yPosition += 35;
      
      // Top 2 issues only
      if (fileAnalysis.issues && fileAnalysis.issues.length > 0) {
        const issues = fileAnalysis.issues.slice(0, 2);
        
        issues.forEach((issue: any) => {
          checkPageBreak(12);
          
          const severityColor = issue.severity === 'high' ? colors.danger :
                               issue.severity === 'medium' ? colors.warning : colors.success;
          
          // Issue background
          doc.setFillColor(...colors.gray[50]);
          doc.rect(margin + 5, yPosition, contentWidth - 10, 10, 'F');
          
          // Severity indicator
          doc.setFillColor(...severityColor);
          doc.circle(margin + 12, yPosition + 5, 1.5, 'F');
          
          // Issue text (truncated)
          doc.setFontSize(8);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(...severityColor);
          doc.text(safeText(issue.type || 'Issue', 15), margin + 18, yPosition + 6);
          
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(...colors.gray[600]);
          const description = safeText(issue.description || '', 50);
          doc.text(description, margin + 55, yPosition + 6);
          
          yPosition += 12;
        });
      }
      
      yPosition += 8;
    });
  };

  // Recommendations with proper formatting
  const addRecommendations = () => {
    if (!analysis.recommendations || analysis.recommendations.length === 0) return;
    
    addSectionHeader('Key Recommendations', 'Priority actions to improve code quality');
    
    // Group and limit recommendations
    const grouped = {
      high: analysis.recommendations.filter(r => r.priority === 'high').slice(0, 3),
      medium: analysis.recommendations.filter(r => r.priority === 'medium').slice(0, 2),
      low: analysis.recommendations.filter(r => r.priority === 'low').slice(0, 2)
    };
    
    ['high', 'medium', 'low'].forEach(priority => {
      const recs = grouped[priority as keyof typeof grouped];
      if (recs.length === 0) return;
      
      const priorityColor = priority === 'high' ? colors.danger :
                           priority === 'medium' ? colors.warning : colors.success;
      
      // Priority header
      checkPageBreak(20);
      doc.setFillColor(...priorityColor, 0.1);
      doc.rect(margin, yPosition, contentWidth, 15, 'F');
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...priorityColor);
      doc.text(`${priority.toUpperCase()} PRIORITY (${recs.length})`, margin + 8, yPosition + 10);
      
      yPosition += 20;
      
      recs.forEach((rec: any) => {
        checkPageBreak(25);
        
        // Recommendation card
        doc.setFillColor(...colors.white);
        doc.roundedRect(margin, yPosition, contentWidth, 22, 3, 3, 'F');
        doc.setDrawColor(...priorityColor, 0.3);
        doc.setLineWidth(0.5);
        doc.roundedRect(margin, yPosition, contentWidth, 22, 3, 3, 'D');
        
        // Priority bar
        doc.setFillColor(...priorityColor);
        doc.rect(margin, yPosition, 3, 22, 'F');
        
        // Content
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...colors.gray[800]);
        doc.text(safeText(rec.category || 'General', 25), margin + 10, yPosition + 10);
        
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...colors.gray[600]);
        const description = safeText(rec.description || '', 80);
        doc.text(description, margin + 10, yPosition + 18);
        
        yPosition += 27;
      });
      
      yPosition += 5;
    });
  };

  // Professional footer
  const addFooter = () => {
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      
      if (i === 1) continue; // Skip footer on cover page
      
      // Footer line
      doc.setDrawColor(...colors.gray[200]);
      doc.setLineWidth(0.5);
      doc.line(margin, pageHeight - 20, pageWidth - margin, pageHeight - 20);
      
      // Footer content
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...colors.gray[500]);
      doc.text('Generated by Lint | Professional Code Analysis', margin, pageHeight - 12);
      
      doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, pageHeight - 12, { align: 'right' });
      
      // Confidential notice
      doc.setFontSize(6);
      doc.setTextColor(...colors.gray[400]);
      doc.text('Confidential - Internal Use Only', pageWidth / 2, pageHeight - 6, { align: 'center' });
    }
  };

  // Generate the complete report
  addCoverPage();
  addExecutiveSummary();
  addFileAnalysis();
  addRecommendations();
  addFooter();

  return doc;
}