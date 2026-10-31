import { useMemo, useState } from 'react'
import { Alert, CssBaseline, Snackbar, ThemeProvider, createTheme } from '@mui/material'
import { QueryClient, QueryClientProvider, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { Provider } from 'react-redux'
import { BrowserRouter, Link, Navigate, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from './app/hooks'
import { store } from './app/store'
import { signIn, signOut } from './features/auth/authSlice'
import { createTransfer, getDashboard, login } from './data/mockApi'
import type { BankAccount, Transaction, TransferInput } from './types'
import './App.css'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
})

const theme = createTheme({
  palette: {
    primary: { main: '#4d6247' },
    background: { default: '#f7f8f5', paper: '#ffffff' },
    text: { primary: '#1e2822', secondary: '#778078' },
  },
  typography: { fontFamily: '"DM Sans", sans-serif', button: { textTransform: 'none', fontWeight: 600 } },
  shape: { borderRadius: 12 },
})

const iconPaths: Record<string, string> = {
  logo: 'M12 2 3.5 6.7v10.6L12 22l8.5-4.7V6.7L12 2Zm0 4 4.8 2.7v5.9L12 17.3l-4.8-2.7V8.7L12 6Z',
  grid: 'M3 3h8v8H3zM13 3h8v5h-8zM13 10h8v11h-8zM3 13h8v8H3z',
  receipt: 'M5 3h14v18l-3-2-4 2-4-2-3 2V3Zm3 5h8M8 12h8M8 16h4',
  transfer: 'M7 7h13m0 0-4-4m4 4-4 4M17 17H4m0 0 4 4m-4-4 4-4',
  card: 'M3 5h18v14H3zM3 10h18M7 15h4',
  users: 'M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2m6-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm6-7a4 4 0 0 1 0 8m5 9v-2a4 4 0 0 0-3-3.87',
  settings: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm0-5v2m0 14v2m9-9h-2M5 12H3m15.36-6.36-1.42 1.42M7.06 16.94l-1.42 1.42m12.72 0-1.42-1.42M7.06 7.06 5.64 5.64',
  bell: 'M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9m-8 12a2 2 0 0 0 4 0',
  search: 'm20 20-4.5-4.5M18 10.5a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z',
  plus: 'M12 5v14m-7-7h14',
  trend: 'm3 17 6-6 4 4 8-9m0 0v6m0-6h-6',
  wallet: 'M4 6.5h15a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h13m3 9h-5a2 2 0 0 0 0 4h5m-5-2h.01',
  arrowDown: 'M12 3v18m0 0 7-7m-7 7-7-7',
  arrowUp: 'M12 21V3m0 0 7 7m-7-7-7 7',
  chevron: 'm9 18 6-6-6-6',
  close: 'm18 6-12 12M6 6l12 12',
  send: 'm22 2-7 20-4-9-9-4 20-7ZM22 2 11 13',
  shield: 'M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Zm-3-11 2 2 4-4',
  check: 'm5 12 4 4L19 6',
  contactless: 'M8.5 8.5a5 5 0 0 0 0 7m3-10a9 9 0 0 0 0 13m3-16a13 13 0 0 0 0 19',
  logout: 'M10 17l5-5-5-5m5 5H3m9-9h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6',
  calendar: 'M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14H3V6a2 2 0 0 1 2-2Z',
  filter: 'M4 6h16M7 12h10m-7 6h4',
  eye: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Zm10-3a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z',
}

