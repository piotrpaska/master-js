import { ThemeProviderState } from '@/contexts/ThemeProvider'
import { createContext, useContext } from 'react'

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null
}

export const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export const useTheme = (): ThemeProviderState => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined) throw new Error('useTheme must be used within a ThemeProvider')

  return context
}
