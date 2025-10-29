import React, { useState, useEffect, useMemo, useRef } from 'react';
import Swal from 'sweetalert2';
import {
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  CircularProgress,
  Chip,
  Paper,
  styled,
  useTheme,
  alpha,
  IconButton
} from '@mui/material';
import {
  Package,
  Eye,
  ShoppingCart,
  TrendUp,
  Plus,
  Funnel,
  MagnifyingGlass,
  ArrowsClockwise,
  GridNine,
  Broom,
  Star,
  ChartLine,
  CaretDown
} from '@phosphor-icons/react';

import ProductCard from '../../components/ProductCard/ProductCard';
import CreateProductModal from '../../components/CreateProductModal/CreateProductModal';
import useProducts from '../../hooks/useProducts';
import useCategories from '../../hooks/useCategories';

Swal.mixin({
  customClass: { container: 'swal-overlay-custom', popup: 'swal-modal-custom' },
  didOpen: () => {
    const container = document.querySelector('.swal-overlay-custom');
    if (container) container.style.zIndex = '2000';
  }
});

// ================ KEYFRAMES PARA ANIMACIÓN DE MÁRMOL MUY VISIBLE ================ 
const marbleFlowKeyframes = `
@keyframes marbleFlow {
  0% {
    transform: translate(2%, 2%) rotate(0deg) scale(1);
  }
  25% {
    transform: translate(-8%, -8%) rotate(5deg) scale(1.05);
  }
  50% {
    transform: translate(-15%, 8%) rotate(-3deg) scale(1.08);
  }
  75% {
    transform: translate(-8%, -5%) rotate(2deg) scale(1.05);
  }
  100% {
    transform: translate(2%, 2%) rotate(0deg) scale(1);
  }
}
`;

// Inyectar keyframes en el documento
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = marbleFlowKeyframes;
  document.head.appendChild(styleSheet);
}

// Estilos para hacer zoom out y mostrar imagen completa cuando hay una card por fila (550px o menos)
const productCardImageZoomStyles = `
@media (max-width: 550px) {
  .product-card-container .product-image-wrapper {
    overflow: visible !important;
    padding: 10px !important;
    height: auto !important;
    min-height: 220px !important;
  }
  
  .product-card-container .product-image-wrapper .product-card-image,
  .product-card-container .product-card-image {
    object-fit: contain !important;
    transform: scale(1.15) !important;
    transform-origin: center center;
    width: 100% !important;
    height: auto !important;
    max-height: 220px !important;
    filter: blur(0px) !important;
  }
  
  .product-card-container:hover .product-image-wrapper .product-card-image,
  .product-card-container:hover .product-card-image {
    transform: scale(1.2) !important;
    filter: blur(0px) !important;
  }
}
`;

// Inyectar estilos para zoom out de imagen en móvil (al final del head para máxima prioridad)
if (typeof document !== 'undefined') {
  const productImageStyleSheet = document.createElement('style');
  productImageStyleSheet.id = 'catalog-product-image-zoom-styles';
  if (!document.getElementById('catalog-product-image-zoom-styles')) {
    productImageStyleSheet.textContent = productCardImageZoomStyles;
    // Insertar al final del head para que tenga máxima prioridad
    document.head.appendChild(productImageStyleSheet);
  } else {
    // Si ya existe, actualizar el contenido
    document.getElementById('catalog-product-image-zoom-styles').textContent = productCardImageZoomStyles;
  }
}

const CatalogPageContainer = styled(Box)({

  minHeight: '100vh', 
  fontFamily: "'Mona Sans'",
  background: 'white',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
});

const CatalogContentWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: '1660px',
  margin: '0 auto',
  paddingTop: '120px',
  paddingBottom: '40px',
  paddingLeft: '32px',
  paddingRight: '32px',
  minHeight: 'calc(100vh - 120px)',
  fontFamily: "'Mona Sans'",
  [theme.breakpoints.down('xl')]: { maxWidth: '1460px', paddingLeft: '28px', paddingRight: '28px' },
  [theme.breakpoints.down('lg')]: { maxWidth: '1260px', paddingLeft: '24px', paddingRight: '24px' },
  [theme.breakpoints.down('md')]: { paddingTop: '110px', paddingLeft: '20px', paddingRight: '20px' },
  [theme.breakpoints.down('sm')]: { paddingTop: '100px', paddingLeft: '16px', paddingRight: '16px' }
}));

const CatalogModernCard = styled(Paper)(({ theme }) => ({
  background: 'white',
  borderRadius: '16px',
  border: `1px solid ${alpha('#1F64BF', 0.08)}`,
  boxShadow: '0 2px 16px rgba(1, 3, 38, 0.06)',
  transition: 'all 0.3s ease',
  fontFamily: "'Mona Sans'",
  '&:hover': {
    boxShadow: '0 4px 20px rgba(1, 3, 38, 0.08)',
    transform: 'translateY(-1px)',
  }
}));

const CatalogHeaderSection = styled(CatalogModernCard)(({ theme }) => ({
  padding: '40px',
  marginBottom: '32px',
  fontWeight: '700 !important',
  background: 'white',
  position: 'relative',
  zIndex: 1,
  width: '100%',
  boxSizing: 'border-box',
  [theme.breakpoints.down('lg')]: { padding: '32px' },
  [theme.breakpoints.down('md')]: { padding: '24px', marginBottom: '24px' },
  [theme.breakpoints.down('sm')]: { padding: '20px', marginBottom: '20px' }
}));

const CatalogHeaderContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '32px',
  width: '100%',
  [theme.breakpoints.down('lg')]: { gap: '24px' },
  [theme.breakpoints.down('md')]: { flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '20px' },
  [theme.breakpoints.down('sm')]: { gap: '16px' }
}));

const CatalogHeaderInfo = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'center',
  [theme.breakpoints.down('md')]: { alignItems: 'center', textAlign: 'center' }
}));

const CatalogMainTitle = styled(Typography)(({ theme }) => ({
  fontSize: '2.5rem',
  fontWeight: '700 !important',
  color: '#010326',
  marginBottom: '12px',
  letterSpacing: '-0.025em',
  lineHeight: 1.2,
  textAlign: 'left',
  fontFamily: "'Mona Sans'",
  [theme.breakpoints.down('lg')]: { fontSize: '2.2rem' },
  [theme.breakpoints.down('md')]: { fontSize: '1.8rem', textAlign: 'center' },
  [theme.breakpoints.down('sm')]: { fontSize: '1.6rem' }
}));

const CatalogMainDescription = styled(Typography)(({ theme }) => ({
  fontSize: '1.1rem',
  color: '#032CA6',
  fontWeight: '700 !important',
  lineHeight: 1.6,
  opacity: 0.9,
  textAlign: 'left',
  maxWidth: '600px',
  fontFamily: "'Mona Sans'",
  [theme.breakpoints.down('lg')]: { fontSize: '1rem' },
  [theme.breakpoints.down('md')]: { fontSize: '0.95rem', textAlign: 'center', maxWidth: '100%' },
  [theme.breakpoints.down('sm')]: { fontSize: '0.9rem' }
}));

const CatalogHeaderActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '16px',
  alignItems: 'center',
  flexShrink: 0,
  [theme.breakpoints.down('lg')]: { gap: '12px' },
  [theme.breakpoints.down('md')]: { justifyContent: 'center', gap: '12px', width: '100%' },
  [theme.breakpoints.down('sm')]: { flexDirection: 'row', width: '100%', gap: '10px', '& > *': { flex: 1 } }
}));

const CatalogPrimaryActionButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1F64BF 0%, #032CA6 100%)',
  color: 'white',
  borderRadius: '12px',
  padding: '14px 28px',
  fontSize: '0.9rem',
  fontWeight: 600,
  textTransform: 'none',
  fontFamily: "'Mona Sans'",
  boxShadow: '0 4px 16px rgba(31, 100, 191, 0.24)',
  transition: 'all 0.3s ease',
  minWidth: '160px',
  whiteSpace: 'nowrap',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
    transition: 'left 0.5s ease',
    zIndex: 0
  },
  '& > *': { position: 'relative', zIndex: 1 },
  '&:hover': {
    background: 'linear-gradient(135deg, #032CA6 0%, #1F64BF 100%)',
    boxShadow: '0 6px 24px rgba(31, 100, 191, 0.32)',
    transform: 'translateY(-1px)',
    '&::before': { left: '100%' }
  },
  '&:active': { transform: 'translateY(0)' },
  [theme.breakpoints.down('lg')]: { minWidth: '140px', padding: '12px 24px', fontSize: '0.875rem' },
  [theme.breakpoints.down('md')]: { minWidth: 'auto', flex: 1 },
  [theme.breakpoints.down('sm')]: { minWidth: 'auto', padding: '12px 20px', fontSize: '0.85rem' }
}));

const CatalogSecondaryActionButton = styled(IconButton)(({ theme }) => ({
  background: alpha('#1F64BF', 0.08),
  color: '#1F64BF',
  borderRadius: '12px',
  width: '52px',
  height: '52px',
  transition: 'all 0.3s ease',
  flexShrink: 0,
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(31, 100, 191, 0.2), transparent)',
    transition: 'left 0.5s ease',
    zIndex: 0
  },
  '& > *': { position: 'relative', zIndex: 1 },
  '&:hover': {
    background: alpha('#1F64BF', 0.12),
    transform: 'translateY(-1px)',
    '&::before': { left: '100%' }
  },
  [theme.breakpoints.down('lg')]: { width: '48px', height: '48px' },
  [theme.breakpoints.down('md')]: { width: '48px', height: '48px' },
  [theme.breakpoints.down('sm')]: { width: '48px', height: '48px' }
}));

const CatalogUnifiedContainer = styled(Box)({ width: '100%', maxWidth: '100%', margin: '0 auto' });
const CatalogStatsContainer = styled(CatalogUnifiedContainer)({ marginBottom: '32px', position: 'relative', zIndex: 1 });

const CatalogStatsGrid = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'grid',
  gap: '24px',
  gridTemplateColumns: 'repeat(4, 1fr)',
  [theme.breakpoints.down(1400)]: { gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' },
  [theme.breakpoints.down('lg')]: { 
    display: 'flex',
    overflowX: 'auto',
    overflowY: 'hidden',
    gap: '16px',
    scrollSnapType: 'x mandatory',
    scrollBehavior: 'smooth',
    WebkitOverflowScrolling: 'touch',
    msOverflowStyle: '-ms-autohiding-scrollbar',
    gridTemplateColumns: 'none',
    paddingLeft: '0px',
    paddingRight: '0px',
    '&::-webkit-scrollbar': {
      height: '4px',
      display: 'none'
    },
    '&::-webkit-scrollbar-track': {
      background: 'transparent'
    },
    '&::-webkit-scrollbar-thumb': {
      background: alpha('#1F64BF', 0.3),
      borderRadius: '10px'
    }
  },
  [theme.breakpoints.down(550)]: { 
    display: 'flex',
    overflowX: 'auto',
    overflowY: 'hidden',
    gap: '0px',
    scrollSnapType: 'x mandatory',
    scrollBehavior: 'smooth',
    WebkitOverflowScrolling: 'touch',
    msOverflowStyle: '-ms-autohiding-scrollbar',
    paddingLeft: '0px',
    paddingRight: '0px',
    '&::before': {
      content: '""',
      minWidth: '0px',
      flexShrink: 0
    },
    '&::after': {
      content: '""',
      minWidth: '0px',
      flexShrink: 0
    },
    '&::-webkit-scrollbar': {
      height: '4px',
      display: 'none'
    },
    '&::-webkit-scrollbar-track': {
      background: 'transparent'
    },
    '&::-webkit-scrollbar-thumb': {
      background: alpha('#1F64BF', 0.3),
      borderRadius: '10px'
    }
  }
}));

