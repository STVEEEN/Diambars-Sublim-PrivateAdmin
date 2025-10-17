// src/components/CreateDesignModal/CreateDesignModal.jsx - DROPDOWNS ARREGLADOS
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import Swal from 'sweetalert2';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Chip,
  CircularProgress,
  styled,
  alpha,
  useTheme,
  useMediaQuery,
  Popper,
  Fade,
  Modal,
  Backdrop
} from '@mui/material';
import {
  X,
  Users,
  Package,
  Palette,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Plus,
  Eye,
  PencilSimple
} from '@phosphor-icons/react';

// Importar componentes
import KonvaDesignEditor from '../KonvaDesignEditor/KonvaDesignEditor';
import KonvaDesignViewer from '../KonvaDesignEditor/components/KonvaDesignViewer';

// ================ HOOK SIMPLIFICADO PARA SCROLL ================
const useScroll = () => {
  // ✅ SIMPLIFICADO: Solo retornar props vacías para mantener compatibilidad
  // El scroll funciona automáticamente con overflowY: 'auto'
  return {
    scrollProps: {}
  };
};

// ================ HOOK PARA PERSISTENCIA DE CANVAS ================
const useCanvasPersistence = () => {
  const [canvasData, setCanvasData] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const saveCanvasData = useCallback((data) => {
    console.log('💾 [CanvasPersistence] Guardando datos del canvas:', data);
    setCanvasData(data);
  }, []);

  const loadCanvasData = useCallback(() => {
    console.log('📂 [CanvasPersistence] Cargando datos del canvas:', canvasData);
    return canvasData;
  }, [canvasData]);

  // ✅ NUEVO: Función para obtener datos actuales sin dependencias
  const getCurrentCanvasData = useCallback(() => {
    return canvasData;
  }, [canvasData]);

  const openEditor = useCallback((initialData = null) => {
    console.log('🎨 [CanvasPersistence] Abriendo editor con datos:', initialData);
    if (initialData) {
      setCanvasData(initialData);
    }
    setIsEditorOpen(true);
  }, []);

  const closeEditor = useCallback(() => {
    console.log('❌ [CanvasPersistence] Cerrando editor');
    setIsEditorOpen(false);
  }, []);

  const openPreview = useCallback(() => {
    console.log('👁️ [CanvasPersistence] Abriendo vista previa');
    setIsPreviewOpen(true);
  }, []);

  const closePreview = useCallback(() => {
    console.log('❌ [CanvasPersistence] Cerrando vista previa');
    setIsPreviewOpen(false);
  }, []);

  return {
    canvasData,
    isEditorOpen,
    isPreviewOpen,
    saveCanvasData,
    loadCanvasData,
    getCurrentCanvasData,
    openEditor,
    closeEditor,
    openPreview,
    closePreview
  };
};

// ================ SERVICIO DE VALIDACIÓN INTEGRADO ================
const DesignService = {
  validateElementsForSubmission: (elements) => {
    const errors = [];
    
    if (!elements || elements.length === 0) {
      errors.push('Debe agregar al menos un elemento al diseño');
    }
    
    elements.forEach((element, index) => {
      
      if (!element.type) {
        errors.push(`Elemento ${index + 1}: tipo no definido`);
      }
      
      if (!element.konvaAttrs) {
        errors.push(`Elemento ${index + 1}: atributos no definidos`);
      }
      
      // ✅ CORRECCIÓN: Validación unificada del texto (consistente con ValidationService)
      if (element.type === 'text') {
        const textContent = element.text || element.konvaAttrs?.text || '';
        if (!textContent || textContent.trim() === '') {
          errors.push(`Elemento de texto ${index + 1}: texto vacío`);
        }
      }
      
      if (element.type === 'image') {
        // Validar que tenga al menos una fuente de imagen
        const hasImageUrl = element.konvaAttrs?.imageUrl || element.imageUrl;
        const hasImage = element.konvaAttrs?.image || element.image;
        const hasSrc = element.src;
        
        if (!hasImageUrl && !hasImage && !hasSrc) {
          errors.push(`Elemento de imagen ${index + 1}: URL de imagen no definida`);
        }
      }
      
      // Validaciones para formas básicas
      if (element.type === 'rect' || element.type === 'circle') {
        if (element.konvaAttrs?.width === 0 || element.konvaAttrs?.height === 0) {
          errors.push(`Elemento de forma ${index + 1}: dimensiones inválidas`);
        }
      }
      
      // Validaciones para formas con puntos
      if (element.type === 'triangle' || element.type === 'star' || element.type === 'customShape' || element.type === 'line') {
        if (!element.konvaAttrs?.points || element.konvaAttrs.points.length === 0) {
          errors.push(`Elemento de forma ${index + 1}: puntos no definidos`);
        } else if (element.konvaAttrs.points.length < 6) {
          errors.push(`Elemento de forma ${index + 1}: debe tener al menos 3 puntos (6 coordenadas)`);
        }
      }
    });
    
    // Validación para datos del canvas (nuevo formato)
    if (elements && elements.canvas) {
      const canvasObjects = elements.canvas.objects || [];
      if (canvasObjects.length === 0) {
        errors.push('El canvas no contiene elementos');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
};

// ================ CUSTOM POPPER PARA DROPDOWNS SIN ANIMACIONES ================
const CustomPopper = styled(Popper)(({ theme }) => ({
  zIndex: 99999, // Z-index más alto
  '& *': {
    transition: 'none !important',
    animation: 'none !important',
    transform: 'none !important',
  },
  '& .MuiPaper-root': {
    borderRadius: '12px',
    boxShadow: '0 8px 32px rgba(1, 3, 38, 0.16)',
    border: `1px solid ${alpha('#1F64BF', 0.12)}`,
    marginTop: '4px',
    maxHeight: '300px',
    overflow: 'auto',
    transition: 'none !important',
    animation: 'none !important',
    transform: 'none !important',
    '& *': {
      transition: 'none !important',
      animation: 'none !important',
      transform: 'none !important',
    },
    '&::-webkit-scrollbar': {
      width: '6px',
    },
    '&::-webkit-scrollbar-track': {
      background: '#f1f1f1',
      borderRadius: '3px',
    },
    '&::-webkit-scrollbar-thumb': {
      background: alpha('#1F64BF', 0.3),
      borderRadius: '3px',
      '&:hover': {
        background: alpha('#1F64BF', 0.5),
      },
    },
  }
}));

// ================ ESTILOS GLOBALES PARA ANIMACIONES ================
const GlobalStyles = () => (
  <style>
    {`
    @keyframes flowMove {
      0% {
        opacity: 0.2;
        transform: scale(1);
      }
      50% {
        opacity: 0.4;
        transform: scale(1.01);
      }
      100% {
        opacity: 0.3;
        transform: scale(1);
      }
    }

    @keyframes shineMove {
      0% {
        left: -100%;
      }
      20% {
        left: -100%;
      }
      80% {
        left: 150%;
      }
      100% {
        left: 150%;
      }
    }

    @keyframes modalSlideIn {
      0% {
        opacity: 0;
        transform: scale(0.98) translateY(10px);
      }
      100% {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }
    `}
  </style>
);

// ================ BACKDROP MODERNO ================
const ModernModalBackdrop = styled(Backdrop)({
  background: 'rgba(1, 3, 38, 0.2)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
});

// ================ CONTAINER RESPONSIVE ================
const ModernModalContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px',
  [theme.breakpoints.down('md')]: {
    padding: '16px',
    alignItems: 'flex-start',
    paddingTop: '20px',
  },
  [theme.breakpoints.down('sm')]: {
    padding: '0',
    alignItems: 'stretch',
  }
}));

