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
    
    // Logo placeholder (using text)
    doc.setFontSize(20);
    doc.setTextColor(255, 255, 255);
    doc.text('🔍', margin, 25);
    
    // Title
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('TechDebt Analyzer', margin + 15, 25);
    
    // Subtitle
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Professional Code Analysis Report', margin + 15, 32);
    
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
    doc.text(title, margin, yPosition + 5);
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
    doc.text(label + ':', margin + 5, yPosition + 8);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(color[0], color[1], color[2]);
    doc.text(value, margin + 50, yPosition + 8);
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
    doc.text(title, margin + 50, yPosition + 12);
    
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
  addInfoBox('Project Name', projectName);
  addInfoBox('Generated On', new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }));
  addInfoBox('Generated For', userEmail);
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
    const summaryLines = doc.splitTextToSize(analysis.summary, contentWidth - 20);
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
      doc.text(line, margin + 10, yPosition + 10 + (index * 6));
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
      
      // File icon
      doc.setFontSize(12);
      doc.text('📄', margin + 5, yPosition + 12);
      
      // File name
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(31, 41, 55);
      const fileName = fileAnalysis.file_path.length > 50 ? 
        '...' + fileAnalysis.file_path.slice(-47) : 
        fileAnalysis.file_path;
      doc.text(fileName, margin + 20, yPosition + 10);
      
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
          
          // Issue icon
          const issueIcon = issue.severity === 'high' ? '🔴' :
                           issue.severity === 'medium' ? '🟡' : '🔵';
          
          doc.setFontSize(10);
          doc.text(issueIcon, margin + 10, yPosition + 5);
          
          // Issue type and severity
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(severityColor[0], severityColor[1], severityColor[2]);
          doc.text(`${issue.type} (${issue.severity})`, margin + 20, yPosition + 5);
          
          // Issue description
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(75, 85, 99);
          const descLines = doc.splitTextToSize(issue.description, contentWidth - 30);
          descLines.slice(0, 2).forEach((line: string, lineIndex: number) => {
            checkPageBreak(6);
            doc.text(line, margin + 20, yPosition + 12 + (lineIndex * 6));
          });
          
          // Suggestion
          if (issue.suggestion) {
            yPosition += descLines.length * 6 + 8;
            checkPageBreak(8);
            doc.setFontSize(9);
            doc.setTextColor(59, 130, 246);
            doc.text('💡 ', margin + 20, yPosition);
            const suggestionLines = doc.splitTextToSize(issue.suggestion, contentWidth - 35);
            suggestionLines.slice(0, 1).forEach((line: string) => {
              doc.text(line, margin + 30, yPosition);
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
      
      // Priority icon
      const priorityIcon = rec.priority === 'high' ? '⚠️' :
                          rec.priority === 'medium' ? '⚡' : '✅';
      
      doc.setFontSize(12);
      doc.text(priorityIcon, margin + 10, yPosition + 12);
      
      // Category and priority
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(31, 41, 55);
      doc.text(`${rec.category}`, margin + 25, yPosition + 10);
      
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(priorityColor[0], priorityColor[1], priorityColor[2]);
      doc.text(`${rec.priority.toUpperCase()} PRIORITY`, margin + 25, yPosition + 18);
      
      yPosition += 30;
      
      // Description
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(75, 85, 99);
      const descLines = doc.splitTextToSize(rec.description, contentWidth - 20);
      descLines.forEach((line: string, lineIndex: number) => {
        checkPageBreak(6);
        doc.text(line, margin + 10, yPosition + (lineIndex * 6));
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
        const impactLines = doc.splitTextToSize(rec.impact, contentWidth - 35);
        impactLines.slice(0, 1).forEach((line: string) => {
          doc.text(line, margin + 30, yPosition);
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
    doc.setTextColor(107, 114, 128);
    doc.text(`Generated by TechDebt Analyzer | Professional Code Analysis Platform`, 
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