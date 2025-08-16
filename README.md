# Vet#1delmundo - Sistema de Cálculo Veterinario

Una aplicación web moderna para el cálculo de dosis de medicamentos veterinarios, desarrollada con React, Vite, TailwindCSS y Firebase.

## 🚀 Características

- **Autenticación segura** con Firebase Authentication
- **Cálculo automático** de dosis de medicamentos en tabletas
- **Base de datos en tiempo real** con Firestore
- **Interfaz moderna y responsiva** con TailwindCSS
- **Panel de administración** para gestionar medicamentos
- **Validaciones completas** y manejo de errores

## 📋 Requisitos Previos

- Node.js (versión 16 o superior)
- npm o yarn
- Cuenta de Firebase

## 🛠️ Instalación

1. **Clona el repositorio:**
   ```bash
   git clone <url-del-repositorio>
   cd Vet#1delmundo
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   ```

3. **Configura Firebase:**
   
   a. Ve a [Firebase Console](https://console.firebase.google.com/)
   b. Crea un nuevo proyecto
   c. Habilita Authentication con Email/Password
   d. Crea una base de datos Firestore
   e. Obtén las credenciales de configuración

4. **Configura las credenciales de Firebase:**
   
   Edita el archivo `src/services/firebase.js` y reemplaza la configuración con tus credenciales:
   ```javascript
   const firebaseConfig = {
     apiKey: "tu-api-key",
     authDomain: "tu-proyecto.firebaseapp.com",
     projectId: "tu-proyecto",
     storageBucket: "tu-proyecto.appspot.com",
     messagingSenderId: "123456789",
     appId: "tu-app-id"
   };
   ```

5. **Ejecuta la aplicación:**
   ```bash
   npm run dev
   ```

6. **Abre tu navegador:**
   ```
   http://localhost:5173
   ```

## 📁 Estructura del Proyecto

```
src/
 ├─ assets/                  # Imágenes y recursos estáticos
 ├─ components/              
 │   ├─ InputPeso.jsx        # Campo de entrada para peso
 │   ├─ TablaResultados.jsx  # Tabla de resultados
 │   ├─ MedicamentoRow.jsx   # Fila de medicamento
 │   ├─ Navbar.jsx           # Barra de navegación
 │   ├─ Welcome.jsx          # Mensaje de bienvenida
 │   └─ Loader.jsx           # Componente de carga
 ├─ pages/                   
 │   ├─ Login.jsx            # Página de autenticación
 │   ├─ Dashboard.jsx        # Vista principal
 │   ├─ FarmacosTabletas.jsx # Módulo de tabletas
 │   └─ AdminPanel.jsx       # Panel de administración
 ├─ context/                 
 │   └─ AuthContext.jsx      # Contexto de autenticación
 ├─ services/
 │   ├─ firebase.js          # Configuración de Firebase
 │   └─ medicamentoService.js# Servicios de medicamentos
 ├─ utils/
 │   └─ calculos.js          # Funciones de cálculo
 └─ App.jsx                  # Componente principal
```

## 🔧 Configuración de Firebase

### 1. Authentication
- Ve a Authentication > Sign-in method
- Habilita Email/Password
- Crea un usuario de prueba

### 2. Firestore Database
- Ve a Firestore Database
- Crea una base de datos en modo de prueba
- Crea una colección llamada `medicamentos`

### 3. Reglas de Seguridad
Configura las reglas de Firestore para permitir lectura/escritura autenticada:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /medicamentos/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 💊 Estructura de Datos

Los medicamentos se almacenan en Firestore con esta estructura:

```javascript
{
  "marca": "Nombre comercial",
  "medicamento": "Nombre genérico",
  "dosis": {
    "min": number,        // Dosis mínima en mg/kg
    "max": number | null  // Dosis máxima (opcional)
  },
  "tabletas": [number, number, number, number] // Tamaños disponibles
}
```

## 🧮 Funciones de Cálculo

### dosisMgKg(peso, dosis)
Calcula la dosis total en mg basada en el peso del animal.

### fraccionTableta(dosisMgKg, tamanoTableta)
Calcula la fracción de tableta necesaria.

## 🎨 Personalización

### Colores
Los colores principales se pueden personalizar en `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
        }
      }
    }
  }
}
```

### Estilos
Los estilos personalizados se encuentran en `src/index.css`.

## 🚀 Despliegue

### Vercel (Recomendado)
1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno de Firebase
3. Despliega automáticamente

### Netlify
1. Sube tu código a GitHub
2. Conecta el repositorio a Netlify
3. Configura las variables de entorno

## 📱 Características Responsivas

La aplicación está completamente optimizada para:
- 📱 Móviles (320px+)
- 📱 Tablets (768px+)
- 💻 Escritorio (1024px+)

## 🔒 Seguridad

- Autenticación requerida para todas las rutas
- Validación de datos en frontend y backend
- Reglas de seguridad en Firestore
- Manejo seguro de errores

## 🐛 Solución de Problemas

### Error de conexión a Firebase
- Verifica las credenciales en `firebase.js`
- Asegúrate de que el proyecto esté activo
- Revisa las reglas de Firestore

### Error de autenticación
- Verifica que Authentication esté habilitado
- Confirma que el usuario existe
- Revisa la configuración de Email/Password

### Problemas de cálculo
- Verifica que los datos estén en el formato correcto
- Asegúrate de que los valores numéricos sean válidos

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Si tienes alguna pregunta o problema:
- Abre un issue en GitHub
- Contacta al equipo de desarrollo
- Revisa la documentación de Firebase

---

**Desarrollado con ❤️ para la comunidad veterinaria**
