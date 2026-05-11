import { useState, useEffect } from 'react'
import { supabase } from './supabase'

function Inventory() {
  const [items, setItems] = useState([])
  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState('')
  const [price, setPrice] = useState('')
  const [message, setMessage] = useState('')

  const fetchItems = async () => {
    const { data } = await supabase.from('inventory').select('*').order('created_at', { ascending: false })
    setItems(data || [])
  }

  useEffect(() => { fetchItems() }, [])

  const handleAdd = async () => {
    if (!name || !quantity || !price) return setMessage('Fill all fields')
    const { error } = await supabase.from('inventory').insert([{
      name, quantity: parseInt(quantity), price: parseFloat(price)
    }])
    if (error) setMessage(error.message)
    else {
      setMessage('Item added!')
      setName(''); setQuantity(''); setPrice('')
      fetchItems()
    }
  }

  const handleDelete = async (id) => {
    await supabase.from('inventory').delete().eq('id', id)
    fetchItems()
  }

  return (
    <div>
      <h2 style={{ marginBottom: '24px' }}>Inventory</h2>

      {/* Add Item Form */}
      <div style={{
        background: 'white', padding: '24px', borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '24px'
      }}>
        <h3 style={{ marginBottom: '16px' }}>Add New Item</h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <input
            placeholder="Product name"
            value={name}
            onChange={e => setName(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #e5e7eb', flex: 1 }}
          />
          <input
            placeholder="Quantity"
            value={quantity}
            onChange={e => setQuantity(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #e5e7eb', width: '120px' }}
          />
          <input
            placeholder="Price (₦)"
            value={price}
            onChange={e => setPrice(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #e5e7eb', width: '140px' }}
          />
          <button
            onClick={handleAdd}
            style={{
              padding: '8px 20px', background: '#7c3aed', color: 'white',
              border: 'none', borderRadius: '8px', cursor: 'pointer'
            }}>
            Add Item
          </button>
        </div>
        {message && <p style={{ color: '#7c3aed', marginTop: '8px' }}>{message}</p>}
      </div>

      {/* Inventory Table */}
      <div style={{
        background: 'white', borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f3f4f6' }}>
              {['Product', 'Quantity', 'Price', 'Action'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', color: '#6b7280' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr><td colSpan="4" style={{ padding: '24px', textAlign: 'center', color: '#6b7280' }}>No items yet</td></tr>
            ) : (
              items.map(item => (
                <tr key={item.id} style={{ borderTop: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '12px 16px' }}>{item.name}</td>
                  <td style={{ padding: '12px 16px' }}>{item.quantity}</td>
                  <td style={{ padding: '12px 16px' }}>₦{item.price.toLocaleString()}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <button
                      onClick={() => handleDelete(item.id)}
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

export default Inventory
