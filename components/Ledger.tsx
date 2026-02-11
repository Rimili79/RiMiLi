
import React, { useState } from 'react';
import { Account, Transaction, AccountType } from '../types';

interface LedgerProps {
  accounts: Account[];
  transactions: Transaction[];
}

const Ledger: React.FC<LedgerProps> = ({ accounts, transactions }) => {
  const [selectedAccountId, setSelectedAccountId] = useState<string>(accounts[0]?.id || '');

  const selectedAccount = accounts.find(a => a.id === selectedAccountId);
  
  const ledgerEntries = transactions
    .filter(t => t.debitAccountId === selectedAccountId || t.creditAccountId === selectedAccountId)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  let runningBalance = 0;

  const entriesWithBalance = ledgerEntries.map(t => {
    let debit = 0;
    let credit = 0;

    if (t.debitAccountId === selectedAccountId) debit = t.value;
    if (t.creditAccountId === selectedAccountId) credit = t.value;

    // Natureza das contas para cálculo do saldo
    if (selectedAccount?.type === AccountType.ATIVO || selectedAccount?.type === AccountType.DESPESA) {
      runningBalance += (debit - credit);
    } else {
      runningBalance += (credit - debit);
    }

    return { ...t, debit, credit, balance: runningBalance };
  });

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-bold text-slate-800">Razão Contábil (Livro Razão)</h2>
          <div className="w-full md:w-72">
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Selecionar Conta</label>
            <select 
              value={selectedAccountId} 
              onChange={e => setSelectedAccountId(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            >
              {accounts.map(a => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.type})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-black tracking-widest">
              <tr>
                <th className="py-4 px-4">Data</th>
                <th className="py-4 px-4">Histórico</th>
                <th className="py-4 px-4 text-right">Débito</th>
                <th className="py-4 px-4 text-right">Crédito</th>
                <th className="py-4 px-4 text-right">Saldo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {entriesWithBalance.map((entry, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-4 whitespace-nowrap">{new Date(entry.date).toLocaleDateString('pt-BR')}</td>
                  <td className="py-4 px-4 font-medium text-slate-700">{entry.history}</td>
                  <td className="py-4 px-4 text-right text-blue-600 font-semibold">
                    {entry.debit > 0 ? `R$ ${entry.debit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '-'}
                  </td>
                  <td className="py-4 px-4 text-right text-red-600 font-semibold">
                    {entry.credit > 0 ? `R$ ${entry.credit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '-'}
                  </td>
                  <td className={`py-4 px-4 text-right font-black ${entry.balance >= 0 ? 'text-blue-700' : 'text-red-700'}`}>
                    R$ {entry.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
              {entriesWithBalance.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-slate-400 italic">
                    Nenhuma movimentação registrada nesta conta.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase">Natureza da Conta</p>
          <p className="text-lg font-bold text-slate-800">{selectedAccount?.type}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase">Saldo Final</p>
          <p className={`text-lg font-bold ${runningBalance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
            R$ {runningBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase">Total de Lançamentos</p>
          <p className="text-lg font-bold text-slate-800">{entriesWithBalance.length}</p>
        </div>
      </div>
    </div>
  );
};

export default Ledger;
