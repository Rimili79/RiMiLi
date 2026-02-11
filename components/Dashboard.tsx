
import React from 'react';
import { Transaction, Account, AccountType } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface DashboardProps {
  transactions: Transaction[];
  balances: Record<string, number>;
  accounts: Account[];
}

const Dashboard: React.FC<DashboardProps> = ({ transactions, balances, accounts }) => {
  const totalAssets = accounts
    .filter(a => a.type === AccountType.ATIVO)
    .reduce((sum, a) => sum + (balances[a.id] || 0), 0);

  const totalLiabilities = accounts
    .filter(a => a.type === AccountType.PASSIVO)
    .reduce((sum, a) => sum + (balances[a.id] || 0), 0);

  const totalIncome = accounts
    .filter(a => a.type === AccountType.RECEITA)
    .reduce((sum, a) => sum + (balances[a.id] || 0), 0);

  const totalExpenses = accounts
    .filter(a => a.type === AccountType.DESPESA)
    .reduce((sum, a) => sum + (balances[a.id] || 0), 0);

  const netEquity = totalAssets - totalLiabilities;
  const netResult = totalIncome - totalExpenses;

  // Data for charts
  const assetData = accounts
    .filter(a => a.type === AccountType.ATIVO && balances[a.id] > 0)
    .map(a => ({ name: a.name, value: balances[a.id] }));

  const expenseData = accounts
    .filter(a => a.type === AccountType.DESPESA && balances[a.id] > 0)
    .map(a => ({ name: a.name, value: balances[a.id] }));

  const COLORS = ['#2563eb', '#7c3aed', '#db2777', '#ea580c', '#16a34a', '#0891b2', '#4f46e5'];

  return (
    <div className="space-y-8">
      {/* Header Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Ativo Total" value={totalAssets} color="blue" subtitle="Posse e Direitos" />
        <StatCard title="Passivo Total" value={totalLiabilities} color="red" subtitle="Obrigações e Dívidas" />
        <StatCard title="Patrimônio Líquido" value={netEquity} color="indigo" subtitle="Riqueza Real" />
        <StatCard title="Resultado (DRE)" value={netResult} color={netResult >= 0 ? 'green' : 'red'} subtitle="Lucro ou Prejuízo" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Assets Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Composição de Ativos</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={assetData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {assetData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `R$ ${value.toLocaleString('pt-BR')}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expenses Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Maiores Despesas</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={expenseData.sort((a, b) => b.value - a.value).slice(0, 5)}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                <Tooltip formatter={(value: number) => `R$ ${value.toLocaleString('pt-BR')}`} cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="value" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent History in Dashboard */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Últimas Movimentações</h3>
        <div className="space-y-4">
          {transactions.slice(0, 5).map(t => (
            <div key={t.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-lg ${t.value > 0 ? 'bg-blue-50 text-blue-600' : 'bg-slate-100'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">{t.history}</p>
                  <p className="text-xs text-slate-400">{new Date(t.date).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-blue-600">R$ {t.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-tighter">Liquidado</p>
              </div>
            </div>
          ))}
          {transactions.length === 0 && <p className="text-center text-slate-400 py-4">Sem dados para exibir.</p>}
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: number;
  color: 'blue' | 'red' | 'indigo' | 'green';
  subtitle: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, color, subtitle }) => {
  const colorMap = {
    blue: 'border-blue-500 text-blue-600 bg-blue-50/50',
    red: 'border-red-500 text-red-600 bg-red-50/50',
    indigo: 'border-indigo-500 text-indigo-600 bg-indigo-50/50',
    green: 'border-green-500 text-green-600 bg-green-50/50',
  };

  return (
    <div className={`p-6 rounded-xl bg-white border-l-4 shadow-sm ${colorMap[color]}`}>
      <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">{title}</p>
      <p className="text-2xl font-black mb-1">
        R$ {value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
      </p>
      <p className="text-[10px] font-medium text-slate-400">{subtitle}</p>
    </div>
  );
};

export default Dashboard;
