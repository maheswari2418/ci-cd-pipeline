import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />)
    expect(document.body).toBeTruthy()
  })

  it('renders the Get started heading', () => {
    render(<App />)
    const heading = screen.getByText(/Get started/i)
    expect(heading).toBeTruthy()
  })
})
