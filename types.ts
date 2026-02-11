
export enum AccountType {
  ATIVO = 'Ativo',
  PASSIVO = 'Passivo',
  RECEITA = 'Receita',
  DESPESA = 'Despesa',
  PATRIMONIO_LIQUIDO = 'Patrimônio Líquido'
}

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  description?: string;
}

export interface Transaction {
  id: string;
  date: string;
  value: number;
  history: string;
  debitAccountId: string; // Onde o recurso entra (Ativo aumenta ou Despesa ocorre)
  creditAccountId: string; // De onde o recurso sai (Ativo diminui, Passivo aumenta ou Receita ocorre)
}

export interface ReportData {
  assets: { name: string; balance: number }[];
  liabilities: { name: string; balance: number }[];
  income: { name: string; balance: number }[];
  expenses: { name: string; balance: number }[];
  totalAssets: number;
  totalLiabilities: number;
  totalIncome: number;
  totalExpenses: number;
  netResult: number;
}
