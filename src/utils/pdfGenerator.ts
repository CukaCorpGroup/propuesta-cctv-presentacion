import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Extend jsPDF type for autotable
declare module 'jspdf' {
  interface jsPDF {
    lastAutoTable: { finalY: number };
  }
}

export interface PDFData {
  title: string;
  subtitle: string;
  date: string;
  items: Array<{
    componente: string;
    descripcion?: string;
    cantidad: number;
    precioUnitario: number;
    total: number;
  }>;
  phasedItems: {
    fase1: any[];
    fase2: any[];
  };
  metrics: {
    reduccionCamaras: number;
    mejoraDiasGrabacion: number;
    resolucion: string;
    ia: string;
  };
  hardware: Array<{ title: string; tag: string; desc: string }>;
  ubicaciones: any[];
  businessImpact: Array<{ area: string; title: string; benefit: string; metrics: string }>;
  subtotal: number;
  notas: Array<{ titulo: string; contenido: string }>;
  empresa?: string;
}

const formatCurrency = (value: number): string => {
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const loadImage = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = reject;
    img.src = url;
  });
};

export const generateCCTVPDF = async (data: PDFData): Promise<void> => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let y = 0;

  // --- MODERN HEADER ---
  doc.setFillColor(15, 23, 42); // Slate-900
  doc.rect(0, 0, pageWidth, 60, 'F');
  
  try {
    const logoBase64 = await loadImage('/images/logo.png');
    doc.addImage(logoBase64, 'PNG', margin, 12, 35, 35);
  } catch (e) {
    console.warn("Logo not found for PDF", e);
  }

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('PROPUESTA TECNOLÓGICA', 65, 25);
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184); // Slate-400
  doc.text(data.title.toUpperCase(), 65, 35);
  
  doc.setFontSize(10);
  doc.text(`FECHA: ${data.date}`, pageWidth - margin - 40, 25);
  doc.text(`CLIENTE: GERENCIA GENERAL`, pageWidth - margin - 40, 32);

  y = 75;

  // --- KEY TRANSFORMATION METRICS ---
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Impacto de la Transformación Digital', margin, y);
  y += 10;

  const metricBoxWidth = (pageWidth - margin * 2 - 15) / 4;
  const metrics = [
    { label: 'EFICIENCIA', val: `-${data.metrics.reduccionCamaras}%`, sub: 'Cámaras' },
    { label: 'RESPALDO', val: `${data.metrics.mejoraDiasGrabacion}x`, sub: 'Días' },
    { label: 'CLARIDAD', val: data.metrics.resolucion, sub: 'Forense' },
    { label: 'VISIÓN', val: data.metrics.ia, sub: 'IA Predictiva' },
  ];

  metrics.forEach((m, i) => {
    const x = margin + i * (metricBoxWidth + 5);
    doc.setDrawColor(226, 232, 240); // Slate-200
    doc.setFillColor(248, 250, 252); // Slate-50
    doc.roundedRect(x, y, metricBoxWidth, 25, 2, 2, 'FD');
    
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(m.label, x + metricBoxWidth / 2, y + 6, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setTextColor(79, 70, 229); // Indigo-600
    doc.setFont('helvetica', 'bold');
    doc.text(m.val, x + metricBoxWidth / 2, y + 15, { align: 'center' });
    
    doc.setFontSize(6);
    doc.setTextColor(148, 163, 184);
    doc.text(m.sub, x + metricBoxWidth / 2, y + 21, { align: 'center' });
  });

  y += 40;

  // --- HARDWARE SHOWCASE ---
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Ecosistema de Hardware Seleccionado', margin, y);
  y += 8;

  data.hardware.forEach((hw, i) => {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text(`• ${hw.title}`, margin + 5, y);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 116, 139);
    doc.text(`(${hw.tag})`, margin + 60, y);
    doc.setFont('helvetica', 'normal');
    const descLines = doc.splitTextToSize(hw.desc, pageWidth - margin * 2 - 15);
    doc.text(descLines, margin + 10, y + 5);
    y += 5 + (descLines.length * 4) + 2;
  });

  y += 10;

  // --- PHASED INVESTMENT TABLES ---
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Plan de Inversión Estratégica', margin, y);
  y += 8;

  // FASE 1 TABLE
  autoTable(doc, {
    startY: y,
    head: [['FASE 1: SISTEMA BASE & INTELIGENCIA IA', '', '', 'SUBTOTAL']],
    body: data.phasedItems.fase1.map(item => [
      item.componente,
      (item.cantidad || 1).toString() + ' ud',
      formatCurrency(item.precioUnitario || 0),
      formatCurrency((item.cantidad || 1) * (item.precioUnitario || 0))
    ]),
    theme: 'grid',
    headStyles: { fillColor: [249, 115, 22], textColor: 255, fontStyle: 'bold', fontSize: 10 },
    styles: { fontSize: 8, cellPadding: 2 },
    columnStyles: { 0: { cellWidth: 'auto' }, 1: { cellWidth: 20, halign: 'center' }, 2: { cellWidth: 30, halign: 'right' }, 3: { cellWidth: 30, halign: 'right' } }
  });

  y = (doc as any).lastAutoTable.finalY + 10;

  // FASE 2 TABLE
  autoTable(doc, {
    startY: y,
    head: [['FASE 2: EXPANSIÓN & MÁXIMA RETENCIÓN', '', '', 'SUBTOTAL']],
    body: data.phasedItems.fase2.map(item => [
      item.componente,
      (item.cantidad || 1).toString() + ' ud',
      formatCurrency(item.precioUnitario || 0),
      formatCurrency((item.cantidad || 1) * (item.precioUnitario || 0))
    ]),
    theme: 'grid',
    headStyles: { fillColor: [16, 185, 129], textColor: 255, fontStyle: 'bold', fontSize: 10 },
    styles: { fontSize: 8, cellPadding: 2 },
    columnStyles: { 0: { cellWidth: 'auto' }, 1: { cellWidth: 20, halign: 'center' }, 2: { cellWidth: 30, halign: 'right' }, 3: { cellWidth: 30, halign: 'right' } }
  });

  // TOTAL BOX
  y = (doc as any).lastAutoTable.finalY + 15;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(79, 70, 229);
  doc.setLineWidth(0.5);
  doc.roundedRect(pageWidth - margin - 80, y, 80, 25, 2, 2, 'FD');
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  doc.text('INVERSIÓN TOTAL NETO:', pageWidth - margin - 75, y + 10);
  doc.setFontSize(16);
  doc.setTextColor(79, 70, 229);
  doc.text(formatCurrency(data.subtotal), pageWidth - margin - 75, y + 20);

  // --- NEW PAGE FOR BUSINESS IMPACT & LOCATIONS ---
  doc.addPage();
  y = 20;

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Impacto Directo por Área de Negocio', margin, y);
  y += 10;

  data.businessImpact.forEach((impact, i) => {
    doc.setDrawColor(241, 245, 249);
    doc.setFillColor(252, 253, 254);
    doc.roundedRect(margin, y, pageWidth - margin * 2, 22, 2, 2, 'FD');
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(79, 70, 229);
    doc.text(impact.area.toUpperCase(), margin + 5, y + 8);
    
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    doc.text(impact.title, margin + 45, y + 8);
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(impact.benefit, margin + 45, y + 14, { maxWidth: pageWidth - margin * 2 - 55 });
    
    y += 28;
  });

  y += 5;

  // --- LOCATIONS TABLE ---
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Mapa de Instalación y Cobertura', margin, y);
  y += 6;

  autoTable(doc, {
    startY: y,
    head: [['Ubicación', 'Cámaras', 'Propósito']],
    body: data.ubicaciones.map(u => [u.ubicacion, u.camarasIP, u.proposito]),
    theme: 'striped',
    headStyles: { fillColor: [51, 65, 85], textColor: 255 },
    styles: { fontSize: 8 }
  });

  y = (doc as any).lastAutoTable.finalY + 15;

  // --- TERMS & SIGNATURE ---
  if (y > 200) { doc.addPage(); y = 20; }
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Términos y Condiciones', margin, y);
  y += 8;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  data.notas.forEach((nota, index) => {
    const lines = doc.splitTextToSize(`${index + 1}. ${nota.titulo}: ${nota.contenido}`, pageWidth - margin * 2);
    doc.text(lines, margin, y);
    y += (lines.length * 4) + 2;
  });

  y += 15;
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, y + 20, margin + 70, y + 20);
  doc.line(pageWidth - margin - 70, y + 20, pageWidth - margin, y + 20);
  doc.setFontSize(9);
  doc.text('Aprobado por Cliente', margin, y + 28);
  doc.text('JEIVIAN Smart Security', pageWidth - margin - 70, y + 28);

  // Footer
  const totalPages = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`JEIVIAN Smart Security Solutions | Pág. ${i} de ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
    doc.text(`Propuesta CCTV 2026-v2`, margin, pageHeight - 10);
    doc.text(`www.jeivian.com`, pageWidth - margin - 25, pageHeight - 10);
  }

  const safeDate = new Date().toISOString().split('T')[0];
  const filename = `Propuesta_Premium_CCTV_JEIVIAN_${safeDate}.pdf`;
  const pdfBlob = doc.output('blob');
  const blobUrl = URL.createObjectURL(pdfBlob);
  const newWindow = window.open(blobUrl, '_blank');
  if (!newWindow) {
    const downloadLink = document.createElement('a');
    downloadLink.href = blobUrl;
    downloadLink.download = filename;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }
  setTimeout(() => URL.revokeObjectURL(blobUrl), 30000);
};

export const generateControlAccesoPDF = (data: PDFData): void => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let y = 20;

  // Header background - Cyan theme
  doc.setFillColor(14, 116, 144); // Cyan-700
  doc.rect(0, 0, pageWidth, 45, 'F');

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('PROPUESTA CONTROL DE ACCESO', margin, y + 10);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(data.subtitle || 'Sistema UniFi Access Profesional', margin, y + 20);
  
  doc.setFontSize(10);
  doc.text(`Fecha: ${data.date}`, pageWidth - margin - 50, y + 10);

  y = 55;

  // Reset text color
  doc.setTextColor(0, 0, 0);

  // Executive Summary Box
  doc.setFillColor(236, 254, 255); // Cyan-50
  doc.roundedRect(margin, y, pageWidth - margin * 2, 25, 3, 3, 'F');
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Resumen del Sistema', margin + 5, y + 8);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Sistema de control de acceso UniFi Access con lectores NFC/Bluetooth', margin + 5, y + 16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(6, 182, 212); // Cyan-500
  doc.text(`Inversión Total: ${formatCurrency(data.subtotal)}`, margin + 5, y + 22);
  doc.setTextColor(0, 0, 0);

  y += 35;

  // Products Table
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Detalle de Productos y Servicios', margin, y);
  y += 6;

  const tableData = data.items.map((item, index) => [
    (index + 1).toString(),
    item.componente,
    item.descripcion?.substring(0, 40) + (item.descripcion && item.descripcion.length > 40 ? '...' : '') || '',
    item.cantidad.toString(),
    formatCurrency(item.precioUnitario),
    formatCurrency(item.total)
  ]);

  autoTable(doc, {
    startY: y,
    head: [['#', 'Componente', 'Descripción', 'Cant.', 'P. Unit.', 'Total']],
    body: tableData,
    foot: [['', '', '', '', 'SUBTOTAL', formatCurrency(data.subtotal)]],
    theme: 'striped',
    headStyles: { 
      fillColor: [8, 145, 178], // Cyan-600
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 9
    },
    footStyles: {
      fillColor: [236, 254, 255],
      textColor: [17, 24, 39],
      fontStyle: 'bold',
      fontSize: 10
    },
    styles: { 
      fontSize: 8,
      cellPadding: 2
    },
    columnStyles: {
      0: { cellWidth: 8, halign: 'center' },
      1: { cellWidth: 35 },
      2: { cellWidth: 'auto' },
      3: { cellWidth: 15, halign: 'center' },
      4: { cellWidth: 22, halign: 'right' },
      5: { cellWidth: 25, halign: 'right' }
    },
    margin: { left: margin, right: margin }
  });

  y = doc.lastAutoTable.finalY + 15;

  // Kit Info Box
  if (y < 200) {
    doc.setFillColor(240, 253, 244); // Green-50
    doc.roundedRect(margin, y, pageWidth - margin * 2, 20, 3, 3, 'F');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(22, 163, 74); // Green-600
    doc.text('Cada Kit UA-G3-SK-Pro incluye:', margin + 5, y + 8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(8);
    doc.text('UA-Hub + UA-G3-Pro Reader + UA-G3 Reader + 2x Keyfobs + 10 Touch Pass (1 año gratis) + Fuente 12V', margin + 5, y + 15);
    y += 28;
  }

  // Check if we need a new page for notes
  if (y > 200) {
    doc.addPage();
    y = 20;
  }

  // Notes Section
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Términos y Condiciones', margin, y);
  y += 8;

  doc.setFontSize(9);
  data.notas.forEach((nota, index) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    doc.setFont('helvetica', 'bold');
    doc.text(`${index + 1}. ${nota.titulo}:`, margin, y);
    doc.setFont('helvetica', 'normal');
    
    const lines = doc.splitTextToSize(nota.contenido, pageWidth - margin * 2 - 5);
    doc.text(lines, margin + 5, y + 5);
    y += 5 + (lines.length * 4) + 3;
  });

  y += 10;

  // Signature Section
  if (y > 240) {
    doc.addPage();
    y = 20;
  }

  doc.setDrawColor(200, 200, 200);
  doc.line(margin, y + 20, margin + 70, y + 20);
  doc.line(pageWidth - margin - 70, y + 20, pageWidth - margin, y + 20);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Aprobado por:', margin, y + 28);
  doc.text('Proveedor:', pageWidth - margin - 70, y + 28);

  doc.text('Fecha: _______________', margin, y + 36);
  doc.text('JEIVIAN Security', pageWidth - margin - 70, y + 36);

  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 10;
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text('* Precios no incluyen IVA | Entrega inmediata', margin, footerY);
  doc.text(`Generado: ${new Date().toLocaleDateString('es-EC')}`, pageWidth - margin - 40, footerY);

  // Save the PDF - use multiple methods for maximum compatibility
  const safeDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const filename = `Propuesta_Control_Acceso_JEIVIAN_${safeDate}.pdf`;
  
  // Get PDF as blob and open in new window for reliable viewing/saving
  const pdfBlob = doc.output('blob');
  const blobUrl = URL.createObjectURL(pdfBlob);
  
  // Open PDF in new tab - user can then save from browser
  const newWindow = window.open(blobUrl, '_blank');
  
  // If popup blocked, fallback to direct download
  if (!newWindow) {
    const downloadLink = document.createElement('a');
    downloadLink.href = blobUrl;
    downloadLink.download = filename;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }
  
  // Clean up the blob URL after a delay
  setTimeout(() => URL.revokeObjectURL(blobUrl), 30000);
  
  console.log(`PDF generado: ${filename}`);
};
