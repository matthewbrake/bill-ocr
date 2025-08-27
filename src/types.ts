export type AiProvider = 'gemini' | 'ollama';

export interface AiSettings {
    provider: AiProvider;
    geminiApiKey: string;
    ollamaUrl: string;
    ollamaModel: string;
}

export interface LineItem {
  description: string;
  amount: number;
}

export interface UsageByYear {
  year: string;
  value: number;
}

export interface UsageDataPoint {
  month: string;
  usage: UsageByYear[];
}

export interface UsageChartData {
  title: string;
  unit: string;
  data: UsageDataPoint[];
}

export interface BillData {
  id: string;
  analyzedAt: string;
  accountName?: string;
  accountNumber: string;
  serviceAddress?: string;
  statementDate?: string;
  servicePeriodStart?: string;
  servicePeriodEnd?: string;
  totalCurrentCharges: number;
  dueDate?: string;
  usageCharts: UsageChartData[];
  lineItems: LineItem[];
  confidenceScore?: number;
}
