import React from 'react';
import jsPDF from 'jspdf';
import { Download } from 'lucide-react';

const ExportToPDF = ({ data, type }) => {
  const exportToPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    let yPosition = margin;

    // Title
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text(`${type.charAt(0).toUpperCase() + type.slice(1)} Report`, margin, yPosition);
    yPosition += 15;

    // Subtitle
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, margin, yPosition);
    yPosition += 10;
    doc.text(`Total Records: ${data.length}`, margin, yPosition);
    yPosition += 20;

    // Table headers based on type
    const getHeaders = () => {
      switch (type) {
        case 'students':
          return ['ID', 'Name', 'Roll Number', 'Email', 'Semester', 'Department'];
        case 'teachers':
          return ['ID', 'Name', 'Email', 'Department', 'Subjects'];
        case 'courses':
          return ['ID', 'Name', 'Credits', 'Type', 'Department'];
        case 'rooms':
          return ['ID', 'Name', 'Capacity', 'Type', 'Amenities'];
        default:
          return ['ID', 'Name'];
      }
    };

    const getRowData = (item) => {
      switch (type) {
        case 'students':
          return [
            item.id,
            item.name,
            item.rollNumber,
            item.email,
            item.semester.toString(),
            item.department
          ];
        case 'teachers':
          return [
            item.id,
            item.name,
            item.email,
            item.department,
            Array.isArray(item.subjects) ? item.subjects.slice(0, 2).join(', ') : ''
          ];
        case 'courses':
          return [
            item.id,
            item.name,
            item.credits.toString(),
            item.type,
            item.department
          ];
        case 'rooms':
          return [
            item.id,
            item.name,
            item.capacity.toString(),
            item.type,
            Array.isArray(item.amenities) ? item.amenities.slice(0, 2).join(', ') : ''
          ];
        default:
          return [item.id, item.name];
      }
    };

    const headers = getHeaders();
    const columnWidth = (pageWidth - 2 * margin) / headers.length;

    // Draw table headers
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    headers.forEach((header, index) => {
      doc.text(header, margin + (index * columnWidth), yPosition);
    });
    yPosition += 5;

    // Draw header line
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;

    // Draw table rows
    doc.setFont(undefined, 'normal');
    data.forEach((item, index) => {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = margin;
      }

      const rowData = getRowData(item);
      rowData.forEach((cell, cellIndex) => {
        const text = cell.length > 15 ? cell.substring(0, 15) + '...' : cell;
        doc.text(text, margin + (cellIndex * columnWidth), yPosition);
      });
      yPosition += 8;
    });

    // Footer
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(
        `Page ${i} of ${totalPages} - AI Timetable Generator`,
        pageWidth - margin - 60,
        pageHeight - 10
      );
    }

    // Save the PDF
    doc.save(`${type}_report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <button
      onClick={exportToPDF}
      className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all"
    >
      <Download size={20} />
      <span>Export PDF</span>
    </button>
  );
};

export default ExportToPDF;
