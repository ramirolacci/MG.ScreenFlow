# 🎬 Clipper

[![Licencia](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Local First](https://img.shields.io/badge/Privacy-100%25%20Local-emerald)](https://github.com)
[![Vite](https://img.shields.io/badge/Built%20With-Vite%20%26%20React-sky)](https://vite.dev)

**Clipper** es un editor de video web moderno, rápido y privado diseñado para ejecutarse completamente en el navegador. Procesa y edita tus videos de manera local utilizando recursos del cliente, asegurando que tus archivos nunca se suban a un servidor externo.

---

## ✨ Características Principales

*   **🔍 Línea de Tiempo de Alta Precisión:** Corta videos visualizando miniaturas continuas de los fotogramas y previsualizaciones instantáneas al pasar el cursor (hover preview).
*   **📐 Rotación y Espejado:** Corrige la orientación del video girando en 90°/180°/270° o aplicando volteado (flip) horizontal y vertical.
*   **⚡ Velocidad y Volumen:** Modifica el ritmo del video (0.25x a 2.0x) y ajusta los niveles de volumen o silencia la pista con controles intuitivos.
*   **🏢 Conversión a Video Wall:** Divide tu video de manera simétrica en cuadrículas multipantalla (2×1, 1×2, 2×2, 3×2, 2×3) simulando paneles físicos reales.
*   **💾 Exportación Instantánea:** Descarga tus clips editados directamente en formatos **MP4** o **WebM** listos para compartir.

---

## 📸 Galería del Proyecto

Disfruta de una experiencia de edición fluida e interactiva a través de una interfaz de usuario minimalista y optimizada para el rendimiento:

<table width="100%">
  <tr>
    <td width="50%" align="center" valign="top">
      <img src="./screenshots/1-landing.png" alt="Pantalla de Inicio" style="border-radius: 8px; border: 1px solid #334155;" />
      <br /><br />
      <strong>Pantalla de Inicio</strong> — interfaz limpia y zona de dropzone para arrastrar videos
    </td>
    <td width="50%" align="center" valign="top">
      <img src="./screenshots/2-upload.png" alt="Carga de Archivos" style="border-radius: 8px; border: 1px solid #334155;" />
      <br /><br />
      <strong>Carga de Archivos</strong> — selector local para cargar de manera segura y privada
    </td>
  </tr>
  <tr>
    <td width="50%" align="center" valign="top">
      <img src="./screenshots/3-editor.png" alt="Espacio de Trabajo" style="border-radius: 8px; border: 1px solid #334155;" />
      <br /><br />
      <strong>Espacio de Trabajo</strong> — timeline de miniaturas continuo y paneles de control posicionados
    </td>
    <td width="50%" align="center" valign="top">
      <img src="./screenshots/4-editor.png" alt="Opciones y Controles" style="border-radius: 8px; border: 1px solid #334155;" />
      <br /><br />
      <strong>Opciones y Controles</strong> — ajustes de calidad, resoluciones y modos de exportación
    </td>
  </tr>
</table>

---

## 🛡️ Privacidad & Seguridad
Al ser una aplicación **Client-Side** (local-first), la edición de video se procesa enteramente en tu ordenador por medio de elementos HTML5, Canvas y MediaRecorder. Ningún byte es enviado a la red, lo que garantiza confidencialidad absoluta sobre tus contenidos multimedia.

---

## 🚀 Instalación y Uso Local

Sigue estos pasos para ejecutar **Clipper** en tu entorno local:

### 📋 Requisitos Previos

* **Node.js** (v18.0 o superior recomendado)
* Un gestor de paquetes: **pnpm** (recomendado), **npm** o **yarn**

### ⚙️ Pasos de Instalación

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/MiGustoDev/MG.ScreenFlow.git
   cd MG.ScreenFlow
   ```

2. **Instalar dependencias:**
   ```bash
   pnpm install
   # o si usas npm:
   # npm install
   ```

3. **Iniciar el servidor de desarrollo:**
   ```bash
   pnpm dev
   # o con npm:
   # npm run dev
   ```

4. **Abrir en tu navegador:**
   Visita `http://localhost:5173` (o la URL indicada en tu terminal) para comenzar a editar videos.

---

### 📦 Scripts Disponibles

* `pnpm dev` — Inicia el entorno de desarrollo local con Vite (HMR activado).
* `pnpm build` — Compila la aplicación optimizada para producción en la carpeta `/dist`.
* `pnpm preview` — Previsualiza localmente el build de producción.
* `pnpm typecheck` — Ejecuta la verificación estática de tipos con TypeScript.
* `pnpm lint` — Analiza el código con ESLint en busca de inconsistencias.
