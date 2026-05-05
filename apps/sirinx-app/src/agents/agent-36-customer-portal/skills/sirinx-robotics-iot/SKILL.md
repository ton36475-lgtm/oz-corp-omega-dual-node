---
name: sirinx-robotics-iot
description: >
  SIRINX Robotics & IoT — เชื่อม solar inverters, sensors, และ smart devices เข้ากับ agent system
  Real-time monitoring, predictive maintenance, automated control สำหรับ solar installations
  Triggers on: IoT, robotics, inverter, sensor, SCADA, monitoring hardware, smart meter
---

# SIRINX Robotics & IoT — v1.0

**Mission:** เชื่อม physical solar infrastructure เข้ากับ 47 Ronin agent system ผ่าน IoT protocols

## Core Integrations

### Inverter Brands
- **Sungrow** — Modbus TCP/IP, SolarInfo Bank API
- **Huawei** — FusionSolar API
- **SMA** — Sunny Portal API
- **Growatt** — ShineServer API

### IoT Protocols
- **MQTT** — Real-time sensor data → Supabase
- **Modbus TCP** — Direct inverter comms
- **REST API** — Cloud-based inverters
- **Zigbee/Z-Wave** — Smart meter integration

### Agent Integration
- **Kuranosuke #01** — PV Monitor (reads inverter data)
- **Chikara #02** — Battery Monitor
- **Sōemon #03** — Weather sensor fusion
- **Chūzaemon #07** — Maintenance history

## Data Points Collected

| Sensor | Interval | Agent |
|--------|----------|-------|
| PV Output (kW) | 5 min | #01 |
| Battery SOC (%) | 5 min | #02 |
| Temperature (°C) | 15 min | #03 |
| Grid Import/Export | 5 min | #04 |
| Irradiance (W/m²) | 15 min | #03 |

## Status
🚧 **Stub** — Protocol specs defined, ต้องการ hardware test environment
