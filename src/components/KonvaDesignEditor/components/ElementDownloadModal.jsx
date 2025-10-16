import React, { useState, useCallback, useMemo, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { 
  Download, 
  X, 
  Image, 
  TextAa, 
  Shapes, 
  Circle, 
  Square, 
  Triangle, 
  Star, 
  Heart, 
  Diamond, 
  Hexagon, 
  Octagon, 
  Pentagon, 
  Polygon, 
  Path, 
  Minus, 
  Check,
  Warning,
  Funnel,
  SortAscending,
  SortDescending
} from '@phosphor-icons/react';
import {
  Box,
  Button,
  Typography,
  IconButton,
  FormControl,
  Select,
  MenuItem,
  Card,
  CardContent,
  Grid,
  Container,
  styled,
  useTheme,
  alpha,
  Paper,
  Modal,
  Backdrop,
  CircularProgress,
  Chip,
  Divider,
  Tooltip
} from '@mui/material';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import html2canvas from 'html2canvas';

// Estilos globales para las animaciones
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
        transform: scale(1.02);
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

    @keyframes flowMoveSubtle {
      0% {
        opacity: 0.4;
        transform: scale(1);
      }
      50% {
        opacity: 0.6;
        transform: scale(1.01);
      }
      100% {
        opacity: 0.5;
        transform: scale(1);
      }
    }

    @keyframes shineMoveSubtle {
      0% {
        opacity: 0.4;
        transform: scale(1);
      }
      50% {
        opacity: 0.6;
        transform: scale(1.01);
      }
      100% {
        opacity: 0.5;
        transform: scale(1);
      }
    }

    @keyframes shineMoveSubtle {
      0% {
        left: -100%;
      }
      25% {
        left: -100%;
      }
      75% {
        left: 150%;
      }
      100% {
        left: 150%;
      }
    }
    `}
  </style>
);

// ================ ESTILOS MODERNOS RESPONSIVE - ELEMENT DOWNLOAD MODAL ================

const ModernModalBackdrop = styled(Backdrop)({
  background: 'rgba(1, 3, 38, 0.2)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  zIndex: 9998, // Un poco menor que el modal pero aún muy alto
});

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
  zIndex: 9999, // Z-index extremadamente alto para asegurar que esté por encima de todo
  [theme.breakpoints.down('sm')]: {
    padding: '16px',
    alignItems: 'flex-start',
    paddingTop: '20px',
  }
}));

const ModernModalCard = styled(Paper)(({ theme }) => ({
  background: 'white',
  borderRadius: '20px',
  border: `1px solid ${alpha('#1F64BF', 0.08)}`,
  boxShadow: '0 4px 20px rgba(1, 3, 38, 0.08)',
  maxWidth: '1200px',
  width: '100%',
  maxHeight: '90vh',
  overflow: 'hidden',
  position: 'relative',
  fontFamily: "'Mona Sans'",
  [theme.breakpoints.down('lg')]: {
    maxWidth: '1000px',
  },
  [theme.breakpoints.down('md')]: {
    maxWidth: '900px',
    maxHeight: '85vh',
  },
  [theme.breakpoints.down('sm')]: {
    maxWidth: '100%',
    maxHeight: '95vh',
    borderRadius: '16px',
  }
}));

// HEADER CON GLASSMORPHISM ANIMADO
const ModernModalHeader = styled(Box)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(25px)',
  WebkitBackdropFilter: 'blur(25px)',
  color: '#010326',
  padding: '32px',
  position: 'relative',
  borderBottom: `2px solid rgba(31, 100, 191, 0.3)`,
  borderRadius: '20px 20px 0 0',
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
    borderRadius: '16px 16px 0 0',
  }
}));

const ModernModalTitle = styled(Typography)(({ theme }) => ({
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

const ModernModalSubtitle = styled(Typography)(({ theme }) => ({
  fontSize: '1rem',
  opacity: 0.7,
  margin: 0,
  fontFamily: "'Mona Sans'",
  position: 'relative',
  zIndex: 3,
  color: '#032CA6',
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.9rem',
  }
}));

const ModernModalCloseButton = styled(IconButton)(({ theme }) => ({
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
    transform: 'translateY(-1px) scale(1.05)',
    boxShadow: '0 2px 8px rgba(31, 100, 191, 0.2)',
    '&::before': {
      left: '100%',
    },
  },
  '&:active': {
    transform: 'scale(0.95) translateY(-1px)',
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

const ModernModalContent = styled(Box)(({ theme }) => ({
  padding: 0,
  maxHeight: 'calc(90vh - 180px)',
  overflowY: 'auto',
  position: 'relative',
  background: 'transparent',
  boxShadow: 'none',
  border: 'none',

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
    maxHeight: 'calc(95vh - 140px)',
  }
}));

const FilterSection = styled(Box)(({ theme }) => ({
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
  [theme.breakpoints.down('sm')]: {
    padding: '20px',
  }
}));

const FilterSectionTitle = styled(Typography)(({ theme }) => ({
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

const FilterControls = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '16px',
  alignItems: 'center',
  flexWrap: 'wrap',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: '12px',
  }
}));

const FilterSelect = styled(Select)(({ theme }) => ({
  minWidth: '150px',
  fontFamily: "'Mona Sans'",
  borderRadius: '12px',
  backgroundColor: 'rgba(255, 255, 255, 0.4)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  transition: 'all 0.3s cubic-bezier(0.23, 1, 0.320, 1)',
  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.5), 0 1px 2px rgba(1, 3, 38, 0.03)',
  '& fieldset': {
    border: 'none',
  },
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
  '& .MuiSelect-select': {
    color: '#010326',
    fontSize: '0.9rem',
    fontWeight: 500,
    fontFamily: "'Mona Sans'",
    padding: '12px 16px',
  }
}));

const ElementsSection = styled(Box)(({ theme }) => ({
  padding: '24px',
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(15px)',
  WebkitBackdropFilter: 'blur(15px)',
  borderRadius: 0,
  border: 'none',
  position: 'relative',
  overflow: 'hidden',
  '& > *': {
    position: 'relative',
    zIndex: 1,
  },
  [theme.breakpoints.down('sm')]: {
    padding: '20px',
  }
}));

const ElementCard = styled(Paper)(({ selected, theme }) => ({
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.23, 1, 0.320, 1)',
  border: selected ? `2px solid #1F64BF` : `1px solid rgba(255, 255, 255, 0.3)`,
  background: selected ? 'rgba(31, 100, 191, 0.1)' : 'rgba(255, 255, 255, 0.4)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  borderRadius: '12px',
  position: 'relative',
  overflow: 'hidden',
  boxShadow: selected ? 'inset 0 1px 0 rgba(255, 255, 255, 0.5), 0 2px 12px rgba(31, 100, 191, 0.1)' : 'inset 0 1px 0 rgba(255, 255, 255, 0.5), 0 1px 4px rgba(1, 3, 38, 0.02)',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
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
    borderColor: '#1F64BF',
    background: selected ? 'rgba(31, 100, 191, 0.15)' : 'rgba(255, 255, 255, 0.6)',
    transform: 'translateY(-2px)',
    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.6), 0 4px 16px rgba(31, 100, 191, 0.15)',
    '&::before': {
      left: '100%',
    }
  }
}));

