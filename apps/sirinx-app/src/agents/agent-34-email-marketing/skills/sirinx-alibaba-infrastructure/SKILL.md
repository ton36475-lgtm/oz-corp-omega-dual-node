---
name: sirinx-alibaba-infrastructure
description: >
  SIRINX Alibaba Cloud Infrastructure — จัดการ cloud infra บน Alibaba Cloud Bangkok region
  ECS, OSS, SLB, RDS, CDN, VPC, และ OpenClaw AI Runtime deployment
  Triggers on: alibaba cloud, alicloud, ECS, OSS, Bangkok region, cloud infra, deploy cloud
---

# SIRINX Alibaba Cloud Infrastructure — v1.0

**Mission:** จัดการ cloud infrastructure ทั้งหมดของ SIRINX บน Alibaba Cloud Bangkok (ap-southeast-7)

---

## Core Services

### Compute
- **ECS** — OpenClaw AI Runtime server (ecs.c6.xlarge / 4 vCPU, 8GB RAM)
- **ECS Auto Scaling** — scale out เมื่อ agent load > 70%

### Storage & Database
- **OSS** — Object Storage สำหรับ solar data, reports, media
- **RDS PostgreSQL** — Supabase-compatible database
- **Redis** — Agent state cache, session storage

### Networking
- **VPC** — Private network สำหรับ internal agent communication
- **SLB** — Load balancer สำหรับ OpenClaw Gateway
- **CDN** — Static asset delivery สำหรับ sirinx-web

### AI Runtime
- **OpenClaw Gateway** — `openclaw.sirinx.ai` → ECS backend
- **Model Endpoint** — Qwen/DeepSeek via Alibaba Model Studio

## Deployment Config

```yaml
region: ap-southeast-7  # Bangkok
vpc_cidr: 10.0.0.0/16
zones:
  - ap-southeast-7a
  - ap-southeast-7b
openclaw_port: 8080
web_port: 3002
```

## Key Operations

| Operation | Command |
|-----------|---------|
| Deploy OpenClaw | `openclaw deploy --env prod` |
| Scale ECS | `aliyun ecs ModifyScalingRule` |
| Update CDN | `aliyun cdn RefreshObjectCaches` |
| Backup RDS | `aliyun rds CreateBackup` |

## Status

🚧 **Stub** — Infrastructure specs defined, ต้องการ Terraform/Pulumi IaC templates
