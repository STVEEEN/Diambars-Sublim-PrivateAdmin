# ✅ TAREAS PENDIENTES - GEOCODIFICACIÓN

## 🔴 URGENTE - Hacer HOY

### Tarea 1: Eliminar Logs de Debugging (15 minutos)
**Archivo:** `src/pages/AddressManagement/AddressMapPicker/AddressMapPicker.jsx`

**Buscar y eliminar estas líneas:**
- Línea 671: `console.log('🗺️ [InteractionHandler] Usuario comenzó a arrastrar el mapa');`
- Línea 680: `console.log('🗺️ [InteractionHandler] Usuario comenzó a mover el mapa manualmente');`
- Línea 692: `console.log('🗺️ [InteractionHandler] Usuario comenzó a hacer zoom');`
- Línea 713: `console.log('🗺️ [AddressMapCenterController] Centrando mapa en:', center, 'con zoom:', zoom);`
- Línea 816: `console.log('🗺️ [AddressMapPicker] Evaluando auto-centrado:', ...);`
- Línea 832: `console.log('🗺️ [AddressMapPicker] Auto-centrando por cambio significativo...');`
- Línea 838: `console.log('🗺️ [AddressMapPicker] Auto-centrando por nueva ubicación inicial');`
- Línea 843: `console.log('🗺️ [AddressMapPicker] Auto-centrado OMITIDO - usuario interactuando...');`
- Línea 852: `console.log('🗺️ [AddressMapPicker] Saltando reverse geocoding - ya procesando');`
- Línea 859: `console.log('🗺️ [AddressMapPicker] Saltando reverse geocoding - ubicación ya procesada');`
- Línea 864: `console.log('🗺️ [useEffect] Evaluando condiciones para reverse geocoding:', ...);`
- Línea 879: `console.log('🗺️ [AddressMapPicker] Iniciando reverse geocoding para:', ...);`
- Línea 885: `console.log('🗺️ [AddressMapPicker] Resultado de reverse geocoding:', ...);`
- Línea 896: `console.log('🗺️ [AddressMapPicker] Auto-poblando formulario con:', ...);`
- Línea 900: `console.log('🚚 [AddressMapPicker] Tiempo estimado de entrega calculado:', ...);`
- Línea 923: `console.log('🗺️ [AddressMapPicker] Enviando datos al formulario:', ...);`
- Línea 927: `console.warn('⚠️ [AddressMapPicker] No se obtuvo resultado válido...');`
- Línea 940: `console.log('🗺️ [AddressMapPicker] Saltando reverse geocoding - condiciones no cumplidas');`
- Línea 957: `console.log('🗺️ [AddressMapPicker] Limpiando timeout de reverse geocoding');`
- Línea 978: `console.log('🗺️ [handleLocationSelect] Nueva ubicación seleccionada:', ...);`
- Línea 1006: `console.log('🗺️ [handleLocationSelect] Estado actualizado - crosshairMode: false, ...);`
- Línea 1010: `console.log('🗺️ [handleConfirmLocation] Confirmando ubicación:', ...);`
- Línea 1022: `console.log('🗺️ [handleConfirmLocation] Ubicación confirmada y panel ocultado');`
- Línea 1024: `console.warn('⚠️ [handleConfirmLocation] No se puede confirmar - falta ubicación...');`

**Mantener SOLO errores críticos:**
```javascript
console.error('❌ [AddressMapPicker] Reverse geocoding failed:', error); // Línea 930
```

---

### Tarea 2: Optimizar Timeout de Reverse Geocoding (2 minutos)
**Archivo:** `src/pages/AddressManagement/AddressMapPicker/AddressMapPicker.jsx`

**Línea 951:**
```javascript
// ❌ ANTES
reverseGeocodingTimeoutRef.current = setTimeout(performReverseGeocode, 1500);

// ✅ CAMBIAR A
reverseGeocodingTimeoutRef.current = setTimeout(performReverseGeocode, 3000);
```

