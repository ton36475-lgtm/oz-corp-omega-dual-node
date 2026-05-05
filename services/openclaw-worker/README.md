# openclaw-worker
This service simulates an orchestrator that distributes tasks across workers and delegates each task to MCP clients (`meta_ads`, `context7`, `deepseek_v4`, `supabase`).

## Running locally
1. Create and activate a virtual environment.
2. Install dependency: `python-dotenv`.
3. Run `python orchestrator.py`.

## Fix: worker error recovery to prevent deadlock
The orchestrator previously could stall with repeated `No idle workers. Scaling up or waiting...` messages when a worker hit an MCP failure and remained in `error` state indefinitely.

The worker flow has been updated so that on MCP failure:
- the worker records `error_count` and `last_error`
- `current_task` is cleared
- worker status returns to `idle`
- an error result is returned for the failed task

This prevents worker starvation and allows remaining queued tasks to continue, so the orchestrator can reach normal shutdown even when intermittent MCP failures occur.