const CatalogStatCard = styled(CatalogModernCard)(({ theme, variant }) => {
  const variants = {
    primary: {
      background: 'linear-gradient(135deg, #1F64BF 0%, #032CA6 100%)',
      color: 'white',
      border: 'none',
      marbleBase: 'rgba(25, 83, 158, 0.2)',
      marbleVeins: 'rgba(3, 44, 166, 0.35)',
      marbleHighlight: 'rgba(123, 164, 221, 0.4)',
      marbleDark: 'rgba(1, 21, 63, 0.15)',
    },
    success: {
      background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
      color: 'white',
      border: 'none',
      marbleBase: 'rgba(13, 75, 54, 0.2)',
      marbleVeins: 'rgba(9, 138, 97, 0.35)',
      marbleHighlight: 'rgba(86, 236, 181, 0.4)',
      marbleDark: 'rgba(2, 77, 55, 0.15)',
    },
    warning: {
      background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
      color: 'white',
      border: 'none',
      marbleBase: 'rgba(245, 158, 11, 0.2)',
      marbleVeins: 'rgba(217, 119, 6, 0.35)',
      marbleHighlight: 'rgba(251, 191, 36, 0.4)',
      marbleDark: 'rgba(180, 83, 9, 0.15)',
    },
    secondary: {
      background: 'white',
      color: '#010326',
      marbleBase: 'rgba(31, 100, 191, 0.08)',
      marbleVeins: 'rgba(3, 44, 166, 0.15)',
      marbleHighlight: 'rgba(100, 150, 220, 0.25)',
      marbleDark: 'rgba(31, 100, 191, 0.05)',
    }
  };

  const selectedVariant = variants[variant] || variants.secondary;
  const isColoredVariant = variant === 'primary' || variant === 'success' || variant === 'warning';

  return {
    padding: '28px',
    width: '100%',
    minHeight: '160px',
    maxHeight: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    position: 'relative',
    overflow: 'hidden',
    boxSizing: 'border-box',
    transition: 'all 0.3s cubic-bezier(0.23, 1, 0.320, 1)',
    boxShadow: '0 2px 12px rgba(1, 3, 38, 0.04)',
    ...selectedVariant,
    
    // Estilos para carrusel con 2 cards visibles (entre 550px y lg ~1200px)
    [`@media (max-width: ${theme.breakpoints.values.lg}px) and (min-width: 551px)`]: {
      width: 'calc(50% - 8px)',
      minWidth: 'calc(50% - 8px)',
      maxWidth: 'calc(50% - 8px)',
      flexShrink: 0,
      scrollSnapAlign: 'start',
      scrollSnapStop: 'always'
    },
    
    // Estilos para carrusel con 1 card (550px o menos)
    [theme.breakpoints.down(550)]: {
      width: '100%',
      minWidth: '100%',
      maxWidth: '100%',
      flexShrink: 0,
      scrollSnapAlign: 'start',
      scrollSnapStop: 'always'
    },
    
    '&::before': {
      content: '""',
      position: 'absolute',
      top: '-50%',
      left: '-50%',
      width: '200%',
      height: '200%',
      opacity: 0,
      transition: 'opacity 0.5s ease',
      pointerEvents: 'none',
      zIndex: 0, 
      background: `
        radial-gradient(ellipse at 15% 30%, ${selectedVariant.marbleHighlight} 0%, transparent 40%),
        radial-gradient(ellipse at 85% 20%, ${selectedVariant.marbleVeins} 0%, transparent 45%),
        radial-gradient(ellipse at 50% 80%, ${selectedVariant.marbleBase} 0%, transparent 50%),
        radial-gradient(ellipse at 70% 50%, ${selectedVariant.marbleHighlight} 0%, transparent 35%),
        radial-gradient(ellipse at 30% 70%, ${selectedVariant.marbleVeins} 0%, transparent 40%),
        radial-gradient(ellipse at 90% 90%, ${selectedVariant.marbleBase} 0%, transparent 45%),
        radial-gradient(ellipse at 10% 90%, ${selectedVariant.marbleDark} 0%, transparent 30%),
        linear-gradient(125deg, 
          ${selectedVariant.marbleBase} 0%, 
          transparent 25%, 
          ${selectedVariant.marbleVeins} 50%, 
          transparent 75%, 
          ${selectedVariant.marbleHighlight} 100%
        )
      `,
      backgroundSize: '100% 100%',
      animation: 'marbleFlow 10s ease-in-out infinite',
      filter: 'blur(2px)',
    },

    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: '-100%',
      width: '100%',
      height: '100%',
      background: isColoredVariant 
        ? 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)'
        : 'linear-gradient(90deg, transparent, rgba(31, 100, 191, 0.1), transparent)',
      transition: 'left 0.6s ease',
      zIndex: 1, 
      pointerEvents: 'none',
    },

    '&:hover': {
      boxShadow: '0 4px 20px rgba(1, 3, 38, 0.08)',
      '&::before': {
        opacity: 1,
      },
      '&::after': {
        left: '100%',
      }
    },

    '& > *': {
      position: 'relative',
      zIndex: 2,
    },

    [theme.breakpoints.down('lg')]: {
      padding: '24px',
      minHeight: '150px',
    },
    [theme.breakpoints.down('md')]: {
      padding: '20px',
      minHeight: '140px',
    },
    [theme.breakpoints.down('sm')]: {
      padding: '18px',
      minHeight: '130px',
    }
  };
});

const CatalogStatHeader = styled(Box)({ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px', width: '100%' });

const CatalogStatIconContainer = styled(Box)(({ variant, theme }) => ({
  width: '56px',
  height: '56px',
  borderRadius: '14px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: variant === 'primary' ? 'rgba(255, 255, 255, 0.2)' : alpha('#1F64BF', 0.1),
  color: variant === 'primary' ? 'white' : '#1F64BF',
  flexShrink: 0,
  [theme.breakpoints.down('lg')]: { width: '48px', height: '48px', borderRadius: '12px' },
  [theme.breakpoints.down('md')]: { width: '44px', height: '44px', borderRadius: '10px' },
  [theme.breakpoints.down('sm')]: { width: '40px', height: '40px', borderRadius: '10px' }
}));

const CatalogStatValue = styled(Typography)(({ variant, theme }) => ({
  fontSize: '2.2rem',
  fontWeight: 700,
  lineHeight: 1.1,
  marginBottom: '12px !important',
  color: variant === 'primary' ? 'white' : '#010326',
  fontFamily: "'Mona Sans'",
  [theme.breakpoints.down('lg')]: { fontSize: '2rem', marginBottom: '10px !important' },
  [theme.breakpoints.down('md')]: { fontSize: '1.8rem', marginBottom: '10px !important' },
  [theme.breakpoints.down('sm')]: { fontSize: '1.6rem', marginBottom: '8px !important' }
}));

const CatalogStatLabel = styled(Typography)(({ variant, theme }) => ({
  fontSize: '0.9rem',
  fontWeight: 500,
  marginTop: '0 !important',
  marginLeft: '8px !important',
  opacity: variant === 'primary' ? 0.9 : 0.7,
  color: variant === 'primary' ? 'white' : '#032CA6',
  lineHeight: 1.3,
  fontFamily: "'Mona Sans'",
  [theme.breakpoints.down('lg')]: { fontSize: '0.875rem', marginTop: '0 !important', marginLeft: '6px !important' },
  [theme.breakpoints.down('md')]: { fontSize: '0.8rem', marginTop: '0 !important', marginLeft: '6px !important' },
  [theme.breakpoints.down('sm')]: { fontSize: '0.75rem', marginTop: '0 !important', marginLeft: '4px !important' }
}));

const CatalogStatChange = styled(Box)(({ variant, trend }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  marginTop: 'auto',
  padding: '6px 10px',
  borderRadius: '8px',
  background: variant === 'primary' ? 'rgba(255, 255, 255, 0.15)' : trend === 'up' ? alpha('#10B981', 0.1) : alpha('#EF4444', 0.1),
  width: 'fit-content'
}));

const CatalogStatTrendText = styled(Typography)(({ variant, trend, theme }) => ({
  fontSize: '0.8rem',
  fontWeight: 600,
  color: variant === 'primary' ? 'white' : trend === 'up' ? '#10B981' : '#EF4444',
  fontFamily: "'Mona Sans'",
  [theme.breakpoints.down('sm')]: { fontSize: '0.75rem' }
}));

const CatalogControlsSection = styled(CatalogModernCard)(({ theme }) => ({
  padding: '32px',
  marginBottom: '32px',
  background: 'white',
  position: 'relative',
  zIndex: 1,
  width: '100%',
  boxSizing: 'border-box',
  [theme.breakpoints.down('lg')]: { padding: '28px' },
  [theme.breakpoints.down('md')]: { padding: '24px', marginBottom: '24px' },
  [theme.breakpoints.down('sm')]: { padding: '20px', marginBottom: '20px' }
}));

const CatalogControlsContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'stretch',
  gap: '16px',
  width: '100%',
  flexWrap: 'nowrap',
  [theme.breakpoints.down('lg')]: { gap: '14px' },
  [theme.breakpoints.down('md')]: { 
    flexDirection: 'column',
    alignItems: 'stretch', 
    gap: '16px',
    flexWrap: 'nowrap'
  },
  [theme.breakpoints.down('sm')]: { 
    gap: '14px'
  }
}));

const CatalogSearchSection = styled(Box)(({ theme }) => ({
  flex: '1 1 300px',
  minWidth: '200px',
  display: 'flex',
  alignItems: 'stretch',
  [theme.breakpoints.down('md')]: { 
    flex: 'none', 
    width: '100%',
    minWidth: '100%'
  }
}));

