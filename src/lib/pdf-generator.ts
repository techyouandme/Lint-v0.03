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
  const margin = 20;

  const lineSpacing = 7;
  const sectionSpacing = 15;

  // Draw horizontal line
  const drawSeparator = () => {
    doc.setDrawColor(220);
    doc.setLineWidth(0.2);
    doc.line(margin, yPosition, 190, yPosition);
    yPosition += 5;
  };

  const checkPageBreak = (height: number) => {
    if (yPosition + height > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
    }
  };

  // Title Section
  doc.setFontSize(24);
  doc.setTextColor(30, 64, 175);
  doc.setFont('helvetica', 'bold');
  doc.text('🧾 Tech Debt Analysis Report', margin, yPosition);
  yPosition += sectionSpacing;

  // Project Metadata
  doc.setFontSize(12);
  doc.setTextColor(80, 80, 80);
  doc.setFont('helvetica', 'normal');
  doc.text(`📁 Project: ${projectName}`, margin, yPosition);
  yPosition += lineSpacing;
  doc.text(`📅 Generated: ${new Date().toLocaleDateString()}`, margin, yPosition);
  yPosition += lineSpacing;
  doc.text(`👤 Analyst: ${userEmail}`, margin, yPosition);
  yPosition += sectionSpacing;
  drawSeparator();

  // Overall Score
  checkPageBreak(30);
  doc.setFontSize(16);
  doc.setTextColor(124, 58, 237);
  doc.setFont('helvetica', 'bold');
  doc.text('📊 Overall Tech Debt Score', margin, yPosition);
  yPosition += 10;

  const scoreColor = analysis.overall_debt_score > 70 ? [239, 68, 68] :
                     analysis.overall_debt_score > 40 ? [245, 158, 11] :
                     [34, 197, 94];
  doc.setFontSize(36);
  doc.setTextColor(...scoreColor);
  doc.setFont('helvetica', 'bold');
  doc.text(`${analysis.overall_debt_score}/100`, margin, yPosition);
  yPosition += sectionSpacing;
  drawSeparator();

  // Executive Summary
  checkPageBreak(40);
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.text('📝 Executive Summary', margin, yPosition);
  yPosition += 10;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  const summaryLines = doc.splitTextToSize(analysis.summary, 170);
  summaryLines.forEach((line: string) => {
    checkPageBreak(lineSpacing);
    doc.text(line, margin, yPosition);
    yPosition += lineSpacing;
  });
  yPosition += sectionSpacing;
  drawSeparator();

  // File Analysis
  if (analysis.file_analyses.length > 0) {
    checkPageBreak(20);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('📂 File Analysis', margin, yPosition);
    yPosition += 10;

    analysis.file_analyses.forEach((fileAnalysis, index) => {
      checkPageBreak(25);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 30, 30);
      doc.text(`${index + 1}. ${fileAnalysis.file_path}`, margin, yPosition);
      yPosition += lineSpacing;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(100, 100, 100);
      doc.text(`Debt Score: ${fileAnalysis.debt_score}/100`, margin + 10, yPosition);
      yPosition += lineSpacing;

      if (fileAnalysis.issues.length > 0) {
        fileAnalysis.issues.slice(0, 3).forEach((issue) => {
          checkPageBreak(15);

          const severityColor = issue.severity === 'high' ? [239, 68, 68] :
                                issue.severity === 'medium' ? [245, 158, 11] :
                                [156, 163, 175];
          doc.setTextColor(...severityColor);
          doc.setFont('helvetica', 'bold');
          doc.text(`• ${issue.type} (${issue.severity})`, margin + 15, yPosition);
          yPosition += 5;

          doc.setFont('helvetica', 'normal');
          doc.setTextColor(0, 0, 0);
          const descLines = doc.splitTextToSize(issue.description, 150);
          descLines.forEach((line: string) => {
            checkPageBreak(5);
            doc.text(line, margin + 20, yPosition);
            yPosition += 5;
          });
          yPosition += 5;
        });
      }
      yPosition += 5;
    });
    drawSeparator();
  }

  // Recommendations
  if (analysis.recommendations.length > 0) {
    checkPageBreak(20);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('✅ Recommendations', margin, yPosition);
    yPosition += 10;

    analysis.recommendations.forEach((rec, index) => {
      checkPageBreak(20);

      const priorityColor = rec.priority === 'high' ? [239, 68, 68] :
                            rec.priority === 'medium' ? [245, 158, 11] :
                            [34, 197, 94];
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...priorityColor);
      doc.text(`${index + 1}. ${rec.category} (${rec.priority} priority)`, margin, yPosition);
      yPosition += 8;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      const descLines = doc.splitTextToSize(rec.description, 160);
      descLines.forEach((line: string) => {
        checkPageBreak(5);
        doc.text(line, margin + 5, yPosition);
        yPosition += 5;
      });

      if (rec.impact) {
        yPosition += 2;
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(80, 80, 80);
        const impactLines = doc.splitTextToSize(`Impact: ${rec.impact}`, 160);
        impactLines.forEach((line: string) => {
          checkPageBreak(5);
          doc.text(line, margin + 5, yPosition);
          yPosition += 5;
        });
      }
      yPosition += sectionSpacing;
    });
    drawSeparator();
  }

  // Footer with Page Numbers
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(150, 150, 150);
    doc.text(`Generated by Lint • Page ${i} of ${pageCount}`, margin, pageHeight - 10);
  }

  return doc;
}
