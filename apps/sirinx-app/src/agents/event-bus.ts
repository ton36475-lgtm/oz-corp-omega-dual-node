// SIRINX Event Bus — pub/sub for agent events
import type { AgentEvent } from './types'

type EventHandler = (event: AgentEvent) => void | Promise<void>

class EventBus {
  private handlers: Map<string, Set<EventHandler>> = new Map()

  subscribe(eventType: string, handler: EventHandler): () => void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set())
    }
    this.handlers.get(eventType)!.add(handler)
    return () => this.handlers.get(eventType)?.delete(handler)
  }

  async publish(eventType: string, payload: Record<string, unknown>, source: string, correlationId?: string): Promise<void> {
    const event: AgentEvent = {
      type: eventType,
      payload,
      source,
      timestamp: new Date().toISOString(),
      correlationId,
    }
    const handlers = this.handlers.get(eventType)
    if (handlers) {
      await Promise.all([...handlers].map(h => h(event)))
    }
    // Wildcard listeners
    const wildcards = this.handlers.get('*')
    if (wildcards) {
      await Promise.all([...wildcards].map(h => h(event)))
    }
  }
}

export const eventBus = new EventBus()
export default eventBus
