import type { AuthSession, DashboardData, Transaction, TransferInput } from '../types'

const wait = (ms = 320) => new Promise((resolve) => window.setTimeout(resolve, ms))
const dateDaysAgo = (days: number) => {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date.toISOString()
}

const initialTransactions: Transaction[] = [
  { id: 'txn-1', name: 'Whole Foods Market', detail: '•••• 4829 · Grocery', category: 'Shopping', date: dateDaysAgo(0), amount: -86.42, kind: 'expense', status: 'Completed', initials: 'W', color: 'peach' },
  { id: 'txn-2', name: 'Acme Studio', detail: 'Monthly salary · Direct deposit', category: 'Income', date: dateDaysAgo(0), amount: 4250, kind: 'income', status: 'Completed', initials: 'A', color: 'blue' },
  { id: 'txn-3', name: 'Blue Bottle Coffee', detail: '•••• 4829 · Food & drink', category: 'Food & drink', date: dateDaysAgo(1), amount: -12.8, kind: 'expense', status: 'Completed', initials: 'B', color: 'brown' },
  { id: 'txn-4', name: 'Monthly rent', detail: 'Scheduled payment · First Bank', category: 'Housing', date: dateDaysAgo(2), amount: -1850, kind: 'expense', status: 'Completed', initials: '⌂', color: 'lavender' },
  { id: 'txn-5', name: 'Spotify Premium', detail: '•••• 4829 · Subscription', category: 'Subscriptions', date: dateDaysAgo(3), amount: -10.99, kind: 'expense', status: 'Completed', initials: 'S', color: 'green' },
  { id: 'txn-6', name: 'Olive Garden', detail: '•••• 4829 · Food & drink', category: 'Food & drink', date: dateDaysAgo(4), amount: -48.65, kind: 'expense', status: 'Completed', initials: 'O', color: 'olive' },
  { id: 'txn-7', name: 'Freelance project', detail: 'Northstar Creative · ACH', category: 'Income', date: dateDaysAgo(5), amount: 780, kind: 'income', status: 'Completed', initials: 'N', color: 'mint' },
  { id: 'txn-8', name: 'Uber trip', detail: '•••• 4829 · Transportation', category: 'Transport', date: dateDaysAgo(6), amount: -24.5, kind: 'expense', status: 'Completed', initials: 'U', color: 'dark' },
  { id: 'txn-9', name: 'Target', detail: '•••• 4829 · Shopping', category: 'Shopping', date: dateDaysAgo(7), amount: -64.12, kind: 'expense', status: 'Completed', initials: 'T', color: 'red' },
  { id: 'txn-10', name: 'Netflix', detail: '•••• 4829 · Subscription', category: 'Subscriptions', date: dateDaysAgo(9), amount: -15.49, kind: 'expense', status: 'Completed', initials: 'N', color: 'red' },
  { id: 'txn-11', name: 'Transfer from savings', detail: 'Internal transfer · Savings', category: 'Transfer', date: dateDaysAgo(11), amount: 250, kind: 'transfer', status: 'Completed', initials: '↔', color: 'mint' },
  { id: 'txn-12', name: 'Trader Joe’s', detail: '•••• 4829 · Grocery', category: 'Shopping', date: dateDaysAgo(13), amount: -72.31, kind: 'expense', status: 'Completed', initials: 'T', color: 'peach' },
  { id: 'txn-13', name: 'Electricity bill', detail: 'Autopay · City Electric', category: 'Bills', date: dateDaysAgo(17), amount: -68.2, kind: 'expense', status: 'Pending', initials: '⚡', color: 'yellow' },
  { id: 'txn-14', name: 'Acme Studio', detail: 'Monthly salary · Direct deposit', category: 'Income', date: dateDaysAgo(30), amount: 4250, kind: 'income', status: 'Completed', initials: 'A', color: 'blue' },
]

let transactions = [...initialTransactions]
const accounts = [
  { id: 'checking', name: 'Everyday checking', number: '•••• 4829', type: 'Checking account', balance: 12480.55, color: 'navy' as const },
  { id: 'savings', name: 'Rainy day savings', number: '•••• 1906', type: 'High-yield savings', balance: 12370.2, color: 'mint' as const },
]

export async function login(email: string, password: string): Promise<AuthSession> {
  await wait(450)
  const normalizedEmail = email.trim().toLowerCase()
  const users = {
    'demo@northstar.com': { id: 'usr-01', name: 'Alex Morgan', email: normalizedEmail, role: 'user' as const },
    'admin@northstar.com': { id: 'usr-02', name: 'Jordan Lee', email: normalizedEmail, role: 'admin' as const },
  }
  const user = users[normalizedEmail as keyof typeof users]
  if (!user || password !== 'password') {
    throw new Error('That email and password don’t match our demo accounts.')
  }

  const payload = window.btoa(JSON.stringify({ sub: user.id, role: user.role, exp: Date.now() + 60 * 60 * 1000 }))
  return { token: `demo.${payload}.signature`, user }
}

export async function getDashboard(): Promise<DashboardData> {
  await wait()
  return { accounts: accounts.map((account) => ({ ...account })), transactions: [...transactions] }
}

export async function createTransfer(input: TransferInput): Promise<Transaction> {
  await wait(500)
  const account = accounts.find((item) => item.id === input.accountId)
  if (!account) throw new Error('Choose a valid account to transfer from.')
  if (!Number.isFinite(input.amount) || input.amount <= 0) throw new Error('Enter a transfer amount greater than zero.')
  if (input.amount > account.balance) throw new Error('This transfer is higher than your available balance.')

  account.balance = Number((account.balance - input.amount).toFixed(2))
  const transaction: Transaction = {
    id: `txn-${Date.now()}`,
    name: input.recipient.trim(),
    detail: `${input.note?.trim() ? `${input.note.trim()} · ` : ''}Transfer from ${account.name} · Just now`,
    category: 'Transfer',
    date: new Date().toISOString(),
    amount: -input.amount,
    kind: 'transfer',
    status: 'Completed',
    initials: input.recipient.trim().slice(0, 1).toUpperCase(),
    color: 'lavender',
  }
  transactions = [transaction, ...transactions]
  return transaction
}
