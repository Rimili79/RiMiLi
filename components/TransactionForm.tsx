
import React, { useState } from 'react';
import { Account, AccountType, Transaction } from '../types';

interface TransactionFormProps {
  accounts: Account[];
  onAdd: (t: Omit<Transaction, 'id'>) => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ accounts, onAdd }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [value, setValue] = useState('');
  const [history, setHistory] = useState('');
  const [debitAccountId, setDebitAccountId] = useState('');
  const [creditAccountId, setCreditAccountId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value || !history || !debitAccountId || !creditAccountId) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    onAdd({
      date,
      value: parseFloat(value),
      history,
      debitAccountId,
      creditAccountId
    });

    setValue('');
    setHistory('');
    setDebitAccountId('');
    setCreditAccountId('');
  };

  const getAccountsByType = (types: AccountType[]) => accounts.filter(a => types.includes(a.type));

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-800">Novo Lançamento Contábil</h2>
        <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded font-semibold">PARTIDA DOBRADA</span>
      </div>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">Data</label>
          <input 
            type="date" 
            value={date} 
            onChange={e => setDate(e.target.value)}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">Valor (R$)</label>
          <input 
            type="number" 
            step="0.01" 
            placeholder="0,00"
            value={value} 
            onChange={e => setValue(e.target.value)}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
          />
        </div>

        <div className="space-y-2 lg:col-span-3">
          <label className="block text-sm font-semibold text-slate-700">Histórico / Descrição</label>
          <input 
            type="text" 
            placeholder="Ex: Pagamento de Aluguel via Pix"
            value={history} 
            onChange={e => setHistory(e.target.value)}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
          />
        </div>

        <div className="space-y-2 md:col-span-2 lg:col-span-2">
          <label className="block text-sm font-semibold text-blue-700">Débito (Destino do Valor)</label>
          <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Aumenta Ativos ou Despesas</p>
          <select 
            value={debitAccountId} 
            onChange={e => setDebitAccountId(e.target.value)}
            className="w-full p-2.5 bg-blue-50 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          >
            <option value="">Selecione a conta...</option>
            <optgroup label="Ativos (Onde o dinheiro entrou)">
              {getAccountsByType([AccountType.ATIVO]).map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </optgroup>
            <optgroup label="Despesas (Onde o dinheiro foi gasto)">
              {getAccountsByType([AccountType.DESPESA]).map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </optgroup>
          </select>
        </div>

        <div className="space-y-2 md:col-span-2 lg:col-span-2">
          <label className="block text-sm font-semibold text-red-700">Crédito (Origem do Valor)</label>
          <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Aumenta Receitas/Passivos ou Diminui Ativos</p>
          <select 
            value={creditAccountId} 
            onChange={e => setCreditAccountId(e.target.value)}
            className="w-full p-2.5 bg-red-50 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition-all"
          >
            <option value="">Selecione a conta...</option>
            <optgroup label="Receitas (Origem: Ganhos)">
              {getAccountsByType([AccountType.RECEITA]).map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </optgroup>
            <optgroup label="Passivos (Origem: Dívidas)">
              {getAccountsByType([AccountType.PASSIVO]).map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </optgroup>
            <optgroup label="Ativos (Origem: De onde o dinheiro saiu)">
              {getAccountsByType([AccountType.ATIVO]).map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </optgroup>
            <optgroup label="Capital Social">
              {getAccountsByType([AccountType.PATRIMONIO_LIQUIDO]).map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </optgroup>
          </select>
        </div>

        <div className="flex items-end">
          <button 
            type="submit"
            className="w-full bg-slate-900 text-white font-bold py-2.5 rounded-lg hover:bg-slate-800 transform active:scale-95 transition-all shadow-md shadow-slate-300"
          >
            Registrar
          </button>
        </div>
      </form>
      <div className="mt-4 flex gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Débito = Aplicação</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> Crédito = Origem</span>
      </div>
    </div>
  );
};

export default TransactionForm;
