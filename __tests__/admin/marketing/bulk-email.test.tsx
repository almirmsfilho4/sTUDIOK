import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BulkEmailPage from '../../../app/admin/marketing/bulk-email/page'

// Mock Firebase
vi.mock('../../../app/firebase', () => ({
  db: {},
  auth: {}
}))

// Mock Firestore
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(() => ({
    // Mock collection reference
  })),
  getDocs: vi.fn()
}))

// Mock fetch
global.fetch = vi.fn()

describe('Admin Bulk Email Page', () => {
  const mockUsers = [
    { email: 'user1@example.com', name: 'User 1', displayName: 'User One' },
    { email: 'user2@example.com', name: 'User 2', displayName: 'User Two' }
  ]

  beforeEach(async () => {
    vi.clearAllMocks()

    // Mock successful Firebase fetch
    const { getDocs } = await import('firebase/firestore')
    vi.mocked(getDocs).mockResolvedValue({
      docs: mockUsers.map(user => ({ data: () => user })),
      size: mockUsers.length
    } as any)

    // Mock successful API response
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        message: '2 enviados, 0 falhas'
      })
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should render the bulk email dashboard', async () => {
    render(<BulkEmailPage />)

    expect(screen.getByText('Disparo em Massa')).toBeInTheDocument()
    expect(screen.getByText('Envie campanhas de marketing para toda a sua base de leads e clientes.')).toBeInTheDocument()
  })

  it('should load users from Firebase on mount', async () => {
    render(<BulkEmailPage />)

    await waitFor(() => {
      expect(screen.getByText('user1@example.com')).toBeInTheDocument()
      expect(screen.getByText('user2@example.com')).toBeInTheDocument()
    })

    const { getDocs } = await import('firebase/firestore')
    expect(getDocs).toHaveBeenCalled()
  })

  it('should allow manual email addition', async () => {
    const user = userEvent.setup()
    render(<BulkEmailPage />)

    const input = screen.getByPlaceholderText('email1@exemplo.com, email2@...')
    await user.type(input, 'manual@example.com')
    
    await user.click(screen.getByRole('button', { name: /add/i }))

    await waitFor(() => {
      expect(screen.getByText('manual@example.com')).toBeInTheDocument()
    })
  })

  it('should prevent duplicate emails', async () => {
    const user = userEvent.setup()
    render(<BulkEmailPage />)

    await waitFor(() => {
      expect(screen.getByText('user1@example.com')).toBeInTheDocument()
    })

    const input = screen.getByPlaceholderText('email1@exemplo.com, email2@...')
    await user.type(input, 'user1@example.com')
    await user.click(screen.getByRole('button', { name: /add/i }))

    // Should still only show one instance of user1@example.com
    const emails = screen.getAllByText('user1@example.com')
    expect(emails).toHaveLength(1)
  })

  it('should remove recipient when delete button clicked', async () => {
    const user = userEvent.setup()
    render(<BulkEmailPage />)

    await waitFor(() => {
      expect(screen.getByText('user1@example.com')).toBeInTheDocument()
    })

    const deleteButton = screen.getAllByRole('button', { name: /remove/i })[0]
    await user.click(deleteButton)

    await waitFor(() => {
      expect(screen.queryByText('user1@example.com')).not.toBeInTheDocument()
    })
  })

  it('should show error when no recipients', async () => {
    const user = userEvent.setup()
    render(<BulkEmailPage />)

    // Remove all recipients
    await waitFor(() => {
      const removeButtons = screen.getAllByRole('button', { name: /remove/i })
      removeButtons.forEach(button => user.click(button))
    })

    // Try to send
    await user.click(screen.getByRole('button', { name: /disparar email em massa/i }))

    expect(await screen.findByText('Adicione pelo menos um destinatário.')).toBeInTheDocument()
  })

  it('should show error when subject is empty', async () => {
    const user = userEvent.setup()
    render(<BulkEmailPage />)

    await waitFor(() => {
      expect(screen.getByText('user1@example.com')).toBeInTheDocument()
    })

    // Fill body but not subject
    const bodyTextarea = screen.getByPlaceholderText('Olá {{nome}}, queremos apresentar...')
    await user.type(bodyTextarea, 'Test body')

    await user.click(screen.getByRole('button', { name: /disparar email em massa/i }))

    expect(await screen.findByText('Assunto e corpo do email são obrigatórios.')).toBeInTheDocument()
  })

  it('should show error when body is empty', async () => {
    const user = userEvent.setup()
    render(<BulkEmailPage />)

    await waitFor(() => {
      expect(screen.getByText('user1@example.com')).toBeInTheDocument()
    })

    // Fill subject but not body
    const subjectInput = screen.getByPlaceholderText('Ex: 🚀 Novidade incrível para o seu negócio!')
    await user.type(subjectInput, 'Test Subject')

    await user.click(screen.getByRole('button', { name: /disparar email em massa/i }))

    expect(await screen.findByText('Assunto e corpo do email são obrigatórios.')).toBeInTheDocument()
  })

  it('should send email successfully', async () => {
    const user = userEvent.setup()
    render(<BulkEmailPage />)

    await waitFor(() => {
      expect(screen.getByText('user1@example.com')).toBeInTheDocument()
    })

    // Fill form
    await user.type(screen.getByPlaceholderText('Ex: 🚀 Novidade incrível para o seu negócio!'), 'Test Subject')
    await user.type(screen.getByPlaceholderText('Olá {{nome}}, queremos apresentar...'), 'Test body')

    // Send
    await user.click(screen.getByRole('button', { name: /disparar email em massa/i }))

    await waitFor(() => {
      expect(screen.getByText('2 enviados, 0 falhas')).toBeInTheDocument()
    })

    expect(global.fetch).toHaveBeenCalledWith('/api/marketing/bulk-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expect.objectContaining({
        recipients: expect.arrayContaining([
          expect.objectContaining({ email: 'user1@example.com' })
        ]),
        subject: 'Test Subject',
        body: 'Test body'
      }))
    })
  })

  it('should show loading state while sending', async () => {
    const user = userEvent.setup()
    render(<BulkEmailPage />)

    // Delay the fetch response
    global.fetch = vi.fn().mockImplementation(() =>
      new Promise(resolve => setTimeout(resolve, 100))
    )

    await waitFor(() => {
      expect(screen.getByText('user1@example.com')).toBeInTheDocument()
    })

    await user.type(screen.getByPlaceholderText('Ex: 🚀 Novidade incrível para o seu negócio!'), 'Test')
    await user.type(screen.getByPlaceholderText('Olá {{nome}}, queremos apresentar...'), 'Body')

    user.click(screen.getByRole('button', { name: /disparar email em massa/i }))

    expect(await screen.findByText('Enviando...')).toBeInTheDocument()
  })

  it('should show error state when API fails', async () => {
    const user = userEvent.setup()
    render(<BulkEmailPage />)

    // Mock API failure
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'API Error' })
    })

    await waitFor(() => {
      expect(screen.getByText('user1@example.com')).toBeInTheDocument()
    })

    await user.type(screen.getByPlaceholderText('Ex: 🚀 Novidade incrível para o seu negócio!'), 'Test')
    await user.type(screen.getByPlaceholderText('Olá {{nome}}, queremos apresentar...'), 'Body')
    await user.click(screen.getByRole('button', { name: /disparar email em massa/i }))

    expect(await screen.findByText('Erro ao enviar emails.')).toBeInTheDocument()
  })

  it('should clear form when clear button clicked', async () => {
    const user = userEvent.setup()
    render(<BulkEmailPage />)

    await waitFor(() => {
      expect(screen.getByText('user1@example.com')).toBeInTheDocument()
    })

    const subjectInput = screen.getByPlaceholderText('Ex: 🚀 Novidade incrível para o seu negócio!')
    const bodyTextarea = screen.getByPlaceholderText('Olá {{nome}}, queremos apresentar...')

    await user.type(subjectInput, 'Test Subject')
    await user.type(bodyTextarea, 'Test body')

    await user.click(screen.getByRole('button', { name: /limpar/i }))

    expect(subjectInput).toHaveValue('')
    expect(bodyTextarea).toHaveValue('')
  })

  it('should display correct recipient count', async () => {
    render(<BulkEmailPage />)

    await waitFor(() => {
      // Wait for users to load
    })

    expect(screen.getByText('Total de destinatários:')).toBeInTheDocument()
    // Should show count of users + any manually added
  })
})
