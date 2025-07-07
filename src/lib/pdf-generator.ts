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
    if (yPosition + height > pageHeight - margin - 30) {
      doc.addPage();
      yPosition = 30;
      addWatermark();
    }
  };

  // Add watermark to each page
  const addWatermark = () => {
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(180, 180, 180);
    doc.text('TechDebt Analyzer - Professional Code Analysis', pageWidth / 2, pageHeight - 10, { align: 'center' });
  };

  // Add header with gradient effect simulation
  const addHeader = () => {
    // Header background
    doc.setFillColor(59, 130, 246); // Blue
    doc.rect(0, 0, pageWidth, 50, 'F');
    
    // Header gradient simulation
    doc.setFillColor(147, 51, 234); // Purple
    doc.rect(pageWidth * 0.6, 0, pageWidth * 0.4, 50, 'F');
    
    // Logo placeholder (using simple geometric shape)
    doc.setFillColor(255, 255, 255);
    doc.circle(margin + 12, 30, 10, 'F');
    doc.setFillColor(59, 130, 246);
    doc.circle(margin + 12, 30, 7, 'F');
    
    // Title
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('TechDebt Analyzer', margin + 30, 28);
    
    // Subtitle
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Professional Code Analysis Report', margin + 30, 38);
    
    yPosition = 65;
  };

  // Add section header with better spacing
  const addSectionHeader = (title: string, color: [number, number, number] = [59, 130, 246]) => {
    checkPageBreak(30);
    
    // Add some space before section
    yPosition += 10;
    
    // Section background
    doc.setFillColor(color[0], color[1], color[2], 0.08);
    doc.rect(margin, yPosition - 8, contentWidth, 20, 'F');
    
    // Section border
    doc.setDrawColor(color[0], color[1], color[2]);
    doc.setLineWidth(0.8);
    doc.line(margin, yPosition + 12, margin + contentWidth, yPosition + 12);
    
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(color[0], color[1], color[2]);
    doc.text(safeText(title), margin, yPosition + 5);
    yPosition += 35;
  };

  // Add info box with better spacing
  const addInfoBox = (label: string, value: string, color: [number, number, number] = [107, 114, 128]) => {
    checkPageBreak(20);
    
    doc.setFillColor(249, 250, 251);
    doc.rect(margin, yPosition, contentWidth, 16, 'F');
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.3);
    doc.rect(margin, yPosition, contentWidth, 16);
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(75, 85, 99);
    doc.text(safeText(label) + ':', margin + 8, yPosition + 10);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(color[0], color[1], color[2]);
    doc.text(safeText(value), margin + 60, yPosition + 10);
    yPosition += 22;
  };

  // Add score card with better proportions
  const addScoreCard = (score: number, title: string) => {
    checkPageBreak(50);
    
    const scoreColor = score > 70 ? [239, 68, 68] : // Red
                     score > 40 ? [245, 158, 11] : // Orange
                     [34, 197, 94]; // Green
    
    // Score card background
    doc.setFillColor(255, 255, 255);
    doc.rect(margin, yPosition, contentWidth, 45, 'F');
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.5);
    doc.rect(margin, yPosition, contentWidth, 45);
    
    // Score circle
    const circleX = margin + 30;
    const circleY = yPosition + 22;
    const radius = 15;
    
    doc.setFillColor(scoreColor[0], scoreColor[1], scoreColor[2], 0.1);
    doc.circle(circleX, circleY, radius, 'F');
    doc.setDrawColor(scoreColor[0], scoreColor[1], scoreColor[2]);
    doc.setLineWidth(2.5);
    doc.circle(circleX, circleY, radius);
    
    // Score text
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2]);
    doc.text(score.toString(), circleX, circleY + 3, { align: 'center' });
    
    // Title and description
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(31, 41, 55);
    doc.text(safeText(title), margin + 60, yPosition + 18);
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 114, 128);
    doc.text('Lower scores indicate better code quality', margin + 60, yPosition + 30);
    
    yPosition += 55;
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
  yPosition += 15;

  // Overall Score Section
  addSectionHeader('Overall Assessment', [147, 51, 234]);
  addScoreCard(analysis.overall_debt_score, 'Technical Debt Score');

  // Executive Summary
  if (analysis.summary) {
    addSectionHeader('Executive Summary', [16, 185, 129]);
    checkPageBreak(40);
    
    const cleanSummary = safeText(analysis.summary);
    const summaryLines = doc.splitTextToSize(cleanSummary, contentWidth - 30);
    const summaryHeight = summaryLines.length * 7 + 20;
    
    doc.setFillColor(249, 250, 251);
    doc.rect(margin, yPosition, contentWidth, summaryHeight, 'F');
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.3);
    doc.rect(margin, yPosition, contentWidth, summaryHeight);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(55, 65, 81);
    
    summaryLines.forEach((line: string, index: number) => {
      checkPageBreak(10);
      doc.text(safeText(line), margin + 15, yPosition + 15 + (index * 7));
    });
    
    yPosition += summaryHeight + 20;
  }

  // File Analysis Section
  if (analysis.file_analyses.length > 0) {
    addSectionHeader('Detailed File Analysis', [245, 158, 11]);
    
    analysis.file_analyses.slice(0, 10).forEach((fileAnalysis, index) => {
      checkPageBreak(50);
      
      // File header with better spacing
      doc.setFillColor(255, 255, 255);
      doc.rect(margin, yPosition, contentWidth, 30, 'F');
      doc.setDrawColor(229, 231, 235);
      doc.setLineWidth(0.4);
      doc.rect(margin, yPosition, contentWidth, 30);
      
      // File icon (simple rectangle)
      doc.setFillColor(59, 130, 246);
      doc.rect(margin + 8, yPosition + 10, 10, 12, 'F');
      doc.setFillColor(255, 255, 255);
      doc.rect(margin + 9, yPosition + 11, 8, 10, 'F');
      
      // File name with proper truncation
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(31, 41, 55);
      const fileName = fileAnalysis.file_path.length > 45 ? 
        '...' + fileAnalysis.file_path.slice(-42) : 
        fileAnalysis.file_path;
      doc.text(safeText(fileName), margin + 25, yPosition + 15);
      
      // File score with better positioning
      const fileScoreColor = fileAnalysis.debt_score > 70 ? [239, 68, 68] :
                            fileAnalysis.debt_score > 40 ? [245, 158, 11] :
                            [34, 197, 94];
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(fileScoreColor[0], fileScoreColor[1], fileScoreColor[2]);
      doc.text(`Score: ${fileAnalysis.debt_score}/100`, margin + 25, yPosition + 25);
      
      yPosition += 35;
      
      // Issues with better formatting
      if (fileAnalysis.issues && fileAnalysis.issues.length > 0) {
        fileAnalysis.issues.slice(0, 3).forEach((issue: any) => {
          checkPageBreak(35);
          
          const severityColor = issue.severity === 'high' ? [239, 68, 68] :
                               issue.severity === 'medium' ? [245, 158, 11] :
                               [156, 163, 175];
          
          // Issue container with padding
          yPosition += 5;
          
          // Issue indicator (colored circle)
          doc.setFillColor(severityColor[0], severityColor[1], severityColor[2]);
          doc.circle(margin + 20, yPosition + 8, 4, 'F');
          
          // Issue type and severity
          doc.setFontSize(11);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(severityColor[0], severityColor[1], severityColor[2]);
          const issueType = safeText(issue.type || 'Code Issue');
          const severity = safeText(issue.severity || 'medium');
          doc.text(`${issueType} (${severity})`, margin + 30, yPosition + 8);
          
          yPosition += 12;
          
          // Issue description with proper wrapping
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(75, 85, 99);
          const cleanDescription = safeText(issue.description || 'No description available');
          const descLines = doc.splitTextToSize(cleanDescription, contentWidth - 50);
          descLines.slice(0, 2).forEach((line: string, lineIndex: number) => {
            checkPageBreak(8);
            doc.text(safeText(line), margin + 30, yPosition + (lineIndex * 7));
          });
          
          yPosition += descLines.length * 7 + 5;
          
          // Suggestion with better formatting
          if (issue.suggestion) {
            checkPageBreak(12);
            doc.setFontSize(10);
            doc.setTextColor(59, 130, 246);
            doc.setFont('helvetica', 'bold');
            doc.text('💡 Suggestion: ', margin + 30, yPosition);
            
            doc.setFont('helvetica', 'normal');
            const cleanSuggestion = safeText(issue.suggestion);
            const suggestionLines = doc.splitTextToSize(cleanSuggestion, contentWidth - 70);
            suggestionLines.slice(0, 2).forEach((line: string, lineIndex: number) => {
              checkPageBreak(7);
              doc.text(safeText(line), margin + 30, yPosition + 8 + (lineIndex * 7));
            });
            
            yPosition += Math.min(suggestionLines.length, 2) * 7 + 8;
          }
          
          yPosition += 10;
        });
      }
      
      yPosition += 15;
    });
  }

  // Recommendations Section
  if (analysis.recommendations.length > 0) {
    addSectionHeader('Priority Recommendations', [34, 197, 94]);
    
    analysis.recommendations.forEach((rec: any, index: number) => {
      checkPageBreak(40);
      
      const priorityColor = rec.priority === 'high' ? [239, 68, 68] :
                           rec.priority === 'medium' ? [245, 158, 11] :
                           [34, 197, 94];
      
      // Recommendation card with better spacing
      const cardHeight = 35;
      doc.setFillColor(255, 255, 255);
      doc.rect(margin, yPosition, contentWidth, cardHeight, 'F');
      doc.setDrawColor(priorityColor[0], priorityColor[1], priorityColor[2]);
      doc.setLineWidth(0.6);
      doc.rect(margin, yPosition, contentWidth, cardHeight);
      
      // Priority indicator bar
      doc.setFillColor(priorityColor[0], priorityColor[1], priorityColor[2]);
      doc.rect(margin, yPosition, 6, cardHeight, 'F');
      
      // Priority indicator icon
      doc.setFillColor(priorityColor[0], priorityColor[1], priorityColor[2]);
      const triangleX = margin + 20;
      const triangleY = yPosition + 17;
      doc.triangle(triangleX, triangleY - 4, triangleX - 4, triangleY + 4, triangleX + 4, triangleY + 4, 'F');
      
      // Category and priority
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(31, 41, 55);
      const category = safeText(rec.category || 'General');
      doc.text(category, margin + 35, yPosition + 15);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(priorityColor[0], priorityColor[1], priorityColor[2]);
      const priority = safeText(rec.priority || 'medium').toUpperCase();
      doc.text(`${priority} PRIORITY`, margin + 35, yPosition + 25);
      
      yPosition += cardHeight + 8;
      
      // Description with proper spacing
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(75, 85, 99);
      const cleanDescription = safeText(rec.description || 'No description available');
      const descLines = doc.splitTextToSize(cleanDescription, contentWidth - 30);
      descLines.forEach((line: string, lineIndex: number) => {
        checkPageBreak(8);
        doc.text(safeText(line), margin + 15, yPosition + (lineIndex * 7));
      });
      yPosition += descLines.length * 7 + 8;
      
      // Impact with better formatting
      if (rec.impact) {
        checkPageBreak(15);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(107, 114, 128);
        doc.text('Impact: ', margin + 15, yPosition);
        
        doc.setFont('helvetica', 'normal');
        const cleanImpact = safeText(rec.impact);
        const impactLines = doc.splitTextToSize(cleanImpact, contentWidth - 50);
        impactLines.slice(0, 2).forEach((line: string, lineIndex: number) => {
          checkPageBreak(7);
          doc.text(safeText(line), margin + 40, yPosition + (lineIndex * 7));
        });
        yPosition += Math.min(impactLines.length, 2) * 7 + 5;
      }
      
      yPosition += 20;
    });
  }

  // Footer with branding
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    
    // Footer background
    doc.setFillColor(249, 250, 251);
    doc.rect(0, pageHeight - 30, pageWidth, 30, 'F');
    
    // Footer content with better spacing
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 114, 128);
    doc.text('Generated by TechDebt Analyzer | Professional Code Analysis Platform', 
             margin, pageHeight - 18);
    
    doc.setTextColor(156, 163, 175);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, pageHeight - 18, { align: 'right' });
    
    // Powered by with better positioning
    doc.setFontSize(8);
    doc.setTextColor(59, 130, 246);
    doc.text('Powered by Walmart Innovation - Sparkathon', 
             pageWidth / 2, pageHeight - 8, { align: 'center' });
  }

  return doc;
}