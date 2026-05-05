/**
 * ContinuityManager
 *
 * Time-aware continuity logic for Hermes Agent.
 * Handles session carryover, staged memory, and tracked follow-ups.
 */

export type TrackedEventType =
  | 'parked_topic'
  | 'watchful_state'
  | 'delegated_task'
  | 'sensitive_event';

export interface TrackedEvent {
  id: string;
  type: TrackedEventType;
  context_before: string;
  event_core: string;
  immediate_result: string;
  followup_focus: string;
  timestamp: number;
}

export interface ContinuityCaptureContext {
  lastIntent?: string;
  commitment?: string;
}

export interface CarryoverOptions {
  recent_4_turns_summary: string;
  last_user_intent: string;
  followup_focus: string | null;
  assistant_commitment: string | null;
}

export class ContinuityManager {
  private stagedMemory: string[] = [];
  private trackedEvents: TrackedEvent[] = [];
  private lastUserIntent = '';
  private assistantCommitments: string[] = [];

  async captureState(context: ContinuityCaptureContext): Promise<void> {
    console.log('ContinuityManager: Capturing state for continuity...');

    this.lastUserIntent = context.lastIntent ?? '';

    if (context.commitment) {
      this.assistantCommitments.push(context.commitment);
    }
  }

  async getCarryoverOptions(): Promise<CarryoverOptions> {
    return {
      recent_4_turns_summary: this.buildRecentSummary(),
      last_user_intent: this.lastUserIntent,
      followup_focus:
        this.trackedEvents.length > 0
          ? this.trackedEvents[this.trackedEvents.length - 1].followup_focus
          : null,
      assistant_commitment:
        this.assistantCommitments.length > 0
          ? this.assistantCommitments[this.assistantCommitments.length - 1]
          : null,
    };
  }

  addTrackedEvent(event: Omit<TrackedEvent, 'id' | 'timestamp'>): TrackedEvent {
    const newEvent: TrackedEvent = {
      ...event,
      id: `event-${Date.now()}`,
      timestamp: Date.now(),
    };

    this.trackedEvents.push(newEvent);

    console.log(
      `ContinuityManager: Tracked new ${event.type}: ${event.event_core}`,
    );

    return newEvent;
  }

  stageMemory(info: string): void {
    if (!info.trim()) return;
    this.stagedMemory.push(info);
  }

  getTrackedEvents(): TrackedEvent[] {
    return [...this.trackedEvents];
  }

  getStagedMemory(): string[] {
    return [...this.stagedMemory];
  }

  clearStagedMemory(): void {
    this.stagedMemory = [];
  }

  private buildRecentSummary(): string {
    const recentMemory = this.stagedMemory.slice(-4);

    if (recentMemory.length === 0) {
      return 'No staged memory yet.';
    }

    return recentMemory.join('\n');
  }
}