function Icon({ name, size = 20, className = '' }: { name: string; size?: number; className?: string }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {name === 'logo' || name === 'grid' ? <path d={iconPaths[name]} fill="currentColor" stroke="none" /> : <path d={iconPaths[name] ?? iconPaths.grid} />}
    </svg>
  )
}

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/*" element={<ProtectedApp />} />
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  )
}

function ProtectedApp() {
  const session = useAppSelector((state) => state.auth.session)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (!session) return <Navigate to="/login" replace state={{ from: location }} />

  const currentTitle = location.pathname.startsWith('/transactions')
    ? 'Transactions'
    : location.pathname.startsWith('/transfer')
      ? 'Transfers'
      : location.pathname.startsWith('/cards')
        ? 'My cards'
        : location.pathname.startsWith('/admin')
          ? 'Team'
          : 'Overview'

  const handleSignOut = () => {
    dispatch(signOut())
    navigate('/login', { replace: true })
  }

  return (
    <div className="app-shell">
      {sidebarOpen && <button className="mobile-backdrop" aria-label="Close menu" onClick={() => setSidebarOpen(false)} />}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <Link className="brand" to="/" onClick={() => setSidebarOpen(false)}>
          <span className="brand-mark"><Icon name="logo" size={24} /></span>
          <span>northstar<span className="brand-period">.</span></span>
        </Link>
        <div className="workspace-label">WORKSPACE</div>
        <nav className="side-nav" aria-label="Main navigation">
          <NavItem to="/" icon="grid" label="Overview" onClick={() => setSidebarOpen(false)} />
          <NavItem to="/transactions" icon="receipt" label="Transactions" onClick={() => setSidebarOpen(false)} />
          <NavItem to="/transfer" icon="transfer" label="Transfers" onClick={() => setSidebarOpen(false)} />
          <NavItem to="/cards" icon="card" label="My cards" onClick={() => setSidebarOpen(false)} />
          {session.user.role === 'admin' && <NavItem to="/admin" icon="users" label="Team" onClick={() => setSidebarOpen(false)} />}
        </nav>
        <div className="sidebar-bottom">
          <div className="help-card">
            <div className="help-icon"><Icon name="shield" size={18} /></div>
            <strong>Your money, protected</strong>
            <span>Bank-level encryption keeps you safe.</span>
            <a href="mailto:support@northstar.demo">Learn about security <Icon name="chevron" size={14} /></a>
          </div>
          <button className="profile-button" onClick={handleSignOut}>
            <span className="avatar">{session.user.name.split(' ').map((part) => part[0]).join('')}</span>
            <span className="profile-copy"><strong>{session.user.name}</strong><small>{session.user.role === 'admin' ? 'Administrator' : 'Personal account'}</small></span>
            <Icon name="logout" size={17} className="logout-icon" />
          </button>
        </div>
      </aside>
      <main className="main-panel">
        <header className="topbar">
          <button className="mobile-menu" aria-label="Open menu" onClick={() => setSidebarOpen(true)}><span /><span /><span /></button>
          <div className="breadcrumb"><span>Workspace</span><Icon name="chevron" size={15} /><strong>{currentTitle}</strong></div>
          <div className="topbar-actions">
            <span className="secure-label"><span className="secure-dot" /> Secure session</span>
            <button className="icon-button notification-button" aria-label="Notifications"><Icon name="bell" size={19} /><i /></button>
            <span className="top-avatar">{session.user.name.split(' ').map((part) => part[0]).join('')}</span>
          </div>
        </header>
        <div className="page-content">
          <Routes>
            <Route path="/" element={<OverviewPage userName={session.user.name} role={session.user.role} />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/transfer" element={<TransferPage />} />
            <Route path="/cards" element={<CardsPage />} />
            <Route path="/admin" element={session.user.role === 'admin' ? <AdminPage /> : <Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}

function NavItem({ to, icon, label, onClick }: { to: string; icon: string; label: string; onClick: () => void }) {
  return (
    <NavLink to={to} end={to === '/'} onClick={onClick} className={({ isActive }) => `nav-item ${isActive ? 'nav-item-active' : ''}`}>
      <Icon name={icon} size={19} /><span>{label}</span>
    </NavLink>
  )
}

function LoginPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('demo@northstar.com')
  const [password, setPassword] = useState('password')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      const session = await login(email, password)
      dispatch(signIn(session))
      const destination = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/'
      navigate(destination, { replace: true })
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Sign in failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <section className="login-visual">
        <div className="login-visual-top"><Link className="brand brand-light" to="/"><span className="brand-mark"><Icon name="logo" size={24} /></span><span>northstar<span className="brand-period">.</span></span></Link><span className="login-tag">A better kind of banking</span></div>
        <div className="visual-copy">
          <span className="eyebrow eyebrow-light"><span className="secure-dot" /> MONEY, MOVING FORWARD</span>
          <h1>Make room<br />for <em>what’s next.</em></h1>
          <p>Thoughtful tools for your everyday money. All the clarity you need, right where you need it.</p>
        </div>
        <div className="visual-balance">
          <div className="visual-balance-top"><span>Total balance</span><span>•••</span></div>
          <strong>$24,850<span>.75</span></strong>
          <div className="balance-trend"><Icon name="trend" size={15} /> 8.2% <span>up this month</span></div>
          <div className="mini-chart"><svg viewBox="0 0 400 72" preserveAspectRatio="none" aria-label="Balance trending up"><defs><linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#d7f0b4" stopOpacity=".25" /><stop offset="100%" stopColor="#d7f0b4" stopOpacity="0" /></linearGradient></defs><path d="M0 58 C22 58 26 45 47 49 S70 55 91 39 118 48 140 38 163 43 183 27 206 37 229 31 246 23 269 31 293 10 315 19 338 23 359 10 382 15 400 3 V72 H0Z" fill="url(#chartFill)" /><path d="M0 58 C22 58 26 45 47 49 S70 55 91 39 118 48 140 38 163 43 183 27 206 37 229 31 246 23 269 31 293 10 315 19 338 23 359 10 382 15 400 3" fill="none" stroke="#d7f0b4" strokeWidth="2.5" /></svg></div>
        </div>
        <div className="login-foot"><span>FDIC insured</span><span>·</span><span>Member FDIC</span><span className="login-foot-right">Built around you <span>✳</span></span></div>
      </section>
      <section className="login-form-panel">
        <div className="mobile-login-brand"><Link className="brand" to="/"><span className="brand-mark"><Icon name="logo" size={24} /></span><span>northstar<span className="brand-period">.</span></span></Link></div>
        <div className="login-form-wrap">
          <span className="eyebrow">WELCOME BACK</span>
          <h2>Sign in to your account</h2>
          <p className="form-subtitle">A little more clarity starts here.</p>
          <form onSubmit={submit} className="login-form">
            <label htmlFor="email">Email address</label>
            <input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required />
            <div className="label-row"><label htmlFor="password">Password</label><button type="button" className="text-button" onClick={() => setError('Use the demo password shown below to sign in.')}>Forgot password?</button></div>
            <input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required />
            {error && <div className="form-error" role="alert">{error}</div>}
            <button className="button button-dark login-submit" disabled={loading}>{loading ? <span className="spinner" /> : null}{loading ? 'Signing in…' : 'Sign in'}<Icon name="chevron" size={17} /></button>
          </form>
          <div className="demo-box"><div className="demo-heading"><span className="demo-icon"><Icon name="eye" size={17} /></span><div><strong>Try the live demo</strong><span>These accounts are ready to use</span></div></div><button onClick={() => { setEmail('demo@northstar.com'); setPassword('password') }}><span>Personal account</span><code>demo@northstar.com</code></button><button onClick={() => { setEmail('admin@northstar.com'); setPassword('password') }}><span>Admin account</span><code>admin@northstar.com</code></button><div className="demo-password">Password for both: <strong>password</strong></div></div>
          <div className="login-terms">By continuing, you agree to our <a href="mailto:legal@northstar.demo">Terms of Service</a> and <a href="mailto:privacy@northstar.demo">Privacy Policy</a>.</div>
        </div>
        <div className="login-bottom">© {new Date().getFullYear()} Northstar Financial <span>Need help? <a href="mailto:support@northstar.demo">Get in touch</a></span></div>
      </section>
    </div>
  )
}

function useDashboard() {
  return useQuery({ queryKey: ['dashboard'], queryFn: getDashboard })
}

function OverviewPage({ userName, role }: { userName: string; role: string }) {
  const { data, isPending, isError } = useDashboard()
  if (isPending) return <LoadingState />
  if (isError || !data) return <ErrorState />
  const firstName = userName.split(' ')[0]
  const total = data.accounts.reduce((sum, account) => sum + account.balance, 0)
  const now = new Date()
  const monthTransactions = data.transactions.filter((transaction) => {
    const date = new Date(transaction.date)
    return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth()
  })
  const income = monthTransactions.filter((transaction) => transaction.amount > 0).reduce((sum, transaction) => sum + transaction.amount, 0)
  const spend = Math.abs(monthTransactions.filter((transaction) => transaction.amount < 0).reduce((sum, transaction) => sum + transaction.amount, 0))

  return (
    <>
      <div className="page-heading heading-spread">
        <div><span className="eyebrow">{role === 'admin' ? 'ADMINISTRATOR VIEW' : new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).toUpperCase()}</span><h1>Good morning, {firstName}<span className="wave">✳</span></h1><p>Here’s what’s happening with your money today.</p></div>
        <Link className="button button-dark" to="/transfer"><Icon name="plus" size={17} /> New transfer</Link>
      </div>
      {role === 'admin' && <div className="admin-note"><span className="admin-note-icon"><Icon name="shield" size={18} /></span><div><strong>Admin preview</strong><span>You’re viewing the admin experience. Team management is available in the sidebar.</span></div><Link to="/admin">Open team view <Icon name="chevron" size={14} /></Link></div>}
      <section className="stats-grid" aria-label="Account summary">
        <article className="stat-card balance-stat"><div className="stat-top"><span>Total balance</span><span className="stat-icon stat-icon-green"><Icon name="wallet" size={18} /></span></div><div className="stat-number">${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>        <div className="stat-foot"><span className="change-pill"><Icon name="trend" size={13} /> 8.2%</span><span>vs. last month</span></div><div className="stat-chart"><svg viewBox="0 0 260 40" preserveAspectRatio="none"><path d="M0 34 C18 33 22 17 43 23S68 31 82 20 106 26 122 13 145 22 164 17 183 22 203 9 228 15 243 5 252 8 260 3" fill="none" stroke="#5f8060" strokeWidth="2" /></svg></div></article>
        <article className="stat-card"><div className="stat-top"><span>Income this month</span><span className="stat-icon stat-icon-blue"><Icon name="arrowDown" size={17} /></span></div><div className="stat-number">${income.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div><div className="stat-foot"><span className="change-pill"><Icon name="trend" size={13} /> 12.4%</span><span>vs. last month</span></div><div className="stat-caption">You’re doing great this month.</div></article>
        <article className="stat-card"><div className="stat-top"><span>Spending this month</span><span className="stat-icon stat-icon-peach"><Icon name="arrowUp" size={17} /></span></div><div className="stat-number">${spend.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div><div className="stat-foot"><span className="change-pill change-neutral">On track</span><span>of $3,500 monthly budget</span></div><div className="budget-track"><span style={{ width: `${Math.min((spend / 3500) * 100, 100)}%` }} /></div></article>
      </section>
      <div className="dashboard-grid">
        <section className="panel accounts-panel">
          <div className="section-heading"><div><h2>Your accounts</h2><p>A little overview of your money.</p></div><button className="more-button" aria-label="More account options">···</button></div>
          <div className="account-list">{data.accounts.map((account) => <AccountCard key={account.id} account={account} />)}</div>
          <Link className="subtle-link" to="/cards">View account details <Icon name="chevron" size={15} /></Link>
        </section>
        <section className="panel activity-panel">
          <div className="section-heading"><div><h2>Spending activity</h2><p>Your money in, and out.</p></div><select className="period-select" aria-label="Spending period"><option>This month</option><option>Last month</option></select></div>
          <div className="activity-legend"><span><i className="legend-income" /> Income <strong>${income.toLocaleString()}</strong></span><span><i className="legend-spend" /> Expenses <strong>${spend.toLocaleString()}</strong></span></div>
          <SpendingChart />
        </section>
      </div>
      <section className="panel transactions-panel overview-transactions">
        <div className="section-heading"><div><h2>Recent transactions</h2><p>Your latest money moves.</p></div><Link className="subtle-link" to="/transactions">See all <Icon name="chevron" size={15} /></Link></div>
        <TransactionTable transactions={data.transactions.slice(0, 5)} compact />
      </section>
      <div className="bottom-note"><Icon name="shield" size={15} /> Your deposits are FDIC-insured up to $250,000. <a href="mailto:security@northstar.demo">Learn more</a></div>
    </>
  )
}

function AccountCard({ account }: { account: BankAccount }) {
  return (
    <div className={`account-card account-${account.color}`}>
      <div className="account-card-top"><span className="account-chip"><Icon name="wallet" size={17} /></span><span className="account-number">{account.number}</span></div>
      <div className="account-name">{account.name}</div>
      <div className="account-balance">${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
      <div className="account-type">{account.type}</div>
    </div>
  )
}

function SpendingChart() {
  const bars = [40, 54, 46, 70, 56, 64, 48, 80, 57, 68, 51, 74]
  const now = new Date()
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
  const labels = [1, Math.ceil(monthEnd * 0.25), Math.ceil(monthEnd * 0.5), Math.ceil(monthEnd * 0.75), monthEnd]
    .map((day) => `${now.toLocaleDateString('en-US', { month: 'short' })} ${day}`)
  return <div className="chart-wrap"><div className="chart-y-labels"><span>$5k</span><span>$3k</span><span>$1k</span><span>$0</span></div><div className="chart-area"><div className="chart-grid-lines"><i /><i /><i /><i /></div><div className="chart-bars">{bars.map((height, index) => <div className="bar-pair" key={`${height}-${index}`}><span className="bar-income" style={{ height: `${height}%` }} /><span className={`bar-spend ${index === 9 ? 'bar-highlight' : ''}`} style={{ height: `${Math.max(height - 22, 16)}%` }} /></div>)}</div><div className="chart-x-labels">{labels.map((label) => <span key={label}>{label}</span>)}</div></div></div>
}

function TransactionsPage() {
  const { data, isPending, isError } = useDashboard()
  if (isPending) return <LoadingState />
  if (isError || !data) return <ErrorState />
  return <><div className="page-heading heading-spread"><div><span className="eyebrow">YOUR MONEY, IN MOTION</span><h1>Transactions</h1><p>Every little detail, all in one place.</p></div><Link className="button button-dark" to="/transfer"><Icon name="plus" size={17} /> New transfer</Link></div><section className="panel transactions-full-panel"><TransactionTable transactions={data.transactions} /></section><div className="bottom-note"><Icon name="shield" size={15} /> Something doesn’t look right? <a href="mailto:support@northstar.demo">Contact support</a></div></>
}

function TransactionTable({ transactions, compact = false }: { transactions: Transaction[]; compact?: boolean }) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [sortKey, setSortKey] = useState<'date' | 'name' | 'amount'>('date')
  const [sortAscending, setSortAscending] = useState(false)
  const [page, setPage] = useState(1)
  const pageSize = compact ? 5 : 8
  const filtered = useMemo(() => transactions.filter((transaction) => {
    const matchesSearch = `${transaction.name} ${transaction.detail} ${transaction.category}`.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = category === 'All' || (category === 'Income' ? transaction.amount > 0 : transaction.amount < 0)
    const transactionDate = transaction.date.slice(0, 10)
    return matchesSearch && matchesCategory && (!fromDate || transactionDate >= fromDate) && (!toDate || transactionDate <= toDate)
  }).sort((a, b) => {
    const comparison = sortKey === 'date' ? a.date.localeCompare(b.date) : sortKey === 'name' ? a.name.localeCompare(b.name) : a.amount - b.amount
    return sortAscending ? comparison : -comparison
  }), [category, fromDate, search, sortAscending, sortKey, toDate, transactions])
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const visible = compact ? filtered.slice(0, pageSize) : filtered.slice((page - 1) * pageSize, page * pageSize)

  const changeSort = (key: 'date' | 'name' | 'amount') => {
    setSortAscending(sortKey === key ? !sortAscending : key !== 'date')
    setSortKey(key)
  }

  return (
    <>
      {!compact && <div className="table-toolbar"><label className="table-search"><Icon name="search" size={17} /><input placeholder="Search transactions..." value={search} onChange={(event) => { setSearch(event.target.value); setPage(1) }} /></label><label className="select-filter"><Icon name="filter" size={16} /><select value={category} onChange={(event) => { setCategory(event.target.value); setPage(1) }} aria-label="Filter by transaction type"><option>All</option><option>Income</option><option>Expenses</option></select></label><label className="date-filter"><Icon name="calendar" size={16} /><span>From</span><input aria-label="Start date" type="date" value={fromDate} onChange={(event) => { setFromDate(event.target.value); setPage(1) }} /></label><label className="date-filter"><span>To</span><input aria-label="End date" type="date" value={toDate} onChange={(event) => { setToDate(event.target.value); setPage(1) }} /></label></div>}
      <div className="table-scroll"><table className="transactions-table"><thead><tr><th><button onClick={() => changeSort('name')}>Transaction <span>↕</span></button></th><th>Category</th><th><button onClick={() => changeSort('date')}>Date <span>↕</span></button></th><th>Status</th><th className="amount-heading"><button onClick={() => changeSort('amount')}>Amount <span>↕</span></button></th></tr></thead><tbody>
        {visible.map((transaction) => <tr key={transaction.id}><td><div className="transaction-identity"><span className={`merchant-icon merchant-${transaction.color}`}>{transaction.initials}</span><span><strong>{transaction.name}</strong><small>{transaction.detail}</small></span></div></td><td><span className="category-label">{transaction.category}</span></td><td className="transaction-date">{new Date(transaction.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: compact ? undefined : 'numeric' })}</td><td><span className={`status-pill status-${transaction.status.toLowerCase()}`}><i />{transaction.status}</span></td><td className={`transaction-amount ${transaction.amount > 0 ? 'amount-positive' : ''}`}>{transaction.amount > 0 ? '+' : '−'}${Math.abs(transaction.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td></tr>)}
        {visible.length === 0 && <tr><td className="empty-table" colSpan={5}>No transactions match these filters. Try changing your search or date range.</td></tr>}
      </tbody></table></div>
      {!compact && <div className="table-footer"><span>Showing <strong>{filtered.length ? (page - 1) * pageSize + 1 : 0}–{Math.min(page * pageSize, filtered.length)}</strong> of <strong>{filtered.length}</strong> transactions</span><div className="pagination"><button aria-label="Previous page" disabled={page === 1} onClick={() => setPage((current) => current - 1)}>‹</button><span>Page {page} of {pages}</span><button aria-label="Next page" disabled={page >= pages} onClick={() => setPage((current) => current + 1)}>›</button></div></div>}
    </>
  )
}

const transferSchema: yup.ObjectSchema<TransferInput> = yup.object({
  recipient: yup.string().trim().min(2, 'Enter the recipient’s name.').required('Recipient is required.'),
  accountId: yup.string().required('Choose an account.'),
  amount: yup.number().typeError('Enter a valid amount.').positive('Amount must be greater than $0.').max(100000, 'For larger transfers, please contact support.').required('Amount is required.'),
  note: yup.string().max(80, 'Keep your note under 80 characters.').optional(),
})

function TransferPage() {
  const { data, isPending, isError } = useDashboard()
  const queryClient = useQueryClient()
  const [notice, setNotice] = useState('')
  const mutation = useMutation({ mutationFn: createTransfer, onSuccess: async () => { await queryClient.invalidateQueries({ queryKey: ['dashboard'] }); setNotice('Your transfer is on its way.') } })
  const submitTransfer = async (input: TransferInput) => {
    try {
      await mutation.mutateAsync(input)
      return true
    } catch {
      return false
    }
  }
  if (isPending) return <LoadingState />
  if (isError || !data) return <ErrorState />
  return <><div className="page-heading"><span className="eyebrow">QUICK & SECURE</span><h1>Send money</h1><p>Move money around with just a few details.</p></div><div className="transfer-layout"><TransferForm accounts={data.accounts} onSubmit={submitTransfer} isSubmitting={mutation.isPending} error={mutation.error?.message} /><aside className="transfer-aside"><div className="transfer-tip-icon"><Icon name="shield" size={20} /></div><h3>Safe, secure, simple.</h3><p>Every transfer is protected with bank-level encryption and real-time fraud monitoring.</p><div className="transfer-tip-line"><span><Icon name="check" size={14} /></span> No transfer fees</div><div className="transfer-tip-line"><span><Icon name="check" size={14} /></span> Arrives in minutes</div><div className="transfer-tip-line"><span><Icon name="check" size={14} /></span> Encrypted end to end</div><div className="transfer-help">Need a hand? <a href="mailto:support@northstar.demo">We’re right here.</a></div></aside></div><Snackbar open={Boolean(notice)} autoHideDuration={4500} onClose={() => setNotice('')}><Alert severity="success" variant="filled" onClose={() => setNotice('')}>{notice}</Alert></Snackbar></>
}

function TransferForm({ accounts, onSubmit, isSubmitting, error }: { accounts: BankAccount[]; onSubmit: (input: TransferInput) => Promise<boolean>; isSubmitting: boolean; error?: string }) {
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<TransferInput>({ resolver: yupResolver(transferSchema), defaultValues: { recipient: '', accountId: accounts[0]?.id ?? '', amount: undefined, note: '' } })
  return <form className="transfer-form panel" onSubmit={handleSubmit(async (values) => { if (await onSubmit(values)) reset({ ...values, recipient: '', amount: undefined, note: '' }) })} noValidate>
    <div className="form-section-title"><span className="form-step">01</span><div><strong>Who are you sending to?</strong><small>Add the name of the person or business.</small></div></div>
    <label className="field-label" htmlFor="recipient">Recipient name</label>
    <input id="recipient" className={`field-input ${errors.recipient ? 'field-invalid' : ''}`} placeholder="e.g. Taylor Smith" {...register('recipient')} />
    {errors.recipient && <span className="field-error">{errors.recipient.message}</span>}
    <div className="field-divider" />
    <div className="form-section-title"><span className="form-step">02</span><div><strong>How much would you like to send?</strong><small>Choose an account and enter an amount.</small></div></div>
    <label className="field-label" htmlFor="account">From account</label>
    <Controller name="accountId" control={control} render={({ field }) => <select id="account" className="field-input field-select" {...field}>{accounts.map((account) => <option value={account.id} key={account.id}>{account.name} · ${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</option>)}</select>} />
    <label className="field-label amount-label" htmlFor="amount">Amount</label>
    <div className={`amount-input-wrap ${errors.amount ? 'field-invalid' : ''}`}><span>$</span><input id="amount" inputMode="decimal" placeholder="0.00" {...register('amount', { valueAsNumber: true })} /></div>
    {errors.amount && <span className="field-error">{errors.amount.message}</span>}
    <label className="field-label amount-label" htmlFor="note">Note <span>(optional)</span></label>
    <input id="note" className={`field-input ${errors.note ? 'field-invalid' : ''}`} placeholder="What’s it for?" {...register('note')} />
    {errors.note && <span className="field-error">{errors.note.message}</span>}
    {error && <div className="form-error transfer-error" role="alert">{error}</div>}
    <button className="button button-dark transfer-submit" disabled={isSubmitting}>{isSubmitting ? <span className="spinner" /> : <Icon name="send" size={17} />}{isSubmitting ? 'Sending securely…' : 'Review and send'}<Icon name="chevron" size={17} /></button>
    <div className="form-encryption"><Icon name="shield" size={14} /> Your information is encrypted and secure.</div>
  </form>
}

function CardsPage() {
  const { data, isPending, isError } = useDashboard()
  const [frozen, setFrozen] = useState(false)
  if (isPending) return <LoadingState />
  if (isError || !data) return <ErrorState />
  return <><div className="page-heading"><span className="eyebrow">YOUR ACCOUNTS</span><h1>Cards & accounts</h1><p>Everything you need, all in one wallet.</p></div><div className="cards-page-grid"><div className={`physical-card ${frozen ? 'physical-card-frozen' : ''}`}><div className="physical-card-top"><span className="brand brand-light"><span className="brand-mark"><Icon name="logo" size={20} /></span><span>northstar<span className="brand-period">.</span></span></span><Icon name="contactless" size={22} /></div><div className="card-chip" /><div className="card-digits">•••• &nbsp;•••• &nbsp;•••• &nbsp;4829</div><div className="physical-card-bottom"><div><small>CARDHOLDER</small><strong>ALEX MORGAN</strong></div><div><small>EXPIRES</small><strong>09/28</strong></div><span className="mastercard-mark"><i /><i /></span></div>{frozen && <div className="frozen-overlay"><Icon name="shield" size={22} /> Card frozen</div>}</div><section className="panel card-details"><span className="eyebrow">EVERYDAY CHECKING</span><h2>•••• 4829</h2><p>Visa debit · Physical card</p><div className="card-detail-row"><span>Daily spending limit</span><strong>$5,000.00</strong></div><div className="card-detail-row"><span>ATM withdrawal limit</span><strong>$1,000.00</strong></div><div className="card-detail-row"><span>Linked account</span><strong>Everyday checking</strong></div><button className={`button ${frozen ? 'button-outline' : 'button-dark'} freeze-button`} onClick={() => setFrozen(!frozen)}><Icon name="shield" size={16} />{frozen ? 'Unfreeze card' : 'Temporarily freeze card'}</button></section></div><section className="panel linked-accounts"><div className="section-heading"><div><h2>Linked accounts</h2><p>Your Northstar accounts at a glance.</p></div></div><div className="linked-account-list">{data.accounts.map((account) => <div className="linked-account" key={account.id}><span className={`linked-account-icon account-icon-${account.color}`}><Icon name="wallet" size={19} /></span><div><strong>{account.name}</strong><small>{account.number} · {account.type}</small></div><b>${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</b></div>)}</div></section></>
}

function AdminPage() {
  const [notice, setNotice] = useState(false)
  return <><div className="page-heading heading-spread"><div><span className="eyebrow">ADMINISTRATION</span><h1>Team overview</h1><p>A secure space to keep your team in sync.</p></div><button className="button button-dark" onClick={() => setNotice(true)}><Icon name="plus" size={17} /> Invite a member</button></div><div className="admin-stats"><div className="panel admin-stat"><span className="stat-icon stat-icon-green"><Icon name="users" size={18} /></span><small>Team members</small><strong>08</strong><span>Across your workspace</span></div><div className="panel admin-stat"><span className="stat-icon stat-icon-blue"><Icon name="wallet" size={18} /></span><small>Total managed accounts</small><strong>14</strong><span>All accounts active</span></div><div className="panel admin-stat"><span className="stat-icon stat-icon-peach"><Icon name="receipt" size={18} /></span><small>Pending approvals</small><strong>02</strong><span>Needs your attention</span></div></div><section className="panel team-panel"><div className="section-heading"><div><h2>Team members</h2><p>Manage your workspace access.</p></div><span className="team-count">8 members</span></div><div className="team-table"><div className="team-row team-header"><span>MEMBER</span><span>ROLE</span><span>STATUS</span><span>LAST ACTIVE</span></div>{[{ name: 'Jordan Lee', email: 'admin@northstar.com', role: 'Admin', initials: 'JL', color: 'mint', active: 'You · Now' }, { name: 'Alex Morgan', email: 'demo@northstar.com', role: 'Member', initials: 'AM', color: 'blue', active: '2 minutes ago' }, { name: 'Taylor Smith', email: 'taylor@northstar.demo', role: 'Member', initials: 'TS', color: 'peach', active: 'Yesterday' }, { name: 'Casey Johnson', email: 'casey@northstar.demo', role: 'Viewer', initials: 'CJ', color: 'lavender', active: 'Oct 24, 2025' }].map((member) => <div className="team-row" key={member.email}><span className="team-member"><i className={`team-avatar team-${member.color}`}>{member.initials}</i><span><strong>{member.name}</strong><small>{member.email}</small></span></span><span className="role-pill">{member.role}</span><span className="member-status"><i /> Active</span><span className="last-active">{member.active}</span></div>)}</div></section><div className="bottom-note"><Icon name="shield" size={15} /> Admin actions are logged and protected. <a href="mailto:security@northstar.demo">Learn about admin access</a></div><Snackbar open={notice} autoHideDuration={4500} onClose={() => setNotice(false)}><Alert severity="info" variant="filled" onClose={() => setNotice(false)}>Team invitations are disabled in this demo.</Alert></Snackbar></>
}

function LoadingState() {
  return <div className="loading-state"><span className="loading-ring" /><p>Getting your finances in order…</p></div>
}

function ErrorState() {
  return <div className="error-state"><div className="error-icon">!</div><h2>We couldn’t load your account</h2><p>Please check your connection and try again.</p><button className="button button-dark" onClick={() => void queryClient.invalidateQueries({ queryKey: ['dashboard'] })}>Try again</button></div>
}

function AppRoot() {
  return <App />
}

export default AppRoot
