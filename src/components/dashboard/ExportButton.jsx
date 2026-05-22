import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Download, FileText, Table, Loader2 } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { usePlanLimits } from '@/hooks/usePlanLimits';
import UpgradePrompt from './UpgradePrompt';

function exportCSV(data, filename) {
  if (!data || data.length === 0) return;
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(row =>
    Object.values(row).map(v => (typeof v === 'string' && v.includes(',') ? `"${v}"` : v)).join(',')
  );
  const csv = [headers, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function exportPDF(data, title, filename) {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.setTextColor(10, 37, 64);
  doc.text(title, 20, 20);
  doc.setFontSize(9);
  doc.setTextColor(66, 84, 102);
  doc.text(`Exported: ${new Date().toLocaleString()}`, 20, 28);

  if (!data || data.length === 0) {
    doc.text('No data available.', 20, 40);
    doc.save(filename);
    return;
  }

  const headers = Object.keys(data[0]);
  const colWidth = Math.min(180 / headers.length, 45);
  let y = 40;

  // Header row
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.setFillColor(99, 91, 255);
  doc.rect(15, y - 5, 180, 8, 'F');
  headers.forEach((h, i) => doc.text(String(h).toUpperCase(), 17 + i * colWidth, y));
  y += 8;

  // Data rows
  doc.setTextColor(10, 37, 64);
  data.forEach((row, ri) => {
    if (y > 270) { doc.addPage(); y = 20; }
    if (ri % 2 === 0) {
      doc.setFillColor(246, 249, 252);
      doc.rect(15, y - 5, 180, 8, 'F');
    }
    headers.forEach((h, i) => {
      const val = String(row[h] ?? '');
      doc.text(val.length > 20 ? val.slice(0, 18) + '…' : val, 17 + i * colWidth, y);
    });
    y += 8;
  });

  doc.save(filename);
}

export default function ExportButton({ data, title = 'Analytics Report', filename = 'export' }) {
  const { can, loading: planLoading } = usePlanLimits();
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleExport = async (format) => {
    if (!can('canExport')) {
      setShowUpgrade(true);
      return;
    }
    setExporting(true);
    // Small delay to show loading state
    await new Promise(r => setTimeout(r, 300));
    if (format === 'csv') {
      exportCSV(data, `${filename}.csv`);
    } else {
      exportPDF(data, title, `${filename}.pdf`);
    }
    setExporting(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            disabled={planLoading || exporting}
            className="flex items-center gap-2 text-[#425466] border-gray-200 hover:border-[#635BFF] hover:text-[#635BFF]"
          >
            {exporting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleExport('csv')} className="gap-2 cursor-pointer">
            <Table className="w-4 h-4 text-green-600" />
            Export as CSV
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExport('pdf')} className="gap-2 cursor-pointer">
            <FileText className="w-4 h-4 text-red-500" />
            Export as PDF
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <UpgradePrompt
        open={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        featureName="data exports"
        requiredPlan="Starter"
      />
    </>
  );
}