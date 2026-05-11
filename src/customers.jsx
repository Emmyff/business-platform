import { useState, useEffect } from 'react'
import { supabase } from './supabase'

function Customers() {
  const [customers, setCustomers] = useState([])
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const fetchCustomers = async () => {
    const { data } = await supabase.from('customers').select('*').order('created_at', { ascending: false })
    setCustomers(data || [])
  }

  useEffect(() => { fetchCustomers() }, [])

  const handleAdd = async () => {
    if (!name || !phone) return setMessage('Name and phone are required')
    const { error } = await supabase.from('customers').insert([{ name, phone, email }])
    if (error) setMessage(error.message)
    else {
      setMessage('Customer added!')
      setName(''); setPhone(''); setEmail('')
      fetchCustomers()
    }
  }

  const handleDelete = async (id) => {
    await supabase.from('customers').delete().eq('id', id)
    fetchCustomers()
  }

  return (
    <div>
      <h2 style={{ marginBottom: '24px' }}>Customers</h2>

      <div style={{
        background: '#2563eb', color: 'white', padding: '24px',
        borderRadius: '12px', marginBottom: '24px', display: 'inline-block', minWidth: '200px'
      }}>
        <p style={{ marginBottom: '8px', opacity: 0.8 }}>Total Customers</p>
        <h2 style={{ fontSize: '32px' }}>{customers.length}</h2>
      </div>

      <div style={{
        background: 'white', padding: '24px', borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '24px'
      }}>
        <h3 style={{ marginBottom: '16px' }}>Add New Customer</h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <input
            placeholder="Full name"
            value={name}
            onChange={e => setName(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #e5e7eb', flex: 1 }}
          />
          <input
            placeholder="Phone number"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #e5e7eb', width: '150px' }}
          />
          <input
            placeholder="Email (optional)"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #e5e7eb', width: '200px' }}
          />
          <button
            onClick={handleAdd}
            style={{
              padding: '8px 20px', background: '#2563eb', color: 'white',
              border: 'none', borderRadius: '8px', cursor: 'pointer'
            }}>
            Add Customer
          </button>
        </div>
        {message && <p style={{ color: '#2563eb', marginTop: '8px' }}>{message}</p>}
      </div>

      <div style={{
        background: 'white', borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f3f4f6' }}>
              {['Name', 'Phone', 'Email', 'Date Added', 'Action'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', color: '#6b7280' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr><td colSpan="5" style={{ padding: '24px', textAlign: 'center', color: '#6b7280' }}>No customers yet</td></tr>
            ) : (
              customers.map(customer => (
                <tr key={customer.id} style={{ borderTop: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '12px 16px' }}>{customer.name}</td>
                  <td style={{ padding: '12px 16px' }}>{customer.phone}</td>
                  <td style={{ padding: '12px 16px', color: '#6b7280' }}>{customer.email || '—'}</td>
                  <td style={{ padding: '12px 16px', color: '#6b7280', fontSize: '13px' }}>
                    {new Date(customer.created_at).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <button
                      onClick={() => handleDelete(customer.id)}
                      style={{
                        padding: '6px 12px', background: '#ef4444', color: 'white',
                        border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px'
                      }}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Customers
