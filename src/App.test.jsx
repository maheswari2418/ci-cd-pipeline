import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />)
    expect(document.body).toBeTruthy()
  })

  it('renders the hero heading', () => {
    render(<App />)
    const heading = screen.getByText(/Save up to 10%/i)
    expect(heading).toBeTruthy()
  })

  it('renders featured products section', () => {
    render(<App />)
    const section = screen.getByText(/Featured Products/i)
    expect(section).toBeTruthy()
  })

  it('renders testimonials section', () => {
    render(<App />)
    const section = screen.getByText(/What Our Customers Say/i)
    expect(section).toBeTruthy()
  })
})
