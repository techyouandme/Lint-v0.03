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
    // Single-line colored header background
    doc.setFillColor(...colors.primary);
    doc.rect(0, 0, pageWidth, 60, 'F');
    
    // Gradient overlay for depth
    for (let i = 0; i < 15; i++) {
      const alpha = 0.3 - (i * 0.02);
      doc.setFillColor(colors.secondary[0], colors.secondary[1], colors.secondary[2], alpha);
      doc.rect(0, 45 + i, pageWidth, 1, 'F');
    }

    // Enhanced Logo/Icon Element - "L" for Lint
    const logoX = margin + 25;
    const logoY = 30;
    
    // Logo outer circle with shadow
    doc.setFillColor(0, 0, 0, 0.1);
    doc.circle(logoX + 1, logoY + 1, 18, 'F');
    
    // Logo outer circle
    doc.setFillColor(...colors.white);
    doc.circle(logoX, logoY, 18, 'F');
    
    // Logo inner circle with gradient effect
    doc.setFillColor(...colors.primary);
    doc.circle(logoX, logoY, 14, 'F');
    
    // Logo accent circle
    doc.setFillColor(...colors.secondary);
    doc.circle(logoX, logoY, 10, 'F');
    
    // Logo "L" text
    doc.setFillColor(...colors.white);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('L', logoX - 5, logoY + 5);

    // Single-line title in white bold text
    doc.setFontSize(32);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.white);
    doc.text('Technical Debt Analysis Report', logoX + 30, 35);

    // Horizontal separator line
    doc.setDrawColor(...colors.white, 0.3);
    doc.setLineWidth(1);
    doc.line(margin, 70, pageWidth - margin, 70);

    // Improved Score Visualization - Color-coded circle badge on the right
    const scoreX = pageWidth - margin - 50;
    const scoreY = 110;
    const scoreRadius = 30;
    
    // Score shadow
    doc.setFillColor(0, 0, 0, 0.15);
    doc.circle(scoreX + 2, scoreY + 2, scoreRadius, 'F');
    
    // Score background circle
    doc.setFillColor(...colors.white);
    doc.circle(scoreX, scoreY, scoreRadius, 'F');
    
    // Score color based on value (Red 70+, Yellow 40-70, Green <40)
    const scoreColor = analysis.overall_debt_score >= 70 ? colors.danger :
                      analysis.overall_debt_score >= 40 ? colors.warning : colors.success;
    
    doc.setFillColor(...scoreColor);
    doc.circle(scoreX, scoreY, scoreRadius - 4, 'F');
    
    // Score text
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.white);
    doc.text(analysis.overall_debt_score.toString(), scoreX, scoreY + 3, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255, 0.9);
    doc.text('/100', scoreX, scoreY + 18, { align: 'center' });

    // Assessment label below score
    const assessmentY = scoreY + 45;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...scoreColor);
    const qualityText = analysis.overall_debt_score >= 70 ? 'High Technical Debt' :
                       analysis.overall_debt_score >= 40 ? 'Moderate Technical Debt' : 'Low Technical Debt';
    doc.text(`Assessment: ${qualityText}`, scoreX, assessmentY, { align: 'center' });

    // Better Layout of Metadata - 2-column layout
    const leftColX = margin + 20;
    const rightColX = pageWidth / 2 + 10;
    let metaY = 100;

    // Left column
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.gray[800]);
    
    // Project name
    doc.text('Project:', leftColX, metaY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...colors.gray[700]);
    const truncatedProjectName = safeText(projectName, 35);
    doc.text(truncatedProjectName, leftColX + 30, metaY);

    // Generated date
    metaY += 20;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.gray[800]);
    doc.text('Generated:', leftColX, metaY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...colors.gray[700]);
    const dateText = new Date().toLocaleDateString('en-US', { 
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
    doc.text(dateText, leftColX + 35, metaY);

    // Engine used
    metaY += 20;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.gray[800]);
    doc.text('Engine:', leftColX, metaY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...colors.gray[700]);
    doc.text('Gemini 2.0 Flash AI', leftColX + 28, metaY);

    // Right column
    metaY = 100;
    
    // Files analyzed
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.gray[800]);
    doc.text('Files Analyzed:', rightColX, metaY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...colors.gray[700]);
    doc.text(`${analysis.file_analyses?.length || 0} files`, rightColX + 45, metaY);

    // Generated for (email)
    metaY += 20;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.gray[800]);
    doc.text('Generated For:', rightColX, metaY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...colors.gray[700]);
    const emailText = safeText(userEmail, 30);
    doc.text(emailText, rightColX + 45, metaY);

    // Increase margin + padding with separator
    metaY += 40;
    
    // Light background separator
    doc.setFillColor(...colors.gray[50]);
    doc.rect(margin, metaY, contentWidth, 20, 'F');
    
    // Subtle watermark
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.primary, 0.3);
    doc.text('Lint Report', pageWidth / 2, metaY + 12, { align: 'center' });

    // Professional footer with enhanced styling
    const footerY = pageHeight - 35;
    
    // Footer background
    doc.setFillColor(...colors.gray[800]);
    doc.rect(0, footerY, pageWidth, 35, 'F');
    
    // Footer accent line
    doc.setFillColor(...colors.primary);
    doc.rect(0, footerY, pageWidth, 3, 'F');
    
    // Main footer text
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.white);
    doc.text('Powered by Lint', pageWidth / 2, footerY + 15, { align: 'center' });
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(255, 255, 255, 0.8);
    doc.text('Professional Code Analysis Platform', pageWidth / 2, footerY + 25, { align: 'center' });
    
    // Confidential notice
    doc.setFontSize(7);
    doc.setTextColor(255, 255, 255, 0.6);
    doc.text('Confidential – Internal Use Only', pageWidth / 2, footerY + 32, { align: 'center' });

    doc.addPage();
    yPosition = 25;
  };

  // Section header with proper spacing
  const addSectionHeader = (title: string, subtitle?: string, color: number[] = colors.primary) => {
    checkPageBreak(40);
    
    yPosition += 10; // Generous spacing
    
    // Section background with separator
    doc.setFillColor(...colors.gray[50]);
    doc.rect(margin - 5, yPosition - 5, contentWidth + 10, 30, 'F');
    
    // Left accent bar
    doc.setFillColor(...color);
    doc.rect(margin - 5, yPosition - 5, 4, 30, 'F');
    
    // Title
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...color);
    doc.text(safeText(title, 50), margin + 5, yPosition + 8);
    
    // Subtitle
    if (subtitle) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...colors.gray[600]);
      const subtitleLines = fitText(subtitle, maxTextWidth - 20, 10);
      doc.text(safeText(subtitleLines[0], 60), margin + 5, yPosition + 20);
    }
    
    yPosition += 40; // Generous spacing
  };

  // Executive summary with text fitting
  const addExecutiveSummary = () => {
    if (!analysis.summary) return;
    
    addSectionHeader('Executive Summary', 'Key findings and overall assessment');
    
    const summaryLines = fitText(analysis.summary, maxTextWidth, 11);
    const summaryHeight = summaryLines.length * 6 + 20;
    
    checkPageBreak(summaryHeight);
    
    // Summary card with separator
    doc.setFillColor(...colors.white);
    doc.roundedRect(margin, yPosition, contentWidth, summaryHeight, 6, 6, 'F');
    doc.setDrawColor(...colors.gray[200]);
    doc.setLineWidth(1);
    doc.roundedRect(margin, yPosition, contentWidth, summaryHeight, 6, 6, 'D');
    
    // Content
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...colors.gray[700]);
    
    summaryLines.forEach((line: string, index: number) => {
      if (index < 10) { // Limit lines to prevent overflow
        doc.text(safeText(line), margin + 15, yPosition + 15 + (index * 6));
      }
    });
    
    yPosition += summaryHeight + 20; // Generous spacing
  };

  // File analysis with proper text fitting
  const addFileAnalysis = () => {
    if (!analysis.file_analyses || analysis.file_analyses.length === 0) return;
    
    const fileCount = Math.min(analysis.file_analyses.length, 8);
    addSectionHeader('File Analysis', `Detailed analysis of ${fileCount} key files`);
    
    analysis.file_analyses.slice(0, 8).forEach((fileAnalysis, index) => {
      const estimatedHeight = 45 + Math.min(fileAnalysis.issues?.length || 0, 3) * 15;
      checkPageBreak(estimatedHeight);
      
      // File card with separator
      doc.setFillColor(...colors.white);
      doc.roundedRect(margin, yPosition, contentWidth, 35, 6, 6, 'F');
      doc.setDrawColor(...colors.gray[200]);
      doc.setLineWidth(1);
      doc.roundedRect(margin, yPosition, contentWidth, 35, 6, 6, 'D');
      
      // File icon
      doc.setFillColor(...colors.primary);
      doc.roundedRect(margin + 12, yPosition + 10, 18, 18, 3, 3, 'F');
      doc.setFillColor(...colors.white);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('{ }', margin + 21, yPosition + 21, { align: 'center' });
      
      // File name (truncated)
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.gray[800]);
      const fileName = safeText(fileAnalysis.file_path, 40);
      doc.text(fileName, margin + 38, yPosition + 18);
      
      // Score badge
      const scoreColor = fileAnalysis.debt_score >= 70 ? colors.danger :
                        fileAnalysis.debt_score >= 40 ? colors.warning : colors.success;
      
      doc.setFillColor(...scoreColor);
      doc.roundedRect(pageWidth - margin - 50, yPosition + 10, 40, 18, 9, 9, 'F');
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.white);
      doc.text(`${fileAnalysis.debt_score}/100`, pageWidth - margin - 30, yPosition + 21, { align: 'center' });
      
      yPosition += 40;
      
      // Top 3 issues only
      if (fileAnalysis.issues && fileAnalysis.issues.length > 0) {
        const issues = fileAnalysis.issues.slice(0, 3);
        
        issues.forEach((issue: any) => {
          checkPageBreak(15);
          
          const severityColor = issue.severity === 'high' ? colors.danger :
                               issue.severity === 'medium' ? colors.warning : colors.success;
          
          // Issue background
          doc.setFillColor(...colors.gray[50]);
          doc.rect(margin + 10, yPosition, contentWidth - 20, 12, 'F');
          
          // Severity indicator
          doc.setFillColor(...severityColor);
          doc.circle(margin + 18, yPosition + 6, 2, 'F');
          
          // Issue text (truncated)
          doc.setFontSize(9);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(...severityColor);
          doc.text(safeText(issue.type || 'Issue', 18), margin + 25, yPosition + 7);
          
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(...colors.gray[600]);
          const description = safeText(issue.description || '', 45);
          doc.text(description, margin + 70, yPosition + 7);
          
          yPosition += 15;
        });
      }
      
      yPosition += 15; // Generous spacing between files
    });
  };

  // Recommendations with proper formatting
  const addRecommendations = () => {
    if (!analysis.recommendations || analysis.recommendations.length === 0) return;
    
    addSectionHeader('Key Recommendations', 'Priority actions to improve code quality');
    
    // Group and limit recommendations
    const grouped = {
      high: analysis.recommendations.filter(r => r.priority === 'high').slice(0, 4),
      medium: analysis.recommendations.filter(r => r.priority === 'medium').slice(0, 3),
      low: analysis.recommendations.filter(r => r.priority === 'low').slice(0, 2)
    };
    
    ['high', 'medium', 'low'].forEach(priority => {
      const recs = grouped[priority as keyof typeof grouped];
      if (recs.length === 0) return;
      
      const priorityColor = priority === 'high' ? colors.danger :
                           priority === 'medium' ? colors.warning : colors.success;
      
      // Priority header with separator
      checkPageBreak(25);
      doc.setFillColor(...priorityColor, 0.1);
      doc.rect(margin, yPosition, contentWidth, 18, 'F');
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...priorityColor);
      doc.text(`${priority.toUpperCase()} PRIORITY (${recs.length})`, margin + 10, yPosition + 12);
      
      yPosition += 25;
      
      recs.forEach((rec: any) => {
        checkPageBreak(30);
        
        // Recommendation card
        doc.setFillColor(...colors.white);
        doc.roundedRect(margin, yPosition, contentWidth, 25, 4, 4, 'F');
        doc.setDrawColor(...priorityColor, 0.4);
        doc.setLineWidth(1);
        doc.roundedRect(margin, yPosition, contentWidth, 25, 4, 4, 'D');
        
        // Priority bar
        doc.setFillColor(...priorityColor);
        doc.rect(margin, yPosition, 4, 25, 'F');
        
        // Content
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...colors.gray[800]);
        doc.text(safeText(rec.category || 'General', 30), margin + 12, yPosition + 12);
        
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...colors.gray[600]);
        const description = safeText(rec.description || '', 75);
        doc.text(description, margin + 12, yPosition + 20);
        
        yPosition += 30;
      });
      
      yPosition += 10; // Generous spacing between priority groups
    });
  };

  // Professional footer
  const addFooter = () => {
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      
      if (i === 1) continue; // Skip footer on cover page
      
      // Footer separator line
      doc.setDrawColor(...colors.gray[300]);
      doc.setLineWidth(1);
      doc.line(margin, pageHeight - 25, pageWidth - margin, pageHeight - 25);
      
      // Footer content
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...colors.gray[500]);
      doc.text('Generated by Lint | Professional Code Analysis', margin, pageHeight - 15);
      
      doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, pageHeight - 15, { align: 'right' });
      
      // Confidential notice
      doc.setFontSize(7);
      doc.setTextColor(...colors.gray[400]);
      doc.text('Confidential – Internal Use Only', pageWidth / 2, pageHeight - 8, { align: 'center' });
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