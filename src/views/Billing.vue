<template>
  <AppLayout>
    <div class="space-y-8">
      <header class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 class="text-4xl font-bold text-white tracking-tight font-headline uppercase">Billing & Invoices</h1>
          <p class="text-slate-400 text-sm mt-2 font-medium outfit">Manage your subscriptions, invoices, and payment methods.</p>
        </div>
        <div class="flex items-center gap-4">
          <button class="bg-surface-container-high border border-white/5 px-6 py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-300 hover:bg-[#2d3a4d] transition-all ubuntu flex items-center gap-2">
            <Download class="w-4 h-4 text-slate-400" /> Download All
          </button>
          <button class="bg-primary text-white px-6 py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:shadow-[0_0_30px_rgba(99,102,241,0.3)] transition-all hover:bg-[#5355e1] ubuntu flex items-center gap-2">
            <Plus class="w-4 h-4" /> Add Payment Method
          </button>
        </div>
      </header>

      <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-surface/60 border border-white/5 p-8 rounded-3xl flex flex-col gap-1 group relative overflow-hidden transition-all hover:border-primary/30 shadow-xl">
          <span class="text-[10px] uppercase tracking-widest text-primary font-bold ubuntu mb-2">Total Invoiced</span>
          <div class="flex items-end gap-3 mt-1">
            <span class="text-4xl font-bold text-white space-font tracking-tight">$12,450.00</span>
            <span class="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2 ubuntu">Lifetime</span>
          </div>
          <div class="mt-6 flex items-center gap-2 text-primary text-[10px] font-bold uppercase tracking-widest ubuntu bg-primary/10 self-start px-3 py-1.5 rounded-lg border border-primary/20">
            <TrendingUp class="w-3.5 h-3.5" />
            <span>+12% vs last year</span>
          </div>
        </div>
        <div class="bg-surface/60 border border-white/5 p-8 rounded-3xl flex flex-col gap-1 group relative overflow-hidden transition-all hover:border-amber-500/30 shadow-xl">
          <span class="text-[10px] uppercase tracking-widest text-amber-400 font-bold ubuntu mb-2">Pending Amount</span>
          <div class="flex items-end gap-3 mt-1">
            <span class="text-4xl font-bold text-white space-font tracking-tight">$1,240.00</span>
            <span class="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2 ubuntu">Due in 3 days</span>
          </div>
          <div class="mt-6 flex items-center gap-2 text-amber-400 text-[10px] font-bold uppercase tracking-widest ubuntu bg-amber-500/10 self-start px-3 py-1.5 rounded-lg border border-amber-500/20">
            <Clock class="w-3.5 h-3.5" />
            <span>Next payment Oct 27</span>
          </div>
        </div>
        <div class="bg-surface/60 border border-white/5 p-8 rounded-3xl flex flex-col gap-1 group relative overflow-hidden transition-all hover:border-emerald-500/30 shadow-xl">
          <span class="text-[10px] uppercase tracking-widest text-emerald-400 font-bold ubuntu mb-2">Paid This Month</span>
          <div class="flex items-end gap-3 mt-1">
            <span class="text-4xl font-bold text-white space-font tracking-tight">$4,950.00</span>
            <span class="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2 ubuntu">All current</span>
          </div>
          <div class="mt-6 flex items-center gap-2 text-emerald-400 text-[10px] font-bold uppercase tracking-widest ubuntu bg-emerald-500/10 self-start px-3 py-1.5 rounded-lg border border-emerald-500/20">
            <CheckCircle class="w-3.5 h-3.5" />
            <span>100% on time</span>
          </div>
        </div>
      </section>

      <section class="bg-surface/60 border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
        <div class="p-8 flex justify-between items-center bg-surface-container/50 border-b border-white/5">
          <div>
            <h3 class="text-xl font-bold text-white tracking-tight font-headline">Recent Invoices</h3>
            <p class="text-xs text-slate-500 mt-1 outfit">View and manage your payment history.</p>
          </div>
          <button class="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center">
            <Filter class="w-5 h-5" />
          </button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left min-w-[800px]">
            <thead>
              <tr class="bg-surface-container/30">
                <th class="px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-slate-500 ubuntu border-y border-white/5">Invoice #</th>
                <th class="px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-slate-500 ubuntu border-y border-white/5">Date Issued</th>
                <th class="px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-slate-500 ubuntu border-y border-white/5">Due Date</th>
                <th class="px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-slate-500 ubuntu border-y border-white/5">Amount</th>
                <th class="px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-slate-500 ubuntu border-y border-white/5">Status</th>
                <th class="px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-slate-500 ubuntu border-y border-white/5 text-right w-24">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              <tr v-for="invoice in invoices" :key="invoice.number" class="group hover:bg-primary/[0.02] transition-colors cursor-pointer">
                <td class="px-8 py-6">
                  <span class="text-sm font-bold text-white group-hover:text-primary transition-colors font-headline">{{ invoice.number }}</span>
                </td>
                <td class="px-8 py-6 text-[11px] font-bold tracking-widest uppercase text-slate-400 space-font">{{ invoice.issued }}</td>
                <td class="px-8 py-6 text-[11px] font-bold tracking-widest uppercase text-slate-400 space-font">{{ invoice.due }}</td>
                <td class="px-8 py-6 text-base font-bold text-white space-font tracking-tight">{{ invoice.amount }}</td>
                <td class="px-8 py-6">
                  <span :class="['inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border ubuntu', statusClass(invoice.status)]">
                    <span :class="['w-1.5 h-1.5 rounded-full', statusDotClass(invoice.status)]"></span>
                    {{ invoice.status }}
                  </span>
                </td>
                <td class="px-8 py-6 text-right">
                  <button class="w-8 h-8 rounded-lg bg-transparent hover:bg-white/10 text-slate-500 hover:text-white transition-all flex items-center justify-center ml-auto">
                    <MoreHorizontal class="w-5 h-5" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </AppLayout>
</template>

<script setup>
import AppLayout from '@/components/AppLayout.vue'
import { Download, Plus, TrendingUp, Clock, CheckCircle, Filter, MoreHorizontal } from 'lucide-vue-next'

const invoices = [
  { number: 'INV-2023-012', issued: 'Oct 24, 2023', due: 'Nov 07, 2023', amount: '$2,400.00', status: 'Paid' },
  { number: 'INV-2023-011', issued: 'Oct 20, 2023', due: 'Nov 03, 2023', amount: '$1,240.00', status: 'Pending' },
  { number: 'INV-2023-010', issued: 'Sep 15, 2023', due: 'Sep 29, 2023', amount: '$3,100.00', status: 'Overdue' }
]

function statusClass(status) {
  const classes = {
    Paid: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    Overdue: 'bg-red-500/10 text-red-400 border-red-500/20'
  }
  return classes[status] || ''
}

function statusDotClass(status) {
  const classes = {
    Paid: 'bg-emerald-500',
    Pending: 'bg-amber-500 animate-pulse',
    Overdue: 'bg-red-500'
  }
  return classes[status] || ''
}
</script>
