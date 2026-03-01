import { create } from 'zustand'

export type Gender = 'Frau' | 'Mann' | 'Kind'
export type Size = string

export interface ConfiguratorDraft {
  gender: Gender | null
  size: Size | null
  color: string | null
  druckfarbe: string | null
  hobbys: string[]
  landschaft: string[]
  nameType: string | null
  customName: string
  stepSelections: Record<string, string[]>
}

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

  stepSelections: Record<string, string[]>
  setStepSelections: (step: string, selections: string[]) => void

  hydrateConfigurator: (draft: Partial<ConfiguratorDraft>) => void
  resetConfigurator: () => void
}

const createInitialState = (): ConfiguratorDraft => ({
  gender: null,
  size: null,
  color: null,
  druckfarbe: null,
  hobbys: [],
  landschaft: [],
  nameType: null,
  customName: '',
  stepSelections: {},
})

const isGender = (value: unknown): value is Gender =>
  value === 'Frau' || value === 'Mann' || value === 'Kind'

const toStringArray = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []

const toStepSelections = (value: unknown): Record<string, string[]> => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {}

  const entries = Object.entries(value as Record<string, unknown>)
  return entries.reduce<Record<string, string[]>>((acc, [step, selections]) => {
    acc[step] = toStringArray(selections)
    return acc
  }, {})
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

  landschaft: [],
  setLandschaft: (landschaft) => set({ landschaft }),

  nameType: null,
  setNameType: (type) => set({ nameType: type }),
  
  customName: '',
  setCustomName: (name) => set({ customName: name }),

  stepSelections: {},
  setStepSelections: (step, selections) =>
    set((state) => ({
      stepSelections: {
        ...state.stepSelections,
        [step]: selections,
      },
    })),

  hydrateConfigurator: (draft) =>
    set({
      gender: isGender(draft.gender) ? draft.gender : null,
      size: typeof draft.size === 'string' ? draft.size : null,
      color: typeof draft.color === 'string' ? draft.color : null,
      druckfarbe: typeof draft.druckfarbe === 'string' ? draft.druckfarbe : null,
      hobbys: toStringArray(draft.hobbys),
      landschaft: toStringArray(draft.landschaft),
      nameType: typeof draft.nameType === 'string' ? draft.nameType : null,
      customName: typeof draft.customName === 'string' ? draft.customName : '',
      stepSelections: toStepSelections(draft.stepSelections),
    }),

  resetConfigurator: () => set(createInitialState()),
}))