---

### Tarea 3: Acortar Mensaje de Error (1 minuto)
**Archivo:** `src/pages/AddressManagement/AddressMapPicker/AddressMapPicker.jsx`

**Línea 982:**
```javascript
// ❌ ANTES
setError('La ubicación debe estar ÚNICAMENTE dentro del territorio de El Salvador. No se permite colocación en fronteras, océano o países vecinos.');

// ✅ CAMBIAR A
setError('La ubicación debe estar dentro de El Salvador');
```

---

## ⚠️ IMPORTANTE - Hacer Esta Semana

### Tarea 4: Verificar Endpoints del Backend (30 minutos)

**Archivo:** `src/api/AddressService.jsx`

**Verificar que estos endpoints existan y funcionen:**

```javascript
// 1. Validar dirección
const response = await fetch('/api/addresses/validate', {
  method: 'POST',
  body: JSON.stringify({ department, municipality, address })
});
// Espera: { success: true, data: { estimatedDeliveryFee: 5.00 } }

// 2. Obtener datos de ubicaciones
const response = await fetch('/api/addresses/location-data');
// Espera: { success: true, data: { departments: [...], municipalities: {...} } }

// 3. Obtener tarifas de envío
const response = await fetch('/api/addresses/delivery-fees');
// Espera: { success: true, data: { fees: {...}, defaultFee: 10.00 } }

// 4. Establecer ubicación predeterminada
const response = await fetch('/api/addresses/set-default-from-coordinates', {
  method: 'POST',
  body: JSON.stringify({ coordinates: {lat, lng}, department, municipality, userId })
});
// Espera: { success: true, data: { address: {...} } }
```

**Si algún endpoint NO existe:**
- Comentar temporalmente su uso en el frontend
- O crear endpoint en el backend
- O usar datos locales como fallback

---

### Tarea 5: Probar Flujo de Reverse Geocoding (15 minutos)

**Pasos:**
1. Abrir aplicación
2. Click en "Nueva Dirección"
3. Hacer clic en el mapa en San Salvador (aprox 13.69, -89.21)
4. Abrir DevTools Console (F12)
5. Verificar que:
   - ✅ No hay errores rojos
   - ✅ Campo "Departamento" se llena con "San Salvador"
   - ✅ Campo "Municipio" se llena con "San Salvador"
   - ✅ Se sugiere una dirección (si disponible)
   - ✅ Coordenadas se muestran correctamente

**Si falla:**
- Revisar consola para errores
- Verificar que Nominatim responde (network tab)
- Verificar validación de coordenadas
- Revisar logs de `reverseGeocode()`

---

### Tarea 6: Probar Flujo de Forward Geocoding (15 minutos)

**Pasos:**
1. Abrir aplicación
2. Click en "Nueva Dirección"
3. Llenar campos manualmente:
   - Departamento: "La Libertad"
   - Municipio: "Santa Tecla"
   - Dirección: "Calle Principal"
4. Click en botón de "Geocodificar" (si existe)
5. Verificar que:
   - ✅ Mapa se centra en Santa Tecla
   - ✅ Marcador aparece en ubicación correcta
   - ✅ Coordenadas son aproximadamente (13.67, -89.27)

**Si falla:**
- Verificar que `geocodeAddress()` se llama
- Revisar consola para errores
- Verificar que Nominatim responde
- Revisar estrategias de búsqueda

---

### Tarea 7: Probar Validación de Límites (10 minutos)

**Pasos:**
1. Abrir aplicación
2. Click en "Nueva Dirección"
3. Hacer clic FUERA de El Salvador:
   - Océano Pacífico (13.0, -89.5)
   - Honduras (15.0, -88.0)
   - Guatemala (14.5, -90.5)
4. Verificar que:
   - ✅ Muestra error "Fuera de El Salvador"
   - ✅ NO permite seleccionar la ubicación
   - ✅ NO se llena el formulario
   - ✅ Marcador NO aparece

