Title: SQA: Add Postman collection, mock backend and CI workflow for TG-01/TG-03

Summary:
This PR adds automated Postman/Newman tests for TG-01 (User profile CRUD + auth) and TG-03 (Reviews rating consistency). To make the CI reproducible without dependency on external Maven downloads, a lightweight mock Express backend is included and started by the CI workflow before running Newman.

Files added/modified:
- MisPruebas/coleccion_TG.json (Postman collection)
- MisPruebas/entorno_TG.json (Postman environment, points to mock)
- MisPruebas/mock-backend/server.js (Express mock implementing required endpoints)
- MisPruebas/mock-backend/package.json
- MisPruebas/usuarios.json (mock persistence)
- MisPruebas/reviews.json (mock persistence)
- MisPruebas/README.md (instructions and PR guidance)
- .github/workflows/newman.yml (CI that starts the mock backend and runs Newman)

How to test locally:
1. Start mock backend
   cd MisPruebas/mock-backend
   npm ci
   npm start &
2. Run Newman
   cd ../../
   newman run "MisPruebas/coleccion_TG.json" -e "MisPruebas/entorno_TG.json" -r cli,html --reporter-html-export "MisPruebas/report.html"

What I validated:
- All Newman tests (TG-01 and TG-03) pass against the mock backend locally.

Notes and next steps for maintainers:
- This PR provides a reproducible CI for API contract checks. When the real Spring Boot backend is available in CI (with Maven Central access), we can add an additional workflow to run the same Postman collection against the real service.
- The mock should be treated as a test harness; it does not replace integration testing against the real backend.

Requested reviewers:
- Backend lead (to validate endpoints match real API behaviour)
- QA lead (to validate test cases and expected outcomes)
