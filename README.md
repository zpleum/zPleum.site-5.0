# 🏗️ zPleum.site — Foundry Architecture v5.0

> **Neural Uplink: ESTABLISHED.**  
> **System Integrity: SECURE.**  
> **Aesthetic State: SUPREME.**

zPleum.site is not just a digital portfolio; it is a high-performance, monolithic ecosystem engineered with surgical technical depth and a "Foundry" design language. Built for the modern web, it merges industrial aesthetics with enterprise-grade security and real-time telemetry.

---

## 🏛️ Project Vision: The Foundry Logic

The **Foundry Architecture** represents a paradigm shift in personal platform engineering. It emphasizes structural transparency, high-density telemetry, and a "mechanical" UI that feels reactive and alive.

### 🛰️ Core Ecosystem Modules

#### 🛡️ 1. The Command Center (Admin Matrix)
A highly-privileged management environment for orchestrating the entire platform.
-   **Intelligence Hub**: Real-time traffic flux analysis using high-precision Chart.js visualizations.
    -   **Traffic Flux**: 14-day telemetry tracking Views vs. Unique Visitors.
    -   **Project Weight**: Distribution analysis of works across technical domains.
    -   **Certificate Weight**: Analytical breakdown of licenses and credentials.
-   **System Telemetry**: Live heartbeat monitoring of Database health, Memory Heap, and Deployment uptime.
-   **Diagnostic Terminal**: Full forensic audit logs tracking every administrative directive.
-   **Incident Response**: Active security monitoring for system anomalies and platform events.

#### 🔐 2. The Shield (Security & Identity)
Built on an advanced defensive matrix to ensure absolute system integrity.
-   **Dual-Layer Authentication**: Password-protected entry with mandatory **TOTP (RFC 6238)** Two-Factor Authentication.
-   **Encryption Matrix**: TOTP secrets are encrypted at rest using **AES-256-GCM** with per-user salt rotation.
-   **Session Matrix**: JWT-based identity handshakes using `HttpOnly`, `SameSite=Strict`, and `Secure` cookie protocols.
-   **Rate Limiting**: Multi-tiered protection (Login, 2FA, Registry API) to neutralize brute-force and DDoS vectors.

#### 🖼️ 3. Visual Registry (Content Systems)
-   **Project Architecture**: Managed via a relational category system. Features masonry grid layouts, interactive 3D lightboxes, and multi-asset carousels.
-   **Certificate Vault**: High-precision credential management with "Featured" badges and skills-indexing.
-   **Journey Timeline**: A visual professional history featuring dual-alignment responsive milestones.
-   **Skills Matrix**: High-density tech-stack management organized by domains (Core, DB, Deployment, etc.).

---

## 🛠️ Technical Engineering Stack

| Layer | Standard | Implementation |
| :--- | :--- | :--- |
| **Foundation** | Next.js 15 (App Router) | React 19, Server Actions, Edge Logic |
| **Logic** | TypeScript | Strict Null Checks, Type-Safe API Links |
| **Aesthetics** | Tailwind CSS 4 | Custom Foundry Design Tokens, Glassmorphism |
| **Motion** | Framer Motion | High-Frequency Layout Transitions, Micro-Animations |
| **Storage** | Cloudflare R2 | S3-compatible Object Vault with Automatic Purging |
| **Data Engine** | MySQL (MariaDB) | Relationally Indexed, Serverless Query Handlers |
| **Protection** | Cloudflare Turnstile | Captcha-less bot mitigation for all transmissions |
| **SEO Core** | Dynamic Metadata | Database-driven SEO Orchestration (`generateMetadata`) |

---

## 🎨 Design Engine: "Foundry Aesthetics"

The project utilizes a custom-engineered CSS variable matrix (`src/app/globals.css`) designed for **dark-room scanability**:
-   **OLED Deep Blacks**: `--background: #0a0a0b`.
-   **Foundry Gradients**: Metallic-sheen overlays and glassmorphic blurs (`backdrop-blur-2xl`).
-   **Surgical Typography**: Integrated **Space Grotesk** and custom **LINE Seed** weights for maximum technical readability.
-   **Micro-Interactions**: Custom "Neural Cursor" mouse effects and smooth-scroll propagation.

---

## �️ Database Specification: Neural Schema

Relational data structure optimized for speed and integrity:

-   `admins`: Core identity and encrypted encryption keys.
-   `projects`: Content registry with JSON-serialized asset arrays.
-   `certificates`: Credential registry with indexing for Featured items.
-   `traffic_logs`: High-frequency hit-tracking with IP hashing for privacy-compliant analytics.
-   `incidents`: Forensic records of system-level alerts and performance dips.
-   `seo_settings`: Dynamic site-wide metadata, OG Image configurations, and keywords.
-   `skill_categories` & `skills`: Nested relational system for technical proficiency.

---

## 📡 Neural Link: API Matrix (Reference)

### 🔐 Auth Handshakes
-   `POST /api/auth/login` → Session Initialization.
-   `POST /api/auth/2fa/verify` → High-privileged access grant.
-   `POST /api/auth/logout` → Secure session destruction.

### �️ System Control
-   `GET /api/admin/health` → Integrated telemetry & system diagnostics.
-   `GET /api/admin/analytics/summary` → Collective distribution data.
-   `POST /api/track` → Anonymous telemetry ingestion.

### 🖼️ Registry Access
-   `GET/POST /api/admin/projects` → Work registry orchestration.
-   `GET/POST /api/admin/certificates` → Credential vault management.

---

## 🚀 Neural Initialization Sequence

1.  **Clone the Core**: `git clone https://github.com/zpleum/zPleum.site.git`
2.  **Install Nucleus**: `npm install`
3.  **Setup Environment**: Populate `.env` from the manifest below.
4.  **Database Ignition**: Execute SQL migrations from `database/migrations/`.
5.  **Platform Launch**: `npm run dev`

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
# Generate via: openssl rand -hex 32
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
