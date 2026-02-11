
import React, { useState, useEffect, useMemo } from 'react';
import { Transaction, Account, AccountType } from './types';
import { INITIAL_CHART_OF_ACCOUNTS } from './constants';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import Reports from './components/Reports';
import Ledger from './components/Ledger';
import Layout from './components/Layout';

const App: React.FC = () => {
  const [accounts] = useState<Account[]>(INITIAL_CHART_OF_ACCOUNTS);
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('bp_transactions');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'transactions' | 'reports' | 'ledger'>('dashboard');

  useEffect(() => {
    localStorage.setItem('bp_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (t: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...t,
      id: Math.random().toString(36).substr(2, 9),
    };
    setTransactions([newTransaction, ...transactions]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const getAccountBalances = useMemo(() => {
    const balances: Record<string, number> = {};
    accounts.forEach(acc => {
      balances[acc.id] = 0;
    });

    transactions.forEach(t => {
      const debitAcc = accounts.find(a => a.id === t.debitAccountId);
      const creditAcc = accounts.find(a => a.id === t.creditAccountId);

      if (debitAcc) {
        // Débito aumenta Ativo e Despesa, diminui Passivo e Receita
        if (debitAcc.type === AccountType.ATIVO || debitAcc.type === AccountType.DESPESA) {
          balances[debitAcc.id] += t.value;
        } else {
          balances[debitAcc.id] -= t.value;
        }
      }

      if (creditAcc) {
        // Crédito aumenta Passivo e Receita, diminui Ativo e Despesa
        if (creditAcc.type === AccountType.PASSIVO || creditAcc.type === AccountType.RECEITA || creditAcc.type === AccountType.PATRIMONIO_LIQUIDO) {
          balances[creditAcc.id] += t.value;
        } else {
          balances[creditAcc.id] -= t.value;
        }
      }
    });

    return balances;
  }, [transactions, accounts]);

  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return <Dashboard transactions={transactions} balances={getAccountBalances} accounts={accounts} />;
      case 'transactions':
        return (
          <div className="space-y-6">
            <TransactionForm accounts={accounts} onAdd={addTransaction} />
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h2 className="text-xl font-semibold mb-4 text-slate-800">Lançamentos Recentes</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-500 text-sm font-medium">
                      <th className="py-3 px-4">Data</th>
                      <th className="py-3 px-4">Histórico</th>
                      <th className="py-3 px-4">Débito (Destino)</th>
                      <th className="py-3 px-4">Crédito (Origem)</th>
                      <th className="py-3 px-4 text-right">Valor</th>
                      <th className="py-3 px-4 text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {transactions.map(t => {
                      const dAcc = accounts.find(a => a.id === t.debitAccountId);
                      const cAcc = accounts.find(a => a.id === t.creditAccountId);
                      return (
                        <tr key={t.id} className="hover:bg-slate-50 transition-colors text-sm">
                          <td className="py-3 px-4">{new Date(t.date).toLocaleDateString('pt-BR')}</td>
                          <td className="py-3 px-4 font-medium text-slate-700">{t.history}</td>
                          <td className="py-3 px-4 text-slate-600">{dAcc?.name}</td>
                          <td className="py-3 px-4 text-slate-600">{cAcc?.name}</td>
                          <td className="py-3 px-4 text-right font-semibold text-blue-600">
                            R$ {t.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button 
                              onClick={() => deleteTransaction(t.id)}
                              className="text-red-500 hover:text-red-700 transition-colors p-1"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {transactions.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-10 text-center text-slate-400">Nenhum lançamento registrado.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case 'reports':
        return <Reports accounts={accounts} balances={getAccountBalances} />;
      case 'ledger':
        return <Ledger accounts={accounts} transactions={transactions} />;
      default:
        return null;
    }
  };

  return (
    <Layout currentTab={currentTab} setCurrentTab={setCurrentTab}>
      {renderContent()}
    </Layout>
  );
};

export default App;
