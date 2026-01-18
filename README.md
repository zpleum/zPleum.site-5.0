# 🏗️ zPleum.site — Foundry Architecture v5.0

> **Neural Uplink: ESTABLISHED.**  
> **System Integrity: SECURE.**  
> **Aesthetic State: SUPREME.**

zPleum.site is a high-performance, monolithic ecosystem engineered with surgical technical depth. It bridges industrial aesthetics with enterprise-grade security and real-time telemetry, creating a unified "Foundry" digital workspace.

---

## 🏛️ Project Vision: The Foundry Logic

The **Foundry Architecture** is designed for extreme technical transparency. It is a data-driven ecosystem where every interaction is logged, every asset is optimized, and every transition is physically simulated.

### 🛰️ Core Ecosystem Modules

#### 🛡️ 1. The Command Center (Admin Matrix)
The high-privileged orbital platform for full-scale architectural management.
-   **Intelligence Hub**: Real-time traffic analytics via high-precision Chart.js visuals.
    -   **Traffic Flux**: 14-day telemetry tracking Page Hits vs. Unique Entrants.
    -   **Project Weight**: Real-time distribution analysis of engineering works.
    -   **Certificate Weight**: Analytical breakdown of technical credentials.
-   **System Telemetry**: Live metric ingestion for Database Latency, Heap Memory Usage, and Uptime.
-   **Diagnostic Terminal**: Full forensic audit logs tracking every admin UID and directive path.
-   **Incident Response**: Active monitoring for security anomalies and system-level performance dips.

#### 🔐 2. The Shield (Security & Identity)
A multi-layered defensive matrix ensuring absolute data sovereignty.
-   **Dual-Layer Auth**: Mandatory **TOTP (RFC 6238)** verification for all privileged access.
-   **Encryption Matrix**: Identity secrets are encrypted at rest using **AES-256-GCM** via the `TOTP_ENCRYPTION_KEY`.
-   **Session Handshakes**: JWT tokens (Access/Refresh) utilizing `HttpOnly`, `Secure`, and `SameSite=Strict` browser protocols.
-   **Rate Limiting Matrix**: Tactical throttling for Login (5/15m), 2FA (10/15m), and General API (100/1m) windows.

#### 🖼️ 3. Visual Registry (Dynamic Content)
-   **Project Architecture**: Relational content system with masonry grid layouts and immersive 3D-interpolated lightboxes.
-   **Certificate Vault**: Credential registry with indexing for "Featured" priority and multi-asset carousels.
-   **Journey Timeline**: professional history milestones with responsive dual-alignment logic.
-   **Skills Matrix**: High-density tech management organized into modular logic domains (Core, DB, DevOps).

---

## 🛠️ Engineering Tech Stack Matrix

| Layer | Standard | Implementation Logic |
| :--- | :--- | :--- |
| **Foundation** | Next.js 15 | React 19, Server Components, Turbopack |
| **Logic** | TypeScript | Strict Null Checks, Modular Type Handlers |
| **Aesthetics** | Tailwind CSS 4 | Custom Foundry Design Tokens, Hardware-accelerated blurs |
| **Motion** | Framer Motion | Spring-physics transitions, Layout ID reconciliation |
| **Interaction** | Lenis | High-fidelity smooth scrolling and scroll-bound animations |
| **Storage** | Cloudflare R2 | S3-Compatible Object Storage with automated R2 clearing |
| **Data Engine** | MySQL (MariaDB) | Relationally indexed query pooling via `mysql2` |
| **Protection** | Turnstile | Cloudflare's invisible challenge protocol for bot neutralization |
| **SEO Core** | Dynamic Metadata | Server-side metadata orchestration via `generateMetadata` |

---

## 🎨 Design Engine: "The Foundry Aesthetics"

The project utilizes a custom design token system defined in `src/app/globals.css`.

### Visual Protocols
-   **OLED Background**: `#0a0a0b` for maximum high-contrast scanning.
-   **Foundry Accent**: Precision blues and purples (`#3b82f6`, `#a855f7`).
-   **Glassmorphism**: Surgical border-opacity and backdrop-blur-2xl filters.
-   **Neural Cursor**: Interactive mouse-tracking effect for tactile engagement.

### Typography Matrix
-   **Technical Headline**: `Space Grotesk` (Variable).
-   **Data Readout**: `LINE Seed Sans` (TH/EN).
-   **Foundry Scripts**: Custom `SOV_RangBab` and `SOV_KhongKhanad` for mechanical aesthetic accents.

