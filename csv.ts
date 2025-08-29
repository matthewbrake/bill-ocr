import type { BillData } from './types';

// Helper to escape CSV fields to handle commas, quotes, and newlines
const escapeCsvField = (field: string | number | undefined | null): string => {
    if (field === null || field === undefined) {
        return '""';
    }
    const stringField = String(field);
    // If the field contains a comma, double quote, or newline, wrap it in double quotes
    // and escape any existing double quotes by doubling them.
    if (/[",\n]/.test(stringField)) {
        return `"${stringField.replace(/"/g, '""')}"`;
    }
    return `"${stringField}"`;
};

export const exportBillToCsv = (billData: BillData) => {
    const rows: string[][] = [];

    // Header for bill details
    rows.push(['Category', 'Field', 'Value']);

    // Bill Details section
    rows.push(['Bill Details', 'Account Name', billData.accountName || '']);
    rows.push(['Bill Details', 'Account Number', billData.accountNumber]);
    rows.push(['Bill Details', 'Service Address', billData.serviceAddress || '']);
    rows.push(['Bill Details', 'Statement Date', billData.statementDate || '']);
    rows.push(['Bill Details', 'Due Date', billData.dueDate || '']);
    rows.push(['Bill Details', 'Total Current Charges', String(billData.totalCurrentCharges)]);
    rows.push(['Bill Details', 'Confidence Score', String(billData.confidenceScore || 'N/A')]);
    rows.push([]); // Spacer row

    // Line Items section
    if (billData.lineItems && billData.lineItems.length > 0) {
        rows.push(['Line Items', 'Description', 'Amount']);
        billData.lineItems.forEach(item => {
            rows.push(['Line Items', item.description, String(item.amount)]);
        });
        rows.push([]); // Spacer row
    }

    // Usage Charts section
    if (billData.usageCharts && billData.usageCharts.length > 0) {
        rows.push(['Usage Data', 'Chart Title', 'Unit', 'Month', 'Year', 'Usage']);
        billData.usageCharts.forEach(chart => {
            chart.data.forEach(dataPoint => {
                dataPoint.usage.forEach(usageEntry => {
                    rows.push([
                        'Usage Data',
                        chart.title,
                        chart.unit,
                        dataPoint.month,
                        usageEntry.year,
                        String(usageEntry.value)
                    ]);
                });
            });
        });
    }
    
    // Use the escape helper for all fields before joining
    const csvContent = rows.map(row => row.map(escapeCsvField).join(",")).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    
    const fileName = `bill-analysis-${billData.accountNumber}-${billData.statementDate || new Date().toISOString().split('T')[0]}.csv`;
    link.setAttribute("download", fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    
    link.click();
    
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};
