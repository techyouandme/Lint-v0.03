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

  // Set default font to ensure proper encoding
  doc.setFont('helvetica', 'normal');

  // Helper function to safely encode text
  const safeText = (text: string): string => {
    if (!text) return '';
    // Replace problematic characters and ensure proper encoding
    return text
      .replace(/[^\x00-\x7F]/g, '') // Remove non-ASCII characters
      .replace(/[""]/g, '"') // Replace smart quotes
      .replace(/['']/g, "'") // Replace smart apostrophes
      .replace(/[–—]/g, '-') // Replace em/en dashes
      .replace(/…/g, '...') // Replace ellipsis
      .trim();
  };

  // Helper function to add new page if needed
  const checkPageBreak = (height: number) => {
    if (yPosition + height > pageHeight - margin - 20) {
      doc.addPage();
      yPosition = 20;
      addWatermark();
    }
  };

  // Add watermark to each page
  const addWatermark = () => {
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(200, 200, 200);
    doc.text('TechDebt Analyzer - Professional Code Analysis', pageWidth / 2, pageHeight - 10, { align: 'center' });
  };

  // Add header with gradient effect simulation
  const addHeader = () => {
    // Header background
    doc.setFillColor(59, 130, 246); // Blue
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    // Header gradient simulation
    doc.setFillColor(147, 51, 234); // Purple
    doc.rect(pageWidth * 0.7, 0, pageWidth * 0.3, 40, 'F');
    
    // Logo placeholder (using simple geometric shape)
    doc.setFillColor(255, 255, 255);
    doc.circle(margin + 10, 25, 8, 'F');
    doc.setFillColor(59, 130, 246);
    doc.circle(margin + 10, 25, 6, 'F');
    
    // Title
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('TechDebt Analyzer', margin + 25, 25);
    
    // Subtitle
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Professional Code Analysis Report', margin + 25, 32);
    
    yPosition = 50;
  };

  // Add section header
  const addSectionHeader = (title: string, color: [number, number, number] = [59, 130, 246]) => {
    checkPageBreak(20);
    
    // Section background
    doc.setFillColor(color[0], color[1], color[2], 0.1);
    doc.rect(margin, yPosition - 5, contentWidth, 15, 'F');
    
    // Section border
    doc.setDrawColor(color[0], color[1], color[2]);
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition + 10, margin + contentWidth, yPosition + 10);
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(color[0], color[1], color[2]);
    doc.text(safeText(title), margin, yPosition + 5);
    yPosition += 20;
  };

  // Add info box
  const addInfoBox = (label: string, value: string, color: [number, number, number] = [107, 114, 128]) => {
    doc.setFillColor(249, 250, 251);
    doc.rect(margin, yPosition, contentWidth, 12, 'F');
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.2);
    doc.rect(margin, yPosition, contentWidth, 12);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(75, 85, 99);
    doc.text(safeText(label) + ':', margin + 5, yPosition + 8);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(color[0], color[1], color[2]);
    doc.text(safeText(value), margin + 50, yPosition + 8);
    yPosition += 15;
  };

  // Add score card
  const addScoreCard = (score: number, title: string) => {
    checkPageBreak(40);
    
    const scoreColor = score > 70 ? [239, 68, 68] : // Red
                     score > 40 ? [245, 158, 11] : // Orange
                     [34, 197, 94]; // Green
    
    // Score card background
    doc.setFillColor(255, 255, 255);
    doc.rect(margin, yPosition, contentWidth, 35, 'F');
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.5);
    doc.rect(margin, yPosition, contentWidth, 35);
    
    // Score circle
    const circleX = margin + 25;
    const circleY = yPosition + 17;
    const radius = 12;
    
    doc.setFillColor(scoreColor[0], scoreColor[1], scoreColor[2], 0.1);
    doc.circle(circleX, circleY, radius, 'F');
    doc.setDrawColor(scoreColor[0], scoreColor[1], scoreColor[2]);
    doc.setLineWidth(2);
    doc.circle(circleX, circleY, radius);
    
    // Score text
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2]);
    doc.text(score.toString(), circleX, circleY + 2, { align: 'center' });
    
    // Title and description
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(31, 41, 55);
    doc.text(safeText(title), margin + 50, yPosition + 12);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 114, 128);
    doc.text('Lower scores indicate better code quality', margin + 50, yPosition + 22);
    
    yPosition += 45;
  };

  // Start document
  addHeader();
  addWatermark();

  // Project Information Section
  addSectionHeader('Project Information', [59, 130, 246]);
  addInfoBox('Project Name', safeText(projectName));
  addInfoBox('Generated On', new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }));
  addInfoBox('Generated For', safeText(userEmail));
  addInfoBox('Analysis Engine', 'Gemini 2.0 Flash AI');
  yPosition += 10;

  // Overall Score Section
  addSectionHeader('Overall Assessment', [147, 51, 234]);
  addScoreCard(analysis.overall_debt_score, 'Technical Debt Score');

  // Executive Summary
  if (analysis.summary) {
    addSectionHeader('Executive Summary', [16, 185, 129]);
    checkPageBreak(30);
    
    doc.setFillColor(249, 250, 251);
    const cleanSummary = safeText(analysis.summary);
    const summaryLines = doc.splitTextToSize(cleanSummary, contentWidth - 20);
    const summaryHeight = summaryLines.length * 6 + 10;
    
    doc.rect(margin, yPosition, contentWidth, summaryHeight, 'F');
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.2);
    doc.rect(margin, yPosition, contentWidth, summaryHeight);
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(55, 65, 81);
    
    summaryLines.forEach((line: string, index: number) => {
      checkPageBreak(8);
      doc.text(safeText(line), margin + 10, yPosition + 10 + (index * 6));
    });
    
    yPosition += summaryHeight + 15;
  }

  // File Analysis Section
  if (analysis.file_analyses.length > 0) {
    addSectionHeader('Detailed File Analysis', [245, 158, 11]);
    
    analysis.file_analyses.slice(0, 12).forEach((fileAnalysis, index) => {
      checkPageBreak(35);
      
      // File header
      doc.setFillColor(255, 255, 255);
      doc.rect(margin, yPosition, contentWidth, 25, 'F');
      doc.setDrawColor(229, 231, 235);
      doc.setLineWidth(0.3);
      doc.rect(margin, yPosition, contentWidth, 25);
      
      // File icon (simple rectangle)
      doc.setFillColor(59, 130, 246);
      doc.rect(margin + 5, yPosition + 8, 8, 10, 'F');
      doc.setFillColor(255, 255, 255);
      doc.rect(margin + 6, yPosition + 9, 6, 8, 'F');
      
      // File name
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(31, 41, 55);
      const fileName = fileAnalysis.file_path.length > 50 ? 
        '...' + fileAnalysis.file_path.slice(-47) : 
        fileAnalysis.file_path;
      doc.text(safeText(fileName), margin + 20, yPosition + 10);
      
      // File score
      const fileScoreColor = fileAnalysis.debt_score > 70 ? [239, 68, 68] :
                            fileAnalysis.debt_score > 40 ? [245, 158, 11] :
                            [34, 197, 94];
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(fileScoreColor[0], fileScoreColor[1], fileScoreColor[2]);
      doc.text(`Score: ${fileAnalysis.debt_score}/100`, margin + 20, yPosition + 20);
      
      yPosition += 30;
      
      // Issues
      if (fileAnalysis.issues && fileAnalysis.issues.length > 0) {
        fileAnalysis.issues.slice(0, 3).forEach((issue: any) => {
          checkPageBreak(20);
          
          const severityColor = issue.severity === 'high' ? [239, 68, 68] :
                               issue.severity === 'medium' ? [245, 158, 11] :
                               [156, 163, 175];
          
          // Issue indicator (colored circle)
          doc.setFillColor(severityColor[0], severityColor[1], severityColor[2]);
          doc.circle(margin + 15, yPosition + 5, 3, 'F');
          
          // Issue type and severity
          doc.setFontSize(10);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(severityColor[0], severityColor[1], severityColor[2]);
          const issueType = safeText(issue.type || 'Code Issue');
          const severity = safeText(issue.severity || 'medium');
          doc.text(`${issueType} (${severity})`, margin + 25, yPosition + 5);
          
          // Issue description
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(75, 85, 99);
          const cleanDescription = safeText(issue.description || 'No description available');
          const descLines = doc.splitTextToSize(cleanDescription, contentWidth - 35);
          descLines.slice(0, 2).forEach((line: string, lineIndex: number) => {
            checkPageBreak(6);
            doc.text(safeText(line), margin + 25, yPosition + 12 + (lineIndex * 6));
          });
          
          // Suggestion
          if (issue.suggestion) {
            yPosition += descLines.length * 6 + 8;
            checkPageBreak(8);
            doc.setFontSize(9);
            doc.setTextColor(59, 130, 246);
            doc.text('Suggestion: ', margin + 25, yPosition);
            const cleanSuggestion = safeText(issue.suggestion);
            const suggestionLines = doc.splitTextToSize(cleanSuggestion, contentWidth - 45);
            suggestionLines.slice(0, 1).forEach((line: string) => {
              doc.text(safeText(line), margin + 45, yPosition);
            });
          }
          
          yPosition += 15;
        });
      }
      
      yPosition += 10;
    });
  }

  // Recommendations Section
  if (analysis.recommendations.length > 0) {
    addSectionHeader('Priority Recommendations', [34, 197, 94]);
    
    analysis.recommendations.forEach((rec: any, index: number) => {
      checkPageBreak(30);
      
      const priorityColor = rec.priority === 'high' ? [239, 68, 68] :
                           rec.priority === 'medium' ? [245, 158, 11] :
                           [34, 197, 94];
      
      // Recommendation card
      doc.setFillColor(255, 255, 255);
      doc.rect(margin, yPosition, contentWidth, 25, 'F');
      doc.setDrawColor(priorityColor[0], priorityColor[1], priorityColor[2]);
      doc.setLineWidth(0.5);
      doc.rect(margin, yPosition, contentWidth, 25);
      
      // Priority indicator
      doc.setFillColor(priorityColor[0], priorityColor[1], priorityColor[2]);
      doc.rect(margin, yPosition, 5, 25, 'F');
      
      // Priority indicator (triangle)
      doc.setFillColor(priorityColor[0], priorityColor[1], priorityColor[2]);
      const triangleX = margin + 15;
      const triangleY = yPosition + 12;
      doc.triangle(triangleX, triangleY - 3, triangleX - 3, triangleY + 3, triangleX + 3, triangleY + 3, 'F');
      
      // Category and priority
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(31, 41, 55);
      const category = safeText(rec.category || 'General');
      doc.text(category, margin + 25, yPosition + 10);
      
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(priorityColor[0], priorityColor[1], priorityColor[2]);
      const priority = safeText(rec.priority || 'medium').toUpperCase();
      doc.text(`${priority} PRIORITY`, margin + 25, yPosition + 18);
      
      yPosition += 30;
      
      // Description
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(75, 85, 99);
      const cleanDescription = safeText(rec.description || 'No description available');
      const descLines = doc.splitTextToSize(cleanDescription, contentWidth - 20);
      descLines.forEach((line: string, lineIndex: number) => {
        checkPageBreak(6);
        doc.text(safeText(line), margin + 10, yPosition + (lineIndex * 6));
      });
      yPosition += descLines.length * 6 + 5;
      
      // Impact
      if (rec.impact) {
        checkPageBreak(10);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(107, 114, 128);
        doc.text('Impact: ', margin + 10, yPosition);
        doc.setFont('helvetica', 'normal');
        const cleanImpact = safeText(rec.impact);
        const impactLines = doc.splitTextToSize(cleanImpact, contentWidth - 35);
        impactLines.slice(0, 1).forEach((line: string) => {
          doc.text(safeText(line), margin + 30, yPosition);
        });
        yPosition += 8;
      }
      
      yPosition += 10;
    });
  }

  // Footer with branding
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    
    // Footer background
    doc.setFillColor(249, 250, 251);
    doc.rect(0, pageHeight - 25, pageWidth, 25, 'F');
    
    // Footer content
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 114, 128);
    doc.text('Generated by TechDebt Analyzer | Professional Code Analysis Platform', 
             margin, pageHeight - 15);
    
    doc.setTextColor(156, 163, 175);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, pageHeight - 15, { align: 'right' });
    
    // Powered by
    doc.setFontSize(7);
    doc.setTextColor(59, 130, 246);
    doc.text('Powered by Walmart Innovation - Sparkathon', 
             pageWidth / 2, pageHeight - 8, { align: 'center' });
  }

  return doc;
}