import { useState, useEffect } from 'react'
import { supabase } from './supabase'

function Expenses() {
  const [expenses, setExpenses] = useState([])
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [message, setMessage] = useState('')

  const fetchExpenses = async () => {
    const { data } = await supabase.from('expenses').select('*').order('created_at', { ascending: false })
    setExpenses(data || [])
  }

  useEffect(() => { fetchExpenses() }, [])

  const handleAdd = async () => {
    if (!description || !amount || !category) return setMessage('Fill all fields')
    const { error } = await supabase.from('expenses').insert([{
      description, amount: parseFloat(amount), category
    }])
    if (error) setMessage(error.message)
    else {
      setMessage('Expense recorded!')
      setDescription(''); setAmount(''); setCategory('')
      fetchExpenses()
    }
  }

  const handleDelete = async (id) => {
    await supabase.from('expenses').delete().eq('id', id)
    fetchExpenses()
  }

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)

  return (
    <div>
      <h2 style={{ marginBottom: '24px' }}>Expenses</h2>

      <div style={{
        background: '#dc2626', color: 'white', padding: '24px',
        borderRadius: '12px', marginBottom: '24px', display: 'inline-block', minWidth: '200px'
      }}>
        <p style={{ marginBottom: '8px', opacity: 0.8 }}>Total Expenses</p>
        <h2 style={{ fontSize: '32px' }}>₦{totalExpenses.toLocaleString()}</h2>
      </div>

      <div style={{
        background: 'white', padding: '24px', borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '24px'
      }}>
        <h3 style={{ marginBottom: '16px' }}>Record an Expense</h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <input
            placeholder="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #e5e7eb', flex: 1 }}
          />
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #e5e7eb', width: '150px' }}>
            <option value="">Category</option>
            <option value="Rent">Rent</option>
            <option value="Salary">Salary</option>
            <option value="Supplies">Supplies</option>
            <option value="Transport">Transport</option>
            <option value="Utilities">Utilities</option>
            <option value="Other">Other</option>
          </select>
          <input
            placeholder="Amount (₦)"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #e5e7eb', width: '140px' }}
          />
          <button
            onClick={handleAdd}
            style={{
              padding: '8px 20px', background: '#dc2626', color: 'white',
              border: 'none', borderRadius: '8px', cursor: 'pointer'
            }}>
            Record Expense
          </button>
        </div>
        {message && <p style={{ color: '#dc2626', marginTop: '8px' }}>{message}</p>}
      </div>

      <div style={{
        background: 'white', borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f3f4f6' }}>
              {['Description', 'Category', 'Amount', 'Date', 'Action'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', color: '#6b7280' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {expenses.length === 0 ? (
              <tr><td colSpan="5" style={{ padding: '24px', textAlign: 'center', color: '#6b7280' }}>No expenses yet</td></tr>
            ) : (
              expenses.map(expense => (
                <tr key={expense.id} style={{ borderTop: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '12px 16px' }}>{expense.description}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      padding: '4px 10px', borderRadius: '20px', fontSize: '12px',
                      background: '#f3f4f6', color: '#374151'
                    }}>{expense.category}</span>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#dc2626' }}>₦{expense.amount.toLocaleString()}</td>
                  <td style={{ padding: '12px 16px', color: '#6b7280', fontSize: '13px' }}>
                    {new Date(expense.created_at).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <button
                      onClick={() => handleDelete(expense.id)}
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

export default Expenses
