# 🚀 ORBITEC | Información del Proyecto

> Documento de contexto general del proyecto.
>
> Este archivo proporciona toda la información necesaria para que cualquier desarrollador o agente de IA comprenda la arquitectura, objetivos, identidad visual y lineamientos del sitio web oficial de ORBITEC.

---

# ¿Qué es ORBITEC?

**ORBITEC** es un equipo multidisciplinario del **Instituto Tecnológico Superior de Uruapan (México)** dedicado al desarrollo de tecnologías espaciales, sistemas embebidos, electrónica, software y diseño mecánico mediante la plataforma **CanSat**.

Nuestro objetivo es acercar la ingeniería aeroespacial a los estudiantes y desarrollar proyectos tecnológicos que generen un impacto positivo en la sociedad.

---

# Proyecto principal

## NightRaptor

**NightRaptor** es el CanSat desarrollado por ORBITEC.

Su misión principal consiste en la **detección temprana de incendios forestales**, obteniendo información ambiental y de vuelo durante todo el descenso para apoyar la protección del medio ambiente.

---

# Objetivos del sitio web

El sitio web tiene dos funciones principales.

## 1. Sitio oficial del equipo

Presentar al equipo, el proyecto y la misión mediante una experiencia moderna e inmersiva.

Debe incluir:

- Historia del equipo
- ¿Qué es un CanSat?
- Información del proyecto NightRaptor
- Diseño del prototipo
- Componentes electrónicos
- Arquitectura del sistema
- Equipo de desarrollo
- Patrocinadores
- Galería
- Contacto

---

## 2. Estación de Tierra (Ground Station)

El sitio contará con un Dashboard capaz de recibir telemetría en tiempo real desde el CanSat mediante una antena LoRa conectada al servidor.

El Dashboard deberá visualizar información como:

- Temperatura
- Humedad
- Presión atmosférica
- Altitud
- Acelerómetro
- Giroscopio
- Magnetómetro
- GPS
- Estado de batería
- Intensidad de señal
- RSSI
- SNR
- Paquetes recibidos
- Eventos de misión
- Ruta del vuelo
- Historial de telemetría

---

# Identidad visual

Toda la interfaz debe transmitir una sensación de:

- Ingeniería
- Tecnología
- Exploración espacial
- Profesionalismo
- Minimalismo
- Innovación

El diseño debe sentirse como un software oficial de una misión espacial.

---

# Inspiraciones

La interfaz está inspirada principalmente en:

- NASA
- SpaceX
- Agencia Espacial Europea (ESA)
- Apple
- Vercel
- Linear

Evitar estilos:

- Cyberpunk
- Neón
- Colores saturados
- Interfaces recargadas
- Glassmorphism excesivo

La prioridad es una interfaz elegante, técnica y limpia.

---

# Paleta de colores

## Fondo principal

```
#000004
```

## Fondo secundario

```
#050816
```

## Tarjetas

```
#0B1120
```

## Texto principal

```
#FFFFFF
```

## Texto secundario

```
#B5BCC9
```

## Azul institucional

```
#1E90FF
```

## Rojo institucional

```
#E31E24
```

Los colores deben mantenerse consistentes en toda la aplicación.

---

# Tipografía

## Principal

**D-DIN**

Usar en:

- Logo
- Hero
- Navegación
- Botones
- Encabezados
- Tarjetas principales

---

## Secundaria

**Roboto Mono**

Usar en:

- Dashboard
- Valores de sensores
- Coordenadas GPS
- Telemetría
- Consolas
- Código
- Estadísticas

---

# Tecnologías

## Frontend

- Astro
- React
- Tailwind CSS
- TypeScript

---

## Firmware

- Arduino Framework
- C++

---

## Comunicación

- LoRa

---

## Diseño CAD

- Fusion 360

---

## Diseño UI

- Figma

---

# Arquitectura del CanSat

NightRaptor posee una estructura impresa en 3D.

Características:

- Diámetro máximo: **66 mm**
- Altura máxima: **115 mm**
- Fabricado mediante impresión 3D
- Material: PLA reforzado con fibra de carbono
- Arquitectura modular

El sistema está dividido en cuatro niveles de PCB circulares.

## Nivel 1

Sistema de Energía

## Nivel 2

Sistema de Control

## Nivel 3

Sistema de Sensores

## Nivel 4

Sistema de Comunicaciones

Esta arquitectura facilita el mantenimiento y futuras expansiones.

---

# Sensores

El CanSat integra sensores para obtener información de vuelo y del entorno.

## Sensores ambientales

- Temperatura
- Humedad
- Presión
- Altitud

## IMU

- Acelerómetro
- Giroscopio
- Magnetómetro

## Navegación

- GPS

## Comunicación

- LoRa

---

# Dashboard

La estación de tierra debe mostrar información en tiempo real.

## Telemetría

- Temperatura
- Humedad
- Presión
- Altitud

## Navegación

- Latitud
- Longitud
- Velocidad
- Número de satélites

## Estado del sistema

- Voltaje
- Estado de batería
- Intensidad de señal

## Comunicaciones

- RSSI
- SNR
- Paquetes enviados
- Paquetes recibidos
- Tiempo entre paquetes

## Eventos

- Encendido
- Lanzamiento
- Separación
- Despliegue del paracaídas
- Aterrizaje

## Visualización

- Gráficas
- Historial
- Ruta GPS
- Mapa interactivo

---

# Secciones del sitio

- Hero
- ¿Qué es ORBITEC?
- ¿Qué es un CanSat?
- NightRaptor
- Diseño 3D
- Arquitectura del sistema
- Componentes
- Sensores
- Dashboard
- Equipo
- Patrocinadores
- Preguntas frecuentes
- Contacto
- Footer

---

# Principios de desarrollo

Todo el código debe seguir estas reglas:

- Componentes reutilizables.
- Código limpio.
- TypeScript.
- Accesibilidad.
- HTML semántico.
- Diseño responsive.
- Optimización de rendimiento.
- Evitar duplicación de código.
- Mantener consistencia visual.

---

# Rendimiento

Priorizar siempre:

- Alto rendimiento.
- Carga rápida.
- Imágenes optimizadas.
- Lazy Loading.
- Componentes ligeros.
- Excelente puntuación en Lighthouse.

---

# Futuras funcionalidades

- Repetición completa de la misión.
- Visualización 3D del vuelo.
- Historial de misiones.
- Exportación de telemetría.
- Predicción de trayectoria.
- Integración con clima.
- Múltiples CanSat.
- Asistente IA para la misión.

---

# Reglas para agentes de IA

Todo agente que trabaje sobre este proyecto deberá respetar las siguientes reglas:

- Mantener siempre la identidad visual aeroespacial.
- Nunca cambiar la paleta de colores principal.
- Mantener el fondo oscuro (#000004).
- Priorizar interfaces limpias y profesionales.
- Favorecer la reutilización de componentes.
- Pensar siempre como si se estuviera desarrollando software para una misión espacial.
- No añadir efectos visuales innecesarios.
- Mantener consistencia entre todas las páginas.
- Todos los nuevos componentes deben integrarse con el diseño existente.
- Priorizar siempre la legibilidad y la experiencia del usuario.

---

# Visión del proyecto

ORBITEC busca inspirar a nuevas generaciones de ingenieros mediante el desarrollo de tecnologías espaciales accesibles, fomentando la investigación, la innovación y el cuidado del medio ambiente.

Cada decisión de diseño, desarrollo y comunicación debe reflejar esa misión.