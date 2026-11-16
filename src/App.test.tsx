import { render, screen } from '@testing-library/react'
import App from './App'

test('renders the shell with nav and dashboard', () => {
  render(<App />)
  expect(screen.getByRole('navigation', { name: 'Main' })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument()
})