// ================ DIALOG RESPONSIVE ================
const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: '24px',
    background: 'white',
    border: `1px solid ${alpha('#1F64BF', 0.08)}`,
    boxShadow: '0 4px 20px rgba(1, 3, 38, 0.08)',
    maxWidth: '1200px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'hidden',
    position: 'relative',
    fontFamily: "'Mona Sans'",
    animation: 'modalSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    [theme.breakpoints.down('lg')]: {
      maxWidth: '1000px',
    },
    [theme.breakpoints.down('md')]: {
      maxWidth: '900px',
      maxHeight: '85vh',
    },
    [theme.breakpoints.down('sm')]: {
      maxWidth: '100%',
      maxHeight: '100vh',
      borderRadius: '0',
      margin: '0',
    }
  },
}));

// ================ HEADER CON GLASSMORPHISM ANIMADO ================
const ModalHeader = styled(DialogTitle)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(25px)',
  WebkitBackdropFilter: 'blur(25px)',
  color: '#010326',
  padding: '32px',
  position: 'relative',
  borderBottom: `2px solid rgba(31, 100, 191, 0.3)`,
  borderRadius: '24px 24px 0 0',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  boxShadow: `
    inset 0 1px 0 rgba(255, 255, 255, 0.5),
    inset 0 -1px 0 rgba(255, 255, 255, 0.1)
  `,
  overflow: 'hidden',

  // Efecto de borde superior brillante
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '1px',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent)',
    zIndex: 1,
  },

  // Efecto de borde lateral izquierdo
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '1px',
    height: '100%',
    background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.8), transparent, rgba(255, 255, 255, 0.3))',
    zIndex: 1,
  },

  [theme.breakpoints.down('md')]: {
    padding: '28px',
  },
  [theme.breakpoints.down('sm')]: {
    padding: '24px',
    borderRadius: '0',
  }
}));

const HeaderTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.75rem',
  fontWeight: 700,
  margin: 0,
  marginBottom: '8px',
  fontFamily: "'Mona Sans'",
  position: 'relative',
  zIndex: 3,
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  color: '#010326',
  [theme.breakpoints.down('md')]: {
    fontSize: '1.5rem',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.3rem',
  }
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  right: '24px',
  top: '24px',
  width: '40px',
  height: '40px',
  background: 'linear-gradient(135deg,rgb(239, 242, 255) 0%,rgb(239, 242, 255) 100%)',
  color: 'white',
  borderRadius: '12px',
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  boxShadow: '0 1px 4px rgba(31, 100, 191, 0.1)',
  zIndex: 10,
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
    transition: 'left 0.6s ease',
    zIndex: 1,
  },
  '& > *': {
    position: 'relative',
    zIndex: 2,
  },
  '&:hover': {
    background: 'linear-gradient(135deg,rgb(180, 179, 247) 0%,rgb(188, 179, 247) 100%)',
    transform: 'translateY(-1px)',
    boxShadow: '0 2px 8px rgba(31, 100, 191, 0.2)',
    '&::before': {
      left: '100%',
    },
  },
  '&:active': {
    transform: 'scale(0.95)',
  },
  [theme.breakpoints.down('md')]: {
    right: '20px',
    top: '20px',
    width: '36px',
    height: '36px',
  },
  [theme.breakpoints.down('sm')]: {
    right: '16px',
    top: '16px',
    width: '32px',
    height: '32px',
  }
}));

const ModalContent = styled(DialogContent)(({ theme }) => ({
  padding: 0,
  maxHeight: 'calc(90vh - 180px)',
  overflowY: 'auto',
  position: 'relative',
  background: 'transparent',
  boxShadow: 'none',
  border: 'none',
  display: 'flex',
  flexDirection: 'column',
  flex: '1',
  minHeight: 0,

  '&::-webkit-scrollbar': {
    width: '6px',
  },
  '&::-webkit-scrollbar-track': {
    background: alpha('#1F64BF', 0.05),
    borderRadius: '3px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: alpha('#1F64BF', 0.2),
    borderRadius: '3px',
    '&:hover': {
      background: alpha('#1F64BF', 0.3),
    }
  },
  [theme.breakpoints.down('md')]: {
    maxHeight: 'calc(85vh - 160px)',
  },
  [theme.breakpoints.down('sm')]: {
    maxHeight: 'calc(100vh - 140px)',
  }
}));

const StepperContainer = styled(Box)(({ theme }) => ({
  padding: '24px',
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(15px)',
  WebkitBackdropFilter: 'blur(15px)',
  borderRadius: 0,
  border: 'none',
  borderBottom: '1px solid rgba(31, 100, 191, 0.1)',
  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.3)',
  position: 'relative',
  overflow: 'hidden',
  '& > *': {
    position: 'relative',
    zIndex: 1,
  },
  '& .MuiStep-root': {
    '& .MuiStepLabel-root': {
      '& .MuiStepLabel-label': {
        fontSize: '0.9rem',
        fontWeight: 600,
        color: '#010326',
        letterSpacing: '-0.01em',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        fontFamily: "'Mona Sans'",
        '&.Mui-active': {
          color: '#1F64BF',
          fontWeight: 700,
          transform: 'scale(1.01)',
        },
        '&.Mui-completed': {
          color: '#032CA6',
          fontWeight: 600,
        }
      }
    }
  },
  [theme.breakpoints.down('sm')]: {
    padding: '20px',
    '& .MuiStepLabel-label': {
      fontSize: '0.8rem !important'
    }
  }
}));

const StepContent = styled(Box)(({ theme }) => ({
  padding: '24px',
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(15px)',
  WebkitBackdropFilter: 'blur(15px)',
  borderRadius: 0,
  border: 'none',
  position: 'relative',
  overflow: 'hidden',
  flex: '1',
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  // ✅ AGREGAR SCROLL PARA CONTENIDO LARGO
  maxHeight: '500px',
  overflowY: 'auto',
  overflowX: 'hidden',
  // Mejorar la experiencia de scroll
  scrollBehavior: 'smooth',
  '& > *': {
    position: 'relative',
    zIndex: 1,
  },
  '&::-webkit-scrollbar': {
    width: '6px',
  },
  '&::-webkit-scrollbar-track': {
    background: alpha('#1F64BF', 0.05),
    borderRadius: '3px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: alpha('#1F64BF', 0.2),
    borderRadius: '3px',
    '&:hover': {
      background: alpha('#1F64BF', 0.3),
    }
  },
  [theme.breakpoints.down('sm')]: {
    padding: '20px',
  }
}));

const SectionCard = styled(Paper)(({ theme }) => ({
  padding: '24px',
  borderRadius: '16px',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  background: 'rgba(255, 255, 255, 0.4)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.5), 0 1px 4px rgba(1, 3, 38, 0.02)',
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  // ✅ AGREGAR SCROLL PARA CONTENIDO LARGO
  maxHeight: '400px',
  overflowY: 'auto',
  overflowX: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(31, 100, 191, 0.08), transparent)',
    transition: 'left 0.5s ease',
    zIndex: 1,
  },
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.6)',
    borderColor: 'rgba(31, 100, 191, 0.2)',
    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.6), 0 2px 8px rgba(31, 100, 191, 0.1)',
    transform: 'translateY(-1px)',
    '&::before': {
      left: '100%',
    }
  },
  // ✅ SCROLLBAR PERSONALIZADO PARA SECTIONCARD
  '&::-webkit-scrollbar': {
    width: '6px',
  },
  '&::-webkit-scrollbar-track': {
    background: alpha('#1F64BF', 0.05),
    borderRadius: '3px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: alpha('#1F64BF', 0.2),
    borderRadius: '3px',
    '&:hover': {
      background: alpha('#1F64BF', 0.3),
    }
  },
  scrollBehavior: 'smooth',
  [theme.breakpoints.down('sm')]: {
    padding: '20px',
    maxHeight: '350px', // ✅ ALTURA REDUCIDA EN MÓVIL
  }
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  fontSize: '1.1rem',
  fontWeight: 600,
  color: '#010326',
  margin: 0,
  marginBottom: '20px',
  paddingBottom: '12px',
  borderBottom: '1px solid rgba(31, 100, 191, 0.15)',
  fontFamily: "'Mona Sans'",
  position: 'relative',

  // Efecto de gradiente en el borde inferior
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-1px',
    left: 0,
    width: '60px',
    height: '2px',
    background: 'linear-gradient(90deg, #1F64BF, #032CA6)',
    borderRadius: '2px',
    boxShadow: '0 0 4px rgba(31, 100, 191, 0.3)',
  },

  [theme.breakpoints.down('sm')]: {
    fontSize: '1rem',
  }
}));

const ModernTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.5), 0 1px 2px rgba(1, 3, 38, 0.03)',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.6)',
      boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.6), 0 1px 4px rgba(1, 3, 38, 0.05)',
      transform: 'translateY(-1px)',
      border: '1px solid rgba(31, 100, 191, 0.2)',
    },
    '&.Mui-focused': {
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.6), 0 2px 8px rgba(31, 100, 191, 0.08)',
      transform: 'translateY(-1px)',
      border: '1px solid rgba(31, 100, 191, 0.3)',
    },
    '& fieldset': {
      border: 'none',
    },
    '&.Mui-focused fieldset': {
      border: 'none',
    }
  },
  '& .MuiInputLabel-root': {
    color: '#010326',
    fontWeight: 500,
    fontFamily: "'Mona Sans'",
    '&.Mui-focused': {
      color: '#1F64BF',
    },
    '&.MuiInputLabel-shrink': {
      transform: 'translate(14px, -9px) scale(0.75)',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      padding: '0 8px',
      borderRadius: '4px',
    }
  }
}));

// ================ DROPDOWN PERSONALIZADO SIN MUI (COMO TestDropDown) ================
const CustomDropdown = ({ 
  options = [], 
  value, 
  onChange, 
  loading = false, 
  placeholder = "Seleccionar...",
  getOptionLabel = (option) => option.name || option,
  renderOption = null,
  error = false,
  helperText = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  const filteredOptions = options.filter(option => {
    const label = getOptionLabel(option);
    return label.toLowerCase().includes(searchTerm.toLowerCase());
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOptionClick = (option) => {
    onChange(option);
    setSearchTerm(getOptionLabel(option));
    setIsOpen(false);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);
  };

  return (
    <div 
      ref={dropdownRef}
      style={{
        position: 'relative',
        width: '100%',
        fontFamily: 'inherit'
      }}
    >
      {/* Input personalizado */}
      <input
        ref={inputRef}
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '16px 50px 16px 16px', // Aumentado padding derecho para la flecha más grande
          border: `1px solid ${error ? '#d32f2f' : 'rgba(31, 100, 191, 0.1)'}`,
          borderRadius: '16px',
          fontSize: '16px',
          outline: 'none',
          boxSizing: 'border-box',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          fontFamily: 'inherit',
          fontWeight: '500',
          color: '#1F64BF',
          '&:focus': {
            borderColor: '#1F64BF',
            boxShadow: '0 0 0 4px rgba(31, 100, 191, 0.15)',
          }
        }}
        onFocus={(e) => {
          e.target.style.borderColor = '#1F64BF';
          e.target.style.boxShadow = '0 0 0 4px rgba(31, 100, 191, 0.15)';
          e.target.style.transform = 'translateY(-2px)';
          setIsOpen(true);
        }}
        onBlur={(e) => {
          e.target.style.borderColor = error ? '#d32f2f' : 'rgba(31, 100, 191, 0.1)';
          e.target.style.boxShadow = 'none';
          e.target.style.transform = 'translateY(0)';
        }}
      />

      {/* Icono de flecha */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'absolute',
          right: '16px',
          top: '40%', // Movido más arriba
          transform: 'translateY(-50%)',
          cursor: 'pointer',
          width: '0',
          height: '0',
          borderLeft: '8px solid transparent', // Más grande
          borderRight: '8px solid transparent', // Más grande
          borderTop: '8px solid #1F64BF', // Más grande y con color de la paleta
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          ...(isOpen && {
            transform: 'translateY(-50%) rotate(180deg)'
          })
        }}
      />

      {/* Loading indicator */}
      {loading && (
        <div
          style={{
            position: 'absolute',
            right: '50px', // Ajustado para la flecha más grande
            top: '50%',
            transform: 'translateY(-50%)',
            width: '20px',
            height: '20px',
            border: '2px solid #f3f3f3',
            borderTop: '2px solid #1F64BF',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}
        />
      )}

      {/* Dropdown list - SIN ANIMACIONES */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: '0',
            right: '0',
            zIndex: 99999,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(31, 100, 191, 0.2)',
            borderRadius: '16px',
            boxShadow: '0 20px 60px rgba(31, 100, 191, 0.15)',
            maxHeight: '200px', // Reducido de 300px a 200px
            overflowY: 'auto',
            marginTop: '8px',
            // SIN ANIMACIONES - APARECE INSTANTÁNEAMENTE
            transition: 'none !important',
            transform: 'none !important',
            animation: 'none !important',
          }}
        >
          {filteredOptions.length === 0 ? (
            <div style={{
              padding: '16px',
              color: '#666',
              fontStyle: 'italic',
              textAlign: 'center'
            }}>
              {loading ? 'Cargando...' : 'No hay resultados'}
            </div>
          ) : (
            filteredOptions.map((option, index) => (
              <div
                key={option.id || option._id || index}
                onClick={() => handleOptionClick(option)}
                style={{
                  padding: '12px 16px', // Reducido padding para más compacto
                  cursor: 'pointer',
                  borderBottom: index < filteredOptions.length - 1 ? '1px solid rgba(31, 100, 191, 0.1)' : 'none',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  borderRadius: '12px',
                  margin: '2px 8px', // Reducido margin
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(31, 100, 191, 0.08)';
                  e.target.style.transform = 'translateX(4px)';
                  e.target.style.boxShadow = '0 4px 12px rgba(31, 100, 191, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.transform = 'translateX(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                {renderOption ? renderOption(option) : (
                  <div>
                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                      {getOptionLabel(option)}
                    </div>
                    {option.email && (
                      <div style={{ fontSize: '14px', color: '#666' }}>
                        {option.email}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Helper text */}
      {helperText && (
        <div style={{
          marginTop: '12px',
          fontSize: '13px',
          color: error ? '#d32f2f' : '#1F64BF',
          fontWeight: '500',
          letterSpacing: '-0.01em',
          opacity: 0.8,
        }}>
          {helperText}
        </div>
      )}
    </div>
  );
};

const DesignPreviewCard = styled(SectionCard)(({ theme }) => ({
  background: 'linear-gradient(135deg, #F8F9FA 0%, #E9ECEF 100%)',
  border: `2px dashed ${alpha('#1F64BF', 0.3)}`,
  textAlign: 'center',
  minHeight: '200px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '16px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: '#1F64BF',
    background: 'linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%)',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 32px rgba(1, 3, 38, 0.12)'
  }
}));

const ActionButton = styled(Button)(({ variant: buttonVariant, theme }) => ({
  borderRadius: '12px',
  padding: '12px 24px',
  fontSize: '0.875rem',
  fontWeight: 600,
  textTransform: 'none',
  fontFamily: "'Mona Sans'",
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  minWidth: '140px',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'transparent',
  
  // Efecto de brillo animado
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: buttonVariant === 'contained' 
      ? 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.25), transparent)'
      : 'linear-gradient(90deg, transparent, rgba(31, 100, 191, 0.15), transparent)',
    transition: 'left 0.5s ease',
    zIndex: 1,
  },

  '& > *': {
    position: 'relative',
    zIndex: 2,
  },

  ...(buttonVariant === 'contained' ? {
    background: 'linear-gradient(135deg, #1F64BF 0%, #032CA6 50%, #040DBF 100%)',
    color: '#ffffff',
    boxShadow: '0 2px 8px rgba(31, 100, 191, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
    borderColor: 'rgba(255, 255, 255, 0.25)',
    '&:hover': {
      background: 'linear-gradient(135deg, #032CA6 0%, #1F64BF 50%, #032CA6 100%)',
      boxShadow: '0 3px 12px rgba(31, 100, 191, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
      transform: 'translateY(-1px)',
      '&::before': {
        left: '100%',
      }
    },
    '&:active': {
      transform: 'translateY(0)',
      boxShadow: '0 1px 4px rgba(31, 100, 191, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
    }
  } : {
    background: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(15px)',
    WebkitBackdropFilter: 'blur(15px)',
    color: '#64748b',
    borderColor: 'rgba(255, 255, 255, 0.4)',
    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.5), 0 1px 4px rgba(1, 3, 38, 0.03)',
    '&:hover': {
      background: 'rgba(31, 100, 191, 0.12)',
      color: '#032CA6',
      borderColor: 'rgba(31, 100, 191, 0.3)',
      boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.6), 0 2px 8px rgba(31, 100, 191, 0.1)',
      transform: 'translateY(-1px)',
      '&::before': {
        left: '100%',
      }
    },
    '&:active': {
      transform: 'translateY(0)',
      boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.5), 0 1px 2px rgba(1, 3, 38, 0.03)',
    }
  }),

  '&:disabled': {
    opacity: 0.5,
    transform: 'none',
    cursor: 'not-allowed',
    '&::before': {
      display: 'none',
    }
  },

  [theme.breakpoints.down('sm')]: {
    minWidth: '120px',
    justifyContent: 'center',
    width: '100%',
  }
}));

const CrystalIconButton = styled(IconButton)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.4)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  borderRadius: '12px',
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.5), 0 1px 2px rgba(1, 3, 38, 0.03)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(31, 100, 191, 0.15), transparent)',
    transition: 'left 0.5s ease',
    zIndex: 1,
  },
  '& > *': {
    position: 'relative',
    zIndex: 2,
  },
  '&:hover': {
    background: 'rgba(31, 100, 191, 0.12)',
    borderColor: 'rgba(31, 100, 191, 0.3)',
    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.6), 0 2px 8px rgba(31, 100, 191, 0.1)',
    transform: 'translateY(-1px)',
    '&::before': {
      left: '100%',
    },
  },
  '&:active': {
    transform: 'scale(0.95)',
  },
}));

