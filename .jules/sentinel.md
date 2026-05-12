# Sentinel Security Journal

## 2026-05-12 - Insecure Direct Object Reference (IDOR) in Event Registration
**Vulnerability:** The `EventController` allowed users to register or unregister any other user for events by providing an arbitrary `userId` as a request parameter. It also lacked authorization checks on the `markAttendance` endpoint.
**Learning:** Reliance on client-provided identifiers for sensitive actions without verifying ownership or authorization leads to IDOR and horizontal/vertical privilege escalation. The application used `@AuthenticationPrincipal` in some controllers but missed it in others, creating an inconsistent security posture.
**Prevention:** Always use the authenticated security context (e.g., `@AuthenticationPrincipal` in Spring) to identify the user performing an action. For administrative actions (like marking attendance), implement explicit role-based access control (RBAC) checks.
