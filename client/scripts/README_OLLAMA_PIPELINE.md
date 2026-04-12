# Ollama Continuous Algo Pipeline

This pipeline continuously upgrades weak placeholder algorithm entries using your local Ollama.

## 1) Prerequisites

1. Ollama running locally (`ollama --version` already confirmed).
2. Pull a strong coding model (example):
   - `ollama pull qwen2.5-coder:14b`
3. Optional reviewer model:
   - `ollama pull llama3.1:8b`

## 2) One-pass generation

```powershell
cd client
$env:OLLAMA_MODEL="llama3.2:latest"
npm run algo:ollama -- --batch=5
```

## 3) Continuous autonomous generation

```powershell
cd client
$env:OLLAMA_MODEL="llama3.2:latest"
$env:OLLAMA_REVIEWER_MODEL="qwen2.5-coder:1.5b"
npm run algo:ollama:continuous
```

## 3.1) Turbo mode (faster)

```powershell
cd client
$env:OLLAMA_MODEL="qwen2.5-coder:1.5b"
$env:OLLAMA_REVIEWER_MODEL="llama3.2:latest"
npm run algo:ollama:turbo
```

## 3.2) Bullet mode (max speed for 8c/16t laptops)

Use this first on your HP Aero 13 (16GB RAM) to maximize throughput while preserving validation gates:

```powershell
cd client
$env:OLLAMA_MODEL="qwen2.5-coder:1.5b"
npm run algo:ollama:bullet
```

If failure rate spikes (timeouts/JSON failures), switch to:

```powershell
cd client
$env:OLLAMA_MODEL="qwen2.5-coder:1.5b"
npm run algo:ollama:balanced
```

## 4) Useful controls

- Dry run queue preview:
  - `npm run algo:ollama -- --dry-run --batch=10`
- Change endpoint:
  - `npm run algo:ollama -- --endpoint http://localhost:11434`
- Skip reviewer pass:
  - `npm run algo:ollama -- --skip-review`
- Adaptive review (default): reviewer runs only on weak draft outputs.
- Force review for every item:
  - `npm run algo:ollama -- --force-review`
- Disable review (maximum speed, lower safety):
  - `npm run algo:ollama -- --no-review`
- Force larger explanations:
  - `npm run algo:ollama -- --min-desc=1200`
- Tune parallelism:
  - `npm run algo:ollama -- --continuous --batch=8 --concurrency=3`
- Skip recently failed items temporarily (to keep throughput high):
  - `npm run algo:ollama -- --fail-cooldown-min=180`
- Disable easy-first prioritization:
  - `npm run algo:ollama -- --no-prioritize-easy`

## 5) State + resume

The pipeline checkpoints progress in:

`client/scripts/.ollama-pipeline-state.json`

If interrupted, re-run and it resumes from remaining weak entries.
