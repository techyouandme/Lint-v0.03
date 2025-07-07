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
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);

  // Color palette
  const colors = {
    primary: [59, 130, 246],      // Blue
    secondary: [147, 51, 234],    // Purple
    success: [34, 197, 94],       // Green
    warning: [245, 158, 11],      // Orange
    danger: [239, 68, 68],        // Red
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

  // Helper function to safely encode text
  const safeText = (text: string): string => {
    if (!text) return '';
    return text
      .toString()
      .replace(/[^\x20-\x7E]/g, '')
      .replace(/[""]/g, '"')
      .replace(/['']/g, "'")
      .replace(/[–—]/g, '-')
      .replace(/…/g, '...')
      .trim();
  };

  // Helper function to add new page if needed
  const checkPageBreak = (height: number) => {
    if (yPosition + height > pageHeight - 40) {
      doc.addPage();
      yPosition = 30;
      addPageHeader();
    }
  };

  // Add page header for subsequent pages
  const addPageHeader = () => {
    doc.setFillColor(...colors.gray[50]);
    doc.rect(0, 0, pageWidth, 25, 'F');
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.gray[700]);
    doc.text(safeText(projectName), margin, 15);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...colors.gray[500]);
    doc.text('Technical Debt Analysis Report', pageWidth - margin, 15, { align: 'right' });
    
    // Header line
    doc.setDrawColor(...colors.primary);
    doc.setLineWidth(0.5);
    doc.line(margin, 20, pageWidth - margin, 20);
    
    yPosition = 35;
  };

  // Professional cover page
  const addCoverPage = () => {
    // Background gradient effect
    doc.setFillColor(...colors.primary);
    doc.rect(0, 0, pageWidth, 80, 'F');
    
    // Overlay gradient
    for (let i = 0; i < 20; i++) {
      const alpha = 1 - (i / 20);
      doc.setFillColor(colors.secondary[0], colors.secondary[1], colors.secondary[2], alpha * 0.3);
      doc.rect(0, 60 + i * 2, pageWidth, 2, 'F');
    }

    // Logo area
    doc.setFillColor(255, 255, 255);
    doc.circle(margin + 20, 40, 15, 'F');
    doc.setFillColor(...colors.primary);
    doc.circle(margin + 20, 40, 12, 'F');
    doc.setFillColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('L', margin + 16, 45);

    // Main title
    doc.setFontSize(32);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('Technical Debt', margin + 50, 35);
    doc.text('Analysis Report', margin + 50, 50);

    // Project name
    doc.setFontSize(18);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(255, 255, 255, 0.9);
    doc.text(safeText(projectName), margin + 50, 65);

    // Report metadata card
    const cardY = 100;
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(margin, cardY, contentWidth, 60, 8, 8, 'F');
    doc.setDrawColor(...colors.gray[200]);
    doc.setLineWidth(1);
    doc.roundedRect(margin, cardY, contentWidth, 60, 8, 8, 'D');

    // Metadata content
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.gray[800]);
    doc.text('Report Summary', margin + 15, cardY + 20);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...colors.gray[600]);
    
    const metadata = [
      ['Generated:', new Date().toLocaleDateString('en-US', { 
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
      })],
      ['For:', safeText(userEmail)],
      ['Analysis Engine:', 'Gemini 2.0 Flash AI'],
      ['Overall Debt Score:', `${analysis.overall_debt_score}/100`]
    ];

    metadata.forEach(([label, value], index) => {
      const x = margin + 15 + (index % 2) * (contentWidth / 2);
      const y = cardY + 35 + Math.floor(index / 2) * 12;
      
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.gray[700]);
      doc.text(label, x, y);
      
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...colors.gray[600]);
      doc.text(safeText(value), x + 50, y);
    });

    // Score visualization
    const scoreX = pageWidth - margin - 80;
    const scoreY = cardY + 15;
    const scoreRadius = 25;
    
    // Score circle background
    doc.setFillColor(...colors.gray[100]);
    doc.circle(scoreX, scoreY, scoreRadius, 'F');
    
    // Score circle
    const scoreColor = analysis.overall_debt_score > 70 ? colors.danger :
                      analysis.overall_debt_score > 40 ? colors.warning : colors.success;
    doc.setFillColor(...scoreColor);
    doc.circle(scoreX, scoreY, scoreRadius - 3, 'F');
    
    // Score text
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text(analysis.overall_debt_score.toString(), scoreX, scoreY + 5, { align: 'center' });
    
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255, 0.8);
    doc.text('/100', scoreX, scoreY + 15, { align: 'center' });

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(...colors.gray[500]);
    doc.text('Powered by Lint - Professional Code Analysis Platform', 
             pageWidth / 2, pageHeight - 20, { align: 'center' });

    doc.addPage();
    yPosition = 30;
  };

  // Section header with modern styling
  const addSectionHeader = (title: string, subtitle?: string, color: number[] = colors.primary) => {
    checkPageBreak(40);
    
    // Section header background
    doc.setFillColor(...colors.gray[50]);
    doc.rect(margin - 5, yPosition - 5, contentWidth + 10, 30, 'F');
    
    // Left accent bar
    doc.setFillColor(...color);
    doc.rect(margin - 5, yPosition - 5, 4, 30, 'F');
    
    // Title
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...color);
    doc.text(safeText(title), margin + 10, yPosition + 8);
    
    // Subtitle
    if (subtitle) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...colors.gray[600]);
      doc.text(safeText(subtitle), margin + 10, yPosition + 18);
    }
    
    yPosition += 40;
  };

  // Executive summary with better styling
  const addExecutiveSummary = () => {
    if (!analysis.summary) return;
    
    addSectionHeader('Executive Summary', 'Key findings and overall assessment');
    
    const summaryText = safeText(analysis.summary);
    const lines = doc.splitTextToSize(summaryText, contentWidth - 30);
    const summaryHeight = lines.length * 6 + 20;
    
    checkPageBreak(summaryHeight);
    
    // Summary card
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(margin, yPosition, contentWidth, summaryHeight, 6, 6, 'F');
    doc.setDrawColor(...colors.gray[200]);
    doc.setLineWidth(0.5);
    doc.roundedRect(margin, yPosition, contentWidth, summaryHeight, 6, 6, 'D');
    
    // Content
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...colors.gray[700]);
    
    lines.forEach((line: string, index: number) => {
      doc.text(safeText(line), margin + 15, yPosition + 15 + (index * 6));
    });
    
    yPosition += summaryHeight + 20;
  };

  // Enhanced file analysis
  const addFileAnalysis = () => {
    if (!analysis.file_analyses || analysis.file_analyses.length === 0) return;
    
    addSectionHeader('Detailed File Analysis', 
      `Analysis of ${Math.min(analysis.file_analyses.length, 8)} files with highest impact`);
    
    analysis.file_analyses.slice(0, 8).forEach((fileAnalysis, index) => {
      const estimatedHeight = 45 + Math.min(fileAnalysis.issues?.length || 0, 3) * 15;
      checkPageBreak(estimatedHeight);
      
      // File header
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(margin, yPosition, contentWidth, 35, 6, 6, 'F');
      doc.setDrawColor(...colors.gray[200]);
      doc.setLineWidth(0.5);
      doc.roundedRect(margin, yPosition, contentWidth, 35, 6, 6, 'D');
      
      // File icon
      doc.setFillColor(...colors.primary);
      doc.roundedRect(margin + 10, yPosition + 8, 20, 20, 4, 4, 'F');
      doc.setFillColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('{ }', margin + 20, yPosition + 20, { align: 'center' });
      
      // File name
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.gray[800]);
      const fileName = fileAnalysis.file_path.length > 50 ? 
        '...' + fileAnalysis.file_path.slice(-47) : fileAnalysis.file_path;
      doc.text(safeText(fileName), margin + 40, yPosition + 15);
      
      // Score badge
      const scoreColor = fileAnalysis.debt_score > 70 ? colors.danger :
                        fileAnalysis.debt_score > 40 ? colors.warning : colors.success;
      
      doc.setFillColor(...scoreColor);
      doc.roundedRect(pageWidth - margin - 60, yPosition + 8, 50, 20, 10, 10, 'F');
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text(`${fileAnalysis.debt_score}/100`, pageWidth - margin - 35, yPosition + 20, { align: 'center' });
      
      yPosition += 40;
      
      // Issues (compact format)
      if (fileAnalysis.issues && fileAnalysis.issues.length > 0) {
        const issues = fileAnalysis.issues.slice(0, 3);
        
        issues.forEach((issue: any) => {
          checkPageBreak(15);
          
          const severityColor = issue.severity === 'high' ? colors.danger :
                               issue.severity === 'medium' ? colors.warning : colors.success;
          
          // Issue line
          doc.setFillColor(...colors.gray[50]);
          doc.rect(margin + 10, yPosition, contentWidth - 20, 12, 'F');
          
          // Severity dot
          doc.setFillColor(...severityColor);
          doc.circle(margin + 18, yPosition + 6, 2, 'F');
          
          // Issue text
          doc.setFontSize(9);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(...severityColor);
          doc.text(safeText(issue.type || 'Issue'), margin + 25, yPosition + 7);
          
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(...colors.gray[600]);
          const description = safeText(issue.description || '').substring(0, 80) + '...';
          doc.text(description, margin + 80, yPosition + 7);
          
          yPosition += 15;
        });
        
        yPosition += 5;
      }
      
      yPosition += 10;
    });
  };

  // Enhanced recommendations
  const addRecommendations = () => {
    if (!analysis.recommendations || analysis.recommendations.length === 0) return;
    
    addSectionHeader('Priority Recommendations', 
      'Actionable steps to improve code quality and reduce technical debt');
    
    // Group by priority
    const grouped = {
      high: analysis.recommendations.filter(r => r.priority === 'high'),
      medium: analysis.recommendations.filter(r => r.priority === 'medium'),
      low: analysis.recommendations.filter(r => r.priority === 'low')
    };
    
    ['high', 'medium', 'low'].forEach(priority => {
      const recs = grouped[priority as keyof typeof grouped];
      if (recs.length === 0) return;
      
      const priorityColor = priority === 'high' ? colors.danger :
                           priority === 'medium' ? colors.warning : colors.success;
      
      // Priority section header
      checkPageBreak(25);
      doc.setFillColor(...priorityColor, 0.1);
      doc.rect(margin, yPosition, contentWidth, 20, 'F');
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...priorityColor);
      doc.text(`${priority.toUpperCase()} PRIORITY (${recs.length})`, margin + 10, yPosition + 12);
      
      yPosition += 25;
      
      recs.forEach((rec: any, index: number) => {
        checkPageBreak(35);
        
        // Recommendation card
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(margin, yPosition, contentWidth, 30, 4, 4, 'F');
        doc.setDrawColor(...priorityColor, 0.3);
        doc.setLineWidth(1);
        doc.roundedRect(margin, yPosition, contentWidth, 30, 4, 4, 'D');
        
        // Priority indicator
        doc.setFillColor(...priorityColor);
        doc.rect(margin, yPosition, 4, 30, 'F');
        
        // Content
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...colors.gray[800]);
        doc.text(safeText(rec.category || 'General'), margin + 15, yPosition + 12);
        
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...colors.gray[600]);
        const description = safeText(rec.description || '');
        const descLines = doc.splitTextToSize(description, contentWidth - 30);
        doc.text(safeText(descLines[0] || ''), margin + 15, yPosition + 22);
        
        yPosition += 35;
      });
      
      yPosition += 10;
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
      doc.line(margin, pageHeight - 25, pageWidth - margin, pageHeight - 25);
      
      // Footer content
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...colors.gray[500]);
      doc.text('Generated by Lint | Professional Code Analysis Platform', 
               margin, pageHeight - 15);
      
      doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, pageHeight - 15, { align: 'right' });
      
      // Confidential notice
      doc.setFontSize(7);
      doc.setTextColor(...colors.gray[400]);
      doc.text('Confidential - For internal use only', 
               pageWidth / 2, pageHeight - 8, { align: 'center' });
    }
  };

  // Generate the report
  addCoverPage();
  addExecutiveSummary();
  addFileAnalysis();
  addRecommendations();
  addFooter();

  return doc;
}