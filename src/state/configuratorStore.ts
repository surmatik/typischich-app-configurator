import { create } from 'zustand'

export type Gender = 'Frau' | 'Mann' | 'Kind'
export type Size = string

interface ConfiguratorState {
  gender: Gender | null
  setGender: (gender: Gender) => void

  size: Size | null
  setSize: (size: Size) => void

  color: string | null
  setColor: (color: string) => void

  druckfarbe: string | null
  setDruckfarbe: (farbe: string) => void

  hobbys: string[]
  setHobbys: (h: string[]) => void

  landschaft: string[]
  setLandschaft: (h: string[]) => void

  nameType: string | null
  setNameType: (type: string) => void

  customName: string
  setCustomName: (name: string) => void
}

export const useConfiguratorStore = create<ConfiguratorState>((set) => ({
  gender: null,
  setGender: (gender) => set({ gender }),

  size: null,
  setSize: (size) => set({ size }),

  color: null,
  setColor: (color) => set({ color }),

  druckfarbe: null,
  setDruckfarbe: (farbe) => set({ druckfarbe: farbe }),

  hobbys: [],
  setHobbys: (hobbys) => set({ hobbys }),

  landschaft: '',
  setLandschaft: (landschaft) => set({ landschaft }),

  nameType: null,
  setNameType: (type) => set({ nameType: type }),
  
  customName: '',
  setCustomName: (name) => set({ customName: name }),
}))
