# Execution Knobs (Anchoring Modes)
Project behaviour is configured via `config/project-profile.json`.
## Knobs
- project.scope: `device_only` | `project_only` | `device_and_project`
- anchoring.mode: `direct` | `merkle_aggregated`
- anchoring.frequency: `hourly` | `daily` | `weekly` | `monthly`
- anchoring.batch_mode: `single_turbine` | `multi_turbine`
- ai_verifier.enabled: `true` | `false`
- ai_verifier.auto_approve_threshold: 0.0–1.0
## Example Profiles
### Transparent Classic
- scope: `device_only`
- mode: `direct`
- frequency: `hourly`
- batch_mode: `single_turbine`
- ai_verifier.enabled: false
### Efficient Transparent
- scope: `device_only`
- mode: `direct`
- frequency: `hourly`
- batch_mode: `multi_turbine`
- ai_verifier.enabled: true
### Project Dashboard
- scope: `project_only`
- mode: `direct`
- frequency: `daily`
- batch_mode: `multi_turbine`
- ai_verifier.enabled: true
### Audit-Friendly Compressed
- scope: `device_and_project`
- mode: `merkle_aggregated`
- frequency: `weekly`
- batch_mode: `multi_turbine`
- ai_verifier.enabled: true
### Extreme Cost Saver
- scope: `project_only`
- mode: `merkle_aggregated`
- frequency: `daily`
- batch_mode: `multi_turbine`
- ai_verifier.enabled: true
- ai_verifier.auto_approve_threshold: 0.30
Any project can choose any combination. ENGINE V1 stays the same.