const CatalogModernTextField = styled(TextField)({
  width: '100%',
  height: '100%',
  fontFamily: "'Mona Sans'",
  '& .MuiOutlinedInput-root': {
    height: '48px',
    borderRadius: '12px',
    backgroundColor: '#F2F2F2',
    transition: 'all 0.3s ease',
    '& fieldset': { border: 'none' },
    '&:hover': { backgroundColor: 'white', boxShadow: '0 2px 8px rgba(1, 3, 38, 0.08)' },
    '&.Mui-focused': { backgroundColor: 'white', boxShadow: '0 4px 16px rgba(31, 100, 191, 0.12)' },
    '& input': { color: '#010326', fontSize: '0.9rem', fontWeight: 500, '&::placeholder': { color: '#64748b', opacity: 1 } }
  },
  '@media (max-width: 600px)': {
    '& .MuiOutlinedInput-root': {
      height: '56px'
    }
  }
});

const CatalogFiltersSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'stretch',
  gap: '16px',
  flexWrap: 'nowrap',
  flex: '0 0 auto',
  justifyContent: 'stretch',
  [theme.breakpoints.down('lg')]: { gap: '14px' },
  [theme.breakpoints.down('md')]: { 
    flexWrap: 'wrap',
    justifyContent: 'stretch',
    flex: 'none',
    width: '100%',
    minWidth: '100%'
  },
  [theme.breakpoints.down('sm')]: { 
    gap: '12px',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    flex: 'none',
    width: '100%',
    minWidth: '100%'
  }
}));

const CatalogFilterChip = styled(Box)(({ theme, active }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  padding: '0 14px',
  height: '48px',
  borderRadius: '12px',
  background: active ? alpha('#1F64BF', 0.1) : '#F2F2F2',
  border: `1px solid ${active ? alpha('#1F64BF', 0.2) : 'transparent'}`,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  fontSize: '0.9rem',
  fontWeight: 500,
  color: active ? '#1F64BF' : '#032CA6',
  whiteSpace: 'nowrap',
  fontFamily: "'Mona Sans'",
  flex: '0 0 auto',
  minWidth: '140px',
  maxWidth: '180px',
  position: 'relative',
  '& > svg[data-filter-icon]': {
    flexShrink: 0
  },
  '& svg[data-caret-down]': {
    flexShrink: 0,
    display: 'none'
  },
  '& .MuiFormControl-root': {
    width: 'auto',
    position: 'relative',
    '& .MuiSelect-select': {
      paddingRight: '28px !important',
      cursor: 'pointer !important'
    },
    '& .MuiSelect-icon': {
      display: 'block'
    }
  },
  [theme.breakpoints.up('md')]: {
    '& .MuiFormControl-root': {
      width: 'auto',
      position: 'relative'
    }
  },
  '&:hover': { 
    background: active ? alpha('#1F64BF', 0.15) : 'white', 
    transform: 'translateY(-1px)',
    boxShadow: '0 2px 8px rgba(1, 3, 38, 0.08)'
  },
  [theme.breakpoints.down('lg')]: { 
    padding: '0 12px', 
    fontSize: '0.875rem',
    minWidth: '120px',
    maxWidth: '160px'
  },
  [theme.breakpoints.down('md')]: {
    height: '48px',
    flex: '1 1 0',
    minWidth: '0',
    maxWidth: 'none'
  },
  [theme.breakpoints.down('sm')]: { 
    padding: '0 8px', 
    fontSize: '0.85rem',
    height: '48px',
    flex: '1 1 calc(33.333% - 8px)',
    minWidth: '0',
    maxWidth: 'calc(33.333% - 8px)',
    width: 'auto',
    '& > svg[data-filter-icon]': {
      width: '16px !important',
      height: '16px !important'
    },
    '& svg[data-caret-down]': {
      display: 'block',
      width: '12px !important',
      height: '12px !important'
    },
    '& .MuiFormControl-root': {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      opacity: 0,
      pointerEvents: 'auto',
      cursor: 'pointer'
    }
  },
  '@media (max-width: 600px)': {
    height: '56px',
    padding: '0 8px',
    fontSize: '0.8rem',
    flex: '1 1 calc(33.333% - 8px)',
    minWidth: '0',
    maxWidth: 'calc(33.333% - 8px)',
    width: 'auto',
    '& > svg[data-filter-icon]': {
      width: '18px !important',
      height: '18px !important'
    },
    '& svg[data-caret-down]': {
      width: '14px !important',
      height: '14px !important'
    },
    '& .MuiFormControl-root': {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      opacity: 0,
      pointerEvents: 'auto',
      cursor: 'pointer'
    }
  }
}));

const CatalogProductsSection = styled(CatalogUnifiedContainer)({ marginBottom: '32px', position: 'relative', zIndex: 1 });

const CatalogSectionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '28px',
  paddingBottom: '18px',
  borderBottom: `1px solid ${alpha('#1F64BF', 0.08)}`,
  width: '100%',
  [theme.breakpoints.down('lg')]: { marginBottom: '24px', paddingBottom: '16px' },
  [theme.breakpoints.down('sm')]: { flexDirection: 'column', alignItems: 'flex-start', gap: '14px', marginBottom: '20px', paddingBottom: '12px' }
}));

const CatalogSectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.6rem',
  fontWeight: 600,
  color: '#010326',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  fontFamily: "'Mona Sans'",
  [theme.breakpoints.down('lg')]: { fontSize: '1.5rem' },
  [theme.breakpoints.down('sm')]: { fontSize: '1.3rem' }
}));

const CatalogProductsGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gap: '28px',
  width: '100%',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  [theme.breakpoints.down('xl')]: { gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' },
  [theme.breakpoints.down('lg')]: { gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' },
  [theme.breakpoints.down('md')]: { gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px' },
  [theme.breakpoints.down('sm')]: { gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' },
  [theme.breakpoints.down(550)]: { gridTemplateColumns: '1fr', gap: '14px' }
}));

const CatalogEmptyState = styled(CatalogModernCard)(({ theme }) => ({
  padding: '100px 40px',
  textAlign: 'center',
  background: 'white',
  border: `2px dashed ${alpha('#1F64BF', 0.2)}`,
  width: '100%',
  [theme.breakpoints.down('lg')]: { padding: '80px 30px' },
  [theme.breakpoints.down('md')]: { padding: '60px 30px' },
  [theme.breakpoints.down('sm')]: { padding: '40px 20px' }
}));

const CatalogEmptyStateIcon = styled(Box)(({ theme }) => ({
  width: '90px',
  height: '90px',
  borderRadius: '50%',
  background: alpha('#1F64BF', 0.1),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 28px',
  color: '#1F64BF',
  [theme.breakpoints.down('lg')]: { width: '80px', height: '80px', marginBottom: '24px' },
  [theme.breakpoints.down('sm')]: { width: '60px', height: '60px', marginBottom: '16px' }
}));

const CatalogEmptyStateTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.6rem',
  fontWeight: 600,
  color: '#010326',
  marginBottom: '14px',
  fontFamily: "'Mona Sans'",
  [theme.breakpoints.down('lg')]: { fontSize: '1.5rem' },
  [theme.breakpoints.down('sm')]: { fontSize: '1.3rem' }
}));

