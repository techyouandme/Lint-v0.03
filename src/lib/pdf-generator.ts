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
    primary: [59, 130, 246], // Blue
    secondary: [147, 51, 234], // Purple
    accent: [16, 185, 129], // Emerald
    danger: [239, 68, 68], // Red
    warning: [245, 158, 11], // Amber
    success: [34, 197, 94], // Green
    text: [17, 24, 39], // Gray-900
    textLight: [107, 114, 128], // Gray-500
    background: [249, 250, 251], // Gray-50
    border: [229, 231, 235] // Gray-200
  };

  // Helper function to add new page if needed
  const checkPageBreak = (height: number) => {
    if (yPosition + height > pageHeight - margin) {
      doc.addPage();
      yPosition = 20;
      addWatermark();
    }
  };

  // Add watermark
  const addWatermark = () => {
    doc.setGState(new doc.GState({ opacity: 0.05 }));
    doc.setFontSize(60);
    doc.setTextColor(...colors.textLight);
    doc.text('LINT AI', pageWidth / 2, pageHeight / 2, { 
      align: 'center',
      angle: 45
    });
    doc.setGState(new doc.GState({ opacity: 1 }));
  };

  // Add header with branding
  const addHeader = () => {
    // Background gradient effect (simulated with rectangles)
    doc.setFillColor(...colors.background);
    doc.rect(0, 0, pageWidth, 60, 'F');
    
    // Brand section
    doc.setFillColor(...colors.primary);
    doc.roundedRect(margin, 15, 8, 8, 2, 2, 'F');
    
    doc.setFontSize(20);
    doc.setTextColor(...colors.primary);
    doc.setFont('helvetica', 'bold');
    doc.text('LINT AI', margin + 12, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(...colors.textLight);
    doc.setFont('helvetica', 'normal');
    doc.text('Professional Code Analysis Platform', margin + 12, 27);
    
    // Report info on the right
    doc.setFontSize(10);
    doc.setTextColor(...colors.text);
    doc.setFont('helvetica', 'bold');
    doc.text('ANALYSIS REPORT', pageWidth - margin, 18, { align: 'right' });
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...colors.textLight);
    doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })}`, pageWidth - margin, 23, { align: 'right' });
    doc.text(`Report ID: #${Date.now().toString().slice(-6)}`, pageWidth - margin, 28, { align: 'right' });
    
    // Separator line
    doc.setDrawColor(...colors.border);
    doc.setLineWidth(0.5);
    doc.line(margin, 35, pageWidth - margin, 35);
    
    yPosition = 50;
  };

  // Add footer
  const addFooter = (pageNum: number, totalPages: number) => {
    const footerY = pageHeight - 15;
    
    // Footer line
    doc.setDrawColor(...colors.border);
    doc.setLineWidth(0.5);
    doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);
    
    // Left side - branding
    doc.setFontSize(8);
    doc.setTextColor(...colors.textLight);
    doc.setFont('helvetica', 'normal');
    doc.text('Powered by Lint AI | Professional Code Analysis', margin, footerY);
    
    // Right side - page number
    doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth - margin, footerY, { align: 'right' });
    
    // Confidentiality notice
    doc.setFontSize(7);
    doc.setTextColor(...colors.textLight);
    doc.text('CONFIDENTIAL - This report contains proprietary analysis data', pageWidth / 2, footerY + 5, { align: 'center' });
  };

  // Start with header
  addHeader();
  addWatermark();

  // Title Section
  checkPageBreak(40);
  doc.setFontSize(28);
  doc.setTextColor(...colors.text);
  doc.setFont('helvetica', 'bold');
  doc.text('Technical Debt Analysis', margin, yPosition);
  yPosition += 12;

  doc.setFontSize(18);
  doc.setTextColor(...colors.primary);
  doc.text(projectName, margin, yPosition);
  yPosition += 20;

  // Executive Summary Box
  checkPageBreak(60);
  doc.setFillColor(248, 250, 252); // Blue-50
  doc.setDrawColor(...colors.primary);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, yPosition, contentWidth, 50, 3, 3, 'FD');
  
  doc.setFontSize(14);
  doc.setTextColor(...colors.text);
  doc.setFont('helvetica', 'bold');
  doc.text('Executive Summary', margin + 10, yPosition + 12);
  
  doc.setFontSize(10);
  doc.setTextColor(...colors.textLight);
  doc.setFont('helvetica', 'normal');
  doc.text(`Project: ${projectName}`, margin + 10, yPosition + 20);
  doc.text(`Analyzed by: Lint AI Engine v2.0`, margin + 10, yPosition + 26);
  doc.text(`For: ${userEmail}`, margin + 10, yPosition + 32);
  doc.text(`Analysis Date: ${new Date().toLocaleDateString()}`, margin + 10, yPosition + 38);
  
  yPosition += 65;

  // Overall Score Section with Visual Enhancement
  checkPageBreak(80);
  
  // Score card background
  const scoreColor = analysis.overall_debt_score > 70 ? colors.danger : 
                     analysis.overall_debt_score > 40 ? colors.warning : 
                     colors.success;
  
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(...scoreColor);
  doc.setLineWidth(2);
  doc.roundedRect(margin, yPosition, contentWidth, 70, 5, 5, 'FD');
  
  // Score circle (simulated)
  doc.setFillColor(...scoreColor);
  doc.circle(margin + 40, yPosition + 35, 25, 'F');
  
  doc.setFillColor(255, 255, 255);
  doc.circle(margin + 40, yPosition + 35, 20, 'F');
  
  // Score text
  doc.setFontSize(24);
  doc.setTextColor(...scoreColor);
  doc.setFont('helvetica', 'bold');
  doc.text(analysis.overall_debt_score.toString(), margin + 40, yPosition + 40, { align: 'center' });
  
  doc.setFontSize(8);
  doc.text('/100', margin + 40, yPosition + 47, { align: 'center' });
  
  // Score description
  doc.setFontSize(16);
  doc.setTextColor(...colors.text);
  doc.setFont('helvetica', 'bold');
  doc.text('Overall Technical Debt Score', margin + 80, yPosition + 25);
  
  doc.setFontSize(10);
  doc.setTextColor(...colors.textLight);
  doc.setFont('helvetica', 'normal');
  const scoreDescription = analysis.overall_debt_score > 70 ? 'High Risk - Immediate attention required' :
                          analysis.overall_debt_score > 40 ? 'Medium Risk - Improvement recommended' :
                          'Low Risk - Good code quality';
  doc.text(scoreDescription, margin + 80, yPosition + 35);
  
  // AI Analysis badge
  doc.setFillColor(...colors.secondary);
  doc.roundedRect(margin + 80, yPosition + 45, 60, 12, 2, 2, 'F');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('✨ AI POWERED ANALYSIS', margin + 110, yPosition + 52, { align: 'center' });
  
  yPosition += 85;

  // Summary Section
  if (analysis.summary) {
    checkPageBreak(50);
    
    doc.setFontSize(16);
    doc.setTextColor(...colors.text);
    doc.setFont('helvetica', 'bold');
    doc.text('📋 Analysis Summary', margin, yPosition);
    yPosition += 15;

    doc.setFillColor(249, 250, 251);
    doc.setDrawColor(...colors.border);
    doc.setLineWidth(0.5);
    doc.roundedRect(margin, yPosition, contentWidth, 40, 3, 3, 'FD');
    
    doc.setFontSize(10);
    doc.setTextColor(...colors.text);
    doc.setFont('helvetica', 'normal');
    const summaryLines = doc.splitTextToSize(analysis.summary, contentWidth - 20);
    let summaryY = yPosition + 10;
    summaryLines.forEach((line: string) => {
      if (summaryY > yPosition + 35) return; // Prevent overflow
      doc.text(line, margin + 10, summaryY);
      summaryY += 6;
    });
    yPosition += 55;
  }

  // Key Metrics Section
  checkPageBreak(60);
  doc.setFontSize(16);
  doc.setTextColor(...colors.text);
  doc.setFont('helvetica', 'bold');
  doc.text('📊 Key Metrics', margin, yPosition);
  yPosition += 15;

  const metrics = [
    { label: 'Files Analyzed', value: analysis.file_analyses?.length || 0, icon: '📁' },
    { label: 'Issues Found', value: analysis.file_analyses?.reduce((sum, file) => sum + (file.issues?.length || 0), 0) || 0, icon: '⚠️' },
    { label: 'High Priority', value: analysis.recommendations?.filter(r => r.priority === 'high').length || 0, icon: '🔴' },
    { label: 'Recommendations', value: analysis.recommendations?.length || 0, icon: '💡' }
  ];

  const metricWidth = contentWidth / 4;
  metrics.forEach((metric, index) => {
    const x = margin + (index * metricWidth);
    
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(...colors.border);
    doc.setLineWidth(0.5);
    doc.roundedRect(x, yPosition, metricWidth - 5, 35, 3, 3, 'FD');
    
    doc.setFontSize(12);
    doc.setTextColor(...colors.primary);
    doc.setFont('helvetica', 'bold');
    doc.text(metric.icon, x + 5, yPosition + 12);
    doc.text(metric.value.toString(), x + 15, yPosition + 12);
    
    doc.setFontSize(8);
    doc.setTextColor(...colors.textLight);
    doc.setFont('helvetica', 'normal');
    doc.text(metric.label, x + 5, yPosition + 20);
  });
  
  yPosition += 50;

  // File Analysis Section
  if (analysis.file_analyses && analysis.file_analyses.length > 0) {
    checkPageBreak(30);
    doc.setFontSize(16);
    doc.setTextColor(...colors.text);
    doc.setFont('helvetica', 'bold');
    doc.text('🔍 Detailed File Analysis', margin, yPosition);
    yPosition += 20;

    analysis.file_analyses.slice(0, 10).forEach((fileAnalysis, index) => {
      checkPageBreak(45);
      
      // File header
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(...colors.border);
      doc.setLineWidth(0.5);
      doc.roundedRect(margin, yPosition, contentWidth, 35, 3, 3, 'FD');
      
      doc.setFontSize(11);
      doc.setTextColor(...colors.text);
      doc.setFont('helvetica', 'bold');
      doc.text(`${index + 1}. ${fileAnalysis.file_path}`, margin + 8, yPosition + 10);
      
      // Score badge
      const fileScoreColor = fileAnalysis.debt_score > 70 ? colors.danger :
                            fileAnalysis.debt_score > 40 ? colors.warning :
                            colors.success;
      
      doc.setFillColor(...fileScoreColor);
      doc.roundedRect(pageWidth - margin - 35, yPosition + 5, 25, 10, 2, 2, 'F');
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.text(`${fileAnalysis.debt_score}/100`, pageWidth - margin - 22.5, yPosition + 11, { align: 'center' });
      
      doc.setFontSize(9);
      doc.setTextColor(...colors.textLight);
      doc.setFont('helvetica', 'normal');
      doc.text(`Debt Score: ${fileAnalysis.debt_score}/100 | Issues: ${fileAnalysis.issues?.length || 0}`, margin + 8, yPosition + 20);
      
      yPosition += 40;

      // Issues
      if (fileAnalysis.issues && fileAnalysis.issues.length > 0) {
        fileAnalysis.issues.slice(0, 3).forEach((issue) => {
          checkPageBreak(20);
          
          const severityColor = issue.severity === 'high' ? colors.danger :
                               issue.severity === 'medium' ? colors.warning :
                               colors.success;
          
          // Issue bullet
          doc.setFillColor(...severityColor);
          doc.circle(margin + 15, yPosition + 3, 2, 'F');
          
          doc.setFontSize(9);
          doc.setTextColor(...colors.text);
          doc.setFont('helvetica', 'bold');
          doc.text(`${issue.type} (${issue.severity.toUpperCase()})`, margin + 20, yPosition + 5);
          
          doc.setFontSize(8);
          doc.setTextColor(...colors.textLight);
          doc.setFont('helvetica', 'normal');
          const descLines = doc.splitTextToSize(issue.description, contentWidth - 30);
          let issueY = yPosition + 10;
          descLines.slice(0, 2).forEach((line: string) => {
            doc.text(line, margin + 20, issueY);
            issueY += 5;
          });
          
          if (issue.suggestion) {
            doc.setTextColor(...colors.primary);
            doc.text(`💡 ${issue.suggestion}`, margin + 20, issueY + 2);
          }
          
          yPosition += 18;
        });
      }
      yPosition += 10;
    });
  }

  // Recommendations Section
  if (analysis.recommendations && analysis.recommendations.length > 0) {
    checkPageBreak(30);
    doc.setFontSize(16);
    doc.setTextColor(...colors.text);
    doc.setFont('helvetica', 'bold');
    doc.text('🎯 Strategic Recommendations', margin, yPosition);
    yPosition += 20;

    analysis.recommendations.forEach((rec, index) => {
      checkPageBreak(35);
      
      const priorityColor = rec.priority === 'high' ? colors.danger :
                           rec.priority === 'medium' ? colors.warning :
                           colors.success;
      
      // Recommendation card
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(...priorityColor);
      doc.setLineWidth(1);
      doc.roundedRect(margin, yPosition, contentWidth, 30, 3, 3, 'FD');
      
      // Priority badge
      doc.setFillColor(...priorityColor);
      doc.roundedRect(margin + 5, yPosition + 5, 20, 8, 2, 2, 'F');
      doc.setFontSize(7);
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.text(rec.priority.toUpperCase(), margin + 15, yPosition + 10, { align: 'center' });
      
      doc.setFontSize(11);
      doc.setTextColor(...colors.text);
      doc.setFont('helvetica', 'bold');
      doc.text(`${index + 1}. ${rec.category}`, margin + 30, yPosition + 10);
      
      doc.setFontSize(9);
      doc.setTextColor(...colors.textLight);
      doc.setFont('helvetica', 'normal');
      const recLines = doc.splitTextToSize(rec.description, contentWidth - 40);
      let recY = yPosition + 16;
      recLines.slice(0, 2).forEach((line: string) => {
        doc.text(line, margin + 8, recY);
        recY += 5;
      });
      
      if (rec.impact) {
        doc.setTextColor(...colors.primary);
        doc.setFont('helvetica', 'italic');
        doc.text(`Impact: ${rec.impact}`, margin + 8, recY + 2);
      }
      
      yPosition += 40;
    });
  }

  // Add AI Analysis Footer
  checkPageBreak(40);
  doc.setFillColor(...colors.primary);
  doc.roundedRect(margin, yPosition, contentWidth, 30, 5, 5, 'F');
  
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('🤖 Analysis by Lint AI', margin + 10, yPosition + 12);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('This report was generated using advanced AI algorithms to analyze code quality,', margin + 10, yPosition + 18);
  doc.text('identify technical debt patterns, and provide actionable recommendations.', margin + 10, yPosition + 23);

  // Add footers to all pages
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    addFooter(i, pageCount);
  }

  return doc;
}