const ModalActions = styled(DialogActions)(({ theme }) => ({
  display: 'flex',
  gap: '12px',
  justifyContent: 'flex-end',
  padding: '16px 32px 20px 32px', // ✅ REDUCIR PADDING SUPERIOR, MANTENER INFERIOR
  background: 'rgba(255, 255, 255, 0.05)',
  position: 'relative',
  borderTop: '2px solid rgba(31, 100, 191, 0.3)',
  borderRadius: '0 0 24px 24px',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  boxShadow: `
    inset 0 1px 0 rgba(255, 255, 255, 0.5),
    inset 0 -1px 0 rgba(255, 255, 255, 0.1)
  `,
  overflow: 'hidden',

  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '1px',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent)',
    zIndex: 1,
  },

  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    right: 0,
    width: '1px',
    height: '100%',
    background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.8), transparent, rgba(255, 255, 255, 0.3))',
    zIndex: 1,
  },

  '& > *': {
    position: 'relative',
    zIndex: 3,
  },

  [theme.breakpoints.down('md')]: {
    padding: '16px 28px 20px 28px', // ✅ CONSISTENTE CON EL PADDING PRINCIPAL
    borderRadius: '0 0 16px 16px',
  },
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    padding: '16px 24px 20px 24px', // ✅ CONSISTENTE CON EL PADDING PRINCIPAL
    gap: '10px',
    borderRadius: '0',
  }
}));

const ElementSummary = styled(Box)(({ theme }) => ({
  padding: '16px',
  borderRadius: '12px',
  background: alpha('#10B981', 0.05),
  border: `1px solid ${alpha('#10B981', 0.2)}`,
  display: 'flex',
  alignItems: 'center',
  gap: '12px'
}));

// ================ COMPONENTE DEL HEADER CON EFECTOS ANIMADOS ================
const AnimatedModalHeader = ({ children, ...props }) => {
  return (
    <ModalHeader {...props}>
      {/* Efecto de glow animado */}
      <div style={{
        position: 'absolute',
        top: '-3px',
        left: '-3px',
        right: '-3px',
        bottom: '-3px',
        background: 'linear-gradient(135deg, rgba(31, 100, 191, 0.3), rgba(3, 44, 166, 0.2), rgba(4, 13, 191, 0.3), rgba(1, 3, 38, 0.2))',
        borderRadius: '27px',
        opacity: 0.3,
        zIndex: -1,
        animation: 'flowMove 3s ease-in-out infinite alternate',
        filter: 'blur(6px)',
        pointerEvents: 'none'
      }} />

      {/* Efecto de brillo animado */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '-100%',
        width: '50%',
        height: '100%',
        background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
        transform: 'skewX(-15deg)',
        animation: 'shineMove 4s ease-in-out infinite',
        zIndex: 1,
        pointerEvents: 'none'
      }} />

      {/* Contenido del header */}
      {children}
    </ModalHeader>
  );
};

