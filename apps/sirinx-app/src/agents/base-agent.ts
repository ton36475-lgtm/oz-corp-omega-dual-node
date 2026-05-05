// SIRINX BaseAgent — all 47 Ronin agents extend this
import type { AgentConfig, AgentInput, AgentOutput } from './types'
import { eventBus } from './event-bus'

export abstract class BaseAgent {
  protected config: AgentConfig

  constructor(config: AgentConfig) {
    this.config = config
  }

  get id() { return this.config.id }
  get name() { return this.config.name }
  get layer() { return this.config.layer }

  async execute(input: AgentInput): Promise<AgentOutput> {
    const start = Date.now()
    try {
      await this.publishEvent('agent.started', { agentId: this.id, layer: this.layer }, input.correlationId)
      const data = await this.process(input)
      const processingMs = Date.now() - start
      await this.publishEvent('agent.completed', { agentId: this.id, processingMs }, input.correlationId)
      return {
        agentId: this.id,
        success: true,
        data,
        processingMs,
        confidence: 0.9,
        correlationId: input.correlationId,
        timestamp: new Date().toISOString(),
      }
    } catch (err) {
      const error = err instanceof Error ? err.message : String(err)
      await this.publishEvent('agent.failed', { agentId: this.id, error }, input.correlationId)
      return {
        agentId: this.id,
        success: false,
        error,
        processingMs: Date.now() - start,
        correlationId: input.correlationId,
        timestamp: new Date().toISOString(),
      }
    }
  }

  protected abstract process(input: AgentInput): Promise<Record<string, unknown>>

  protected async publishEvent(type: string, payload: Record<string, unknown>, correlationId?: string): Promise<void> {
    await eventBus.publish(type, payload, this.id, correlationId)
  }
}
