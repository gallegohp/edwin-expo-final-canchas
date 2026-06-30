# 🏟️ Gestor de Canchas de Fútbol Sintético

Aplicación móvil desarrollada con **React Native** y **Expo** para la gestión integral de canchas de fútbol sintético. Permite administrar reservas, finanzas, torneos y el estado de las canchas de forma intuitiva y eficiente.

---

## 📌 Definición del problema

Los administradores de canchas de fútbol sintético suelen manejar sus operaciones de manera manual o con herramientas dispersas (hojas de cálculo, agendas físicas, etc.), lo que genera:

- **Pérdida de información** y dobles reservas.
- **Dificultad para llevar un control financiero** claro (ingresos, gastos, balances).
- **Desorganización en torneos** y enfrentamientos.
- **Falta de visibilidad** del estado de las canchas (disponibilidad, mantenimiento).

Esta aplicación soluciona dichos problemas integrando en un solo lugar:

- Gestión de canchas (CRUD y mantenimiento).
- Reservas con calendario semanal y selector de hora intuitivo.
- Registro financiero automático (ingresos por reservas y gastos manuales).
- Organización de torneos con sorteo aleatorio y seguimiento de resultados.
- Dashboard con gráficos y estadísticas clave.

---

# 🛠️ Requisitos previos

- **Node.js** (versión 14 o superior)
- **npm** o **Yarn**
- **Expo CLI** (o utilizar `npx expo`)
- **Expo Go** para dispositivos móviles (opcional)
- Navegador web moderno o emulador Android/iOS

---

# 📦 Instalación y ejecución

## 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/gestor-canchas.git
cd gestor-canchas
```

## 2. Instalar dependencias

```bash
npm install
```

Si aparecen conflictos de dependencias:

```bash
npm install --legacy-peer-deps
```

## 3. Ejecutar el proyecto

```bash
npx expo start
```

## 4. Abrir la aplicación

### Web

```bash
npm run web
```

o presiona **w** cuando Expo esté ejecutándose.

### Android

```bash
npm run android
```

o presiona **a** en Expo.

### iOS (solo macOS)

```bash
npm run ios
```

o presiona **i**.

### Dispositivo físico

Escanea el código QR con **Expo Go**.

---

# 📁 Estructura del proyecto

```text
GestorCanchas/
├── src/
│   ├── components/
│   │   ├── Boton.js
│   │   ├── CanchaCard.js
│   │   ├── ReservaCard.js
│   │   └── TorneoCard.js
│   │
│   ├── context/
│   │   ├── AppContext.js
│   │   └── AppProvider.js
│   │
│   ├── hooks/
│   │
│   ├── navigation/
│   │   └── AppNavigator.js
│   │
│   ├── screens/
│   │   ├── InicioScreen.js
│   │   ├── CanchasScreen.js
│   │   ├── NuevaCanchaScreen.js
│   │   ├── ReservasScreen.js
│   │   ├── NuevaReservaScreen.js
│   │   ├── FinanzasScreen.js
│   │   ├── TorneosScreen.js
│   │   ├── NuevoTorneoScreen.js
│   │   └── DetalleTorneoScreen.js
│   │
│   ├── styles/
│   │   └── globalStyles.js
│   │
│   └── utils/
│       └── helpers.js
│
├── App.js
├── app.json
├── package.json
└── README.md
```

---

# 🧩 Funcionalidades principales

## 🏟️ Gestión de Canchas

- Crear canchas.
- Editar información.
- Eliminar canchas.
- Registrar precio por hora.
- Registrar capacidad.
- Agregar descripción.
- Marcar una cancha en mantenimiento.
- Visualizar disponibilidad de cada cancha.

---

## 📅 Gestión de Reservas

- Calendario interactivo.
- Selección de fecha.
- Selección de hora mediante botones.
- Duraciones disponibles:

  - 30 minutos
  - 60 minutos
  - 90 minutos
  - 120 minutos

- Precio sugerido automáticamente.
- Registro automático en finanzas.

---

## 💰 Finanzas

- Registro automático de ingresos.
- Registro manual de gastos.
- Balance general.
- Historial de movimientos.
- Totales de ingresos y gastos.

---

## 🏆 Torneos

- Crear torneos.
- Registrar equipos.
- Sorteo aleatorio.
- Llaves de eliminación directa.
- Registro de resultados.
- Avance automático entre rondas.

---

## 📊 Dashboard

Incluye:

- Balance financiero.
- Ingresos.
- Gastos.
- Total de canchas.
- Canchas disponibles.
- Canchas en mantenimiento.
- Torneos activos.
- Gráfico de barras.
- Gráfico circular de reservas.

---

# 📦 Dependencias principales

| Paquete | Uso |
|---------|-----|
| Expo | Framework principal |
| React Native | Desarrollo móvil |
| React Navigation | Navegación |
| React Native Calendars | Calendario |
| React Native Chart Kit | Gráficos |
| React Native SVG | Soporte gráfico |
| Async Storage | Persistencia local |
| DateTimePicker | Selección de fecha |
| Expo Vector Icons | Iconografía |

Consulta `package.json` para ver todas las dependencias.

---

# 🚀 Scripts disponibles

```bash
npm start
```

Inicia Expo.

```bash
npm run web
```

Abre la aplicación en el navegador.

```bash
npm run android
```

Ejecuta Android.

```bash
npm run ios
```

Ejecuta iOS (macOS).

```bash
npx expo start --clear
```

Limpia la caché de Expo.

---

# 📱 Generar APK (Opcional)

Instalar EAS:

```bash
npm install -g eas-cli
```

Iniciar sesión:

```bash
eas login
```

Configurar el proyecto:

```bash
eas build:configure
```

Generar APK:

```bash
eas build --platform android --profile preview
```

---

# 👥 Autor

**Camilo Gallego Palacio**

GitHub:

```
https://github.com/gallegohp/edwin-expo-final-canchas.git
```

Proyecto desarrollado como evidencia del programa **ADSO**.

---

# 📄 Licencia

Proyecto desarrollado únicamente con fines educativos.

No se autoriza su uso comercial sin autorización del autor.

---