// ================ COMPONENTE PRINCIPAL ================
const CreateDesignModal = ({
  isOpen,
  onClose,
  onCreateDesign,
  editMode = false,
  designToEdit = null,
  products = [],
  users = [],
  loadingProducts = false,
  loadingUsers = false
}) => {
  const theme = useTheme();
  
  // ==================== RESPONSIVE HOOKS ====================
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallScreen = isMobile || isTablet;
  
  // ==================== ESTADOS ====================
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Estados del editor
  const [showEditor, setShowEditor] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [designElements, setDesignElements] = useState([]);
  
  // Datos del diseño
  const [designData, setDesignData] = useState({
    name: '',
    userId: '',
    productId: '',
    elements: [],
    productOptions: [],
    clientNotes: '',
    mode: 'simple',
    productColorFilter: null
  });

  // ==================== CANVAS PERSISTENCE HOOK ====================
  const {
    canvasData,
    isEditorOpen,
    isPreviewOpen,
    saveCanvasData,
    loadCanvasData,
    getCurrentCanvasData,
    openEditor,
    closeEditor,
    openPreview,
    closePreview
  } = useCanvasPersistence();

  // ==================== EFECTOS ====================
  // Agregar CSS para spinner de loading
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Efecto para bloquear el scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      // Guardar la posición actual del scroll
      const scrollY = window.scrollY;
      document.body.style.top = `-${scrollY}px`;
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      // Restaurar el scroll
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    return () => {
      // Cleanup en caso de que el componente se desmonte
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (editMode && designToEdit) {
      const editData = {
        name: designToEdit.name || '',
        userId: designToEdit.user?.id || designToEdit.user?._id || '',
        productId: designToEdit.product?.id || designToEdit.product?._id || '',
        elements: designToEdit.elements || [],
        productOptions: designToEdit.productOptions || [],
        clientNotes: designToEdit.clientNotes || '',
        mode: designToEdit.metadata?.mode || 'simple',
        productColorFilter: designToEdit.productColorFilter || null
      };
      
      setDesignData(editData);
      setDesignElements(designToEdit.elements || []);
      
      // ✅ NUEVO: Guardar datos del diseño en canvasData para el editor
      const canvasDataForEdit = {
        elements: designToEdit.elements || [],
        productColorFilter: designToEdit.productColorFilter || null,
        canvasData: designToEdit.canvasData || null,
        metadata: designToEdit.metadata || {}
      };
      
      console.log('🔄 [CreateDesignModal] Preparando datos para reedición:', canvasDataForEdit);
      saveCanvasData(canvasDataForEdit);
      
    } else {
      // Resetear para modo creación
      setDesignData({
        name: '',
        userId: '',
        productId: '',
        elements: [],
        productOptions: [],
        clientNotes: '',
        mode: 'simple',
        productColorFilter: null
      });
      setDesignElements([]);
      
      // ✅ NUEVO: Limpiar canvasData para modo creación
      saveCanvasData(null);
    }
    
    setActiveStep(0);
    setErrors({});
    setShowEditor(false);
    setShowPreview(false);
  }, [editMode, designToEdit, isOpen, saveCanvasData]);

  // ==================== STEPS CONFIGURATION ====================
  const steps = [
    {
      label: 'Cliente y Producto',
      icon: Users,
      description: 'Seleccionar cliente y producto base'
    },
    {
      label: 'Diseño Visual',
      icon: Palette,
      description: 'Crear diseño con editor visual'
    },
    {
      label: 'Revisión Final',
      icon: CheckCircle,
      description: 'Verificar y confirmar el diseño'
    }
  ];

  // ==================== VALIDACIONES ====================
  const validateStep = useCallback((step) => {
    const newErrors = {};
    
    switch (step) {
      case 0:
        if (!designData.userId) {
          newErrors.userId = 'Debe seleccionar un cliente';
        }
        if (!designData.productId) {
          newErrors.productId = 'Debe seleccionar un producto';
        }
        if (!designData.name.trim()) {
          newErrors.name = 'Debe escribir un nombre para el diseño';
        }
        break;
      
      case 1:
        if (!designElements || designElements.length === 0) {
          newErrors.elements = 'Debe crear al menos un elemento en el diseño';
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [designData, designElements]);

  // ==================== MANEJADORES ====================
  const handleNext = useCallback(() => {
    if (validateStep(activeStep)) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  }, [activeStep, validateStep]);

  const handleBack = useCallback(() => {
    setActiveStep((prevStep) => prevStep - 1);
  }, []);

  const handleInputChange = useCallback((field, value) => {
    setDesignData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpiar error del campo
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  }, [errors]);

  const handleOpenEditor = useCallback(() => {
    if (!designData.productId) {
      Swal.fire({
        title: '⚠️ Producto Requerido',
        text: 'Debe seleccionar un producto antes de abrir el editor',
        icon: 'warning',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#F59E0B'
      });
      setErrors({ productId: 'Debe seleccionar un producto primero' });
      return;
    }
    
    // ✅ CORREGIDO: Usar datos persistidos si existen, sino usar elementos actuales
    const savedData = loadCanvasData();
    const initialData = savedData || { elements: designElements };
    
    console.log('🎨 [CreateDesignModal] Abriendo editor con:', {
      tieneDataGuardado: !!savedData,
      elementosEnData: savedData?.elements?.length || 0,
      elementosEnEstado: designElements.length,
      filtroColor: savedData?.productColorFilter || null
    });
    
    openEditor(initialData);
  }, [designData.productId, designElements, loadCanvasData, openEditor]);

  const handleCloseEditor = useCallback(() => {
    closeEditor();
  }, [closeEditor]);

  const handleSaveDesign = useCallback((designDataFromEditor) => {
    // El editor ya envía los elementos en formato correcto
    const elements = designDataFromEditor.elements || [];
    const productColorFilter = designDataFromEditor.productColorFilter;
    const canvasData = designDataFromEditor.canvasData;
    
    // ✅ MEJORADO: Persistir datos del canvas
    saveCanvasData(designDataFromEditor);
    
    // Validar elementos
    const validation = DesignService.validateElementsForSubmission(elements);
    if (!validation.isValid) {
      Swal.fire({
        title: '❌ Elementos Inválidos',
        html: `
          <p>Los elementos del diseño tienen errores:</p>
          <ul style="text-align: left; margin: 10px 0;">
            ${validation.errors.map(error => `<li>${error}</li>`).join('')}
          </ul>
        `,
        icon: 'error',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#EF4444'
      });
      setErrors({ elements: validation.errors.join('; ') });
      return;
    }

    // Actualizar estado con los datos del editor
    const finalDesignData = {
      ...designData,
      elements: elements,
      canvasData: canvasData,
      productColorFilter: productColorFilter || null,
      metadata: designDataFromEditor.metadata || {}
    };


    setDesignData(finalDesignData);
    setDesignElements(elements);
    closeEditor(); // ✅ CORREGIDO: Usar closeEditor() en lugar de setShowEditor(false)
    setErrors(prev => ({ ...prev, elements: undefined }));
    
    if (activeStep === 1) {
      setActiveStep(2);
    }
  }, [activeStep, designData, closeEditor]);

  const handlePreviewDesign = useCallback(() => {
    // ✅ CORREGIDO: Verificar que haya un diseño guardado
    const savedDesign = loadCanvasData();
    if (!savedDesign || !savedDesign.elements || savedDesign.elements.length === 0) {
      Swal.fire({
        title: '⚠️ Diseño Vacío',
        text: 'Debe guardar el diseño primero antes de previsualizarlo',
        icon: 'warning',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#F59E0B'
      });
      setErrors({ elements: 'Debe guardar el diseño primero' });
      return;
    }
    // ✅ CORREGIDO: Usar el diseño guardado para la vista previa
    openPreview();
  }, [loadCanvasData, openPreview]);

  const handleClosePreview = useCallback(() => {
    closePreview();
  }, [closePreview]);

  const handleSubmit = useCallback(async () => {
    if (!validateStep(2)) return;
    
    try {
      setLoading(true);
      setErrors({}); // Limpiar errores previos
      
      const finalDesignData = {
        ...designData,
        elements: designElements,
        productColorFilter: designData.productColorFilter || null
      };
      
      console.log('📤 [CreateDesignModal] Enviando diseño:', finalDesignData);
      
      // Validar que el producto esté activo
      const selectedProduct = products.find(p => p.id === designData.productId || p._id === designData.productId);
      if (!selectedProduct) {
        console.error('❌ [CreateDesignModal] Producto no encontrado');
        Swal.fire({
          title: '❌ Producto No Encontrado',
          text: 'El producto seleccionado no existe o fue eliminado',
          icon: 'error',
          confirmButtonText: 'Entendido',
          confirmButtonColor: '#EF4444'
        });
        setErrors({ productId: 'Producto no encontrado' });
        setLoading(false);
        return;
      }
      
      if (!selectedProduct.isActive) {
        console.error('❌ [CreateDesignModal] Producto inactivo:', selectedProduct.name);
        Swal.fire({
          title: '⚠️ Producto Desactivado',
          text: `El producto "${selectedProduct.name}" está desactivado y no se puede usar para crear diseños`,
          icon: 'warning',
          confirmButtonText: 'Entendido',
          confirmButtonColor: '#F59E0B'
        });
        setErrors({ productId: 'Este producto está desactivado y no se puede usar para crear diseños' });
        setLoading(false);
        return;
      }
      
      // Validación de elementos antes de enviar
      const validation = DesignService.validateElementsForSubmission(designElements);
      if (!validation.isValid) {
        console.error('❌ [CreateDesignModal] Validación fallida:', validation.errors);
        setErrors({ elements: validation.errors.join('; ') });
        setLoading(false); // Importante: detener loading
        
        // Mostrar error con SweetAlert2
        Swal.fire({
          title: '❌ Elementos Inválidos',
          html: validation.errors.map(error => `<div>• ${error}</div>`).join(''),
          icon: 'error',
          confirmButtonText: 'Entendido',
          confirmButtonColor: '#EF4444'
        });
        return;
      }

      await onCreateDesign(finalDesignData);
      console.log('✅ [CreateDesignModal] Diseño creado exitosamente');
    } catch (error) {
      console.error('❌ [CreateDesignModal] Error submitting design:', error);
      setErrors({ submit: error.message || 'Error al crear el diseño' });
    } finally {
      setLoading(false); // Asegurar que siempre se detenga el loading
    }
  }, [designData, designElements, onCreateDesign, validateStep]);

  const handleClose = useCallback(() => {
    if (!loading) {
      onClose();
    }
  }, [loading, onClose]);

  // ==================== DATOS CALCULADOS ====================
  const selectedProduct = products.find(p => p.id === designData.productId || p._id === designData.productId);
  const selectedUser = users.find(u => u.id === designData.userId || u._id === designData.userId);
  const canProceed = !loading;
  const isLastStep = activeStep === steps.length - 1;
  const hasDesignElements = designElements.length > 0;

  // ==================== SCROLL HOOK ====================
  const { scrollProps } = useScroll();

  // ==================== DATOS MEMOIZADOS PARA VISTA PREVIA ====================
  const previewDesign = useMemo(() => {
    if (!isPreviewOpen) return null;
    
    const canvasData = loadCanvasData();
    return {
      elements: canvasData?.elements || designElements,
      productColorFilter: canvasData?.productColorFilter || null,
      metadata: canvasData?.metadata || {}
    };
  }, [isPreviewOpen, canvasData, designElements]);

  // ==================== RENDER STEPS ====================
  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box
            sx={{
              minHeight: '400px',
              maxHeight: '500px',
              overflowY: 'auto',
              overflowX: 'hidden',
              padding: '24px',
              background: 'rgba(255, 255, 255, 0.6)',
              borderRadius: '20px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
              // ✅ Scrollbar personalizado
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                background: 'rgba(0, 0, 0, 0.05)',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'rgba(31, 100, 191, 0.4)',
                borderRadius: '4px',
                '&:hover': {
                  background: 'rgba(31, 100, 191, 0.6)',
                },
              },
              scrollBehavior: 'smooth',
            }}
          >
            {/* ✅ Título simplificado */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              marginBottom: '24px'
            }}>
              <Palette size={16} weight="bold" />
              <Typography variant="h6" fontWeight={600} color="#1F64BF">
                Información básica
              </Typography>
            </Box>
            
            {/* ✅ Formulario simplificado */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <ModernTextField
                label="Nombre del diseño"
                value={designData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                error={!!errors.name}
                helperText={errors.name}
                fullWidth
                placeholder="Ej: Logo para camiseta promocional"
              />

              <CustomDropdown
                options={users}
                getOptionLabel={(option) => `${option.name} (${option.email})`}
                value={selectedUser}
                onChange={(option) => {
                  handleInputChange('userId', option?.id || option?._id || '');
                }}
                loading={loadingUsers}
                placeholder="Buscar cliente por nombre o email"
                error={!!errors.userId}
                helperText={errors.userId || 'Buscar cliente por nombre o email'}
                renderOption={(option) => (
                  <div>
                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                      {option.name}
                    </div>
                    <div style={{ fontSize: '14px', color: '#666' }}>
                      {option.email}
                    </div>
                  </div>
                )}
              />

              <CustomDropdown
                options={products}
                getOptionLabel={(option) => option.name}
                value={selectedProduct}
                onChange={(option) => {
                  handleInputChange('productId', option?.id || option?._id || '');
                }}
                loading={loadingProducts}
                placeholder="Seleccionar producto base para personalizar"
                error={!!errors.productId}
                helperText={errors.productId || 'Seleccionar producto base para personalizar'}
                renderOption={(option) => (
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px',
                    opacity: option.isActive ? 1 : 0.6
                  }}>
                    {(option.mainImage || option.images?.main) && (
                      <img
                        src={option.mainImage || option.images?.main}
                        alt={option.name}
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '8px',
                          objectFit: 'cover'
                        }}
                      />
                    )}
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        fontWeight: '600', 
                        marginBottom: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        {option.name}
                        {!option.isActive && (
                          <span style={{
                            fontSize: '12px',
                            color: '#f44336',
                            fontWeight: '500',
                            background: '#ffebee',
                            padding: '2px 6px',
                            borderRadius: '4px'
                          }}>
                            INACTIVO
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '14px', color: '#666' }}>
                        {option.formattedPrice || `${option.basePrice}` || 'Precio no disponible'}
                      </div>
                    </div>
                  </div>
                )}
              />

              <ModernTextField
                label="Notas para el cliente (opcional)"
                value={designData.clientNotes}
                onChange={(e) => handleInputChange('clientNotes', e.target.value)}
                multiline
                rows={3}
                fullWidth
                placeholder="Instrucciones especiales o detalles adicionales..."
              />
            </Box>
          </Box>
        );

      case 1:
        return (
          <StepContent {...scrollProps}>
         <SectionCard>
                 <SectionTitle component="div">
                   <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                     <Palette size={16} weight="bold" />
                     <span>Editor Visual de diseño</span>
                    </Box>
                 </SectionTitle>
              
              {selectedProduct ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {hasDesignElements ? (
                    <ElementSummary>
                      <CheckCircle size={24} weight="fill" color="#10B981" />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" fontWeight={600} color="#059669">
                          Diseño creado exitosamente
                        </Typography>
                        <Typography variant="caption" color="#065F46">
                          {designElements.length} elemento{designElements.length !== 1 ? 's' : ''} agregado{designElements.length !== 1 ? 's' : ''}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: '8px' }}>
                        <CrystalIconButton
                          size="small"
                          onClick={handlePreviewDesign}
                        >
                          <Eye size={16} weight="bold" />
                        </CrystalIconButton>
                        <CrystalIconButton
                          size="small"
                          onClick={handleOpenEditor}
                        >
                          <PencilSimple size={16} weight="bold" />
                        </CrystalIconButton>
                      </Box>
                    </ElementSummary>
                  ) : (
                    <DesignPreviewCard onClick={handleOpenEditor}>
                      <Palette size={48} weight="duotone" color="#1F64BF" />
                      <Typography variant="h6" fontWeight={700} color="#010326">
                        Crear Diseño Visual
                      </Typography>
                      <Typography variant="body2" color="#032CA6" sx={{ opacity: 0.8 }}>
                        Usa nuestro editor visual para crear el diseño personalizado
                      </Typography>
                      <ActionButton variant="contained" startIcon={<Plus size={16} weight="bold" />}>
                        Abrir Editor
                      </ActionButton>
                    </DesignPreviewCard>
                  )}

                  {selectedProduct.customizationAreas && (
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
                        Áreas disponibles para personalización:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {selectedProduct.customizationAreas.map((area) => (
                          <Chip
                            key={area._id || area.id}
                            label={area.displayName || area.name}
                            size="small"
                            variant="outlined"
                            sx={{
                              borderColor: alpha('#1F64BF', 0.3),
                              color: '#1F64BF',
                              fontSize: '0.75rem'
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}

                  {errors.elements && (
                    <Typography color="error" variant="body2">
                      {errors.elements}
                    </Typography>
                  )}
                </Box>
              ) : (
                <Box sx={{ 
                  textAlign: 'center', 
                  py: 4, 
                  color: alpha('#032CA6', 0.6) 
                }}>
                  <Package size={48} weight="duotone" />
                  <Typography component="div" variant="body1" sx={{ mt: 2 }}>
                    Selecciona un producto en el paso anterior para continuar
                  </Typography>
                </Box>
              )}
            </SectionCard>
          </StepContent>
        );

      case 2:
        return (
          <StepContent {...scrollProps}>
            <SectionCard>
              <SectionTitle component="div">
  <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    <Palette size={16} weight="bold" />
    <span>Resumen del diseño</span>
  </Box>
</SectionTitle>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Información básica */}
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                  gap: '16px' 
                }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Nombre del diseño
                    </Typography>
                    <Typography component="div" variant="body1" fontWeight={600}>
                      {designData.name}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Cliente
                    </Typography>
                    <Typography component="div" variant="body1" fontWeight={600}>
                      {selectedUser?.name || 'No seleccionado'}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Producto
                    </Typography>
                    <Typography component="div" variant="body1" fontWeight={600}>
                      {selectedProduct?.name || 'No seleccionado'}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Elementos
                    </Typography>
                    <Typography component="div" variant="body1" fontWeight={600}>
                      {designElements.length} elemento{designElements.length !== 1 ? 's' : ''}
                    </Typography>
                  </Box>
                </Box>

                {/* Vista previa del diseño */}
                {hasDesignElements && selectedProduct && (
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
                      Vista previa del diseño:
                    </Typography>
                    <DesignPreviewCard onClick={handlePreviewDesign}>
                      <Eye size={32} weight="duotone" color="#1F64BF" />
                      <Typography variant="body2" fontWeight={600}>
                        Ver diseño completo
                      </Typography>
                      <ActionButton variant="outlined" startIcon={<Eye size={16} weight="bold" />}>
                        Vista Previa
                      </ActionButton>
                    </DesignPreviewCard>
                  </Box>
                )}

                {/* Producto preview */}
                {(selectedProduct?.mainImage || selectedProduct?.images?.main) && (
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                      Producto base
                    </Typography>
                    <Box
                      component="img"
                      src={selectedProduct.mainImage || selectedProduct.images?.main}
                      alt={selectedProduct.name}
                      sx={{
                        width: '100%',
                        maxWidth: '300px',
                        height: 'auto',
                        borderRadius: '12px',
                        border: `1px solid ${alpha('#1F64BF', 0.12)}`
                      }}
                    />
                  </Box>
                )}

                {/* Notas del cliente */}
                {designData.clientNotes && (
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                      Notas para el cliente
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        p: 2,
                        borderRadius: '8px',
                        background: alpha('#1F64BF', 0.05),
                        border: `1px solid ${alpha('#1F64BF', 0.1)}`,
                        fontStyle: 'italic'
                      }}
                    >
                      "{designData.clientNotes}"
                    </Typography>
                  </Box>
                )}

                {errors.submit && (
                  <Typography color="error" variant="body2">
                    {errors.submit}
                  </Typography>
                )}
              </Box>
            </SectionCard>
          </StepContent>
        );

      default:
        return null;
    }
  };

  // ==================== RENDER PRINCIPAL ====================
  // Para pantallas pequeñas, renderizar como página completa
  if (isSmallScreen) {
    return (
      <>
        <GlobalStyles />
        <Modal
          open={isOpen}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={ModernModalBackdrop}
        >
          <ModernModalContainer>
            <Box
              sx={{
                width: '100%',
                height: '100%',
                background: 'white',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                fontFamily: "'Mona Sans'",
                animation: 'modalSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              {/* Efecto de glow animado para todo el modal */}
              <div style={{
                position: 'absolute',
                top: '-3px',
                left: '-3px',
                right: '-3px',
                bottom: '-3px',
                background: 'linear-gradient(135deg, rgba(31, 100, 191, 0.3), rgba(3, 44, 166, 0.2), rgba(4, 13, 191, 0.3), rgba(1, 3, 38, 0.2))',
                borderRadius: '23px',
                opacity: 0.3,
                zIndex: -1,
                animation: 'flowMove 3s ease-in-out infinite alternate',
                filter: 'blur(6px)',
              }} />
              
              {/* Efecto de brillo interior animado para todo el modal */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '50%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
                transform: 'skewX(-15deg)',
                animation: 'shineMove 4s ease-in-out infinite',
                zIndex: 1,
                pointerEvents: 'none',
              }} />

              {/* HEADER MEJORADO CON GLASSMORPHISM ANIMADO */}
              <AnimatedModalHeader>
                <CloseButton
                  onClick={handleClose}
                  disabled={loading}
                  aria-label="Cerrar modal"
                >
                  <X size={18} weight="bold" color="#000000" />
                </CloseButton>
                
                <HeaderTitle>
                  <Palette size={28} weight="duotone" />
                  {editMode ? 'Editar Diseño' : 'Crear Nuevo Diseño'}
                </HeaderTitle>
                <Typography variant="body1" sx={{ 
                  fontSize: '1rem',
                  opacity: 0.7,
                  margin: 0,
                  fontFamily: "'Mona Sans'",
                  position: 'relative',
                  zIndex: 3,
                  color: '#032CA6',
                }}>
                  {editMode ? 'Modifica los elementos del diseño existente' : 'Crea un nuevo diseño personalizado paso a paso'}
                </Typography>
              </AnimatedModalHeader>

              <ModalContent>
                <StepperContainer>
                  <Stepper activeStep={activeStep} orientation={isMobile ? "vertical" : "horizontal"}>
                    {steps.map((step, index) => (
                      <Step key={step.label}>
                        <StepLabel
                          icon={<step.icon size={20} weight={index <= activeStep ? "fill" : "regular"} />}
                        >
                          <Box sx={{ textAlign: isMobile ? 'left' : 'center' }}>
                            <Typography variant="body2" fontWeight={600}>
                              {step.label}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {step.description}
                            </Typography>
                          </Box>
                        </StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </StepperContainer>

                <StepContent>
                  {renderStepContent()}
                </StepContent>
              </ModalContent>

              <ModalActions>
                {/* Efecto de glow animado */}
                <div style={{
                  position: 'absolute',
                  top: '-3px',
                  left: '-3px',
                  right: '-3px',
                  bottom: '-3px',
                  background: 'linear-gradient(135deg, rgba(31, 100, 191, 0.3), rgba(3, 44, 166, 0.2), rgba(4, 13, 191, 0.3), rgba(1, 3, 38, 0.2))',
                  borderRadius: '0 0 23px 23px',
                  opacity: 0.3,
                  zIndex: -1,
                  animation: 'flowMove 3s ease-in-out infinite alternate',
                  filter: 'blur(6px)',
                }} />
                
                {/* Efecto de brillo animado */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '50%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
                  transform: 'skewX(-15deg)',
                  animation: 'shineMove 4s ease-in-out infinite',
                  zIndex: 1,
                }} />

                <ActionButton
                  variant="outlined"
                  onClick={handleClose}
                  disabled={loading}
                >
                  Cancelar
                </ActionButton>

                <Box sx={{ display: 'flex', gap: '12px', width: isMobile ? '100%' : 'auto' }}>
                  {activeStep > 0 && (
                    <ActionButton
                      variant="outlined"
                      onClick={handleBack}
                      disabled={loading}
                      startIcon={<ArrowLeft size={16} weight="bold" />}
                    >
                      Anterior
                    </ActionButton>
                  )}

                  {isLastStep ? (
                    <ActionButton
                      variant="contained"
                      onClick={handleSubmit}
                      disabled={loading || !canProceed || !hasDesignElements}
                      startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <CheckCircle size={16} weight="bold" />}
                    >
                      {loading ? 'Creando...' : (editMode ? 'Actualizar Diseño' : 'Crear Diseño')}
                    </ActionButton>
                  ) : (
                    <ActionButton
                      variant="contained"
                      onClick={handleNext}
                      disabled={loading}
                      endIcon={<ArrowRight size={16} weight="bold" />}
                    >
                      Siguiente
                    </ActionButton>
                  )}
                </Box>
              </ModalActions>
            </Box>
          </ModernModalContainer>
        </Modal>

        {/* ✅ EDITOR: Solo para edición */}
        {isEditorOpen && selectedProduct && (
          <>
            <KonvaDesignEditor
              isOpen={isEditorOpen}
              onClose={handleCloseEditor}
              product={selectedProduct}
              initialDesign={(() => {
                const savedData = getCurrentCanvasData();
                const fallbackData = { elements: designElements };
                return savedData || fallbackData;
              })()}
              onSave={handleSaveDesign}
              onBack={handleCloseEditor}
            />
          </>
        )}

        {/* ✅ VISTA PREVIA: Usar KonvaDesignViewer para vista previa */}
        {isPreviewOpen && selectedProduct && previewDesign && (
          <KonvaDesignViewer
            isOpen={isPreviewOpen}
            onClose={handleClosePreview}
            design={previewDesign}
            product={selectedProduct}
          />
        )}
      </>
    );
  }

  // Para pantallas grandes, renderizar como modal tradicional
  return (
    <>
      <GlobalStyles />
      <StyledDialog
        open={isOpen}
        onClose={handleClose}
        maxWidth={false}
        fullWidth
        disableEnforceFocus
        disableAutoFocus
        disableScrollLock={true}
        keepMounted={false}
      >
        {/* Efecto de glow animado para todo el modal */}
        <div style={{
          position: 'absolute',
          top: '-3px',
          left: '-3px',
          right: '-3px',
          bottom: '-3px',
          background: 'linear-gradient(135deg, rgba(31, 100, 191, 0.3), rgba(3, 44, 166, 0.2), rgba(4, 13, 191, 0.3), rgba(1, 3, 38, 0.2))',
          borderRadius: '27px',
          opacity: 0.3,
          zIndex: -1,
          animation: 'flowMove 3s ease-in-out infinite alternate',
          filter: 'blur(6px)',
        }} />
        
        {/* Efecto de brillo interior animado para todo el modal */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '50%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
          transform: 'skewX(-15deg)',
          animation: 'shineMove 4s ease-in-out infinite',
          zIndex: 1,
          pointerEvents: 'none',
        }} />

        {/* HEADER MEJORADO CON GLASSMORPHISM ANIMADO */}
        <AnimatedModalHeader>
          <CloseButton
            onClick={handleClose}
            disabled={loading}
            aria-label="Cerrar modal"
          >
            <X size={18} weight="bold" color="#000000" />
          </CloseButton>
          
          <HeaderTitle>
            <Palette size={28} weight="duotone" />
            {editMode ? 'Editar Diseño' : 'Crear Nuevo Diseño'}
          </HeaderTitle>
          <Typography variant="body1" sx={{ 
            fontSize: '1rem',
            opacity: 0.7,
            margin: 0,
            fontFamily: "'Mona Sans'",
            position: 'relative',
            zIndex: 3,
            color: '#032CA6',
          }}>
            {editMode ? 'Modifica los elementos del diseño existente' : 'Crea un nuevo diseño personalizado paso a paso'}
          </Typography>
        </AnimatedModalHeader>

        <ModalContent>
          <StepperContainer>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((step, index) => (
                <Step key={step.label}>
                  <StepLabel
                    icon={<step.icon size={20} weight={index <= activeStep ? "fill" : "regular"} />}
                  >
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body2" fontWeight={600}>
                        {step.label}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {step.description}
                      </Typography>
                    </Box>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </StepperContainer>

          <StepContent>
            {renderStepContent()}
          </StepContent>
        </ModalContent>

        <ModalActions>
          {/* Efecto de glow animado */}
          <div style={{
            position: 'absolute',
            top: '-3px',
            left: '-3px',
            right: '-3px',
            bottom: '-3px',
            background: 'linear-gradient(135deg, rgba(31, 100, 191, 0.3), rgba(3, 44, 166, 0.2), rgba(4, 13, 191, 0.3), rgba(1, 3, 38, 0.2))',
            borderRadius: '0 0 23px 23px',
            opacity: 0.3,
            zIndex: -1,
            animation: 'flowMove 3s ease-in-out infinite alternate',
            filter: 'blur(6px)',
          }} />
          
          {/* Efecto de brillo animado */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '50%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
            transform: 'skewX(-15deg)',
            animation: 'shineMove 4s ease-in-out infinite',
            zIndex: 1,
          }} />

          <ActionButton
            variant="outlined"
            onClick={handleClose}
            disabled={loading}
          >
            Cancelar
          </ActionButton>

          <Box sx={{ display: 'flex', gap: '12px' }}>
            {activeStep > 0 && (
              <ActionButton
                variant="outlined"
                onClick={handleBack}
                disabled={loading}
                startIcon={<ArrowLeft size={16} weight="bold" />}
              >
                Anterior
              </ActionButton>
            )}

            {isLastStep ? (
              <ActionButton
                variant="contained"
                onClick={handleSubmit}
                disabled={loading || !canProceed || !hasDesignElements}
                startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <CheckCircle size={16} weight="bold" />}
              >
                {loading ? 'Creando...' : (editMode ? 'Actualizar Diseño' : 'Crear Diseño')}
              </ActionButton>
            ) : (
              <ActionButton
                variant="contained"
                onClick={handleNext}
                disabled={loading}
                endIcon={<ArrowRight size={16} weight="bold" />}
              >
                Siguiente
              </ActionButton>
            )}
          </Box>
        </ModalActions>
      </StyledDialog>

      {/* ✅ EDITOR: Solo para edición */}
      {isEditorOpen && selectedProduct && (
        <>
          <KonvaDesignEditor
            isOpen={isEditorOpen}
            onClose={handleCloseEditor}
            product={selectedProduct}
            initialDesign={(() => {
              const savedData = getCurrentCanvasData();
              const fallbackData = { elements: designElements };
              return savedData || fallbackData;
            })()}
            onSave={handleSaveDesign}
            onBack={handleCloseEditor}
          />
        </>
      )}

      {/* ✅ VISTA PREVIA: Usar KonvaDesignViewer para vista previa */}
      {isPreviewOpen && selectedProduct && previewDesign && (
        <KonvaDesignViewer
          isOpen={isPreviewOpen}
          onClose={handleClosePreview}
          design={previewDesign}
          product={selectedProduct}
        />
      )}
    </>
  );
};

// ==================== PROP TYPES ====================
CreateDesignModal.defaultProps = {
  isOpen: false,
  editMode: false,
  designToEdit: null,
  products: [],
  users: [],
  loadingProducts: false,
  loadingUsers: false,
  onClose: () => {},
  onCreateDesign: () => {}
};

export default CreateDesignModal;