const ElementCardContent = styled(CardContent)(({ theme }) => ({
  padding: '20px',
  position: 'relative',
  zIndex: 2,
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  [theme.breakpoints.down('sm')]: {
    padding: '16px',
  }
}));

const ElementPreview = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '120px',
  background: 'rgba(255, 255, 255, 0.8)',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '12px',
  border: '1px solid rgba(31, 100, 191, 0.1)',
  position: 'relative',
  overflow: 'hidden',
  '& canvas': {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
  }
}));

const ElementInfo = styled(Box)({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

const ElementTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1rem',
  fontWeight: 600,
  color: '#010326',
  margin: 0,
  fontFamily: "'Mona Sans'",
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.9rem',
  }
}));

const ElementType = styled(Chip)(({ theme }) => ({
  fontSize: '0.7rem',
  height: '24px',
  background: 'rgba(31, 100, 191, 0.15)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  color: '#1F64BF',
  border: `1px solid rgba(255, 255, 255, 0.4)`,
  fontFamily: "'Mona Sans'",
  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.3)',
  '& .MuiChip-label': {
    padding: '0 8px',
    fontSize: '0.7rem',
    fontWeight: 500,
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.65rem',
    height: '20px',
    '& .MuiChip-label': {
      padding: '0 6px',
      fontSize: '0.65rem',
    }
  }
}));

const ElementActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '8px',
  marginTop: '12px',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    gap: '6px',
  }
}));

const DownloadBtn = styled(Button)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '8px 16px',
  borderRadius: '8px',
  fontSize: '0.8rem',
  fontWeight: 600,
  textTransform: 'none',
  fontFamily: "'Mona Sans'",
  transition: 'all 0.3s cubic-bezier(0.23, 1, 0.320, 1)',
  position: 'relative',
  overflow: 'hidden',
  minWidth: '100px',
  background: 'linear-gradient(135deg, #1F64BF 0%, #032CA6 50%, #040DBF 100%)',
  color: '#ffffff',
  boxShadow: '0 2px 8px rgba(31, 100, 191, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
  border: '1px solid rgba(255, 255, 255, 0.25)',
  '&:hover': {
    background: 'linear-gradient(135deg, #032CA6 0%, #1F64BF 50%, #032CA6 100%)',
    boxShadow: '0 3px 12px rgba(31, 100, 191, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
    transform: 'translateY(-2px)',
  },
  '&:active': {
    transform: 'translateY(0) scale(1)',
    boxShadow: '0 1px 4px rgba(31, 100, 191, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
  },
  '&:disabled': {
    opacity: 0.5,
    transform: 'none',
    cursor: 'not-allowed',
  },
  [theme.breakpoints.down('sm')]: {
    minWidth: 'auto',
    justifyContent: 'center',
    width: '100%',
    fontSize: '0.75rem',
    padding: '6px 12px',
  }
}));

// FOOTER CON GLASSMORPHISM ANIMADO
const ElementDownloadActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '12px',
  justifyContent: 'flex-end',
  padding: '20px 32px',
  background: 'rgba(255, 255, 255, 0.05)',
  position: 'relative',
  borderTop: '2px solid rgba(31, 100, 191, 0.3)',
  borderRadius: '0 0 20px 20px',
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
    padding: '20px 28px',
    borderRadius: '0 0 16px 16px',
  },
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    padding: '20px 24px',
    gap: '10px',
    borderRadius: '0 0 16px 16px',
  }
}));

const ElementDownloadBtn = styled(Button)(({ variant, theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '12px 24px',
  borderRadius: '12px',
  fontSize: '0.875rem',
  fontWeight: 600,
  textTransform: 'none',
  fontFamily: "'Mona Sans'",
  transition: 'all 0.3s cubic-bezier(0.23, 1, 0.320, 1)',
  position: 'relative',
  overflow: 'hidden',
  // Fijar un ancho mínimo más grande para evitar redimensionamiento
  minWidth: '180px',
  // Asegurar que el ancho se mantenga constante
  width: 'auto',
  flexShrink: 0,
  // Prevenir cambios de tamaño en el contenido
  whiteSpace: 'nowrap',

  // Efecto de brillo animado
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: variant === 'primary' 
      ? 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.25), transparent)'
      : 'linear-gradient(90deg, transparent, rgba(31, 100, 191, 0.15), transparent)',
    transition: 'left 0.5s ease',
    zIndex: 1,
  },

  '& > *': {
    position: 'relative',
    zIndex: 2,
  },

  ...(variant === 'primary' ? {
    background: 'linear-gradient(135deg, #1F64BF 0%, #032CA6 50%, #040DBF 100%)',
    color: '#ffffff',
    boxShadow: '0 2px 8px rgba(31, 100, 191, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.25)',
    '&:hover': {
      background: 'linear-gradient(135deg, #032CA6 0%, #1F64BF 50%, #032CA6 100%)',
      boxShadow: '0 3px 12px rgba(31, 100, 191, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
      // Solo mover verticalmente, sin escalar
      transform: 'translateY(-2px)',
      '&::before': {
        left: '100%',
      }
    },
    '&:active': {
      // Mantener el mismo tamaño, solo cambiar la sombra
      transform: 'translateY(-1px)',
      boxShadow: '0 1px 4px rgba(31, 100, 191, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
    }
  } : {
    background: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(15px)',
    WebkitBackdropFilter: 'blur(15px)',
    color: '#64748b',
    border: '1px solid rgba(255, 255, 255, 0.4)',
    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.5), 0 1px 4px rgba(1, 3, 38, 0.03)',
    '&:hover': {
      background: 'rgba(31, 100, 191, 0.12)',
      color: '#032CA6',
      borderColor: 'rgba(31, 100, 191, 0.3)',
      boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.6), 0 2px 8px rgba(31, 100, 191, 0.1)',
      // Solo mover verticalmente, sin escalar
      transform: 'translateY(-2px)',
      '&::before': {
        left: '100%',
      }
    },
    '&:active': {
      // Mantener el mismo tamaño, solo cambiar la sombra
      transform: 'translateY(-1px)',
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
    minWidth: '140px',
    justifyContent: 'center',
    width: '100%',
  }
}));

