# Couple Finance Tracker — CLAUDE.md

## Concepto
App para que dos personas trackeen gastos compartidos. Permite agregar gastos con categoría, quién pagó, cómo se divide, y adjuntar comprobantes (fotos). Balance en tiempo real entre los dos usuarios.

## Stack
| Capa | Tecnología |
|------|-----------|
| Mobile | React Native + Expo (Expo Router) |
| Web | Next.js 14 (App Router) |
| Desktop | Tauri (wrapper de la web en Next.js) |
| Backend | NestJS + Prisma |
| Base de datos | PostgreSQL vía Supabase |
| Auth | Supabase Auth |
| Storage | Supabase Storage (comprobantes) |
| UI Mobile | NativeWind (Tailwind para RN) |
| UI Web | Tailwind CSS |
| Estado | Zustand |
| Fetching | TanStack Query (compartido mobile + web) |
| Formularios | React Hook Form + Zod (compartido) |
| Charts | Recharts (web) / Victory Native (mobile) |

## Estructura del repo (monorepo Turborepo)
```
couple-finance-tracker/
├── apps/
│   ├── backend/          ← NestJS + Prisma
│   ├── mobile/           ← Expo + Expo Router
│   ├── web/              ← Next.js 14
│   └── desktop/          ← Tauri (wrapper de web)
├── packages/
│   ├── shared/           ← tipos, hooks, services compartidos
│   │   ├── types/        ← Expense, User, Couple, etc.
│   │   ├── hooks/        ← useExpenses, useBalance (reutilizables)
│   │   └── services/     ← expenseService, authService
│   └── ui/               ← componentes compartidos (opcional)
├── turbo.json
└── CLAUDE.md
```

## Modelo de datos
```prisma
model User {
  id          String    @id @default(uuid())
  email       String    @unique
  name        String
  avatarUrl   String?
  coupleAs1   Couple?   @relation("User1")
  coupleAs2   Couple?   @relation("User2")
  paidExpenses Expense[]
  splits      ExpenseSplit[]
  createdAt   DateTime  @default(now())
}

model Couple {
  id          String    @id @default(uuid())
  user1Id     String    @unique
  user2Id     String    @unique
  user1       User      @relation("User1", fields: [user1Id], references: [id])
  user2       User      @relation("User2", fields: [user2Id], references: [id])
  inviteCode  String    @unique @default(cuid())
  expenses    Expense[]
  createdAt   DateTime  @default(now())
}

model Expense {
  id          String       @id @default(uuid())
  coupleId    String
  couple      Couple       @relation(fields: [coupleId], references: [id])
  paidById    String
  paidBy      User         @relation(fields: [paidById], references: [id])
  amount      Decimal      @db.Decimal(10, 2)
  category    Category
  description String
  date        DateTime
  splitType   SplitType    @default(EQUAL)
  splits      ExpenseSplit[]
  receipts    Receipt[]
  createdAt   DateTime     @default(now())
}

model ExpenseSplit {
  id          String   @id @default(uuid())
  expenseId   String
  expense     Expense  @relation(fields: [expenseId], references: [id])
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  amountOwed  Decimal  @db.Decimal(10, 2)
  settled     Boolean  @default(false)
}

model Receipt {
  id          String   @id @default(uuid())
  expenseId   String
  expense     Expense  @relation(fields: [expenseId], references: [id])
  fileUrl     String
  uploadedAt  DateTime @default(now())
}

enum Category {
  GROCERIES
  RESTAURANTS
  UTILITIES
  TRANSPORT
  HEALTH
  ENTERTAINMENT
  OTHER
}

enum SplitType {
  EQUAL       // 50/50
  CUSTOM      // porcentaje custom
  FULL        // uno paga todo
}
```

## Arquitectura (Feature-Based, MVVM light)
```
packages/shared/src/
├── types/
│   ├── expense.ts
│   ├── user.ts
│   └── couple.ts
├── hooks/
│   ├── useExpenses.ts      ← TanStack Query (compartido)
│   ├── useBalance.ts
│   └── useCouple.ts
└── services/
    ├── expenseService.ts   ← llamadas a la API
    └── coupleService.ts

apps/mobile/src/
├── app/                    ← Expo Router
│   ├── (auth)/login.tsx
│   ├── (tabs)/
│   │   ├── index.tsx       ← dashboard
│   │   ├── expenses.tsx    ← historial
│   │   └── balance.tsx     ← balance actual
│   └── expenses/new.tsx    ← agregar gasto
├── features/
│   ├── expenses/components/
│   └── dashboard/components/
└── shared/components/      ← Button, Input, etc.

apps/web/src/
├── app/                    ← Next.js App Router
│   ├── (auth)/
│   ├── dashboard/
│   ├── expenses/
│   └── balance/
└── components/

apps/backend/src/
├── auth/
├── expenses/
├── couples/
├── receipts/               ← upload a Supabase Storage
└── prisma/
```

