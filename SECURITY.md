# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 2.x     | ✅ Yes    |
| 1.x     | ❌ No     |

## Scope

ConvertLab is a client-side-only PWA. All tool processing happens in the browser — no user data is sent to any server except:

- **Pollinations.ai** — used by AI Text Enhancer (text prompts sent over HTTPS)
- **api.qrserver.com** — used by QR Code tool (QR data sent over HTTPS)
- **EmailJS** — used by the feedback form (feedback messages sent over HTTPS)

## Reporting a Vulnerability

**Please do not open a public GitHub Issue for security vulnerabilities.**

Report privately via GitHub's [Security Advisories](https://github.com/Amatias13/ConvertLab/security/advisories/new), or email directly: **andem2002@gmail.com**

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

You can expect an acknowledgement within **72 hours** and a fix or mitigation within **14 days** for confirmed issues.

## Security Design Notes

- No backend, no accounts, no cookies.
- All localStorage data is scoped to the origin.
- HTML rendered via `dangerouslySetInnerHTML` (Email Preview, Markdown Preview) is sanitized before rendering — inline event handlers and `javascript:` URLs are stripped.
- The Content Security Policy in `index.html` restricts script sources.
