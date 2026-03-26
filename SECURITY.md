# Security Policy

## Platform Type

Social Media Platform — NigStar

## Data Protection Measures

### Authentication

- All authentication handled by Clerk (SOC 2 Type II certified)
- JWT tokens with automatic rotation
- Session invalidation on logout

### Database Security

- All database connections use SSL (Neon PostgreSQL)
- Prisma ORM prevents SQL injection by design
- No raw SQL queries used

### User Privacy

- Passwords never stored (handled entirely by Clerk)
- User images served via UploadThing CDN
- No third-party tracking scripts

### Security Headers

The following headers are set on every response:

- `X-Frame-Options: DENY` — prevents clickjacking
- `X-Content-Type-Options: nosniff` — prevents MIME sniffing
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` — disables camera, mic, geolocation

### Content Moderation

- Post deletion restricted to post authors only
- All mutations require authenticated sessions
- Rate limiting handled at Vercel edge level

## Reporting a Vulnerability

If you find a security issue, please open a private GitHub issue.