**Si permite ubicaciones fuera:**
- Revisar `isWithinElSalvador()` en GeocodingService
- Verificar límites: `getElSalvadorBounds()`
- Revisar validación en `handleLocationSelect()`

---

### Tarea 8: Simplificar Limpieza de Campos (30 minutos)

**Archivo:** `src/pages/AddressManagement/AddressMapPicker/AddressMapPicker.jsx`

**Líneas 1275-1332 - Reemplazar lógica compleja:**

```javascript
// ❌ ANTES (muy complejo)
const handleClearLocation = () => {
  // ... 60 líneas de código complejo con '___FORCE_CLEAR___'
  const clearData = {
    department: '___FORCE_CLEAR___',
    municipality: '___FORCE_CLEAR___',
    // ... más código complejo
  };
};

// ✅ DESPUÉS (simple y directo)
const handleClearLocation = () => {
  // Limpiar estado local
  setCurrentLocation(null);
  setCrosshairMode(true);
  setAddressInfo(null);
  setDeliveryTimeInfo(null);
  setShowLocationPanel(false);
  setError(null);
  setIsAutoPopulating(false);
  setLastProcessedLocation(null);
  isProcessingRef.current = false;
  
  // Limpiar timeout
  if (reverseGeocodingTimeoutRef.current) {
    clearTimeout(reverseGeocodingTimeoutRef.current);
  }
  
  // Notificar al padre para limpiar formulario
  if (onClearAllFormFields) {
    onClearAllFormFields();
  }
};
```

**Luego en AddressFormModal.jsx, agregar:**
```javascript
onClearAllFormFields={() => {
  setFormData({
    ...initialFormData,
    userId: formData.userId // Mantener usuario seleccionado
  });
  setValidationErrors({});
}}
```

---

## 💡 OPCIONAL - Cuando Tengas Tiempo

### Tarea 9: Implementar Caché de Resultados (1 hora)

**Archivo:** `src/api/GeocodingService.jsx`

**Agregar después de la línea 10:**
```javascript
constructor() {
  // ... código existente ...
  
  // Caché de resultados
  this.geocodingCache = new Map();
  this.reverseGeocodingCache = new Map();
  this.cacheMaxSize = 100;
  this.cacheExpiration = 60 * 60 * 1000; // 1 hora
}

// Nueva función para caché
getCacheKey(lat, lng) {
  return `${lat.toFixed(4)},${lng.toFixed(4)}`;
}

// Modificar reverseGeocode para usar caché
async reverseGeocode(lat, lng) {
  const cacheKey = this.getCacheKey(lat, lng);
  
  // Verificar caché
  if (this.reverseGeocodingCache.has(cacheKey)) {
    const cached = this.reverseGeocodingCache.get(cacheKey);
    if (Date.now() - cached.timestamp < this.cacheExpiration) {
      console.log('[GeocodingService] Usando resultado en caché');
      return cached.data;
    }
  }
  
  // ... código existente de reverseGeocode ...
  
  // Guardar en caché
  if (result) {
    this.reverseGeocodingCache.set(cacheKey, {
      data: result,
      timestamp: Date.now()
    });
    
    // Limitar tamaño de caché
    if (this.reverseGeocodingCache.size > this.cacheMaxSize) {
      const firstKey = this.reverseGeocodingCache.keys().next().value;
      this.reverseGeocodingCache.delete(firstKey);
    }
  }
  
  return result;
}
```

---

### Tarea 10: Agregar Tests Unitarios (2 horas)

**Crear archivo:** `src/api/GeocodingService.test.js`

