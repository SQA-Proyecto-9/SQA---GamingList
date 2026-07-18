Colección y entorno para pruebas TG-01 y TG-03 (Postman/Newman)

Resumen
- Colección: coleccion_TG.json
- Entorno: entorno_TG.json

Requisitos locales
- Node.js + npm (para usar `newman` o `npx newman`).
- Postman (opcional) para editar/ejecutar colección.

Mock backend incluido
- Se incluye un mock backend en `MisPruebas/mock-backend` para ejecutar las pruebas sin necesidad de que el backend Spring Boot esté disponible. El mock escucha en `http://localhost:8085` y persiste en `MisPruebas/usuarios.json` y `MisPruebas/reviews.json`.

Ejecutar localmente con Newman (usa mock por defecto)
1. Desde la raíz del repositorio:

```bash
# Instalar newman si no lo tienes
npm install -g newman

# (opcional) arrancar el mock backend en background
cd MisPruebas/mock-backend
npm ci
nohup npm start > mock.log 2>&1 &
cd ../../

# Ejecutar la colección con el entorno (apunta al mock backend)
newman run "MisPruebas/coleccion_TG.json" -e "MisPruebas/entorno_TG.json" -r cli,html --reporter-html-export "MisPruebas/report.html"
```

2. Ver reportes: `MisPruebas/report.html` (si instalaste el reporter HTML) o la salida CLI.

Automatización en GitHub Actions
- El workflow `newman.yml` en `.github/workflows` arranca el **mock backend** incluido y luego ejecuta Newman. Esto permite que el pipeline sea reproducible y verde sin depender de descargas Maven externas.

Preparar Pull Request para tu líder
Incluye estos cambios para que tu líder pueda revisar y aprobar la automatización. Archivos clave añadidos:
- `MisPruebas/coleccion_TG.json` — colección Postman con tests TG-01 y TG-03.
- `MisPruebas/entorno_TG.json` — entorno apuntando por defecto al mock backend.
- `MisPruebas/mock-backend/` — mock Express que implementa los endpoints y persiste en JSON.
- `.github/workflows/newman.yml` — workflow que arranca el mock y ejecuta Newman.

Comandos sugeridos para preparar PR (en tu máquina):
```bash
git checkout -b feature/sqa-postman-newman
git add MisPruebas .github/workflows/newman.yml
git commit -m "SQA: Add Postman collection, mock backend and CI workflow for TG-01/TG-03"
git push origin feature/sqa-postman-newman
# Abrir PR en GitHub con título y descripción adjunta
```

Notas técnicas
- Si en el futuro queréis ejecutar las pruebas contra el backend Spring Boot real, se puede modificar el workflow para intentar arrancar el JAR o `mvn spring-boot:run` si la red del runner permite descargas Maven.
- El mock está pensado solo para pruebas automatizadas E2E de los endpoints REST; no reemplaza validación con la implementación real del backend.

Contacto
- Si quieres, genero el PR y lo subo desde aquí (necesitaría credenciales o un token), o te ayudo a redactar la descripción del PR para tu líder.
