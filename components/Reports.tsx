
import React from 'react';
import { Account, AccountType } from '../types';

interface ReportsProps {
  accounts: Account[];
  balances: Record<string, number>;
}

const Reports: React.FC<ReportsProps> = ({ accounts, balances }) => {
  const assets = accounts.filter(a => a.type === AccountType.ATIVO);
  const liabilities = accounts.filter(a => a.type === AccountType.PASSIVO);
  const income = accounts.filter(a => a.type === AccountType.RECEITA);
  const expenses = accounts.filter(a => a.type === AccountType.DESPESA);
  const equity = accounts.filter(a => a.type === AccountType.PATRIMONIO_LIQUIDO);

  const totalAssets = assets.reduce((sum, a) => sum + (balances[a.id] || 0), 0);
  const totalLiabilities = liabilities.reduce((sum, a) => sum + (balances[a.id] || 0), 0);
  const totalIncome = income.reduce((sum, a) => sum + (balances[a.id] || 0), 0);
  const totalExpenses = expenses.reduce((sum, a) => sum + (balances[a.id] || 0), 0);
  const totalEquity = equity.reduce((sum, a) => sum + (balances[a.id] || 0), 0);
  
  const netResult = totalIncome - totalExpenses;
  const netWorth = totalAssets - totalLiabilities;

  return (
    <div className="space-y-10">
      {/* Balanço Patrimonial */}
      <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
        <div className="bg-slate-900 p-6 text-white">
          <h2 className="text-xl font-bold">Balanço Patrimonial</h2>
          <p className="text-slate-400 text-xs">Posição atual consolidada</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* LADO DO ATIVO */}
          <div className="p-6 border-r border-slate-100">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Ativos (Bens e Direitos)</h3>
            <div className="space-y-3">
              {assets.map(a => (
                <div key={a.id} className="flex justify-between text-sm">
                  <span className="text-slate-600">{a.name}</span>
                  <span className="font-semibold text-blue-600">R$ {(balances[a.id] || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-4 border-t-2 border-slate-900 flex justify-between font-black text-slate-900">
              <span>TOTAL DO ATIVO</span>
              <span>R$ {totalAssets.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>

          {/* LADO DO PASSIVO E PL */}
          <div className="p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Passivos (Obrigações)</h3>
              <div className="space-y-3">
                {liabilities.map(a => (
                  <div key={a.id} className="flex justify-between text-sm">
                    <span className="text-slate-600">{a.name}</span>
                    <span className="font-semibold text-red-600">R$ {(balances[a.id] || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                ))}
              </div>

              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mt-8 mb-4">Patrimônio Líquido</h3>
              <div className="space-y-3">
                {equity.map(a => (
                  <div key={a.id} className="flex justify-between text-sm">
                    <span className="text-slate-600">{a.name}</span>
                    <span className="font-semibold text-slate-800">R$ {(balances[a.id] || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm italic">
                  <span className="text-slate-600">Lucros/Prejuízos Acumulados</span>
                  <span className={`font-semibold ${netResult >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                    R$ {netResult.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t-2 border-slate-900 flex justify-between font-black text-slate-900">
              <span>TOTAL DO PASSIVO + PL</span>
              <span>R$ {(totalLiabilities + totalEquity + netResult).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>
        <div className="bg-slate-50 p-4 text-center text-[10px] text-slate-400 font-medium">
          * Ativo deve ser igual a Passivo + Patrimônio Líquido.
        </div>
      </div>

      {/* DRE - Demonstração do Resultado do Exercício */}
      <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
        <div className="bg-indigo-900 p-6 text-white">
          <h2 className="text-xl font-bold">DRE - Demonstração de Resultado</h2>
          <p className="text-indigo-300 text-xs">Fluxo de Receitas e Despesas acumulado</p>
        </div>

        <div className="p-8 max-w-3xl mx-auto space-y-6">
          <section>
            <h3 className="text-xs font-black text-slate-400 uppercase mb-4 tracking-wider">Receitas Operacionais</h3>
            <div className="space-y-2">
              {income.map(a => (
                <div key={a.id} className="flex justify-between text-sm">
                  <span>(+) {a.name}</span>
                  <span className="font-semibold text-blue-600">R$ {(balances[a.id] || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
              ))}
            </div>
            <div className="mt-2 pt-2 border-t border-slate-100 flex justify-between text-sm font-bold text-slate-800">
              <span>RECEITA BRUTA TOTAL</span>
              <span>R$ {totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
          </section>

          <section>
            <h3 className="text-xs font-black text-slate-400 uppercase mb-4 tracking-wider">Despesas Operacionais</h3>
            <div className="space-y-2">
              {expenses.map(a => (
                <div key={a.id} className="flex justify-between text-sm">
                  <span className="text-slate-600">(-) {a.name}</span>
                  <span className="font-semibold text-red-600">R$ {(balances[a.id] || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
              ))}
            </div>
            <div className="mt-2 pt-2 border-t border-slate-100 flex justify-between text-sm font-bold text-slate-800">
              <span>DESPESA BRUTA TOTAL</span>
              <span>R$ {totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
          </section>

          <section className="pt-6 border-t-4 border-slate-100">
            <div className={`flex justify-between items-center p-4 rounded-lg ${netResult >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
              <div>
                <p className="text-xs font-black text-slate-500 uppercase">Resultado Líquido do Período</p>
                <p className={`text-3xl font-black ${netResult >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                  R$ {netResult.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className={`text-xs font-bold px-3 py-1 rounded-full ${netResult >= 0 ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                {netResult >= 0 ? 'SUPERÁVIT' : 'DÉFICIT'}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Reports;
