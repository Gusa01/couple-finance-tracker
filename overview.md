# 💸 App de Gastos para Parejas — Documentación del Proyecto

> Idea y arquitectura definida antes de arrancar a codear.

---

## 🎯 Concepto

App mobile (React Native) + web (React) para que dos personas trackeen gastos compartidos. Permite agregar gastos con categoría, quién pagó, cómo se divide, y adjuntar comprobantes (fotos de facturas, tickets, etc.).

---

## ✅ Funcionalidades

### Gastos

- Agregar gasto con: monto, categoría, descripción, fecha, quién pagó
- Split automático (50/50 o porcentaje custom)
- Balance en tiempo real: "Tu pareja te debe $X" o viceversa
- Historial filtrable por mes, categoría, persona

### Comprobantes

- Foto desde cámara o galería adjunta al gasto
- Vista de comprobante en pantalla completa
- (Futuro) OCR para leer el monto automáticamente

### Categorías

- Supermercado, Restaurantes, Servicios, Transporte, Salud, Entretenimiento, Otros
- Colores e íconos por categoría

### Dashboard

- Resumen mensual con gráficos simples
- Últimos gastos
- Balance actual de la pareja

---

## 🏗️ Arquitectura — Feature-Based (Clean Architecture simplificada)

Cada feature es un módulo autónomo con sus propias capas. La lógica de negocio vive en los hooks y services, los componentes solo renderizan.

```
src/
├── features/
│   ├── auth/
│   ├── expenses/
│   │   ├── components/     # UI pura
│   │   ├── screens/        # Pantallas (RN) / Pages (Web)
│   │   ├── hooks/          # useExpenses, useBalance
│   │   ├── services/       # llamadas a la API
│   │   └── types.ts
│   ├── receipts/
│   └── dashboard/
├── shared/
│   ├── components/         # Button, Input, Modal genéricos
│   ├── hooks/              # useAuth, useToast
│   └── utils/
└── core/
    ├── api/                # cliente HTTP configurado
    └── store/              # estado global
```

### Patrón dentro de cada feature: MVVM light

- **View** → Componentes/Screens (solo renderizan)
- **ViewModel** → Hooks (lógica, estado, efectos)
- **Model** → Services + tipos (hablan con la API)

---

## 🛠️ Stack Tecnológico

### 📱 Mobile — React Native

| Qué            | Herramienta                       | Por qué                             |
| -------------- | --------------------------------- | ----------------------------------- |
| Framework      | **Expo** (SDK 51+)                | Cero config, perfecto para aprender |
| Navegación     | **Expo Router**                   | File-based routing, como Next.js    |
| Estado global  | **Zustand**                       | Simple, sin boilerplate de Redux    |
| Fetching/Cache | **TanStack Query**                | Estándar para server state          |
| Formularios    | **React Hook Form**               | Liviano y potente                   |
| Fotos          | **expo-image-picker**             | Cámara y galería nativas            |
| UI/Estilos     | **NativeWind** (Tailwind para RN) | Misma sintaxis que la web           |

### 🌐 Web — React

| Qué               | Herramienta                            |
| ----------------- | -------------------------------------- |
| Framework         | **Next.js 14** (App Router)            |
| Estilos           | **Tailwind CSS**                       |
| Estado + Fetching | **TanStack Query** (mismo que mobile)  |
| Formularios       | **React Hook Form** (mismo que mobile) |
| Charts            | **Recharts**                           |

> 💡 **Gran ventaja del monorepo**: hooks, services, types y utils se comparten entre mobile y web. La lógica de negocio se escribe UNA sola vez.

### ⚙️ Backend

| Qué                 | Herramienta        | Por qué                                    |
| ------------------- | ------------------ | ------------------------------------------ |
| Runtime             | **Node.js + Hono** | Más moderno que Express, TypeScript nativo |
| Base de datos       | **PostgreSQL**     | Relacional, ideal para este dominio        |
| ORM                 | **Drizzle ORM**    | Liviano, type-safe, fácil de aprender      |
| Auth + DB + Storage | **Supabase**       | Todo en uno, free tier más que suficiente  |
| Deploy backend      | **Railway**        | Free tier 500hs/mes                        |
| Deploy web          | **Vercel**         | Gratis para proyectos personales           |

### 🗂️ Monorepo

**Turborepo** para manejar los tres proyectos (mobile, web, backend) en un solo repo con código compartido.

---

## 🗃️ Modelo de Datos

```sql
users           id, email, name, avatar_url
couples         id, user1_id, user2_id, invite_code
expenses        id, couple_id, paid_by_id, amount, category,
                description, date, split_type, created_at
expense_splits  id, expense_id, user_id, amount_owed, settled
receipts        id, expense_id, file_url, uploaded_at
categories      id, name, icon, color, couple_id (null = global)
```

---

## 💰 Costos

| Servicio                                      | Costo               | Notas                                                         |
| --------------------------------------------- | ------------------- | ------------------------------------------------------------- |
| Expo / React Native / Next.js                 | Gratis              | Open source                                                   |
| Todas las librerías (Zustand, TanStack, etc.) | Gratis              | Open source                                                   |
| Supabase                                      | **Gratis**          | 500MB DB, 1GB storage, 50k usuarios — sobra para dos personas |
| Vercel                                        | **Gratis**          | Para proyectos personales                                     |
| Railway                                       | **Gratis**          | 500hs/mes en free tier                                        |
| Google Play (opcional, futuro)                | U$S 25 una sola vez | Solo si quieren publicar                                      |

**Total para uso personal: $0**

---

## 📱 Deploy Mobile (Android)

### Fase 1 — Desarrollo

**Expo Go**: app que instalás en ambos celulares. Escanean un QR y corren la app al instante. Perfecto mientras se desarrolla.

### Fase 2 — Producción personal

**EAS Build** (Expo Application Services): genera un `.apk` que instalás directamente en los dos celulares Android. Se siente como una app real. Es gratis.

```bash
# Instalar EAS CLI
npm install -g eas-cli

# Login con cuenta Expo
eas login

# Configurar el proyecto
eas build:configure

# Generar APK para Android
eas build --platform android --profile preview
```

Una vez generado, bajás el `.apk` y lo instalás en ambos celulares. Listo.

> No hace falta publicar en Google Play para uso personal. El APK alcanza.

---

## 🗺️ Roadmap de Aprendizaje

| Semana | Foco                                                                        |
| ------ | --------------------------------------------------------------------------- |
| 1-2    | Setup monorepo, auth con Supabase, pantalla de login, crear y listar gastos |
| 3-4    | Categorías, split de gastos, balance, formularios con validación            |
| 5-6    | Upload de comprobantes (fotos), gráficos en dashboard, filtros              |
| 7-8    | Versión web en Next.js (vas a ver lo fácil que se reutiliza la lógica)      |

---

## 🚀 Por dónde arrancar

1. Crear cuenta en [Supabase](https://supabase.com) — configurar DB y storage
2. Inicializar proyecto Expo con `npx create-expo-app`
3. Configurar Expo Router para navegación
4. Conectar Supabase Auth para login
5. Primera pantalla: agregar y listar gastos

---

_Documentación generada como punto de partida del proyecto. ¡A codear!_
