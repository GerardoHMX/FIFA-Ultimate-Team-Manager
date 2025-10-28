# FIFA Ultimate Team Manager - Versión Mejorada

Una aplicación web de gestión táctica para fútbol 6 con integración a Google Sheets, diseño responsivo y colores estilo FIFA.

## Nuevas Características

### Integración con Google Sheets (Hardcodeada)
- El ID de Google Sheets está configurado directamente en el código
- Carga automática de datos al iniciar la aplicación
- No necesitas ingresar el ID manualmente cada vez

### Diseño Responsivo Completo
- Optimizado para computadoras, tablets (iPads) y móviles
- Colores inspirados en FIFA: negro oscuro, verde neón, tarjetas doradas
- Animaciones suaves y efectos visuales mejorados

### Fotos de Jugadores
- Agrega fotos personalizadas mediante URL
- Icono de persona (👤) por defecto si no hay foto
- Visualización en tarjetas, tabla y estadísticas

### Drag & Drop Mejorado
- Funciona con mouse en computadora
- Soporte táctil completo para iPad y tablets
- Sistema híbrido: arrastra o haz clic para intercambiar

## Configuración de Google Sheets

### Paso 1: Editar el ID en el Código

Abre el archivo `script.js` y busca esta línea (cerca del inicio):

\`\`\`javascript
const GOOGLE_SHEET_ID = "1234567890abcdefghijklmnopqrstuvwxyz";
\`\`\`

Reemplaza el ID con el de tu Google Sheet:

\`\`\`javascript
const GOOGLE_SHEET_ID = "TU_ID_AQUI";
\`\`\`

### Paso 2: Crear tu Hoja de Cálculo

Crea una Google Sheet con estas columnas (en este orden):

| nombre | posicion | pais | foto | titular | lesionado |
|--------|----------|------|------|---------|-----------|
| Dasi | POR | 🇪🇸 | https://... | TRUE | FALSE |
| Susete | DEF | 🇪🇸 | | TRUE | FALSE |
| Hugo | MC | 🇪🇸 | https://... | TRUE | FALSE |
| Ricardo | DEL | 🇪🇸 | | TRUE | FALSE |

**Columnas:**
- **nombre**: Nombre del jugador
- **posicion**: POR, DEF, MC o DEL
- **pais**: Emoji de bandera (🇪🇸, 🇲🇽, 🇧🇷, etc.)
- **foto**: URL de la foto (opcional, dejar vacío para icono)
- **titular**: TRUE o FALSE
- **lesionado**: TRUE o FALSE

### Paso 3: Hacer Pública tu Hoja

1. En Google Sheets: **Archivo → Compartir → Publicar en la web**
2. Selecciona formato **CSV**
3. Haz clic en **Publicar**

### Paso 4: Obtener el ID

De la URL de tu Google Sheet:
\`\`\`
https://docs.google.com/spreadsheets/d/ABC123XYZ456/edit
\`\`\`

Copia solo el ID (entre `/d/` y `/edit`):
\`\`\`
ABC123XYZ456
\`\`\`

## Características Principales

### Gestión de Equipo
- 4 formaciones tácticas: Ofensiva, Equilibrada, Presión Alta, Balanceada
- Intercambio fácil entre titulares y suplentes
- Mínimo 6 jugadores titulares garantizado

### Controles
- **Desktop**: Arrastra y suelta con el mouse
- **Tablet/iPad**: Toca y arrastra con el dedo
- **Móvil**: Toca para seleccionar e intercambiar

### Sidebars Desplegables
- **Izquierdo**: Suplentes disponibles
- **Derecho**: Controles y configuración

### Estadísticas
- Partidos jugados, victorias, empates, derrotas
- Próximos partidos y historial
- Jugadores lesionados y disponibles

## Paleta de Colores

Inspirada en la interfaz de FIFA Ultimate Team:

- **Fondo**: Negro oscuro (#1a1a1a)
- **Acento**: Verde neón (#00ff41)
- **Tarjetas**: Dorado (#c8a14a, #d4af37)
- **Campo**: Verde oscuro (#2d5016, #1a3a0f)
- **UI**: Grises (#2a2a2a, #3a3a3a)

## Instalación

1. Descarga los archivos: `index.html`, `script.js`, `styles.css`
2. Edita el `GOOGLE_SHEET_ID` en `script.js`
3. Abre `index.html` en tu navegador
4. Los datos se cargarán automáticamente desde Google Sheets

## Compatibilidad

- Chrome, Firefox, Safari, Edge (últimas versiones)
- Windows, macOS, Linux
- iPad, tablets Android
- iPhone, móviles Android

## Tecnologías

- HTML5
- CSS3 (Flexbox, Grid, Animaciones, Media Queries)
- JavaScript ES6+
- Google Sheets API (CSV público)
- LocalStorage para persistencia

## Notas Importantes

- Los datos se guardan localmente en tu navegador
- La hoja de Google Sheets debe ser pública
- Las fotos deben ser URLs accesibles públicamente
- Usa servicios como Imgur o Google Drive para alojar fotos

## Personalización

Puedes personalizar:
- Nombre del equipo (botón "EDITAR EQUIPO")
- Logo del equipo (emoji)
- Formación táctica (selector en controles)
- Jugadores y datos (vía Google Sheets)

## Próximas Mejoras

- Autenticación con Google para hojas privadas
- Subir fotos directamente desde la app
- Exportar alineación como imagen
- Múltiples equipos

---

**Desarrollado por Gerardo Huizar Castro**  
Proyecto Escolar - FIFA Ultimate Team Manager
