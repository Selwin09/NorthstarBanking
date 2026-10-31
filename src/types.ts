export type UserRole = 'user' | 'admin'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
}

export interface AuthSession {
  token: string
  user: AuthUser
}

export interface BankAccount {
  id: string
  name: string
  number: string
  type: string
  balance: number
  color: 'navy' | 'mint' | 'lavender'
}

export interface Transaction {
  id: string
  name: string
  detail: string
  category: string
  date: string
  amount: number
  kind: 'income' | 'expense' | 'transfer'
  status: 'Completed' | 'Pending'
  initials: string
  color: string
}

export interface DashboardData {
  accounts: BankAccount[]
  transactions: Transaction[]
}

export interface TransferInput {
  recipient: string
  accountId: string
  amount: number
  note?: string
}
