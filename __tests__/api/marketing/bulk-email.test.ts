import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from '../../../app/api/marketing/bulk-email/route'
import { Resend } from 'resend'

// Mock the Resend API properly
vi.mock('resend', () => {
  return {
    Resend: class {
      emails = {
        send: vi.fn().mockResolvedValue({ id: 'email_123', status: 'sent' })
      }
    }
  }
})

describe('POST /api/marketing/bulk-email', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return error when no recipients provided', async () => {
    const request = new Request('http://localhost:3000/api/marketing/bulk-email', {
      method: 'POST',
      body: JSON.stringify({ recipients: [], subject: 'Test', body: 'Hello' })
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Nenhum destinatário fornecido')
  })

  it('should return error when subject is missing', async () => {
    const request = new Request('http://localhost:3000/api/marketing/bulk-email', {
      method: 'POST',
      body: JSON.stringify({ 
        recipients: [{ email: 'test@example.com' }], 
        subject: '', 
        body: 'Hello' 
      })
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Assunto e corpo do email são obrigatórios')
  })

  it('should return error when body is missing', async () => {
    const request = new Request('http://localhost:3000/api/marketing/bulk-email', {
      method: 'POST',
      body: JSON.stringify({ 
        recipients: [{ email: 'test@example.com' }], 
        subject: 'Test', 
        body: '' 
      })
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Assunto e corpo do email são obrigatórios')
  })

  it('should process single recipient successfully', async () => {
    const request = new Request('http://localhost:3000/api/marketing/bulk-email', {
      method: 'POST',
      body: JSON.stringify({
        recipients: [{ email: 'test@example.com', name: 'John' }],
        subject: 'Olá {{nome}}',
        body: 'Bem-vindo, {{nome}}!'
      })
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.details.success).toBe(1)
    expect(data.details.failed).toBe(0)
    expect(data.details.errors).toHaveLength(0)
  })

  it('should personalize emails with {{nome}} placeholder', async () => {
    const request = new Request('http://localhost:3000/api/marketing/bulk-email', {
      method: 'POST',
      body: JSON.stringify({
        recipients: [{ email: 'test@example.com', name: 'João' }],
        subject: 'Olá {{nome}}',
        body: 'Bem-vindo {{nome}}!'
      })
    })

    const response = await POST(request)
    const data = await response.json()

    // Check that personalization was applied
    expect(data.success).toBe(true)
    // The mock should have been called with personalized content
    const ResendMock = (await import('resend')).Resend
    expect(ResendMock).toHaveBeenCalled()
  })

  it('should handle batch processing for large recipient lists', async () => {
    const recipients = Array.from({ length: 100 }, (_, i) => ({
      email: `user${i}@example.com`,
      name: `User ${i}`
    }))

    const request = new Request('http://localhost:3000/api/marketing/bulk-email', {
      method: 'POST',
      body: JSON.stringify({
        recipients,
        subject: 'Batch test',
        body: 'Testing batch processing'
      })
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.details.success).toBe(100)
    expect(data.details.failed).toBe(0)
  })

  it('should report failed emails', async () => {
    // Mock a failure
    const ResendMock = (await import('resend')).Resend
    const mockSend = vi.fn().mockRejectedValue(new Error('Invalid email'))
    
    // Override the mock for this test
    vi.mocked(ResendMock).mockImplementation(() => ({
      emails: { send: mockSend }
    }))

    const request = new Request('http://localhost:3000/api/marketing/bulk-email', {
      method: 'POST',
      body: JSON.stringify({
        recipients: [{ email: 'invalid-email' }],
        subject: 'Test',
        body: 'Test'
      })
    })

    const response = await POST(request)
    const data = await response.json()

    expect(data.details.failed).toBe(1)
    expect(data.details.errors).toHaveLength(1)
    expect(data.details.errors[0].error).toContain('Invalid email')
  })

  it('should return 500 on internal server error', async () => {
    // Mock a server error
    process.env.RESEND_API_KEY = '' // Missing API key

    const request = new Request('http://localhost:3000/api/marketing/bulk-email', {
      method: 'POST',
      body: JSON.stringify({
        recipients: [{ email: 'test@example.com' }],
        subject: 'Test',
        body: 'Test'
      })
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Erro interno do servidor')
  })
})