// Componente del Header con efectos animados
const AnimatedModalHeader = ({ children, ...props }) => {
  return (
    <ModernModalHeader {...props}>
      {/* Efecto de glow animado */}
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
    </ModernModalHeader>
  );
};

// Mapeo de tipos de elementos a iconos
const getElementIcon = (type) => {
  const iconMap = {
    text: <TextAa size={16} weight="duotone" />,
    image: <Image size={16} weight="duotone" />,
    rect: <Square size={16} weight="duotone" />,
    square: <Square size={16} weight="duotone" />,
    circle: <Circle size={16} weight="duotone" />,
    triangle: <Triangle size={16} weight="duotone" />,
    star: <Star size={16} weight="duotone" />,
    heart: <Heart size={16} weight="duotone" />,
    diamond: <Diamond size={16} weight="duotone" />,
    hexagon: <Hexagon size={16} weight="duotone" />,
    octagon: <Octagon size={16} weight="duotone" />,
    pentagon: <Pentagon size={16} weight="duotone" />,
    polygon: <Polygon size={16} weight="duotone" />,
    shape: <Shapes size={16} weight="duotone" />,
    customShape: <Shapes size={16} weight="duotone" />,
    path: <Path size={16} weight="duotone" />,
    line: <Minus size={16} weight="duotone" />,
    ellipse: <Circle size={16} weight="duotone" />
  };
  return iconMap[type] || <Shapes size={16} weight="duotone" />;
};

// Mapeo de tipos a nombres legibles
const getElementTypeName = (type) => {
  const typeMap = {
    text: 'Texto',
    image: 'Imagen',
    rect: 'Rectángulo',
    square: 'Cuadrado',
    circle: 'Círculo',
    triangle: 'Triángulo',
    star: 'Estrella',
    heart: 'Corazón',
    diamond: 'Diamante',
    hexagon: 'Hexágono',
    octagon: 'Octágono',
    pentagon: 'Pentágono',
    polygon: 'Polígono',
    shape: 'Forma',
    customShape: 'Forma Personalizada',
    path: 'Línea',
    line: 'Línea',
    ellipse: 'Elipse'
  };
  return typeMap[type] || 'Elemento';
};

// Formatos disponibles por tipo de elemento
const getAvailableFormats = (type) => {
  const formatMap = {
    text: ['PNG'],
    image: ['PNG', 'JPG'],
    rect: ['PNG', 'SVG'],
    square: ['PNG', 'SVG'],
    circle: ['PNG', 'SVG'],
    triangle: ['PNG', 'SVG'],
    star: ['PNG', 'SVG'],
    heart: ['PNG', 'SVG'],
    diamond: ['PNG', 'SVG'],
    hexagon: ['PNG', 'SVG'],
    octagon: ['PNG', 'SVG'],
    pentagon: ['PNG', 'SVG'],
    polygon: ['PNG', 'SVG'],
    shape: ['PNG', 'SVG'],
    customShape: ['PNG', 'SVG'],
    path: ['PNG', 'SVG'],
    line: ['PNG', 'SVG'],
    ellipse: ['PNG', 'SVG']
  };
  return formatMap[type] || ['PNG'];
};