const CatalogEmptyStateDescription = styled(Typography)(({ theme }) => ({
  fontSize: '1.1rem',
  color: '#032CA6',
  marginBottom: '36px',
  maxWidth: '450px',
  margin: '0 auto 36px',
  lineHeight: 1.6,
  fontFamily: "'Mona Sans'",
  [theme.breakpoints.down('lg')]: { fontSize: '1rem', marginBottom: '32px', maxWidth: '400px' },
  [theme.breakpoints.down('sm')]: { fontSize: '0.9rem', marginBottom: '24px', maxWidth: '300px' }
}));

const CatalogLoadingContainer = styled(Box)({ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '24px' });
const CatalogLoadingOverlay = styled(CatalogModernCard)({ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', padding: '24px', marginBottom: '24px', background: alpha('#1F64BF', 0.04) });

const CatalogStatsDotsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '8px',
  marginTop: '16px',
  [theme.breakpoints.up('lg')]: { display: 'none' }
}));

const CatalogStatsDot = styled(Box)(({ active, theme }) => ({
  width: active ? '24px' : '8px',
  height: '8px',
  borderRadius: '4px',
  background: active ? '#1F64BF' : alpha('#1F64BF', 0.2),
  transition: 'all 0.3s ease',
  cursor: 'pointer'
}));

const ClearFiltersButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  borderRadius: '8px',
  fontSize: '0.875rem',
  fontWeight: 600,
  color: '#032CA6',
  backgroundColor: alpha('#032CA6', 0.1),
  padding: '8px 12px',
  minWidth: 'auto',
  fontFamily: "'Mona Sans'",
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(3, 44, 166, 0.15), transparent)',
    transition: 'left 0.5s ease',
    zIndex: 0
  },
  '& > *': {
    position: 'relative',
    zIndex: 1
  },
  '&:hover': {
    backgroundColor: alpha('#032CA6', 0.15),
    '&::before': {
      left: '100%'
    }
  },
  '& .MuiButton-startIcon': {
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  '& .MuiButton-label > span': {
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    }
  },
  '@media (max-width: 600px)': {
    minWidth: '48px',
    padding: '8px',
    '& .MuiButton-label > span': {
      display: 'none'
    }
  }
}));

