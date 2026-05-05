export type TrackedEventType =
  | "parked_topic"
  | "watchful_state"
  | "delegated_task"
  | "sensitive_event";

export interface TrackedEvent {
  id: string;
  type: TrackedEventType;
  context_before: string;
  event_core: string;
  immediate_result: string;
  followup_focus: string;
  timestamp: number;
}

export class HermesContinuity {
  private events: TrackedEvent[] = [];
  private stagedMemory: string[] = [];

  stage(info: string): void {
    if (!info.trim()) return;
    this.stagedMemory.push(info);
  }

  track(event: Omit<TrackedEvent, "id" | "timestamp">): TrackedEvent {
    const next: TrackedEvent = {
      ...event,
      id: `event-${Date.now()}`,
      timestamp: Date.now()
    };

    this.events.push(next);
    return next;
  }

  carryover() {
    return {
      recent_memory: this.stagedMemory.slice(-4),
      latest_event: this.events[this.events.length - 1] || null
    };
  }
}