---

## 🗃️ Database Specification: Neural Schema

Relational data structure designed for relational integrity and query velocity:

-   `admins`: Privileged identity storage with encrypted binary keys.
-   `projects`: Content registry with JSON-serialized technology stacks and links.
-   `certificates`: Credential registry with automatic categorization and featured-weight indexing.
-   `traffic_logs`: High-frequency metrics (IP hashes, paths, referrers, UA strings).
-   `incidents`: Forensic logs for system status changes and security events.
-   `seo_settings`: Dynamic management of Site Title, Description, and OG Graph images.
-   `skill_categories` & `skills`: Reorderable nested system for tech-stack display.

---

## 📡 API Link Matrix (Architectural Reference)

### 🔐 Authentication Protocols
-   `POST /api/auth/login` → Initial identity handshake.
-   `POST /api/auth/2fa/verify` → High-privilege session granting.
-   `GET /api/auth/me` → Continuous signature verification.

### 🛰️ System Telemetry
-   `GET /api/admin/health` → Service status & hardware heartbeats.
-   `GET /api/admin/analytics/summary` → Collective distribution data ingestion.
-   `POST /api/track` → Privacy-aware telemetry ingestion.

---

## 📂 Structural Manifest

```text
src/
├── app/                  # Application Logic (Next.js 15)
│   ├── admin/            # Command Center UI (Intelligence Hub, Registry)
│   ├── api/              # Restful Neural Link Endpoints (Auth, Telemetry)
│   ├── (site)/           # High-Performance UI (About, Contact, Gallery)
│   └── layout.tsx        # Neural Core Layout (Header, SmoothScroll)
├── components/           # Modular Interface Modules
│   ├── admin/            # Management Widgets (CategoryManager, Uploader)
│   ├── Carousel.tsx      # High-end Visual Display Engine
│   └── ProjectLightBox.tsx # Immersive Forensic Inspection
├── lib/                  # Engineering Nucleus
│   ├── db.ts             # Connection Pool Orchestration
│   ├── r2.ts             # Cloudflare Storage Protocols
│   └── middleware/       # Identity & Rate-Limiting Logic
└── database/             # Relational Migrations & Entity Definitions
```

---

## 🚀 Neural Initialization Sequence

1.  **Clone the Architecture**: `git clone https://github.com/zpleum/zPleum.site.git`
2.  **Install Nucleus**: `npm install`
3.  **Configure Manifest**: Populated `.env` using the template below.
4.  **Database Migration**: Execute SQL directives from `database/migrations/`.
5.  **Platform Ignition**: `npm run dev`

---

## 🗝️ Environment Manifest (.env.example)

```env
# 🗝️ FOUNDRY ARCHITECTURE v5.0 — ENVIRONMENT MANIFEST

# [SECURITY]: Transmissions Layer
RESEND_API_KEY=your_resend_api_key

# [SECURITY]: Bot Mitigation (Cloudflare Turnstile)
CLOUDFLARE_SECRET=your_cloudflare_turnstile_secret_key
NEXT_PUBLIC_CLOUDFLARE_SITE_KEY=your_cloudflare_turnstile_key

# [STORAGE]: Cloudflare R2 Logic (S3 Compatible)
R2_ACCESS_KEY_ID=your_r2_access_key
R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
R2_ENDPOINT=https://XXXXX.r2.cloudflarestorage.com
R2_BUCKET_NAME=your_bucket_name
R2_PUBLIC_URL=https://pub-xxxx.r2.dev

# [DATA]: Neural Core (MySQL / MariaDB)
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_mysql_password
DB_NAME=your_database_name
DB_PORT=3306

# [TLS]: SSL/TLS Connectivity Protocols
DB_SSL=true
DB_SSL_REJECT_UNAUTHORIZED=true

# [IDENTITY]: JWT Encryption Matrix
JWT_ACCESS_SECRET=your_random_access_secret_here
JWT_REFRESH_SECRET=your_random_refresh_secret_here

# [IDENTITY]: TOTP Encryption Layer (2FA)
TOTP_ENCRYPTION_KEY=your_64_char_hex_encryption_key_here

# [ORCHESTRATION]: System Access Protocols
ENABLE_ADMIN_REGISTRATION=false

# [NETWORK]: Propagation Control
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

<p align="center">
  <b>© 2026 WIRAPHAT MAKWONG. ALL SYSTEMS OPERATIONAL.</b><br/>
  <i>Engineered for supremacy. Nexus Link Stable.</i>
</p>
