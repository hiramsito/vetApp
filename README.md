# VetApp - Sistema Automatizado de Dosis Veterinarias 🐾

🚀 **[Ver Aplicación en Vivo](https://hiram-vetapp.netlify.app/)**

> **🔐 Acceso de Prueba (Modo Demo)**
> Para explorar la interfaz y probar las funcionalidades sin modificar la base de datos de producción, utiliza las siguientes credenciales:
> - **Email:** `demo@vetapp.com`
> - **Contraseña:** `123456`

---

## 📖 El Problema y la Solución

En entornos de clínica veterinaria rápida, la precisión y la velocidad son vitales. Originalmente, el cálculo de dosis para los pacientes se realizaba mediante hojas de Excel genéricas. Aunque funcional, este método resultaba poco intuitivo, tomaba tiempo valioso durante las consultas y era propenso a errores humanos de captura.

**VetApp** fue desarrollado como una solución de software a medida para resolver este cuello de botella. Es una aplicación web moderna que automatiza por completo los cálculos de dosificación (mg/kg y fracciones de tabletas) en tiempo real, optimizando el flujo de trabajo del profesional y garantizando la seguridad del paciente.

## 📸 Vista Previa

<img width="644" height="671" alt="vetapplogin" src="https://github.com/user-attachments/assets/23bd47ad-2d3f-4670-a502-5f56d5186bdf" />

<img width="1901" height="946" alt="vetappdashboard" src="https://github.com/user-attachments/assets/cbcbbf8e-8acc-45d4-b66b-c610f5afc529" />

## 🛠️ Stack Tecnológico

- **Frontend:** React.js, Vite
- **Estilos e Interfaz:** Tailwind CSS
- **Backend / BaaS:** Firebase (Authentication & Firestore Database)
- **Despliegue:** Netlify

## ✨ Características Principales

- **Motor de Cálculo Automático:** Determina dosis totales y fracciones de tabletas al instante basándose en el peso exacto del animal.
- **Gestión de Inventario en Tiempo Real:** Interfaz administrativa conectada a Firestore para agregar, editar y leer datos de medicamentos sin recargar la página.
- **Seguridad y Control de Acceso:** Sistema de autenticación integrado; solo el personal autorizado puede alterar la base de datos de fármacos.
- **Diseño Responsivo:** Interfaz limpia (UI/UX) optimizada para usarse desde el celular durante la consulta o en la computadora de la clínica.