## API endpoints
```
# Auth
POST   /auth/validate

# Couple
POST   /couples/invite       ← generar invite code
POST   /couples/join         ← unirse con invite code
GET    /couples/me           ← pareja actual

# Expenses
GET    /expenses             ← listar (filtros: month, category, userId)
POST   /expenses             ← crear
GET    /expenses/:id
PUT    /expenses/:id
DELETE /expenses/:id
POST   /expenses/:id/receipt ← subir comprobante

# Balance
GET    /balance              ← balance actual de la pareja
GET    /balance/history      ← historial mensual
```

## Variables de entorno
```env
# apps/backend/.env
DATABASE_URL=postgresql://...
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=...
JWT_SECRET=...

# apps/mobile/.env / apps/web/.env
EXPO_PUBLIC_SUPABASE_URL=   # mobile
NEXT_PUBLIC_SUPABASE_URL=   # web
SUPABASE_ANON_KEY=...
API_URL=http://localhost:3000
```

## Roadmap
- [ ] **Etapa 1** — Setup monorepo Turborepo + backend NestJS + auth Supabase
- [ ] **Etapa 2** — Mobile: agregar y listar gastos + balance básico
- [ ] **Etapa 3** — Mobile: split de gastos + comprobantes (fotos)
- [ ] **Etapa 4** — Mobile: dashboard con gráficos + filtros
- [ ] **Etapa 5** — Web: versión Next.js reutilizando hooks/services de shared
- [ ] **Etapa 6** — Desktop: wrapper Tauri de la web

## Categorías con colores
```ts
export const CATEGORIES = {
  GROCERIES:     { label: 'Supermercado', color: '#4CAF50', icon: '🛒' },
  RESTAURANTS:   { label: 'Restaurantes', color: '#FF9800', icon: '🍽️' },
  UTILITIES:     { label: 'Servicios',    color: '#2196F3', icon: '💡' },
  TRANSPORT:     { label: 'Transporte',   color: '#9C27B0', icon: '🚗' },
  HEALTH:        { label: 'Salud',        color: '#F44336', icon: '❤️' },
  ENTERTAINMENT: { label: 'Entretenim.', color: '#FF5722', icon: '🎬' },
  OTHER:         { label: 'Otros',        color: '#607D8B', icon: '📦' },
}
```

## ⚠️ Regla crítica: separación de lógica y UI
**NUNCA poner lógica de negocio, estado, efectos o llamadas a la API dentro de un componente.**
Toda la lógica vive en hooks. Los componentes solo reciben props y renderizan.

Estructura obligatoria dentro de cada feature:
```
features/expenses/
├── components/             ← SOLO JSX. Reciben props, no llaman a la API.
│   ├── ExpenseCard.tsx
│   └── ExpenseForm.tsx
├── hooks/                  ← TODA la lógica: estado, efectos, fetch, mutaciones
│   ├── useExpenses.ts      ← lista + filtros
│   ├── useCreateExpense.ts ← formulario + submit
│   └── useBalance.ts       ← cálculo de balance
└── services/               ← llamadas HTTP puras, sin estado
    └── expenseService.ts
```

Ejemplo correcto:
```tsx
// ✅ hooks/useExpenses.ts — lógica aquí
export function useExpenses(filters?: ExpenseFilters) {
  return useQuery({
    queryKey: ['expenses', filters],
    queryFn: () => expenseService.getAll(filters)
  })
}

// ✅ components/ExpenseList.tsx — solo UI
export function ExpenseList({ filters }: { filters: ExpenseFilters }) {
  const { data, isLoading } = useExpenses(filters)
  if (isLoading) return <LoadingSpinner />
  return data?.map(e => <ExpenseCard key={e.id} expense={e} />)
}
```

Ejemplo incorrecto:
```tsx
// ❌ NUNCA hacer esto en un componente
export function ExpenseList() {
  const [expenses, setExpenses] = useState([])
  useEffect(() => {
    fetch('/expenses').then(r => r.json()).then(setExpenses)
  }, [])
  return expenses.map(e => <ExpenseCard expense={e} />)
}
```

## Convenciones de código
- TypeScript estricto en todo
- Commits en inglés, convencional: `feat:`, `fix:`, `chore:`
- Lógica de negocio SIEMPRE en hooks/services, nunca en componentes
- Componentes: solo renderizan, zero lógica
- No usar `any`
- Formatear amounts siempre con 2 decimales

## Comandos útiles
```bash
# Desde la raíz (Turborepo)
npm run dev              # levanta todos los apps en paralelo
npm run build            # build de todo

# Backend
cd apps/backend
npm run start:dev
npx prisma migrate dev
npx prisma studio

# Mobile
cd apps/mobile
npx expo start
eas build --platform android --profile preview

# Web
cd apps/web
npm run dev

# Desktop (requiere Rust instalado)
cd apps/desktop
npm run tauri dev
```

## Estado actual
- Todo el proyecto: SOLO EXISTE el repo vacío en GitHub.
- El código local tiene el overview.md pero aún no fue pusheado.
- Próximo paso: inicializar monorepo Turborepo y hacer el primer push.