const ElementDownloadModal = ({ 
  open, 
  onClose, 
  elements = [], 
  design, 
  product 
}) => {
  const [selectedElements, setSelectedElements] = useState(new Set());
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('type');
  const [sortOrder, setSortOrder] = useState('asc');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [elementPreviews, setElementPreviews] = useState(new Map());

  // Generar vista previa del elemento
  const generateElementPreview = useCallback(async (element) => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 120;
      canvas.height = 120;
      
      // Limpiar canvas
      ctx.clearRect(0, 0, 120, 120);
      
      if (element.elementType === 'text') {
        // Para textos, renderizar con estilos
        const konvaAttrs = element.konvaAttrs || {};
        const text = konvaAttrs.text || element.text || 'Texto';
        const fontSize = konvaAttrs.fontSize || element.fontSize || 24;
        const fontFamily = konvaAttrs.fontFamily || element.fontFamily || 'Arial';
        const fontWeight = konvaAttrs.fontWeight || element.fontWeight || 'normal';
        const fontStyle = konvaAttrs.fontStyle || element.fontStyle || 'normal';
        const textDecoration = konvaAttrs.textDecoration || element.textDecoration || 'none';
        const fill = konvaAttrs.fill || element.fill || '#000000';
        const stroke = konvaAttrs.stroke || element.stroke || 'transparent';
        const strokeWidth = konvaAttrs.strokeWidth || element.strokeWidth || 0;
        const align = konvaAttrs.align || element.align || 'left';
        const verticalAlign = konvaAttrs.verticalAlign || element.verticalAlign || 'top';
        
        // Configurar fuente
        ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
        ctx.fillStyle = fill;
        ctx.strokeStyle = stroke;
        ctx.lineWidth = strokeWidth;
        ctx.textAlign = align;
        ctx.textBaseline = verticalAlign;
        
        // Calcular posición del texto
        const textMetrics = ctx.measureText(text);
        const textWidth = textMetrics.width;
        const textHeight = fontSize * 1.2; // Aproximación de altura
        
        // Escalar para que quepa en 120x120
        const scale = Math.min(100 / textWidth, 100 / textHeight, 1);
        const scaledFontSize = fontSize * scale;
        const scaledTextWidth = textWidth * scale;
        const scaledTextHeight = textHeight * scale;
        
        // Reconfigurar con tamaño escalado
        ctx.font = `${fontStyle} ${fontWeight} ${scaledFontSize}px ${fontFamily}`;
        
        // Calcular posición centrada
        let x = 60;
        let y = 60;
        
        if (align === 'center') {
          x = 60;
        } else if (align === 'right') {
          x = 60 + (scaledTextWidth / 2);
        } else {
          x = 60 - (scaledTextWidth / 2);
        }
        
        if (verticalAlign === 'middle') {
          y = 60;
        } else if (verticalAlign === 'bottom') {
          y = 60 + (scaledTextHeight / 2);
        } else {
          y = 60 - (scaledTextHeight / 2);
        }
        
        // Dibujar texto
        if (fill && fill !== 'transparent') {
          ctx.fillText(text, x, y);
        }
        if (stroke && stroke !== 'transparent' && strokeWidth > 0) {
          ctx.strokeText(text, x, y);
        }
        
        // Dibujar decoraciones de texto
        if (textDecoration && textDecoration !== 'none') {
          // Calcular posición correcta basándose en textBaseline y fontSize
          let lineY;
          const lineStartX = x - (scaledTextWidth / 2);
          const lineEndX = x + (scaledTextWidth / 2);
          
          ctx.strokeStyle = fill;
          ctx.lineWidth = Math.max(1, scaledFontSize * 0.05);
          
          if (textDecoration === 'line-through' || textDecoration === 'strikethrough') {
            // Línea tachada - posición exacta en el centro del texto
            // En Konva, el tachado se dibuja en el centro vertical del texto
            if (verticalAlign === 'top') {
              lineY = y + (scaledFontSize * 0.5); // Centro del texto desde arriba
            } else if (verticalAlign === 'middle') {
              lineY = y; // Ya está centrado
            } else { // bottom
              lineY = y - (scaledFontSize * 0.5); // Centro del texto desde abajo
            }
            
            ctx.beginPath();
            ctx.moveTo(lineStartX, lineY);
            ctx.lineTo(lineEndX, lineY);
            ctx.stroke();
          } else if (textDecoration === 'underline') {
            // Línea subrayada - debajo del texto
            if (verticalAlign === 'top') {
              lineY = y + (scaledFontSize * 0.8);
            } else if (verticalAlign === 'middle') {
              lineY = y + (scaledFontSize * 0.3);
            } else { // bottom
              lineY = y + (scaledFontSize * 0.1);
            }
            
            ctx.beginPath();
            ctx.moveTo(lineStartX, lineY);
            ctx.lineTo(lineEndX, lineY);
            ctx.stroke();
          } else if (textDecoration === 'overline') {
            // Línea superior - encima del texto
            if (verticalAlign === 'top') {
              lineY = y - (scaledFontSize * 0.2);
            } else if (verticalAlign === 'middle') {
              lineY = y - (scaledFontSize * 0.7);
            } else { // bottom
              lineY = y - (scaledFontSize * 1.2);
            }
            
            ctx.beginPath();
            ctx.moveTo(lineStartX, lineY);
            ctx.lineTo(lineEndX, lineY);
            ctx.stroke();
          }
        }
        
        return canvas.toDataURL('image/png');
      } else if (element.elementType === 'image') {
        // Para imágenes, crear una vista previa pequeña
        let imageData = null;
        
        if (element.imageUrl) {
          imageData = element.imageUrl;
        } else if (element.konvaAttrs && element.konvaAttrs.image) {
          imageData = element.konvaAttrs.image;
        } else if (element.image) {
          imageData = element.image;
        }
        
        if (imageData) {
          return new Promise((resolve) => {
            const img = document.createElement('img');
            img.crossOrigin = 'anonymous';
            img.onload = () => {
              // Dibujar la imagen escalada
              ctx.drawImage(img, 0, 0, 120, 120);
              resolve(canvas.toDataURL('image/png'));
            };
            img.onerror = () => {
              resolve(null);
            };
            img.src = imageData;
          });
        }
      } else if (['triangle', 'star', 'heart', 'diamond', 'hexagon', 'octagon', 'pentagon', 'polygon', 'custom', 'line', 'shape', 'customShape', 'path'].includes(element.elementType)) {
        // Para formas complejas, renderizar usando puntos
        const konvaAttrs = element.konvaAttrs || {};
        const points = konvaAttrs.points || element.points || [];
        
        if (points.length > 0) {
          // Calcular el bounding box de los puntos
          let minX = Math.min(...points.filter((_, i) => i % 2 === 0));
          let maxX = Math.max(...points.filter((_, i) => i % 2 === 0));
          let minY = Math.min(...points.filter((_, i) => i % 2 === 1));
          let maxY = Math.max(...points.filter((_, i) => i % 2 === 1));
          
          const width = maxX - minX;
          const height = maxY - minY;
          
          // Escalar para que quepa en 120x120
          const scale = Math.min(100 / width, 100 / height, 1);
          const offsetX = (120 - width * scale) / 2;
          const offsetY = (120 - height * scale) / 2;
          
          // Configurar estilo
          ctx.fillStyle = konvaAttrs.fill || element.fill || '#1F64BF';
          ctx.strokeStyle = konvaAttrs.stroke || element.stroke || '#032CA6';
          ctx.lineWidth = (konvaAttrs.strokeWidth || element.strokeWidth || 2) * scale;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          
          // Dibujar la forma
          ctx.beginPath();
          for (let i = 0; i < points.length; i += 2) {
            const x = (points[i] - minX) * scale + offsetX;
            const y = (points[i + 1] - minY) * scale + offsetY;
            
            if (i === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }
          
          // Cerrar la forma si es necesario
          if (konvaAttrs.closed !== false && element.closed !== false) {
            ctx.closePath();
          }
          
          // Rellenar y contornear
          if (konvaAttrs.fill || element.fill) {
            ctx.fill();
          }
          if (konvaAttrs.strokeWidth > 0 || element.strokeWidth > 0) {
            ctx.stroke();
          }
          
          return canvas.toDataURL('image/png');
        }
      } else if (element.elementType === 'rect' || element.elementType === 'square') {
        // Para rectángulos y cuadrados
        const konvaAttrs = element.konvaAttrs || {};
        const width = konvaAttrs.width || element.width || 100;
        const height = konvaAttrs.height || element.height || 100;
        const cornerRadius = konvaAttrs.cornerRadius || element.cornerRadius || 0;
        
        // Escalar para que quepa en 120x120
        const scale = Math.min(100 / width, 100 / height, 1);
        const scaledWidth = width * scale;
        const scaledHeight = height * scale;
        const scaledRadius = cornerRadius * scale;
        const offsetX = (120 - scaledWidth) / 2;
        const offsetY = (120 - scaledHeight) / 2;
        
        // Configurar estilo
        ctx.fillStyle = konvaAttrs.fill || element.fill || '#1F64BF';
        ctx.strokeStyle = konvaAttrs.stroke || element.stroke || '#032CA6';
        ctx.lineWidth = (konvaAttrs.strokeWidth || element.strokeWidth || 2) * scale;
        
        // Dibujar rectángulo
        if (scaledRadius > 0) {
          ctx.beginPath();
          ctx.roundRect(offsetX, offsetY, scaledWidth, scaledHeight, scaledRadius);
        } else {
          ctx.rect(offsetX, offsetY, scaledWidth, scaledHeight);
        }
        
        if (konvaAttrs.fill || element.fill) {
          ctx.fill();
        }
        if (konvaAttrs.strokeWidth > 0 || element.strokeWidth > 0) {
          ctx.stroke();
        }
        
        return canvas.toDataURL('image/png');
      } else if (element.elementType === 'circle') {
        // Para círculos
        const konvaAttrs = element.konvaAttrs || {};
        const radius = konvaAttrs.radius || element.radius || 50;
        
        // Escalar para que quepa en 120x120
        const scale = Math.min(100 / (radius * 2), 1);
        const scaledRadius = radius * scale;
        const centerX = 60;
        const centerY = 60;
        
        // Configurar estilo
        ctx.fillStyle = konvaAttrs.fill || element.fill || '#1F64BF';
        ctx.strokeStyle = konvaAttrs.stroke || element.stroke || '#032CA6';
        ctx.lineWidth = (konvaAttrs.strokeWidth || element.strokeWidth || 2) * scale;
        
        // Dibujar círculo
        ctx.beginPath();
        ctx.arc(centerX, centerY, scaledRadius, 0, 2 * Math.PI);
        
        if (konvaAttrs.fill || element.fill) {
          ctx.fill();
        }
        if (konvaAttrs.strokeWidth > 0 || element.strokeWidth > 0) {
          ctx.stroke();
        }
        
        return canvas.toDataURL('image/png');
      }
      
      return null;
    } catch (error) {
      console.error('Error generando vista previa:', error);
      return null;
    }
  }, []);

  // Generar vistas previas cuando se abra el modal
  useEffect(() => {
    if (open && elements.length > 0) {
      const generatePreviews = async () => {
        const previews = new Map();
        for (const element of elements) {
          // Generar vista previa para todos los tipos de elementos
          const preview = await generateElementPreview(element);
          if (preview) {
            previews.set(element.id, preview);
          }
        }
        setElementPreviews(previews);
      };
      generatePreviews();
    }
  }, [open, elements, generateElementPreview]);

  // Filtrar y ordenar elementos
  const filteredAndSortedElements = useMemo(() => {
    let filtered = elements;

    // Filtrar por tipo
    if (filterType !== 'all') {
      filtered = filtered.filter(element => element.elementType === filterType);
    }

    // Ordenar
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'type':
          aValue = getElementTypeName(a.elementType);
          bValue = getElementTypeName(b.elementType);
          break;
        case 'name':
          aValue = a.name || '';
          bValue = b.name || '';
          break;
        default:
          aValue = a.elementType;
          bValue = b.elementType;
      }

      if (sortOrder === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });

    return filtered;
  }, [elements, filterType, sortBy, sortOrder]);

  // Obtener tipos únicos para el filtro
  const availableTypes = useMemo(() => {
    const types = [...new Set(elements.map(el => el.elementType))];
    return [
      { value: 'all', label: 'Todos los elementos' },
      ...types.map(type => ({
        value: type,
        label: getElementTypeName(type)
      }))
    ];
  }, [elements]);

  // Manejar selección de elementos
  const handleElementSelect = useCallback((elementId) => {
    setSelectedElements(prev => {
      const newSet = new Set(prev);
      if (newSet.has(elementId)) {
        newSet.delete(elementId);
      } else {
        newSet.add(elementId);
      }
      return newSet;
    });
  }, []);

  // Seleccionar/deseleccionar todos
  const handleSelectAll = useCallback(() => {
    if (selectedElements.size === filteredAndSortedElements.length) {
      setSelectedElements(new Set());
    } else {
      setSelectedElements(new Set(filteredAndSortedElements.map(el => el.id)));
    }
  }, [selectedElements.size, filteredAndSortedElements]);

  // Extraer elemento individual del canvas
  const extractElement = useCallback(async (element, format = 'PNG') => {
    try {
      // Crear un canvas temporal para el elemento
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Configurar tamaño del canvas
      const padding = 20;
      canvas.width = (element.width || 200) + (padding * 2);
      canvas.height = (element.height || 200) + (padding * 2);
      
      // Fondo transparente
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Dibujar el elemento según su tipo
      ctx.save();
      ctx.translate(padding, padding);
      
      if (element.elementType === 'text') {
        // Configurar texto con estilos completos
        const konvaAttrs = element.konvaAttrs || {};
        const text = konvaAttrs.text || element.text || 'Texto';
        const fontSize = konvaAttrs.fontSize || element.fontSize || 24;
        const fontFamily = konvaAttrs.fontFamily || element.fontFamily || 'Arial';
        const fontWeight = konvaAttrs.fontWeight || element.fontWeight || 'normal';
        const fontStyle = konvaAttrs.fontStyle || element.fontStyle || 'normal';
        const textDecoration = konvaAttrs.textDecoration || element.textDecoration || 'none';
        const fill = konvaAttrs.fill || element.fill || '#000000';
        const stroke = konvaAttrs.stroke || element.stroke || 'transparent';
        const strokeWidth = konvaAttrs.strokeWidth || element.strokeWidth || 0;
        const align = konvaAttrs.align || element.align || 'left';
        const verticalAlign = konvaAttrs.verticalAlign || element.verticalAlign || 'top';
        const lineHeight = konvaAttrs.lineHeight || element.lineHeight || 1.2;
        
        // Configurar fuente
        ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
        ctx.fillStyle = fill;
        ctx.strokeStyle = stroke;
        ctx.lineWidth = strokeWidth;
        ctx.textAlign = align;
        ctx.textBaseline = verticalAlign;
        
        // Dibujar texto
        const lines = text.split('\n');
        const actualLineHeight = fontSize * lineHeight;
        
        lines.forEach((line, index) => {
          const y = index * actualLineHeight;
          
          // Dibujar texto
          if (fill && fill !== 'transparent') {
            ctx.fillText(line, 0, y);
          }
          if (stroke && stroke !== 'transparent' && strokeWidth > 0) {
            ctx.strokeText(line, 0, y);
          }
          
          // Dibujar decoraciones de texto
          if (textDecoration && textDecoration !== 'none') {
            const textMetrics = ctx.measureText(line);
            const lineWidth = textMetrics.width;
            const lineStartX = 0;
            const lineEndX = lineWidth;
            
            ctx.strokeStyle = fill;
            ctx.lineWidth = Math.max(1, fontSize * 0.05);
            
            if (textDecoration === 'line-through' || textDecoration === 'strikethrough') {
              // Línea tachada - posición exacta en el centro del texto
              // En Konva, el tachado se dibuja en el centro vertical del texto
              let lineY;
              if (verticalAlign === 'top') {
                lineY = y + (fontSize * 0.5); // Centro del texto desde arriba
              } else if (verticalAlign === 'middle') {
                lineY = y; // Ya está centrado
              } else { // bottom
                lineY = y - (fontSize * 0.5); // Centro del texto desde abajo
              }
              
              ctx.beginPath();
              ctx.moveTo(lineStartX, lineY);
              ctx.lineTo(lineEndX, lineY);
              ctx.stroke();
            } else if (textDecoration === 'underline') {
              // Línea subrayada - debajo del texto
              let underlineY;
              if (verticalAlign === 'top') {
                underlineY = y + (fontSize * 0.8);
              } else if (verticalAlign === 'middle') {
                underlineY = y + (fontSize * 0.3);
              } else { // bottom
                underlineY = y + (fontSize * 0.1);
              }
              
              ctx.beginPath();
              ctx.moveTo(lineStartX, underlineY);
              ctx.lineTo(lineEndX, underlineY);
              ctx.stroke();
            } else if (textDecoration === 'overline') {
              // Línea superior - encima del texto
              let overlineY;
              if (verticalAlign === 'top') {
                overlineY = y - (fontSize * 0.2);
              } else if (verticalAlign === 'middle') {
                overlineY = y - (fontSize * 0.7);
              } else { // bottom
                overlineY = y - (fontSize * 1.2);
              }
              
              ctx.beginPath();
              ctx.moveTo(lineStartX, overlineY);
              ctx.lineTo(lineEndX, overlineY);
              ctx.stroke();
            }
          }
        });
        
      } else if (element.elementType === 'image') {
        // Buscar la imagen en diferentes ubicaciones posibles
        let imageData = null;
        
        // Primero intentar con imageUrl
        if (element.imageUrl) {
          imageData = element.imageUrl;
        }
        // Luego intentar con konvaAttrs.image (datos base64)
        else if (element.konvaAttrs && element.konvaAttrs.image) {
          imageData = element.konvaAttrs.image;
        }
        // También verificar si hay una propiedad image directa
        else if (element.image) {
          imageData = element.image;
        }
        
        if (imageData) {
          return new Promise((resolve) => {
            const img = document.createElement('img');
            img.crossOrigin = 'anonymous';
            img.onload = () => {
              // Dibujar la imagen con las dimensiones correctas
              const width = element.width || element.konvaAttrs?.width || 100;
              const height = element.height || element.konvaAttrs?.height || 100;
              ctx.drawImage(img, 0, 0, width, height);
              resolve(canvas);
            };
            img.onerror = () => {
              console.error('Error cargando imagen:', imageData);
              // Si falla la carga, dibujar un placeholder
              ctx.fillStyle = '#f0f0f0';
              ctx.fillRect(0, 0, element.width || 100, element.height || 100);
              ctx.fillStyle = '#999';
              ctx.font = '12px Arial';
              ctx.textAlign = 'center';
              ctx.fillText('Error cargando imagen', (element.width || 100) / 2, (element.height || 100) / 2);
              resolve(canvas);
            };
            img.src = imageData;
          });
        } else {
          // No hay datos de imagen disponibles
          ctx.fillStyle = '#f0f0f0';
          ctx.fillRect(0, 0, element.width || 100, element.height || 100);
          ctx.fillStyle = '#999';
          ctx.font = '12px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('Sin datos de imagen', (element.width || 100) / 2, (element.height || 100) / 2);
          return canvas;
        }
        
      } else if (['triangle', 'star', 'heart', 'diamond', 'hexagon', 'octagon', 'pentagon', 'polygon', 'custom', 'line', 'shape', 'customShape', 'path'].includes(element.elementType)) {
        // Para formas complejas, renderizar usando puntos
        const konvaAttrs = element.konvaAttrs || {};
        const points = konvaAttrs.points || element.points || [];
        
        if (points.length > 0) {
          // Calcular el bounding box de los puntos
          let minX = Math.min(...points.filter((_, i) => i % 2 === 0));
          let maxX = Math.max(...points.filter((_, i) => i % 2 === 0));
          let minY = Math.min(...points.filter((_, i) => i % 2 === 1));
          let maxY = Math.max(...points.filter((_, i) => i % 2 === 1));
          
          const width = maxX - minX;
          const height = maxY - minY;
          
          // Configurar tamaño del canvas basado en la forma real
          canvas.width = width + (padding * 2);
          canvas.height = height + (padding * 2);
          
          // Limpiar y reconfigurar
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.save();
          ctx.translate(padding - minX, padding - minY);
          
          // Configurar estilo
          ctx.fillStyle = konvaAttrs.fill || element.fill || '#1F64BF';
          ctx.strokeStyle = konvaAttrs.stroke || element.stroke || '#032CA6';
          ctx.lineWidth = konvaAttrs.strokeWidth || element.strokeWidth || 2;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          
          // Dibujar la forma
          ctx.beginPath();
          for (let i = 0; i < points.length; i += 2) {
            const x = points[i];
            const y = points[i + 1];
            
            if (i === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }
          
          // Cerrar la forma si es necesario
          if (konvaAttrs.closed !== false && element.closed !== false) {
            ctx.closePath();
          }
          
          // Rellenar y contornear
          if (konvaAttrs.fill || element.fill) {
            ctx.fill();
          }
          if (konvaAttrs.strokeWidth > 0 || element.strokeWidth > 0) {
            ctx.stroke();
          }
          
          ctx.restore();
          return canvas;
        }
      } else if (element.elementType === 'rect' || element.elementType === 'square') {
        // Para rectángulos y cuadrados
        const konvaAttrs = element.konvaAttrs || {};
        const width = konvaAttrs.width || element.width || 100;
        const height = konvaAttrs.height || element.height || 100;
        const cornerRadius = konvaAttrs.cornerRadius || element.cornerRadius || 0;
        
        // Configurar tamaño del canvas
        canvas.width = width + (padding * 2);
        canvas.height = height + (padding * 2);
        
        // Limpiar y reconfigurar
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(padding, padding);
        
        // Configurar estilo
        ctx.fillStyle = konvaAttrs.fill || element.fill || '#1F64BF';
        ctx.strokeStyle = konvaAttrs.stroke || element.stroke || '#032CA6';
        ctx.lineWidth = konvaAttrs.strokeWidth || element.strokeWidth || 2;
        
        // Dibujar rectángulo
        if (cornerRadius > 0) {
          ctx.beginPath();
          ctx.roundRect(0, 0, width, height, cornerRadius);
        } else {
          ctx.rect(0, 0, width, height);
        }
        
        if (konvaAttrs.fill || element.fill) {
          ctx.fill();
        }
        if (konvaAttrs.strokeWidth > 0 || element.strokeWidth > 0) {
          ctx.stroke();
        }
        
        ctx.restore();
        return canvas;
      } else if (element.elementType === 'circle') {
        // Para círculos
        const konvaAttrs = element.konvaAttrs || {};
        const radius = konvaAttrs.radius || element.radius || 50;
        
        // Configurar tamaño del canvas
        const diameter = radius * 2;
        canvas.width = diameter + (padding * 2);
        canvas.height = diameter + (padding * 2);
        
        // Limpiar y reconfigurar
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(padding, padding);
        
        // Configurar estilo
        ctx.fillStyle = konvaAttrs.fill || element.fill || '#1F64BF';
        ctx.strokeStyle = konvaAttrs.stroke || element.stroke || '#032CA6';
        ctx.lineWidth = konvaAttrs.strokeWidth || element.strokeWidth || 2;
        
        // Dibujar círculo
        ctx.beginPath();
        ctx.arc(radius, radius, radius, 0, 2 * Math.PI);
        
        if (konvaAttrs.fill || element.fill) {
          ctx.fill();
        }
        if (konvaAttrs.strokeWidth > 0 || element.strokeWidth > 0) {
          ctx.stroke();
        }
        
        ctx.restore();
        return canvas;
      } else {
        // Forma genérica (fallback)
        const width = element.width || 100;
        const height = element.height || 100;
        
        ctx.fillStyle = element.fill || '#1F64BF';
        ctx.strokeStyle = element.stroke || '#032CA6';
        ctx.lineWidth = element.strokeWidth || 2;
        
        if (element.fill) ctx.fillRect(0, 0, width, height);
        if (element.stroke) ctx.strokeRect(0, 0, width, height);
      }
      
      ctx.restore();
      return canvas;
      
    } catch (error) {
      console.error('Error extrayendo elemento:', error);
      throw error;
    }
  }, []);

  // Descargar elemento individual
  const downloadElement = useCallback(async (element, format = 'PNG') => {
    try {
      setIsDownloading(true);
      
      const canvas = await extractElement(element, format);
      
      // Convertir a blob
      const mimeType = format === 'JPG' ? 'image/jpeg' : 'image/png';
      const quality = format === 'JPG' ? 0.9 : 1.0;
      
      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) {
            // Generar nombre de archivo
            const timestamp = new Date().toISOString().slice(0, 10);
            const clientName = design?.user?.name?.replace(/\s+/g, '-') || 'cliente';
            const elementType = getElementTypeName(element.elementType).toLowerCase();
            const fileName = `${clientName}-${timestamp}-${elementType}-${element.id}.${format.toLowerCase()}`;
            
            // Descargar
            saveAs(blob, fileName);
            resolve();
          }
        }, mimeType, quality);
      });
      
    } catch (error) {
      console.error('Error descargando elemento:', error);
      throw error;
    } finally {
      setIsDownloading(false);
    }
  }, [extractElement, design]);

  // Descargar elementos seleccionados como ZIP
  const downloadSelectedAsZip = useCallback(async () => {
    if (selectedElements.size === 0) return;
    
    try {
      setIsDownloading(true);
      setDownloadProgress(0);
      
      const zip = new JSZip();
      const selectedElementsList = filteredAndSortedElements.filter(el => selectedElements.has(el.id));
      
      for (let i = 0; i < selectedElementsList.length; i++) {
        const element = selectedElementsList[i];
        const canvas = await extractElement(element, 'PNG');
        
        // Convertir a blob
        const blob = await new Promise((resolve) => {
          canvas.toBlob(resolve, 'image/png', 1.0);
        });
        
        if (blob) {
          // Generar nombre de archivo
          const timestamp = new Date().toISOString().slice(0, 10);
          const clientName = design?.user?.name?.replace(/\s+/g, '-') || 'cliente';
          const elementType = getElementTypeName(element.elementType).toLowerCase();
          const fileName = `${clientName}-${timestamp}-${elementType}-${element.id}.png`;
          
          zip.file(fileName, blob);
        }
        
        setDownloadProgress(((i + 1) / selectedElementsList.length) * 100);
      }
      
      // Generar y descargar ZIP
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const timestamp = new Date().toISOString().slice(0, 10);
      const clientName = design?.user?.name?.replace(/\s+/g, '-') || 'cliente';
      const zipFileName = `${clientName}-${timestamp}-elementos-diseno.zip`;
      
      saveAs(zipBlob, zipFileName);
      
    } catch (error) {
      console.error('Error creando ZIP:', error);
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  }, [selectedElements, filteredAndSortedElements, extractElement, design]);

  // Limpiar estado al cerrar
  const handleClose = useCallback(() => {
    setSelectedElements(new Set());
    setFilterType('all');
    setSortBy('type');
    setSortOrder('asc');
    setIsDownloading(false);
    setDownloadProgress(0);
    setElementPreviews(new Map());
    onClose();
  }, [onClose]);

  if (!open) return null;

  // Renderizar el modal usando un portal para evitar problemas de z-index
  const modalContent = (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={ModernModalBackdrop}
      sx={{
        zIndex: 9999, // Asegurar que el Modal tenga el z-index correcto
      }}
    >
      <ModernModalContainer>
        <GlobalStyles />
        <ModernModalCard>
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
            <ModernModalCloseButton
              onClick={handleClose}
              aria-label="Cerrar modal"
            >
              <X size={18} weight="bold" color="#000000" />
            </ModernModalCloseButton>
            
            <ModernModalTitle>
              <Download size={28} weight="duotone" />
              Descargar Elementos del Diseño
            </ModernModalTitle>
            <ModernModalSubtitle>
              Selecciona y descarga elementos individuales para usar como referencia
            </ModernModalSubtitle>
          </AnimatedModalHeader>

          <ModernModalContent>
            <Container maxWidth="lg" disableGutters>
              {/* Sección de Filtros */}
              <FilterSection>
                <FilterSectionTitle>
                  <Funnel size={18} weight="duotone" />
                  Filtros y Ordenamiento
                </FilterSectionTitle>

                <FilterControls>
                  <FormControl>
                    <FilterSelect
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                    >
                      {availableTypes.map(type => (
                        <MenuItem key={type.value} value={type.value}>
                          {type.label}
                        </MenuItem>
                      ))}
                    </FilterSelect>
                  </FormControl>

                  <FormControl>
                    <FilterSelect
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <MenuItem value="type">Ordenar por tipo</MenuItem>
                      <MenuItem value="name">Ordenar por nombre</MenuItem>
                    </FilterSelect>
                  </FormControl>

                  <IconButton
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    sx={{
                      background: 'rgba(255, 255, 255, 0.4)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '12px',
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.6)',
                        transform: 'translateY(-1px)',
                      }
                    }}
                  >
                    {sortOrder === 'asc' ? 
                      <SortAscending size={16} weight="duotone" /> : 
                      <SortDescending size={16} weight="duotone" />
                    }
                  </IconButton>

                  <Button
                    onClick={handleSelectAll}
                    variant="outlined"
                    size="small"
                    sx={{
                      borderRadius: '12px',
                      textTransform: 'none',
                      fontFamily: "'Mona Sans'",
                      fontWeight: 600,
                      // Fijar ancho para evitar redimensionamiento
                      minWidth: '140px',
                      width: 'auto',
                      flexShrink: 0,
                      whiteSpace: 'nowrap',
                      // Transiciones suaves sin escalado
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-1px)',
                      },
                      '&:active': {
                        transform: 'translateY(0)',
                      }
                    }}
                  >
                    {selectedElements.size === filteredAndSortedElements.length ? 
                      'Deseleccionar Todo' : 'Seleccionar Todo'
                    }
                  </Button>
                </FilterControls>
              </FilterSection>

              {/* Sección de Elementos */}
              <ElementsSection>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ 
                    fontFamily: "'Mona Sans'", 
                    fontWeight: 600, 
                    color: '#010326' 
                  }}>
                    Elementos Disponibles ({filteredAndSortedElements.length})
                  </Typography>
                  
                  {selectedElements.size > 0 && (
                    <Chip
                      label={`${selectedElements.size} seleccionado(s)`}
                      color="primary"
                      size="small"
                      sx={{ fontFamily: "'Mona Sans'" }}
                    />
                  )}
                </Box>

                <Grid container spacing={2}>
                  {filteredAndSortedElements.map((element) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={element.id}>
                      <ElementCard
                        selected={selectedElements.has(element.id)}
                        onClick={() => handleElementSelect(element.id)}
                      >
                        <ElementCardContent>
                          <ElementPreview>
                            {elementPreviews.has(element.id) ? (
                              <img 
                                src={elementPreviews.get(element.id)} 
                                alt={`Preview de ${element.name || element.elementType}`}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'contain',
                                  borderRadius: '8px'
                                }}
                              />
                            ) : (
                              <Box sx={{
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: 'linear-gradient(135deg, rgba(31, 100, 191, 0.1), rgba(3, 44, 166, 0.05))',
                                borderRadius: '8px',
                                color: '#1F64BF',
                              }}>
                                {getElementIcon(element.elementType)}
                              </Box>
                            )}
                          </ElementPreview>

                          <ElementInfo>
                            <ElementTitle>
                              {getElementIcon(element.elementType)}
                              {element.name || `${getElementTypeName(element.elementType)} ${element.id.slice(-4)}`}
                            </ElementTitle>
                            
                            <ElementType
                              label={getElementTypeName(element.elementType)}
                              size="small"
                            />

                            <ElementActions>
                              <DownloadBtn
                                onClick={(e) => {
                                  e.stopPropagation();
                                  downloadElement(element, 'PNG');
                                }}
                                disabled={isDownloading}
                                size="small"
                              >
                                <Download size={14} weight="duotone" />
                                PNG
                              </DownloadBtn>
                              
                              {getAvailableFormats(element.elementType).includes('SVG') && (
                                <DownloadBtn
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    downloadElement(element, 'SVG');
                                  }}
                                  disabled={isDownloading}
                                  size="small"
                                >
                                  <Download size={14} weight="duotone" />
                                  SVG
                                </DownloadBtn>
                              )}
                            </ElementActions>
                          </ElementInfo>
                        </ElementCardContent>
                      </ElementCard>
                    </Grid>
                  ))}
                </Grid>

                {filteredAndSortedElements.length === 0 && (
                  <Box sx={{
                    textAlign: 'center',
                    py: 8,
                    color: 'text.secondary'
                  }}>
                    <Shapes size={48} weight="duotone" style={{ opacity: 0.3, marginBottom: 16 }} />
                    <Typography variant="h6" sx={{ fontFamily: "'Mona Sans'", mb: 1 }}>
                      No hay elementos disponibles
                    </Typography>
                    <Typography variant="body2" sx={{ fontFamily: "'Mona Sans'" }}>
                      {filterType === 'all' ? 
                        'Este diseño no contiene elementos para descargar' :
                        `No hay elementos de tipo "${getElementTypeName(filterType)}" en este diseño`
                      }
                    </Typography>
                  </Box>
                )}
              </ElementsSection>
            </Container>

            {/* Actions */}
            <ElementDownloadActions>
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
              
              <ElementDownloadBtn
                type="button"
                variant="secondary"
                onClick={handleClose}
                disabled={isDownloading}
              >
                <X size={16} weight="duotone" />
                Cerrar
              </ElementDownloadBtn>
              
              {selectedElements.size > 0 && (
                <ElementDownloadBtn
                  type="button"
                  variant="primary"
                  onClick={downloadSelectedAsZip}
                  disabled={isDownloading}
                >
                  {isDownloading ? (
                    <>
                      <CircularProgress size={16} color="inherit" />
                      Descargando... ({Math.round(downloadProgress)}%)
                    </>
                  ) : (
                    <>
                      <Download size={16} weight="duotone" />
                      Descargar Seleccionados ({selectedElements.size})
                    </>
                  )}
                </ElementDownloadBtn>
              )}
            </ElementDownloadActions>
          </ModernModalContent>
        </ModernModalCard>
      </ModernModalContainer>
    </Modal>
  );

  // Renderizar usando portal para evitar problemas de stacking context
  return ReactDOM.createPortal(modalContent, document.body);
};

export default ElementDownloadModal;
