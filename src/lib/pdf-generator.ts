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
    if (yPosition + height > pageHeight - margin - 20) {
      doc.addPage();
      yPosition = 30;
      addWatermark();
    }
  };

  // Add subtle watermark
  const addWatermark = () => {
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(180, 180, 180);
    doc.text('Lint - Professional Code Analysis', pageWidth / 2, pageHeight - 8, { align: 'center' });
  };

  // Enhanced Header with Professional Design
  const addProfessionalHeader = () => {
    // Header gradient background
    doc.setFillColor(37, 99, 235); // Blue-600
    doc.rect(0, 0, pageWidth, 60, 'F');
    
    // Subtle gradient overlay
    doc.setFillColor(59, 130, 246); // Blue-500
    doc.rect(0, 0, pageWidth * 0.6, 60, 'F');
    
    doc.setFillColor(147, 51, 234); // Purple-600
    doc.rect(pageWidth * 0.6, 0, pageWidth * 0.4, 60, 'F');

    // Professional Logo Design
    const logoX = margin + 8;
    const logoY = 20;
    
    // Outer circle
    doc.setFillColor(255, 255, 255);
    doc.circle(logoX, logoY, 14, 'F');
    
    // Inner gradient circle
    doc.setFillColor(37, 99, 235);
    doc.circle(logoX, logoY, 11, 'F');
    
    // Center accent
    doc.setFillColor(255, 255, 255);
    doc.circle(logoX, logoY, 6, 'F');
    
    // Logo text "L"
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(37, 99, 235);
    doc.text('L', logoX - 3, logoY + 4);

    // Main Title - Split Design
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('Technical Debt Analysis', logoX + 25, 22);
    
    doc.setFontSize(24);
    doc.setFont('helvetica', 'normal');
    doc.text('Report', logoX + 25, 42);

    // Project Name with proper truncation
    const maxProjectLength = 35;
    const displayProjectName = projectName.length > maxProjectLength ? 
      projectName.substring(0, maxProjectLength) + '...' : projectName;
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text(`Project: ${safeText(displayProjectName)}`, logoX + 25, 54);

    yPosition = 80;
  };

  // Enhanced Report Overview Card
  const addReportOverviewCard = () => {
    checkPageBreak(100);
    
    // Card background with shadow effect
    doc.setFillColor(248, 250, 252); // Gray-50
    doc.roundedRect(margin, yPosition, contentWidth, 85, 8, 8, 'F');
    
    // Card border
    doc.setDrawColor(226, 232, 240); // Gray-200
    doc.setLineWidth(1);
    doc.roundedRect(margin, yPosition, contentWidth, 85, 8, 8, 'D');
    
    // Card shadow effect
    doc.setFillColor(0, 0, 0, 0.05);
    doc.roundedRect(margin + 2, yPosition + 2, contentWidth, 85, 8, 8, 'F');

    // Card Header
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59); // Slate-800
    doc.text('Report Overview', margin + 15, yPosition + 20);

    // Left Column - Metadata (Compact Two-Column Layout)
    const leftColX = margin + 15;
    const rightColX = margin + 95;
    let metaY = yPosition + 35;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105); // Slate-600

    // Generated Date
    doc.text('Generated:', leftColX, metaY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139); // Slate-500
    doc.text(new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }), leftColX + 35, metaY);

    // Generated For
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text('Generated For:', rightColX, metaY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    const truncatedEmail = userEmail.length > 20 ? userEmail.substring(0, 17) + '...' : userEmail;
    doc.text(safeText(truncatedEmail), rightColX + 40, metaY);

    metaY += 12;

    // Analysis Engine
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text('Analysis Engine:', leftColX, metaY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text('Gemini 2.0 Flash AI', leftColX + 35, metaY);

    // Files Analyzed
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text('Files Analyzed:', rightColX, metaY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(`${analysis.file_analyses.length} files`, rightColX + 40, metaY);

    // Score Circle - Right Side with Enhanced Design
    const scoreX = pageWidth - margin - 45;
    const scoreY = yPosition + 42;
    const scoreRadius = 25;
    
    const scoreColor = analysis.overall_debt_score >= 70 ? [239, 68, 68] : // Red-500
                      analysis.overall_debt_score >= 40 ? [245, 158, 11] : // Orange-500
                      [34, 197, 94]; // Green-500

    // Score circle shadow
    doc.setFillColor(0, 0, 0, 0.1);
    doc.circle(scoreX + 2, scoreY + 2, scoreRadius, 'F');
    
    // Score circle background
    doc.setFillColor(255, 255, 255);
    doc.circle(scoreX, scoreY, scoreRadius, 'F');
    
    // Score circle border
    doc.setDrawColor(scoreColor[0], scoreColor[1], scoreColor[2]);
    doc.setLineWidth(3);
    doc.circle(scoreX, scoreY, scoreRadius, 'D');
    
    // Score circle inner fill
    doc.setFillColor(scoreColor[0], scoreColor[1], scoreColor[2], 0.1);
    doc.circle(scoreX, scoreY, scoreRadius - 2, 'F');

    // Score text
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2]);
    doc.text(analysis.overall_debt_score.toString(), scoreX, scoreY + 4, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text('/100', scoreX, scoreY + 16, { align: 'center' });

    // Assessment text below score
    metaY += 20;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    const assessment = analysis.overall_debt_score >= 70 ? 'High Technical Debt' :
                      analysis.overall_debt_score >= 40 ? 'Moderate Technical Debt' :
                      'Low Technical Debt';
    doc.text('Assessment:', scoreX - 25, metaY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2]);
    doc.text(assessment, scoreX - 25, metaY + 8);

    yPosition += 100;
  };

  // Enhanced Section Headers
  const addSectionHeader = (title: string, color: [number, number, number] = [37, 99, 235]) => {
    checkPageBreak(35);
    
    yPosition += 10;
    
    // Section background with gradient
    doc.setFillColor(color[0], color[1], color[2], 0.08);
    doc.roundedRect(margin, yPosition - 8, contentWidth, 25, 4, 4, 'F');
    
    // Left accent bar
    doc.setFillColor(color[0], color[1], color[2]);
    doc.roundedRect(margin, yPosition - 8, 4, 25, 2, 2, 'F');
    
    // Section icon (simple geometric shape)
    doc.setFillColor(color[0], color[1], color[2]);
    doc.circle(margin + 15, yPosition + 4, 3, 'F');
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(color[0], color[1], color[2]);
    doc.text(safeText(title), margin + 25, yPosition + 7);
    
    yPosition += 30;
  };

  // Enhanced Content Cards
  const addContentCard = (content: string, bgColor: [number, number, number] = [248, 250, 252]) => {
    const lines = doc.splitTextToSize(safeText(content), contentWidth - 30);
    const cardHeight = Math.max(lines.length * 6 + 20, 35);
    
    checkPageBreak(cardHeight + 10);
    
    // Card background
    doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
    doc.roundedRect(margin, yPosition, contentWidth, cardHeight, 6, 6, 'F');
    
    // Card border
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.roundedRect(margin, yPosition, contentWidth, cardHeight, 6, 6, 'D');
    
    // Content
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85); // Slate-700
    
    lines.forEach((line: string, index: number) => {
      doc.text(safeText(line), margin + 15, yPosition + 15 + (index * 6));
    });
    
    yPosition += cardHeight + 15;
  };

  // Enhanced File Analysis Cards
  const addFileAnalysisCard = (fileAnalysis: any) => {
    const issueCount = Math.min(fileAnalysis.issues?.length || 0, 3);
    const estimatedHeight = 45 + (issueCount * 25) + 15;
    
    checkPageBreak(estimatedHeight);
    
    // File card background
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(margin, yPosition, contentWidth, estimatedHeight, 8, 8, 'F');
    
    // File card border
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(1);
    doc.roundedRect(margin, yPosition, contentWidth, estimatedHeight, 8, 8, 'D');
    
    // File header with icon
    doc.setFillColor(59, 130, 246);
    doc.roundedRect(margin + 10, yPosition + 10, 12, 12, 2, 2, 'F');
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(margin + 12, yPosition + 12, 8, 8, 1, 1, 'F');
    
    // File name
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    const fileName = fileAnalysis.file_path.length > 40 ? 
      '...' + fileAnalysis.file_path.slice(-37) : fileAnalysis.file_path;
    doc.text(safeText(fileName), margin + 30, yPosition + 20);
    
    // File score badge
    const fileScoreColor = fileAnalysis.debt_score >= 70 ? [239, 68, 68] :
                          fileAnalysis.debt_score >= 40 ? [245, 158, 11] :
                          [34, 197, 94];
    
    doc.setFillColor(fileScoreColor[0], fileScoreColor[1], fileScoreColor[2], 0.1);
    doc.roundedRect(pageWidth - margin - 60, yPosition + 12, 50, 16, 8, 8, 'F');
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(fileScoreColor[0], fileScoreColor[1], fileScoreColor[2]);
    doc.text(`${fileAnalysis.debt_score}/100`, pageWidth - margin - 35, yPosition + 22, { align: 'center' });
    
    let issueY = yPosition + 35;
    
    // Issues
    if (fileAnalysis.issues && fileAnalysis.issues.length > 0) {
      fileAnalysis.issues.slice(0, 3).forEach((issue: any) => {
        const severityColor = issue.severity === 'high' ? [239, 68, 68] :
                             issue.severity === 'medium' ? [245, 158, 11] :
                             [34, 197, 94];
        
        // Issue indicator
        doc.setFillColor(severityColor[0], severityColor[1], severityColor[2]);
        doc.circle(margin + 20, issueY + 5, 2, 'F');
        
        // Issue text
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(severityColor[0], severityColor[1], severityColor[2]);
        doc.text(`${safeText(issue.type || 'Issue')} (${issue.severity || 'medium'})`, margin + 30, issueY + 7);
        
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(71, 85, 105);
        const description = safeText(issue.description || 'No description');
        const descLines = doc.splitTextToSize(description, contentWidth - 60);
        doc.text(descLines[0] || '', margin + 30, issueY + 16);
        
        issueY += 25;
      });
    }
    
    yPosition += estimatedHeight + 15;
  };

  // Start document generation
  addProfessionalHeader();
  addWatermark();
  addReportOverviewCard();

  // Executive Summary
  if (analysis.summary) {
    addSectionHeader('Executive Summary', [16, 185, 129]);
    addContentCard(analysis.summary, [236, 253, 245]); // Green tint
  }

  // File Analysis
  if (analysis.file_analyses.length > 0) {
    addSectionHeader('Detailed File Analysis', [245, 158, 11]);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 114, 128);
    doc.text('Individual file analysis with identified issues and recommendations', margin, yPosition);
    yPosition += 20;
    
    analysis.file_analyses.slice(0, 8).forEach((fileAnalysis) => {
      addFileAnalysisCard(fileAnalysis);
    });
  }

  // Recommendations
  if (analysis.recommendations.length > 0) {
    addSectionHeader('Priority Recommendations', [147, 51, 234]);
    
    analysis.recommendations.forEach((rec: any) => {
      checkPageBreak(50);
      
      const priorityColor = rec.priority === 'high' ? [239, 68, 68] :
                           rec.priority === 'medium' ? [245, 158, 11] :
                           [34, 197, 94];
      
      // Recommendation card
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(margin, yPosition, contentWidth, 40, 6, 6, 'F');
      doc.setDrawColor(priorityColor[0], priorityColor[1], priorityColor[2]);
      doc.setLineWidth(1);
      doc.roundedRect(margin, yPosition, contentWidth, 40, 6, 6, 'D');
      
      // Priority indicator
      doc.setFillColor(priorityColor[0], priorityColor[1], priorityColor[2]);
      doc.roundedRect(margin, yPosition, 4, 40, 2, 2, 'F');
      
      // Priority badge
      doc.setFillColor(priorityColor[0], priorityColor[1], priorityColor[2], 0.1);
      doc.roundedRect(margin + 15, yPosition + 8, 25, 10, 5, 5, 'F');
      
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(priorityColor[0], priorityColor[1], priorityColor[2]);
      doc.text((rec.priority || 'medium').toUpperCase(), margin + 27, yPosition + 15, { align: 'center' });
      
      // Category
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 41, 59);
      doc.text(safeText(rec.category || 'General'), margin + 50, yPosition + 15);
      
      // Description
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      const description = safeText(rec.description || 'No description');
      const descLines = doc.splitTextToSize(description, contentWidth - 70);
      doc.text(descLines[0] || '', margin + 15, yPosition + 28);
      
      yPosition += 50;
    });
  }

  // Enhanced Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    
    // Footer background
    doc.setFillColor(248, 250, 252);
    doc.rect(0, pageHeight - 20, pageWidth, 20, 'F');
    
    // Footer line
    doc.setDrawColor(37, 99, 235);
    doc.setLineWidth(0.5);
    doc.line(0, pageHeight - 20, pageWidth, pageHeight - 20);
    
    // Footer content
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text('Lint - Professional Code Analysis Platform', margin, pageHeight - 12);
    
    doc.setTextColor(148, 163, 184);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, pageHeight - 12, { align: 'right' });
    
    // Branding
    doc.setFontSize(7);
    doc.setTextColor(37, 99, 235);
    doc.text('Powered by Walmart Innovation - Sparkathon', pageWidth / 2, pageHeight - 6, { align: 'center' });
  }

  return doc;
}