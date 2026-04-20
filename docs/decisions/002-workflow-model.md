# Decision 002 — Workflow Model

**Status:** Accepted
**Date:** 2026-04-18

## Decision

The product is **task-centric**, not asset-centric. Work is organized as:

```
Project
 └── Task                       (unit of work, e.g. "30s Ramadan TVC")
      ├── Brief                 (objective, deliverables, brand refs, deadline)
      ├── Subtask (optional)    ("Storyboard", "Animatic", "V1 cut", "Color")
      │    └── Asset(s)
      │         └── Versions (V1, V2, V3 …)
      │              └── Review cycle → Approved | Changes Requested
      └── Status                (rolls up from subtasks)
```

Approval is the **atomic closing event** of every task: who approved, when, against which version. This is the audit trail we own.

## Rationale

- Frame.io is asset-centric — assets float without a containing unit of work. Agencies end up tracking "work" in Notion/email and "assets" in Frame.io. That seam is the gap we're closing.
- A task model maps cleanly to how creative agencies already think (briefs, deliverables, rounds of revision).
- Owning the **brief** at the top of the task means owning the start of the lifecycle, not just the end. Frame.io owns neither.
- Approval-as-event gives agencies the legally-relevant artifact for client billing disputes — a real B2B value prop.

## Guardrails — what we are NOT building

To avoid scope-creeping into Asana / ClickUp / Monday territory:

1. **No Gantt charts, no resource planning, no time tracking.**
2. **No task dependencies, sprints, or backlog grooming.** Tasks exist to organize review, not to manage delivery.
3. **Due dates and assignees: yes.** Workload views, capacity planning: no.

If we ever want PM-style features, integrate (Asana/ClickUp/Linear webhooks) — don't build.

## Implications

- Task is the primary entity in the data model; assets belong to tasks (or subtasks), never float at project level.
- Versioning lives at the asset level, not the task level — a task can have multiple assets, each with their own version stack.
- Approval signatures must be immutable and exportable (PDF audit log per task).
- Brief should be a structured field (not just freeform text) so it can be templated per agency.
