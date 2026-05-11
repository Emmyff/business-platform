import { useState } from 'react'

function AIAssistant() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am your business assistant. Ask me anything about managing your business, sales strategies, inventory tips, or financial advice!' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim()) return
    const userMessage = { role: 'user', content: input }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': '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',
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-calls': 'true'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: 'You are a helpful business assistant for small and medium enterprises (SMEs) in Nigeria. You help business owners with inventory management, sales strategies, expense tracking, customer management, and general business advice. Keep responses concise and practical.',
          messages: updatedMessages.filter(m => m.role !== 'system')
        })
      })

      const data = await response.json()
      const assistantMessage = {
        role: 'assistant',
        content: data.content[0].text
      }
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      }])
    }
    setLoading(false)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div>
      <h2 style={{ marginBottom: '8px' }}>AI Business Assistant</h2>
      <p style={{ color: '#6b7280', marginBottom: '24px' }}>Powered by Claude AI</p>

      {/* Chat Window */}
      <div style={{
        background: 'white', borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden'
      }}>
        <div style={{
          height: '450px', overflowY: 'auto', padding: '24px',
          display: 'flex', flexDirection: 'column', gap: '16px'
        }}>
          {messages.map((msg, index) => (
            <div key={index} style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
            }}>
              <div style={{
                maxWidth: '70%', padding: '12px 16px', borderRadius: '12px',
                background: msg.role === 'user' ? '#7c3aed' : '#f3f4f6',
                color: msg.role === 'user' ? 'white' : '#1f2937',
                fontSize: '14px', lineHeight: '1.5'
              }}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{
                padding: '12px 16px', borderRadius: '12px',
                background: '#f3f4f6', color: '#6b7280', fontSize: '14px'
              }}>
                Thinking...
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div style={{
          borderTop: '1px solid #e5e7eb', padding: '16px',
          display: 'flex', gap: '12px'
        }}>
          <input
            placeholder="Ask your business assistant anything..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            style={{
              flex: 1, padding: '10px 16px', borderRadius: '8px',
              border: '1px solid #e5e7eb', fontSize: '14px', outline: 'none'
            }}
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            style={{
              padding: '10px 24px', background: loading ? '#9ca3af' : '#7c3aed',
              color: 'white', border: 'none', borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer', fontSize: '14px'
            }}>
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

export default AIAssistant
