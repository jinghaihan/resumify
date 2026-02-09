import type {
  GenerateSchemaOutputOptions,
  GenerateStreamSchemaOutputOptions,
  ModelClient,
  ModelClientOptions,
  ModelConfig,
  ModelProviderType,
} from './types'
import { SUPPORTED_MODEL_PROVIDERS } from './providers'

export class AIService {
  private clients: Map<ModelProviderType, ModelClient> = new Map()

  parseModel(data: string): { provider: ModelProviderType, model: string } {
    const parts = data.split('/')
    if (parts.length !== 2 || !parts[0] || !parts[1])
      throw new Error(`invalid model format ${data}: expected "provider/modelId"`)

    const provider = parts[0] as ModelProviderType
    if (!SUPPORTED_MODEL_PROVIDERS.some(p => p.id === provider))
      throw new Error(`unsupported provider: ${provider}`)

    return { provider: parts[0], model: parts[1] }
  }

  private async createClient(options: ModelClientOptions): Promise<ModelClient> {
    const provider = SUPPORTED_MODEL_PROVIDERS.find(p => p.id === options.provider)
    if (!provider)
      throw new Error(`unsupported provider: ${options.provider}`)
    return provider.createClient(options)
  }

  async getClient(options: ModelClientOptions): Promise<ModelClient> {
    if (this.clients.has(options.provider))
      return this.clients.get(options.provider)!

    const client = await this.createClient(options)
    this.clients.set(options.provider, client)

    return client
  }

  async fetchModels(options: ModelClientOptions): Promise<ModelConfig[]> {
    const ModelProvider = SUPPORTED_MODEL_PROVIDERS.find(p => p.id === options.provider)
    if (!ModelProvider)
      throw new Error(`unsupported provider: ${options.provider}`)

    const data = await ModelProvider.fetchModels(options)
    return data
  }

  async generateStreamSchemaOutput<T>(options: GenerateStreamSchemaOutputOptions<T>) {
    const client = await this.getClient(options)
    const model = client(options.model)

    const { streamText, Output } = await import('ai')
    const { output } = await streamText({
      model,
      system: options.systemPrompt,
      messages: options.messages ?? [],
      output: Output.object({
        schema: options.schema,
      }),
      abortSignal: options.abortSignal,
    })

    return output
  }

  async generateSchemaOutput<T>(options: GenerateSchemaOutputOptions<T>) {
    const client = await this.getClient(options)
    const model = client(options.model)

    const { generateText, Output } = await import('ai')
    const { output } = await generateText({
      model,
      system: options.systemPrompt,
      prompt: options.userPrompt,
      output: Output.object({
        schema: options.schema,
      }),
      abortSignal: options.abortSignal,
    })

    return output
  }

  dispose() {
    this.clients.clear()
  }
}
