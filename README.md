# App Bangla - Admin Equipo de Fútbol

SPA para administrar tu equipo de fútbol: gestión de indumentaria, tesorería y habilitación de jugadores.

## Funcionalidades

- **Indumentaria**: Asignar números de camiseta para 3 partidos (A, B, C) y toggle Pantalón (Sí/No)
- **Tesorería**: Ingresos, egresos y botón rápido para marcar cuota pagada
- **Habilitación**: Solo jugadores con cuota pagada aparecen como ✅ Habilitados
- **Persistencia**: Supabase o localStorage (si no configuras Supabase)

## Inicio rápido

```bash
npm install
npm run dev
```

## Supabase

1. Crea un proyecto en [Supabase](https://supabase.com)
2. Ejecuta el schema en el SQL Editor:
   - Copia el contenido de `supabase/schema.sql`
3. Crea un archivo `.env` en la raíz:

```
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key
```

4. Reinicia el servidor de desarrollo

## Sin Supabase

La app funciona con localStorage. Los datos se mantienen en el navegador sin backend.
