import { cn } from './utils'

describe('cn utility', () => {
  it('should merge class names', () => {
    const result = cn('text-red-500', 'bg-blue-500')
    expect(result).toContain('text-red-500')
    expect(result).toContain('bg-blue-500')
  })

  it('should handle conditional classes', () => {
    const isActive = true
    const result = cn('base', isActive && 'active')
    expect(result).toContain('base')
    expect(result).toContain('active')
  })

  it('should filter out falsy values', () => {
    const result = cn('base', false && 'hidden', null, undefined, 'visible')
    expect(result).toContain('base')
    expect(result).toContain('visible')
    expect(result).not.toContain('hidden')
  })

  it('should handle Tailwind class conflicts', () => {
    // tailwind-merge should keep the last conflicting class
    const result = cn('p-4', 'p-8')
    expect(result).toContain('p-8')
    expect(result).not.toContain('p-4')
  })

  it('should handle empty input', () => {
    const result = cn()
    expect(result).toBe('')
  })

  it('should handle arrays of classes', () => {
    const result = cn(['text-sm', 'font-bold'], 'text-center')
    expect(result).toContain('text-sm')
    expect(result).toContain('font-bold')
    expect(result).toContain('text-center')
  })
})
