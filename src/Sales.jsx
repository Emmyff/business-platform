import { useState, useEffect } from 'react'
import { supabase } from './supabase'

function Sales() {
  const [sales, setSales] = useState([])
  const [productName, setProductName] = useState('')
  const [quantitySold, setQuantitySold] = useState('')
  const [amount, setAmount] = useState('')
  const [message, setMessage] = useState('')

  const fetchSales = async () => {
    const { data } = await supabase.from('sales').select('*').order('created_at', { ascending: false })
    setSales(data || [])
  }

  useEffect(() => { fetchSales() }, [])

  const handleAdd = async () => {
    if (!productName || !quantitySold || !amount) return setMessage('Fill all fields')
    const { error } = await supabase.from('sales').insert([{
      product_name: productName,
      quantity_sold: parseInt(quantitySold),
      amount: parseFloat(amount)
    }])
    if (error) setMessage(error.message)
    else {
      setMessage('Sale recorded!')
      setProductName(''); setQuantitySold(''); setAmount('')
      fetchSales()
    }
  }

  const handleDelete = async (id) => {
    await supabase.from('sales').delete().eq('id', id)
    fetchSales()
  }

  const totalRevenue = sales.reduce((sum, s) => sum + s.amount, 0)

  return (
    <div>
      <h2 style={{ marginBottom: '24px' }}>Sales</h2>

      {/* Total Revenue Card */}
      <div style={{
        background: '#7c3aed', color: 'white', padding: '24px',
        borderRadius: '12px', marginBottom: '24px', display: 'inline-block', minWidth: '200px'
      }}>
        <p style={{ marginBottom: '8px', opacity: 0.8 }}>Total Revenue</p>
        <h2 style={{ fontSize: '32px' }}>₦{totalRevenue.toLocaleString()}</h2>
      </div>

      {/* Add Sale Form */}
      <div style={{
        background: 'white', padding: '24px', borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '24px'
      }}>
        <h3 style={{ marginBottom: '16px' }}>Record a Sale</h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <input
            placeholder="Product name"
            value={productName}
            onChange={e => setProductName(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #e5e7eb', flex: 1 }}
          />
          <input
            placeholder="Quantity sold"
            value={quantitySold}
            onChange={e => setQuantitySold(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #e5e7eb', width: '130px' }}
          />
          <input
            placeholder="Amount (₦)"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #e5e7eb', width: '140px' }}
          />
          <button
            onClick={handleAdd}
            style={{
              padding: '8px 20px', background: '#7c3aed', color: 'white',
              border: 'none', borderRadius: '8px', cursor: 'pointer'
            }}>
            Record Sale
          </button>
        </div>
        {message && <p style={{ color: '#7c3aed', marginTop: '8px' }}>{message}</p>}
      </div>

      {/* Sales Table */}
      <div style={{
        background: 'white', borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f3f4f6' }}>
              {['Product', 'Qty Sold', 'Amount', 'Date', 'Action'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', color: '#6b7280' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sales.length === 0 ? (
              <tr><td colSpan="5" style={{ padding: '24px', textAlign: 'center', color: '#6b7280' }}>No sales yet</td></tr>
            ) : (
              sales.map(sale => (
                <tr key={sale.id} style={{ borderTop: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '12px 16px' }}>{sale.product_name}</td>
                  <td style={{ padding: '12px 16px' }}>{sale.quantity_sold}</td>
                  <td style={{ padding: '12px 16px' }}>₦{sale.amount.toLocaleString()}</td>
                  <td style={{ padding: '12px 16px', color: '#6b7280', fontSize: '13px' }}>
                    {new Date(sale.created_at).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <button
                      onClick={() => handleDelete(sale.id)}
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

export default Sales
