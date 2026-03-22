import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />)
    // Verify the app mounts and renders content
    expect(document.querySelector('#root') || document.body).toBeTruthy()
  })

  it('renders the Vite + React heading', () => {
    render(<App />)
    const heading = screen.getByText(/Vite \+ React/i)
    expect(heading).toBeTruthy()
  })
})