const CatalogManagement = () => {
  const theme = useTheme();
  
  const {
    products, loading, error, pagination, filters, fetchProducts, createProduct, updateProduct, deleteProduct,
    getProductById, searchProducts, updateProductStats, getProductStats, updateFilters, clearFilters,
    createSampleProducts, hasProducts, isEmpty
  } = useProducts();

  const { categories, loading: loadingCategories, error: categoriesError } = useCategories();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sortOption, setSortOption] = useState('newest');
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [activeStatsIndex, setActiveStatsIndex] = useState(0);
  const statsGridRef = useRef(null);

  useEffect(() => {
    updateFilters({
      search: searchQuery,
      isActive: selectedFilter === 'all' ? '' : selectedFilter === 'active' ? true : false,
      sort: sortOption,
      category: selectedCategory
    });
  }, [searchQuery, selectedFilter, sortOption, selectedCategory, updateFilters]);

  useEffect(() => {
    if (categoriesError) {
      Swal.fire({
        title: 'Advertencia',
        text: 'No se pudieron cargar las categorías. Algunas funciones pueden estar limitadas.',
        icon: 'warning',
        confirmButtonColor: '#1F64BF',
      });
    }
  }, [categoriesError]);

  const stats = useMemo(() => {
    const productStats = getProductStats();
    return [
      { id: 'total-products', title: "Total de Productos", value: productStats.total, change: "+12% este mes", trend: "up", icon: Package, variant: "primary" },
      { id: 'active-products', title: "Productos Activos", value: productStats.active, change: `${productStats.active}/${productStats.total} activos`, trend: "up", icon: Eye, variant: "secondary" },
      { id: 'total-orders', title: "Pedidos Totales", value: productStats.totalOrders, change: "+8% vs mes anterior", trend: "up", icon: ShoppingCart, variant: "secondary" },
      { id: 'featured-products', title: "Productos Destacados", value: productStats.featured, change: "Productos premium", trend: "up", icon: Star, variant: "secondary" }
    ];
  }, [getProductStats]);

  // Efecto para manejar el loop infinito sin duplicar elementos (mejor rendimiento)
  useEffect(() => {
    const grid = statsGridRef.current;
    if (!grid || stats.length === 0) return;

    const getCardWidth = () => {
      const containerWidth = grid.offsetWidth;
      const windowWidth = window.innerWidth;
      const isMobile = windowWidth <= 550;
      
      if (isMobile) {
        // Una card por vez (100% del ancho)
        return containerWidth;
      } else {
        // Dos cards por vez (50% del ancho cada una + gap)
        return (containerWidth + 16) / 2;
      }
    };
    
    const totalCards = stats.length;
    
    let lastScrollLeft = grid.scrollLeft;
    let isScrolling = false;

    const handleScroll = () => {
      if (!grid || isScrolling) return;
      
      const cardWidth = getCardWidth();
      const windowWidth = window.innerWidth;
      const isMobile = windowWidth <= 550;
      // Cuando hay 2 cards visibles, maxScroll es totalCards - 2 (3 posiciones para 4 cards: 0, 1, 2)
      // Cuando hay 1 card visible, maxScroll es totalCards - 1 (4 posiciones para 4 cards: 0, 1, 2, 3)
      const maxIndex = isMobile ? totalCards - 1 : totalCards - 2;
      const maxScroll = cardWidth * maxIndex;
      const scrollLeft = grid.scrollLeft;
      const scrollDelta = scrollLeft - lastScrollLeft;
      
      // Detectar si estamos en los bordes y crear el loop infinito sin duplicación
      if (scrollLeft >= maxScroll - 1 && scrollDelta > 0) {
        // Llegamos al final avanzando, saltar al inicio instantáneamente
        isScrolling = true;
        grid.scrollTo({
          left: 0,
          behavior: 'instant'
        });
        lastScrollLeft = 0;
        setTimeout(() => { isScrolling = false; }, 50);
      } else if (scrollLeft <= 1 && scrollDelta < 0) {
        // Llegamos al inicio retrocediendo, saltar al final instantáneamente
        isScrolling = true;
        grid.scrollTo({
          left: maxScroll,
          behavior: 'instant'
        });
        lastScrollLeft = maxScroll;
        setTimeout(() => { isScrolling = false; }, 50);
      } else {
        lastScrollLeft = scrollLeft;
      }
    };

    // Throttle del scroll para mejor rendimiento
    let scrollTimeout;
    const throttledHandleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(handleScroll, 50);
    };

    grid.addEventListener('scroll', throttledHandleScroll);

    return () => {
      grid.removeEventListener('scroll', throttledHandleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [stats.length]);

  const handleCreateProduct = () => { setEditingProduct(null); setShowCreateModal(true); };
  const handleCloseModal = () => { setShowCreateModal(false); setEditingProduct(null); };

  const handleProductCreated = async (productData, mode = 'create') => {
    try {
      if (mode === 'edit' && editingProduct) {
        await updateProduct(editingProduct._id, productData);
      } else {
        await createProduct(productData);
      }
      setShowCreateModal(false);
      setEditingProduct(null);
      await Swal.fire({ title: '¡Éxito!', text: mode === 'edit' ? 'Producto actualizado exitosamente' : 'Producto creado exitosamente', icon: 'success', confirmButtonColor: '#1F64BF', backdrop: `rgba(0,0,0,0.7)`, customClass: { container: 'swal-overlay-custom', popup: 'swal-modal-custom' } });
    } catch (error) {
      console.error('Error en handleProductCreated:', error);
      await Swal.fire({ title: 'Error', text: error.message || `Error al ${mode === 'edit' ? 'actualizar' : 'crear'} el producto`, icon: 'error', confirmButtonColor: '#1F64BF', backdrop: `rgba(0,0,0,0.7)`, customClass: { container: 'swal-overlay-custom', popup: 'swal-modal-custom' } });
    }
  };

  const handleEditProduct = async (productId) => {
    try {
      updateProductStats(productId, 'view');
      const productData = await getProductById(productId);
      if (productData) { setEditingProduct(productData); setShowCreateModal(true); } else { throw new Error('Producto no encontrado'); }
    } catch (error) {
      await Swal.fire({ title: 'Error', text: 'No se pudo cargar el producto para editar', icon: 'error', confirmButtonColor: '#1F64BF', backdrop: `rgba(0,0,0,0.7)`, customClass: { container: 'swal-overlay-custom', popup: 'swal-modal-custom' } });
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const product = products.find(p => p.id === productId);
      const productName = product?.name || 'este producto';
      const { isConfirmed } = await Swal.fire({ title: '¿Eliminar producto?', text: `¿Estás seguro de eliminar "${productName}"? Esta acción no se puede deshacer.`, icon: 'warning', showCancelButton: true, confirmButtonColor: '#dc2626', cancelButtonColor: '#6b7280', confirmButtonText: 'Sí, eliminar', cancelButtonText: 'Cancelar', backdrop: `rgba(0,0,0,0.7)`, customClass: { container: 'swal-overlay-custom', popup: 'swal-modal-custom' } });
      if (isConfirmed) {
        await deleteProduct(productId, productName);
        await Swal.fire({ title: '¡Eliminado!', text: 'El producto ha sido eliminado exitosamente', icon: 'success', confirmButtonColor: '#1F64BF', backdrop: `rgba(0,0,0,0.7)`, customClass: { container: 'swal-overlay-custom', popup: 'swal-modal-custom' } });
      }
    } catch (error) {
      await Swal.fire({ title: 'Error', text: 'No se pudo eliminar el producto', icon: 'error', confirmButtonColor: '#1F64BF', backdrop: `rgba(0,0,0,0.7)`, customClass: { container: 'swal-overlay-custom', popup: 'swal-modal-custom' } });
    }
  };

  const handleViewProduct = (productId) => {
    updateProductStats(productId, 'view');
    const product = products.find(p => p.id === productId);
    if (product) {
      Swal.fire({ title: product.name, html: `<div style="text-align: left; padding: 20px; line-height: 1.6;"><div style="margin-bottom: 12px;"><strong>Precio:</strong> ${product.formattedPrice}</div><div style="margin-bottom: 12px;"><strong>Categoría:</strong> ${product.categoryName}</div><div style="margin-bottom: 12px;"><strong>Estado:</strong> ${product.statusText}</div><div style="margin-bottom: 12px;"><strong>Pedidos:</strong> ${product.totalOrders}</div><div style="margin-bottom: 12px;"><strong>Vistas:</strong> ${product.totalViews}</div>${product.description ? `<div style="margin-top: 16px;"><strong>Descripción:</strong><br/><span style="color: #666;">${product.description}</span></div>` : ''}</div>`, imageUrl: product.mainImage, imageWidth: 300, imageHeight: 200, confirmButtonText: 'Cerrar', confirmButtonColor: '#1F64BF', width: 600, backdrop: `rgba(0,0,0,0.7)`, customClass: { container: 'swal-overlay-custom', popup: 'swal-modal-custom' } });
    }
  };

  const handleClearFilters = () => { setSearchQuery(''); setSelectedFilter('all'); setSortOption('newest'); setSelectedCategory(''); clearFilters(); };

  const handleCreateSamples = async () => {
    try {
      const result = await Swal.fire({ title: '¿Crear productos de ejemplo?', text: 'Esto creará varios productos de ejemplo para testing', icon: 'question', showCancelButton: true, confirmButtonColor: '#1F64BF', cancelButtonColor: '#6b7280', confirmButtonText: 'Sí, crear', cancelButtonText: 'Cancelar', backdrop: `rgba(0,0,0,0.7)`, customClass: { container: 'swal-overlay-custom', popup: 'swal-modal-custom' } });
      if (result.isConfirmed) {
        await createSampleProducts();
        await Swal.fire({ title: '¡Productos creados!', text: 'Se han creado los productos de ejemplo exitosamente', icon: 'success', confirmButtonColor: '#1F64BF', backdrop: `rgba(0,0,0,0.7)`, customClass: { container: 'swal-overlay-custom', popup: 'swal-modal-custom' } });
      }
    } catch (error) {
      await Swal.fire({ title: 'Error', text: 'No se pudieron crear los productos de ejemplo', icon: 'error', confirmButtonColor: '#1F64BF', backdrop: `rgba(0,0,0,0.7)`, customClass: { container: 'swal-overlay-custom', popup: 'swal-modal-custom' } });
    }
  };

  const handleStatsScroll = (e) => {
    const container = e.target;
    if (!container || stats.length === 0) return;
    
    const containerWidth = container.offsetWidth;
    const scrollLeft = container.scrollLeft;
    const totalCards = stats.length;
    
    // Detectar si estamos en modo 2 cards (550px < pantalla ≤ 1200px) o 1 card (≤550px)
    const windowWidth = window.innerWidth;
    const isMobile = windowWidth <= 550;
    let cardWidth;
    let maxIndex;
    
    if (isMobile) {
      // Una card por vez (100% del ancho) - 4 dots (0-3)
      cardWidth = containerWidth;
      maxIndex = totalCards - 1; // 3 (para 4 cards)
    } else {
      // Dos cards por vez (50% del ancho cada una + gap) - 3 dots (0-2)
      cardWidth = (containerWidth + 16) / 2; // containerWidth/2 + gap/2
      maxIndex = totalCards - 2; // 2 (para 4 cards, posiciones: 0-1, 1-2, 2-3)
    }
    
    // Calcular el índice actual basado en el ancho de card
    const currentIndex = Math.round(scrollLeft / cardWidth);
    setActiveStatsIndex(Math.max(0, Math.min(currentIndex, maxIndex)));
  };

  if (loading && !hasProducts) {
    return (
      <CatalogPageContainer>
        <CatalogContentWrapper>
          <CatalogLoadingContainer>
            <CircularProgress size={48} sx={{ color: '#1F64BF', filter: 'drop-shadow(0 4px 8px rgba(31, 100, 191, 0.3))' }} />
            <Typography component="div" variant="body1" sx={{ color: '#010326', fontWeight: 600, fontFamily: "'Mona Sans'" }}>Cargando catálogo de productos...</Typography>
          </CatalogLoadingContainer>
        </CatalogContentWrapper>
      </CatalogPageContainer>
    );
  }

  return (
    <CatalogPageContainer>
      <CatalogContentWrapper>
        <CatalogHeaderSection sx={{ fontWeight: '700 !important' }} className="force-bold" style={{ fontWeight: '700 !important' }}>
          <CatalogHeaderContent>
            <CatalogHeaderInfo>
              <CatalogMainTitle sx={{ fontWeight: '700 !important' }} className="force-bold" style={{ fontWeight: '700 !important' }}>Gestión de Productos</CatalogMainTitle>
              <CatalogMainDescription sx={{ fontWeight: '700 !important' }} className="force-bold" style={{ fontWeight: '700 !important' }}>Administra tu catálogo de productos personalizados y plantillas</CatalogMainDescription>
            </CatalogHeaderInfo>
            <CatalogHeaderActions>
              <CatalogPrimaryActionButton onClick={handleCreateProduct} disabled={loading} startIcon={<Plus size={18} weight="bold" />}>Nuevo Producto</CatalogPrimaryActionButton>
              <CatalogSecondaryActionButton onClick={fetchProducts} disabled={loading} title="Refrescar productos"><ArrowsClockwise size={20} weight="bold" /></CatalogSecondaryActionButton>
            </CatalogHeaderActions>
          </CatalogHeaderContent>
        </CatalogHeaderSection>

        {error && (
          <CatalogModernCard sx={{ p: 3, mb: 4, background: alpha('#dc2626', 0.05), border: `1px solid ${alpha('#dc2626', 0.2)}`, position: 'relative', zIndex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography sx={{ color: '#dc2626', fontWeight: 500, fontFamily: "'Mona Sans'" }}>⚠️ {error}</Typography>
              <Button size="small" onClick={fetchProducts} sx={{ color: '#dc2626', fontWeight: 600, textTransform: 'none', fontFamily: "'Mona Sans'" }}>Reintentar</Button>
            </Box>
          </CatalogModernCard>
        )}

        <CatalogStatsContainer>
          <CatalogStatsGrid ref={statsGridRef} onScroll={handleStatsScroll}>
            {stats.map((stat) => (
              <CatalogStatCard key={stat.id} variant={stat.variant}>
                <CatalogStatHeader>
                  <Box><CatalogStatValue variant={stat.variant}>{stat.value}</CatalogStatValue><CatalogStatLabel variant={stat.variant}>{stat.title}</CatalogStatLabel></Box>
                  <CatalogStatIconContainer variant={stat.variant}><stat.icon size={24} weight="duotone" /></CatalogStatIconContainer>
                </CatalogStatHeader>
                <CatalogStatChange variant={stat.variant} trend={stat.trend}><TrendUp size={12} weight="bold" /><CatalogStatTrendText variant={stat.variant} trend={stat.trend}>{stat.change}</CatalogStatTrendText></CatalogStatChange>
              </CatalogStatCard>
            ))}
          </CatalogStatsGrid>
          <CatalogStatsDotsContainer>
            {(() => {
              const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
              const isMobile = windowWidth <= 550;
              // Si hay 2 cards visibles, mostrar solo totalCards - 1 dots (3 para 4 cards)
              // Si hay 1 card visible, mostrar totalCards dots (4 para 4 cards)
              const dotsToShow = isMobile ? stats.length : stats.length - 1;
              
              return Array.from({ length: dotsToShow }, (_, index) => (
                <CatalogStatsDot 
                  key={index} 
                  active={activeStatsIndex === index} 
                  onClick={() => {
                    const grid = statsGridRef.current;
                    if (grid && grid.scrollTo) {
                      const containerWidth = grid.offsetWidth;
                      const windowWidth = window.innerWidth;
                      const isMobile = windowWidth <= 550;
                      const cardWidth = isMobile ? containerWidth : (containerWidth + 16) / 2;
                      grid.scrollTo({ left: index * cardWidth, behavior: 'smooth' });
                    }
                  }} 
                />
              ));
            })()}
          </CatalogStatsDotsContainer>
        </CatalogStatsContainer>

        <CatalogControlsSection>
          <CatalogControlsContent>
            <CatalogSearchSection>
              <CatalogModernTextField fullWidth placeholder="Buscar productos por nombre..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} InputProps={{ startAdornment: (<InputAdornment position="start"><MagnifyingGlass size={18} weight="bold" color="#032CA6" /></InputAdornment>) }} />
            </CatalogSearchSection>
            <CatalogFiltersSection>
              <CatalogFilterChip active={selectedFilter !== 'all'}>
                <Funnel size={14} weight="bold" data-filter-icon />
                <CaretDown size={12} weight="bold" data-caret-down style={{ opacity: 0.6 }} />
                <FormControl size="small" sx={{ width: '100%', height: '100%', '& .MuiOutlinedInput-root': { width: '100%', height: '100%' } }}>
                  <Select value={selectedFilter} onChange={(e) => setSelectedFilter(e.target.value)} displayEmpty sx={{ width: '100%', height: '100%', border: 'none', fontFamily: "'Mona Sans'", '& .MuiOutlinedInput-notchedOutline': { border: 'none' }, '& .MuiSelect-select': { padding: 0, fontSize: '0.875rem', fontWeight: 500, color: '#010326', fontFamily: "'Mona Sans'", width: '100%', height: '100%', display: 'flex', alignItems: 'center' }, '& .MuiSelect-icon': { display: 'none' } }}>
                    <MenuItem value="all">Todos</MenuItem><MenuItem value="active">Activos</MenuItem><MenuItem value="inactive">Inactivos</MenuItem>
                  </Select>
                </FormControl>
              </CatalogFilterChip>
              <CatalogFilterChip active={selectedCategory !== ''}>
                <Package size={14} weight="bold" data-filter-icon />
                <CaretDown size={12} weight="bold" data-caret-down style={{ opacity: 0.6 }} />
                <FormControl size="small" sx={{ width: '100%', height: '100%', '& .MuiOutlinedInput-root': { width: '100%', height: '100%' } }}>
                  <Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} displayEmpty disabled={loadingCategories || categoriesError} sx={{ width: '100%', height: '100%', border: 'none', fontFamily: "'Mona Sans'", '& .MuiOutlinedInput-notchedOutline': { border: 'none' }, '& .MuiSelect-select': { padding: 0, fontSize: '0.875rem', fontWeight: 500, color: '#010326', fontFamily: "'Mona Sans'", width: '100%', height: '100%', display: 'flex', alignItems: 'center' }, '& .MuiSelect-icon': { display: 'none' } }}>
                    <MenuItem value="">{loadingCategories ? 'Cargando...' : categoriesError ? 'Error' : 'Categorías'}</MenuItem>
                    {!categoriesError && categories.map(category => (<MenuItem key={category._id} value={category._id}>{category.name}</MenuItem>))}
                  </Select>
                </FormControl>
              </CatalogFilterChip>
              <CatalogFilterChip active={sortOption !== 'newest'}>
                <ChartLine size={14} weight="bold" data-filter-icon />
                <CaretDown size={12} weight="bold" data-caret-down style={{ opacity: 0.6 }} />
                <FormControl size="small" sx={{ width: '100%', height: '100%', '& .MuiOutlinedInput-root': { width: '100%', height: '100%' } }}>
                  <Select value={sortOption} onChange={(e) => setSortOption(e.target.value)} sx={{ width: '100%', height: '100%', border: 'none', fontFamily: "'Mona Sans'", '& .MuiOutlinedInput-notchedOutline': { border: 'none' }, '& .MuiSelect-select': { padding: 0, fontSize: '0.875rem', fontWeight: 500, color: '#010326', fontFamily: "'Mona Sans'", width: '100%', height: '100%', display: 'flex', alignItems: 'center' }, '& .MuiSelect-icon': { display: 'none' } }}>
                    <MenuItem value="newest">Más nuevos</MenuItem><MenuItem value="oldest">Más antiguos</MenuItem><MenuItem value="name_asc">A-Z</MenuItem><MenuItem value="name_desc">Z-A</MenuItem><MenuItem value="price_asc">Precio ↑</MenuItem><MenuItem value="price_desc">Precio ↓</MenuItem>
                  </Select>
                </FormControl>
              </CatalogFilterChip>
              {(searchQuery || selectedFilter !== 'all' || selectedCategory || sortOption !== 'newest') && (
                <ClearFiltersButton onClick={handleClearFilters} startIcon={<Broom size={16} weight="bold" />}>Limpiar</ClearFiltersButton>
              )}
            </CatalogFiltersSection>
          </CatalogControlsContent>
        </CatalogControlsSection>

        <CatalogProductsSection>
          <CatalogSectionHeader>
            <CatalogSectionTitle component="div">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span>Productos</span>
                <Chip label={`${products.length}${pagination.totalProducts !== products.length ? ` de ${pagination.totalProducts}` : ''}`} size="small" sx={{ background: alpha('#1F64BF', 0.1), color: '#032CA6', fontWeight: 600, ml: 1, fontFamily: "'Mona Sans'" }} />
              </Box>
            </CatalogSectionTitle>
          </CatalogSectionHeader>

          {loading && hasProducts && (
            <CatalogLoadingOverlay>
              <CircularProgress size={20} sx={{ color: '#1F64BF' }} />
              <Typography variant="body2" sx={{ color: '#1F64BF', fontWeight: 600, fontFamily: "'Mona Sans'" }}>Actualizando productos...</Typography>
            </CatalogLoadingOverlay>
          )}

          {products.length > 0 ? (
            <>
              <CatalogProductsGrid>
                {products.map((product) => (
                  <ProductCard key={product.id} id={product.id} name={product.name} image={product.mainImage} price={product.basePrice} status={product.isActive ? 'active' : 'inactive'} category={product.categoryName} sales={product.totalOrders} createdAt={product.createdAt} rank={product.isFeatured ? 1 : null} isTopProduct={product.isFeatured} onEdit={() => handleEditProduct(product.id)} onDelete={() => handleDeleteProduct(product.id)} onView={() => handleViewProduct(product.id)} />
                ))}
              </CatalogProductsGrid>
              {pagination.totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 5, gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                  <Button variant="outlined" onClick={() => fetchProducts({ page: pagination.currentPage - 1 })} disabled={!pagination.hasPrev || loading} sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 600, borderColor: alpha('#1F64BF', 0.3), color: '#1F64BF', minWidth: { xs: '100%', sm: 'auto' }, fontFamily: "'Mona Sans'", position: 'relative', overflow: 'hidden', '&::before': { content: '""', position: 'absolute', top: 0, left: '-100%', width: '100%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(31, 100, 191, 0.15), transparent)', transition: 'left 0.5s ease', zIndex: 0 }, '& > *': { position: 'relative', zIndex: 1 }, '&:hover': { borderColor: '#1F64BF', backgroundColor: alpha('#1F64BF', 0.05), '&::before': { left: '100%' } }, '&:disabled': { borderColor: alpha('#1F64BF', 0.1), color: alpha('#1F64BF', 0.3) } }}>← Anterior</Button>
                  <CatalogModernCard sx={{ px: 3, py: 1, minWidth: { xs: '100%', sm: 'auto' }, textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#032CA6', fontWeight: 600, fontFamily: "'Mona Sans'" }}>{pagination.currentPage} de {pagination.totalPages}</Typography>
                  </CatalogModernCard>
                  <Button variant="outlined" onClick={() => fetchProducts({ page: pagination.currentPage + 1 })} disabled={!pagination.hasNext || loading} sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 600, borderColor: alpha('#1F64BF', 0.3), color: '#1F64BF', minWidth: { xs: '100%', sm: 'auto' }, fontFamily: "'Mona Sans'", position: 'relative', overflow: 'hidden', '&::before': { content: '""', position: 'absolute', top: 0, left: '-100%', width: '100%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(31, 100, 191, 0.15), transparent)', transition: 'left 0.5s ease', zIndex: 0 }, '& > *': { position: 'relative', zIndex: 1 }, '&:hover': { borderColor: '#1F64BF', backgroundColor: alpha('#1F64BF', 0.05), '&::before': { left: '100%' } }, '&:disabled': { borderColor: alpha('#1F64BF', 0.1), color: alpha('#1F64BF', 0.3) } }}>Siguiente →</Button>
                </Box>
              )}
            </>
          ) : (
            <CatalogEmptyState>
              <CatalogEmptyStateIcon><Package size={40} weight="duotone" /></CatalogEmptyStateIcon>
              <CatalogEmptyStateTitle>{searchQuery || selectedFilter !== 'all' || selectedCategory ? 'No hay productos que coincidan' : 'No hay productos en el catálogo'}</CatalogEmptyStateTitle>
              <CatalogEmptyStateDescription>{searchQuery || selectedFilter !== 'all' || selectedCategory ? 'Intenta ajustar los filtros de búsqueda o crear un nuevo producto para comenzar' : 'Comienza creando tu primer producto personalizado para el catálogo'}</CatalogEmptyStateDescription>
              <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                <CatalogPrimaryActionButton onClick={handleCreateProduct} startIcon={<Plus size={18} weight="bold" />} sx={{ minWidth: { xs: '100%', sm: '140px' } }}>Crear Producto</CatalogPrimaryActionButton>
                {process.env.NODE_ENV === 'development' && (
                  <Button variant="outlined" onClick={handleCreateSamples} startIcon={<span style={{ fontSize: '16px' }}>🧪</span>} sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 600, borderColor: alpha('#1F64BF', 0.3), color: '#1F64BF', padding: '12px 24px', minWidth: { xs: '100%', sm: 'auto' }, fontFamily: "'Mona Sans'", position: 'relative', overflow: 'hidden', '&::before': { content: '""', position: 'absolute', top: 0, left: '-100%', width: '100%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(31, 100, 191, 0.15), transparent)', transition: 'left 0.5s ease', zIndex: 0 }, '& > *': { position: 'relative', zIndex: 1 }, '&:hover': { borderColor: '#1F64BF', backgroundColor: alpha('#1F64BF', 0.05), '&::before': { left: '100%' } } }}>Crear Ejemplos</Button>
                )}
              </Box>
            </CatalogEmptyState>
          )}
        </CatalogProductsSection>
      </CatalogContentWrapper>

      {showCreateModal && (<CreateProductModal isOpen={showCreateModal} onClose={handleCloseModal} onCreateProduct={handleProductCreated} editMode={!!editingProduct} productToEdit={editingProduct} />)}
    </CatalogPageContainer>
  );
};

export default CatalogManagement;