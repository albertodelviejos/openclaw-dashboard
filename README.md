# OpenClaw Dashboard

Dashboard moderno para gestionar agentes de OpenClaw.

## 🚀 Estado Actual

✅ **Completado:**
- UI moderna con diseño glassmorphism
- Interfaz responsive
- API Routes configurados
- Acceso en red local

⏳ **En Desarrollo:**
- Implementación completa del protocolo WebSocket de OpenClaw Gateway
- Gestión de agentes en tiempo real (spawn, kill, steer)

## 📡 Acceso

### Dashboard Custom (Next.js)
```
http://192.168.1.154:3000
```

### Dashboard Nativo de OpenClaw
```
http://192.168.1.154:18789
```

## 🛠️ Desarrollo Local

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev -- -H 0.0.0.0

# Build
npm run build

# Producción
npm start
```

## 🔧 Variables de Entorno

Crear `.env.local`:

```env
OPENCLAW_GATEWAY_URL=http://192.168.1.154:18789
OPENCLAW_GATEWAY_TOKEN=tu_token_aqui
```

## 📝 Notas

El dashboard está expuesto en la red local para acceso desde cualquier dispositivo en tu WiFi.

Para funcionalidad completa ahora, usa el dashboard nativo en el puerto 18789.
