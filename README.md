# 🏗️ zPleum.site — Foundry Architecture v5.0

> **Neural Uplink Established.** A premium, high-performance personal ecosystem built with surgical precision and a high-end "Foundry" aesthetic.

[![Framework: Next.js 15](https://img.shields.io/badge/Framework-Next.js%2015-000000?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Style: Tailwind 4](https://img.shields.io/badge/Style-Tailwind%204-06B6D4?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

---

## 🏛️ Project Overview

**zPleum.site** is more than a portfolio; it's a unified command center. Designed with a custom-engineered "Foundry" design system, it emphasizes mechanical depth, glassmorphism, and surgical typography to create a high-end technical experience.

### 🛰️ Core Modules

*   **🛡️ Command Center (Admin)**: A centralized dashboard for platform management, featuring real-time telemetry and architectural controls.
*   **📡 System Telemetry**: Integrated health monitoring for database status, memory heap usage, uptime, and environment configuration.
*   **🚨 Incident Logs**: Active response recording system for tracking platform events and security anomalies.
*   **🔐 Security Uplink**: Advanced authentication protocol with **Two-Factor (TOTP) Encryption**, JWT-based sessions, and secure HttpOnly cookie management.
*   **📧 Fail-Safe Transmissions**: Contact portal integrated with Cloudflare Turnstile and a "Mailto" redundancy protocol for guaranteed deliverability.
*   **🖼️ Visual Registry**: High-performance gallery and project showcases featuring modular masonry layouts and immersive lightboxes.

---

## 🛠️ Technical Stack

- **Core**: [Next.js 15](https://nextjs.org/) (App Router), TypeScript, React 19
- **Aesthetics**: Tailwind CSS 4, [Framer Motion](https://www.framer.com/motion/)
- **Intelligence**: Custom Telemetry API, Activity Logging Engine
- **Data**: MySQL / MariaDB via Serverless Query layer
- **Communication**: [Resend](https://resend.com/) for Transactional Email
- **Security**: HttpOnly Cookies, JWT, [Speakeasy (TOTP)](https://github.com/speakeasyjs/speakeasy), [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/)

---

## 🚀 Getting Started

### 1. Verification of Requirements
Ensure you have **Node.js 18+** and a **MySQL** instance operational.

### 2. Neural Initialization
```bash
# Clone the repository
git clone https://github.com/zpleum/zPleum.site.git

# Enter the architectural core
cd zPleum.site

# Install dependencies
npm install

# Initialize development sequence
npm run dev
```

### 3. Environment Configuration
Create a `.env` file in the root directory based on `.env.example`:

```env
RESEND_API_KEY=your_resend_api_key

CLOUDFLARE_SECRET=your_cloudflare_turnstile_secret_key
NEXT_PUBLIC_CLOUDFLARE_SITE_KEY=your_cloudflare_turnstile_key

# Database Configuration
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_mysql_password
DB_NAME=your_database_name
DB_PORT=3306

# For cloud databases (TiDB Cloud, PlanetScale, etc.) that require SSL
DB_SSL=true
DB_SSL_REJECT_UNAUTHORIZED=true

# JWT Secrets (generate with: openssl rand -base64 32)
JWT_ACCESS_SECRET=your_random_access_secret_here
JWT_REFRESH_SECRET=your_random_refresh_secret_here

# TOTP Encryption (generate with: openssl rand -hex 32)
TOTP_ENCRYPTION_KEY=your_64_char_hex_encryption_key_here

# Admin Registration (set to 'true' to enable temporary registration)
ENABLE_ADMIN_REGISTRATION=false

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 📂 Architectural Structure

```text
src/
├── app/              # Application Routes (Next.js App Router)
│   ├── admin/        # Secured Command Center
│   ├── api/          # Neural Link Endpoints (Telemetry, Incidents, etc.)
│   └── (site)/       # Public Architectural Entities
├── components/       # Interface Modules (Foundry UI)
├── lib/              # Core Logic & Shared Utilities
└── styles/           # Global Design Tokens & Foundry CSS
```

---

## 📜 Licensing

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<p align="center">
  <b>© 2026 WIRAPHAT MAKWONG. ALL SYSTEMS OPERATIONAL.</b>
</p>
