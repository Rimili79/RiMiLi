
import { Account, AccountType } from './types';

export const INITIAL_CHART_OF_ACCOUNTS: Account[] = [
  // ATIVOS
  { id: 'a1', name: 'Dinheiro em Espécie', type: AccountType.ATIVO },
  { id: 'a2', name: 'Banco Conta Corrente', type: AccountType.ATIVO },
  { id: 'a3', name: 'Investimentos / Poupança', type: AccountType.ATIVO },
  { id: 'a4', name: 'Veículos', type: AccountType.ATIVO },
  { id: 'a5', name: 'Imóveis', type: AccountType.ATIVO },
  
  // PASSIVOS
  { id: 'p1', name: 'Cartão de Crédito', type: AccountType.PASSIVO },
  { id: 'p2', name: 'Empréstimos Bancários', type: AccountType.PASSIVO },
  { id: 'p3', name: 'Financiamento Imobiliário', type: AccountType.PASSIVO },
  { id: 'p4', name: 'Financiamento de Veículo', type: AccountType.PASSIVO },
  { id: 'p5', name: 'Dívidas com Terceiros', type: AccountType.PASSIVO },

  // RECEITAS
  { id: 'r1', name: 'Salário / Proventos', type: AccountType.RECEITA },
  { id: 'r2', name: 'Dividendos / Juros', type: AccountType.RECEITA },
  { id: 'r3', name: 'Aluguéis Recebidos', type: AccountType.RECEITA },
  { id: 'r4', name: 'Vendas de Ativos', type: AccountType.RECEITA },
  { id: 'r5', name: 'Outras Receitas', type: AccountType.RECEITA },

  // DESPESAS
  { id: 'd1', name: 'Alimentação / Supermercado', type: AccountType.DESPESA },
  { id: 'd2', name: 'Moradia (Aluguel/Condomínio)', type: AccountType.DESPESA },
  { id: 'd3', name: 'Contas Fixas (Luz/Água/Internet)', type: AccountType.DESPESA },
  { id: 'd4', name: 'Transporte (Combustível/Uber)', type: AccountType.DESPESA },
  { id: 'd5', name: 'Saúde (Farmácia/Plano)', type: AccountType.DESPESA },
  { id: 'd6', name: 'Educação (Cursos/Mensalidade)', type: AccountType.DESPESA },
  { id: 'd7', name: 'Lazer e Viagens', type: AccountType.DESPESA },
  { id: 'd8', name: 'Impostos e Taxas', type: AccountType.DESPESA },
  { id: 'd9', name: 'Manutenção Geral', type: AccountType.DESPESA },
  { id: 'd10', name: 'Outras Despesas', type: AccountType.DESPESA },
  
  // PATRIMÔNIO LÍQUIDO (Para balanço)
  { id: 'pl1', name: 'Patrimônio Inicial / Capital', type: AccountType.PATRIMONIO_LIQUIDO }
];
