# Componente de Paginación

Un componente de paginación minimalista y moderno para navegar por listas paginadas.

## Características

- ✅ **Diseño minimalista**: Solo números y flechas simples
- ✅ **Estilos de DesignManagement**: Usa los mismos estilos, colores y animaciones
- ✅ **Paleta de colores de la app**: Gradientes y colores corporativos (#1F64BF)
- ✅ **Animaciones suaves**: Transiciones y efectos hover iguales a DesignManagement
- ✅ **Responsive**: Se adapta a diferentes tamaños de pantalla
- ✅ **Inteligente**: Muestra elipsis (...) cuando hay muchas páginas
- ✅ **Accesible**: Botones deshabilitados cuando corresponde
- ✅ **Información clara**: Muestra "Mostrando X-Y de Z elementos"
- ✅ **Paginación dual**: Disponible arriba y abajo de la lista

## Uso

```jsx
import Pagination from '../../components/Pagination/Pagination';

// En tu componente
const MyComponent = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(5);
  const [totalItems, setTotalItems] = useState(100);
  const [itemsPerPage] = useState(12);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    // Aquí cargas los datos de la nueva página
  };

  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      totalItems={totalItems}
      itemsPerPage={itemsPerPage}
      onPageChange={handlePageChange}
    />
  );
};
```

## Props

| Prop | Tipo | Requerido | Descripción |
|------|------|-----------|-------------|
| `currentPage` | `number` | ✅ | Página actual |
| `totalPages` | `number` | ✅ | Total de páginas |
| `totalItems` | `number` | ✅ | Total de elementos |
| `itemsPerPage` | `number` | ✅ | Elementos por página |
| `onPageChange` | `function` | ✅ | Callback cuando cambia la página |

## Integración con useDesigns

El componente ya está integrado con el hook `useDesigns`:

```jsx
import useDesigns from '../../hooks/useDesigns';

const DesignManagement = () => {
  const {
    designs,
    pagination,
    changePage,
    // ... otros métodos
  } = useDesigns();

  return (
    <div>
      {/* Paginación superior */}
      {pagination.pages > 1 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.pages}
          totalItems={pagination.total}
          itemsPerPage={pagination.limit}
          onPageChange={changePage}
        />
      )}

      {/* Tu lista de diseños */}
      {designs.map(design => (
        <DesignCard key={design.id} {...design} />
      ))}

      {/* Paginación inferior */}
      {pagination.pages > 1 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.pages}
          totalItems={pagination.total}
          itemsPerPage={pagination.limit}
          onPageChange={changePage}
        />
      )}
    </div>
  );
};
```

## Ejemplo Visual

```
Mostrando 1-10 de 29 elementos

‹  1  2  3  ...  10  ›
```

### Estilos aplicados:
- **Página activa**: Gradiente azul con sombra (#1F64BF → #032CA6)
- **Páginas inactivas**: Borde azul claro con hover effects
- **Botones deshabilitados**: Gris atenuado sin efectos
- **Hover**: Elevación y sombra suave
- **Transiciones**: Animaciones suaves con cubic-bezier
- **Tipografía**: Mona Sans con pesos consistentes

### Características visuales:
- **Border radius**: 12px (igual que DesignManagement)
- **Sombras**: Efectos de profundidad sutiles
- **Gradientes**: Mismo estilo que botones principales
- **Animaciones**: translateY(-1px) en hover
