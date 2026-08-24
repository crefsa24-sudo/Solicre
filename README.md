# 📝 Solicitud de Crédito — Formulario Web con envío por WhatsApp

Página web para llenar el formato de **Solicitud de Crédito** desde cualquier dispositivo
(celular, tablet o computadora) y enviarlo como **PDF por WhatsApp** al
**+52 249 110 3620**.

## ✨ Características

- 🎨 **Diseño formal**: documento en **hoja tamaño carta (8.5" x 11")**, **cuadrícula azul**,
  rubros en **azul con letras blancas**, datos ingresados en **blanco con letras negras**.
- 🏢 **Espacio para el logo de la empresa** y **título sobresaliente** en el encabezado del documento.
- 🧮 **Cálculos automáticos**: total de ingresos, total de gastos, diferencia (capacidad de pago)
  y capacidad de pago semanal (÷4), tanto del cliente como del aval.
- 👁️ **Vista previa en vivo**: el documento se actualiza mientras se llena el formulario.
- 📤 **Envío del PDF por WhatsApp**:
  - 📱 En celular/tablet usa la **API de compartir del sistema** (Web Share): adjunta el PDF y eliges WhatsApp.
  - 💻 En computadora descarga el PDF automáticamente y abre WhatsApp Web con el mensaje redactado.
- 📥 Botón para **descargar el PDF** e **imprimir**.
- ✅ Validación de campos obligatorios y casilla de aceptación.

## 📁 Estructura

```
├── index.html   # Estructura: formulario + documento carta (Parte 1)
├── styles.css   # Estilos: interfaz + cuadrícula azul del documento (Parte 2)
├── script.js    # Lógica: cálculos, generación de PDF y envío por WhatsApp (Parte 3)
└── README.md    # Este archivo
```

## 🚀 Cómo usar

1. **Sube los 3 archivos** (index.html, styles.css, script.js) a cualquier hosting estático
   (GitHub Pages, Netlify, Vercel) o ábrelos localmente en el navegador.
2. Llena el formulario (la vista previa del documento se actualiza en vivo).
3. Toca **"📤 Enviar PDF por WhatsApp"** y sigue las instrucciones según tu dispositivo.
4. También puedes **descargar el PDF** o **imprimirlo**.

## 📱 Envío por WhatsApp — cómo funciona

> ⚠️ **Importante**: WhatsApp no permite adjuntar archivos mediante enlaces `wa.me`
> (solo texto). Por eso la página usa dos métodos según el dispositivo:

| Dispositivo | Comportamiento |
|---|---|
| 📱 Celular / tablet | Web Share: genera el PDF → abre el menú de compartir → eliges WhatsApp → adjunta el PDF → solo pulsas enviar |
| 💻 Computadora | Descarga automática del PDF + apertura de WhatsApp Web en la conversación con +52 249 110 3620 → arrastras el PDF y envías |

Para enviar el PDF automáticamente desde cualquier dispositivo (incluido escritorio) se necesitaría
un servicio de pago tipo WhatsApp Business API, no es posible con una página estática gratuita.

## 🔧 Personalizar

- **Número de WhatsApp**: edita la variable `NUMERO` en `script.js` (línea ~15).
- **Logo de la empresa**: reemplaza el texto "Logo de la empresa" en `index.html`
  (dentro de `<div class="logo-box">`) por una imagen `<img>` o sube la imagen del logo.
- **Colores**: ajusta las variables CSS al inicio de `styles.css`.

## 🛠️ Tecnologías

HTML + CSS + JavaScript puro, con [jsPDF](https://github.com/parallax/jsPDF) y
[html2canvas](https://github.com/niklasvh/html2canvas.js) cargados vía CDN.
No requiere servidor ni base de datos: todo ocurre en el navegador del usuario.
