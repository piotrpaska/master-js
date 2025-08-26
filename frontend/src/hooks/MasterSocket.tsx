import React from 'react'
import type { MasterSocketContextType } from '@/contexts/MasterCommSocket'

export const MasterSocketContext = React.createContext<MasterSocketContextType | undefined>(
  undefined
)

export const useMasterSocket = (): MasterSocketContextType => {
  const context = React.useContext(MasterSocketContext)
  if (!context) {
    throw new Error('useMasterSocket must be used within a MasterSocketProvider')
  }
  return context
}
