function Dashboard({ user, onLogout }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* Sidebar */}
      <div style={{ width: '220px', background: '#1e1e2e', color: 'white', padding: '30px 20px' }}>
        <h2 style={{ marginBottom: '40px', fontSize: '18px' }}>⚡ BizPlatform</h2>
        <nav>
          {['Dashboard', 'Inventory', 'Sales', 'Customers', 'Expenses'].map(item => (
            <div key={item} style={{
              padding: '12px 16px',
              marginBottom: '8px',
              borderRadius: '8px',
              cursor: 'pointer',
              background: item === 'Dashboard' ? '#7c3aed' : 'transparent'
            }}>
              {item}
            </div>
          ))}
        </nav>
        <button
          onClick={onLogout}
          style={{
            marginTop: '40px',
            width: '100%',
            padding: '10px',
            background: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}>
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '40px', background: '#f9fafb' }}>
        <h1 style={{ marginBottom: '8px' }}>Welcome back 👋</h1>
        <p style={{ color: '#6b7280', marginBottom: '40px' }}>{user?.email}</p>

        {/* Stat Cards */}
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          {[
            { label: 'Total Sales', value: '₦0', color: '#7c3aed' },
            { label: 'Inventory Items', value: '0', color: '#059669' },
            { label: 'Customers', value: '0', color: '#2563eb' },
            { label: 'Expenses', value: '₦0', color: '#dc2626' },
          ].map(card => (
            <div key={card.label} style={{
              background: 'white',
              borderRadius: '12px',
              padding: '24px',
              minWidth: '180px',
              flex: 1,
              borderTop: `4px solid ${card.color}`,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <p style={{ color: '#6b7280', marginBottom: '8px' }}>{card.label}</p>
              <h2 style={{ color: card.color, fontSize: '28px' }}>{card.value}</h2>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default Dashboard
