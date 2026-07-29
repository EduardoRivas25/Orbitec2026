<p align="center">
  <img src="[https://res.cloudinary.com/pwwxj8hf/image/upload/v1785352240/logo_cansat2026-final1_xvqgvl.png](https://res.cloudinary.com/pwwxj8hf/image/upload/v1785354328/orbitec2026-logo.webp)" width="260" alt="ORBITEC Logo"/>
</p>

<h1 align="center">
🚀 ORBITEC • NightRaptor CanSat Mission
</h1>

<p align="center">
<b>Explorar. Innovar. Inspirar.</b>
</p>

<p align="center">

![Astro](https://img.shields.io/badge/Astro-5-FF5D01?style=for-the-badge&logo=astro)

![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38BDF8?style=for-the-badge&logo=tailwindcss)

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)

![Arduino](https://img.shields.io/badge/Arduino-C++-00979D?style=for-the-badge&logo=arduino)

![LoRa](https://img.shields.io/badge/LoRa-Telemetry-blue?style=for-the-badge)

![GPS](https://img.shields.io/badge/GPS-Live-green?style=for-the-badge)

![3D Printing](https://img.shields.io/badge/3D%20Printed-PLA%20CF-orange?style=for-the-badge)

</p>

---

# 🌎 ¿Qué es ORBITEC?

ORBITEC es un equipo multidisciplinario del **Instituto Tecnológico Superior de Uruapan** dedicado al diseño y desarrollo de tecnologías espaciales, sistemas embebidos y plataformas CanSat.

Nuestro objetivo es aplicar ingeniería, programación, electrónica y diseño mecánico para desarrollar soluciones que contribuyan a la sociedad mediante tecnologías aeroespaciales.

---

# 🚀 NightRaptor

NightRaptor es nuestro CanSat de última generación.

Su misión principal consiste en la **detección temprana de incendios forestales**, obteniendo información ambiental durante su descenso para apoyar la protección del medio ambiente.

El sistema integra:

- 🌡 Temperatura
- 💧 Humedad
- 🌬 Presión atmosférica
- 📍 GPS
- 🧭 Magnetómetro
- 📈 Acelerómetro
- 🔄 Giroscopio
- 📡 Telemetría LoRa
- 🪂 Sistema de despliegue de paracaídas
- 💾 Registro de datos

---

# 🌌 Sitio Web Oficial

Este repositorio contiene el desarrollo completo del sitio web oficial de ORBITEC.

La plataforma combina una página informativa con una estación de tierra completamente funcional.

## La web incluye

- Landing Page inspirada en NASA
- Historia del equipo
- ¿Qué es un CanSat?
- Componentes del NightRaptor
- Diseño 3D interactivo
- Animaciones espaciales
- Información del proyecto
- Equipo de desarrollo
- Patrocinadores
- Galería
- Misiones
- Blog
- Contacto

---

# 🛰 Ground Station Dashboard

Uno de los principales módulos del proyecto es una estación de tierra completamente web.

La estación recibirá información en tiempo real mediante una antena LoRa conectada al servidor.

Desde el navegador será posible visualizar:

## Telemetría

- Temperatura
- Humedad
- Presión
- Altitud
- Estado de la batería
- Voltaje
- Intensidad de señal
- RSSI
- SNR

---

## IMU

- Acelerómetro
- Giroscopio
- Magnetómetro
- Orientación

---

## GPS

- Latitud
- Longitud
- Velocidad
- Altitud
- Número de satélites
- Precisión

---

## Eventos

- Encendido
- Lanzamiento
- Separación
- Despliegue del paracaídas
- Aterrizaje
- Pérdida de señal
- Recuperación

---

## Comunicaciones

- Paquetes recibidos
- Paquetes perdidos
- CRC
- RSSI
- SNR
- Tiempo entre paquetes

---

## Visualización

- Mapa interactivo
- Ruta recorrida
- Posición actual
- Altitud en tiempo real
- Gráficas históricas
- Registro de eventos

---

# 🛠 Arquitectura del CanSat

NightRaptor está construido mediante una estructura impresa en 3D con un diseño modular.

El sistema está dividido en cuatro niveles de PCBs circulares.

| Piso | Función |
|------|----------|
| 🔋 Nivel 1 | Energía |
| 🧠 Nivel 2 | Control |
| 📡 Nivel 3 | Sensores |
| 📶 Nivel 4 | Comunicaciones |

La estructura fue diseñada para ser ligera, resistente y completamente modular, permitiendo mantenimiento y futuras actualizaciones.

---

# 💻 Tecnologías

## Frontend

- Astro
- React
- Tailwind CSS
- TypeScript

---

## Backend

- Node.js
- API REST
- WebSockets

---

## Embedded

- Arduino Framework (C++)
- LoRa
- GPS
- Sensores I2C

---

## Diseño

- Fusion 360
- Impresión 3D
- Figma

---

# 📂 Estructura del proyecto

```
.
├── public
├── src
│   ├── assets
│   ├── components
│   ├── layouts
│   ├── pages
│   ├── sections
│   ├── hooks
│   ├── services
│   ├── dashboard
│   └── styles
├── firmware
├── docs
└── README.md
```

---

# ✨ Características

- Landing Page moderna
- Animaciones espaciales
- Dashboard en tiempo real
- Telemetría LoRa
- Mapa GPS
- Diseño responsive
- Modo oscuro
- Componentes reutilizables
- Arquitectura modular

---

# 👨‍🚀 Equipo

Próximamente...

---

# 🎯 Objetivo

Inspirar a nuevas generaciones de ingenieros mientras desarrollamos tecnologías espaciales que contribuyan a la protección del medio ambiente.

---

# 📸 Capturas

Próximamente...

---

# 🚀 Roadmap

- [x] Diseño conceptual
- [x] Diseño mecánico
- [x] Arquitectura electrónica
- [ ] Firmware
- [ ] Dashboard
- [ ] Integración LoRa
- [ ] Telemetría en tiempo real
- [ ] Lanzamiento oficial

---

# 🤝 Contribuciones

Las contribuciones son bienvenidas para fines educativos y de investigación.

Antes de realizar cambios importantes, abre primero un Issue para discutir la propuesta.

---

# 📄 Licencia

Este proyecto está bajo un esquema de **Doble Licenciamiento**.

### Uso educativo y de investigación

El código puede utilizarse libremente para fines educativos, académicos y de investigación bajo los términos especificados por el proyecto.

### Uso comercial

Queda prohibida la utilización del proyecto con fines comerciales sin autorización expresa del equipo ORBITEC.

Para solicitar permisos especiales o una licencia comercial, contacta al equipo de desarrollo.

---

<p align="center">

⭐ Si este proyecto te parece interesante, considera darle una estrella al repositorio.

**ORBITEC • Instituto Tecnológico Superior de Uruapan**

</p>