```javascript
import geocodingService from './GeocodingService';

describe('GeocodingService', () => {
  describe('isWithinElSalvador', () => {
    test('acepta coordenadas de San Salvador', () => {
      expect(geocodingService.isWithinElSalvador(13.6929, -89.2182)).toBe(true);
    });
    
    test('rechaza coordenadas de Honduras', () => {
      expect(geocodingService.isWithinElSalvador(15.0, -88.0)).toBe(false);
    });
    
    test('rechaza coordenadas del océano', () => {
      expect(geocodingService.isWithinElSalvador(13.0, -89.5)).toBe(false);
    });
  });
  
  describe('calculateDistance', () => {
    test('calcula distancia entre dos puntos', () => {
      const distance = geocodingService.calculateDistance(
        13.6929, -89.2182, // San Salvador
        13.6769, -89.2796  // Santa Tecla
      );
      expect(distance).toBeGreaterThan(5);
      expect(distance).toBeLessThan(10);
    });
  });
  
  describe('getDepartmentCenter', () => {
    test('retorna coordenadas de San Salvador', () => {
      const center = geocodingService.getDepartmentCenter('San Salvador');
      expect(center).toEqual({ lat: 13.6929, lng: -89.2182 });
    });
    
    test('retorna null para departamento inexistente', () => {
      const center = geocodingService.getDepartmentCenter('No Existe');
      expect(center).toBeNull();
    });
  });
});
```

---

## 📊 PROGRESO DE TAREAS

```
Tarea 1: Eliminar logs              [ ]  15 min
Tarea 2: Optimizar timeout          [ ]   2 min
Tarea 3: Acortar mensaje error      [ ]   1 min
Tarea 4: Verificar backend          [ ]  30 min
Tarea 5: Probar reverse geocoding   [ ]  15 min
Tarea 6: Probar forward geocoding   [ ]  15 min
Tarea 7: Probar validación límites  [ ]  10 min
Tarea 8: Simplificar limpieza       [ ]  30 min

CRÍTICAS COMPLETADAS:                0/8   (0%)
TIEMPO ESTIMADO RESTANTE:            1.8 horas

Tarea 9: Implementar caché          [ ]  1 hora (opcional)
Tarea 10: Agregar tests             [ ]  2 horas (opcional)
```

---

## ✅ ORDEN RECOMENDADO

### Sesión 1 (20 minutos) - Limpieza Rápida
1. ✅ Tarea 1: Eliminar logs (15 min)
2. ✅ Tarea 2: Optimizar timeout (2 min)
3. ✅ Tarea 3: Acortar mensaje (1 min)

### Sesión 2 (1 hora) - Pruebas
4. ⚠️ Tarea 5: Probar reverse geocoding (15 min)
5. ⚠️ Tarea 6: Probar forward geocoding (15 min)
6. ⚠️ Tarea 7: Probar validación (10 min)
7. ⚠️ Tarea 4: Verificar backend (30 min)

### Sesión 3 (30 minutos) - Optimización
8. ⚠️ Tarea 8: Simplificar limpieza (30 min)

### Sesión 4 (Opcional) - Mejoras
9. 💡 Tarea 9: Implementar caché (1 hora)
10. 💡 Tarea 10: Agregar tests (2 horas)

---

## 📝 NOTAS IMPORTANTES

### Al Eliminar Logs
- ✅ Eliminar todos los `console.log()`
- ✅ Eliminar todos los `console.warn()` de debugging
- ❌ NO eliminar `console.error()` de errores críticos

### Al Probar
- Usar navegador en modo incógnito para evitar caché
- Abrir DevTools Console siempre
- Tomar screenshots de errores
- Documentar comportamiento inesperado

### Si Encuentras Errores
1. Revisar consola del navegador
2. Revisar Network tab (requests a Nominatim)
3. Verificar que coordenadas sean válidas
4. Verificar que backend responda correctamente
5. Revisar logs del servidor (si aplica)

---

**Creado:** 31 de Diciembre, 2024
**Prioridad:** ALTA
**Tiempo Total Estimado:** 1.8 horas (crítico) + 3 horas (opcional)

