import type { AIStore } from './types'
import { APPLICATION_NAME } from '@resumify/shared'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAIStore = create<AIStore>()(
  persist(
    set => ({
      modelSelection: '',
      providers: {},

      updateModelSelection: modelSelection => set({ modelSelection }),

      updateProviders: providers => set({ providers }),

      updateProviderConfig: (provider, config) =>
        set(state => ({
          providers: {
            ...state.providers,
            [provider]: {
              ...config,
              models: Array.isArray(config.models) ? config.models : [],
            },
          },
        })),
      updateProviderApiKey: (provider, apiKey) =>
        set(state => ({
          providers: {
            ...state.providers,
            [provider]: { ...state.providers[provider], apiKey },
          },
        })),
      updateProviderBaseURL: (provider, baseURL) =>
        set(state => ({
          providers: {
            ...state.providers,
            [provider]: { ...state.providers[provider], baseURL },
          },
        })),
      updateProviderEnabled: (provider, enabled) =>
        set(state => ({
          providers: {
            ...state.providers,
            [provider]: { ...state.providers[provider], enabled },
          },
        })),
      toggleProviderEnabled: provider =>
        set(state => ({
          providers: {
            ...state.providers,
            [provider]: {
              ...state.providers[provider],
              enabled: !state.providers[provider].enabled,
            },
          },
        })),

      updateModels: (provider, models) =>
        set(state => ({
          providers: {
            ...state.providers,
            [provider]: {
              ...state.providers[provider],
              models,
            },
          },
        })),
      updateModelEnabled: (provider, model, enabled) =>
        set((state) => {
          const providerConfig = state.providers[provider]
          if (!providerConfig || !Array.isArray(providerConfig.models))
            return state

          const modelConfig = providerConfig.models.find(m => m.id === model)
          if (!modelConfig)
            return state

          return {
            providers: {
              ...state.providers,
              [provider]: {
                ...providerConfig,
                models: providerConfig.models.map(m =>
                  m.id === model ? { ...m, enabled } : m),
              },
            },
          }
        }),
      toggleModelEnabled: (provider, model) =>
        set((state) => {
          const providerConfig = state.providers[provider]
          if (!providerConfig || !Array.isArray(providerConfig.models))
            return state

          const modelConfig = state.providers[provider].models.find(m => m.id === model)
          if (!modelConfig)
            return state

          return {
            providers: {
              ...state.providers,
              [provider]: {
                ...providerConfig,
                models: providerConfig.models.map(m =>
                  m.id === model ? { ...m, enabled: !m.enabled } : m),
              },
            },
          }
        }),
    }),
    {
      name: `${APPLICATION_NAME}-ai`,
      partialize: state => ({
        modelSelection: state.modelSelection,
        providers: state.providers,
      }),
    },
  ),
)
