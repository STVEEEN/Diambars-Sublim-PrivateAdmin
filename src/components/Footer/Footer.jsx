// src/components/Footer/Footer.jsx
import React, { useState } from 'react';
import { 
  Phone, 
  MapPin, 
  EnvelopeSimple, 
  WhatsappLogo,
  Shield,
  Clock,
  House,
  Users,
  UserList,
  Folders,
  ChartBar,
  Star,
  PaintBrush,
  ShoppingCart,
  FileText,
  CreditCard,
  ChartPie,
  Gear,
  CaretDown,
  CaretUp
} from '@phosphor-icons/react';
import {
  Box,
  Typography,
  Container,
  styled,
  useTheme,
  alpha,
  IconButton,
  Collapse,
  Link
} from '@mui/material';

// ================ KEYFRAMES PARA LIQUID GLASS WWDC 2025 ================ 
const liquidGlassKeyframes = ` 
  @keyframes marbleFlow { 
    0% { transform: translate(2%, 2%) rotate(0deg) scale(1); } 
    25% { transform: translate(-8%, -8%) rotate(5deg) scale(1.05); } 
    50% { transform: translate(-15%, 8%) rotate(-3deg) scale(1.08); } 
    75% { transform: translate(-8%, -5%) rotate(2deg) scale(1.05); } 
    100% { transform: translate(2%, 2%) rotate(0deg) scale(1); } 
  } 
  
  @keyframes footerGlow {
    0%, 100% { opacity: 0.4; transform: scaleX(1); }
    50% { opacity: 0.8; transform: scaleX(1.1); }
  }
  
  @keyframes logoRotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes liquidGlassReflection {
    0% {
      background: linear-gradient(180deg,
        rgba(255, 255, 255, 0.3) 0%,
        rgba(255, 255, 255, 0.15) 30%,
        rgba(255, 255, 255, 0.08) 60%,
        transparent 100%
      );
      transform: translateX(0%) scaleX(1);
    }
    25% {
      background: linear-gradient(180deg,
        rgba(255, 255, 255, 0.4) 0%,
        rgba(255, 255, 255, 0.25) 25%,
        rgba(255, 255, 255, 0.12) 50%,
        transparent 100%
      );
      transform: translateX(2%) scaleX(1.02);
    }
    50% {
      background: linear-gradient(180deg,
        rgba(255, 255, 255, 0.5) 0%,
        rgba(255, 255, 255, 0.3) 20%,
        rgba(255, 255, 255, 0.15) 40%,
        transparent 100%
      );
      transform: translateX(-1%) scaleX(0.98);
    }
    75% {
      background: linear-gradient(180deg,
        rgba(255, 255, 255, 0.35) 0%,
        rgba(255, 255, 255, 0.2) 35%,
        rgba(255, 255, 255, 0.1) 65%,
        transparent 100%
      );
      transform: translateX(1%) scaleX(1.01);
    }
    100% {
      background: linear-gradient(180deg,
        rgba(255, 255, 255, 0.3) 0%,
        rgba(255, 255, 255, 0.15) 30%,
        rgba(255, 255, 255, 0.08) 60%,
        transparent 100%
      );
      transform: translateX(0%) scaleX(1);
    }
  }

  @keyframes liquidGlassShimmer {
    0% {
      transform: translateX(-100%) skewX(-15deg);
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      transform: translateX(200%) skewX(-15deg);
      opacity: 0;
    }
  }

  @keyframes liquidGlassWave {
    0% {
      transform: translateY(0px) scaleY(1);
      opacity: 0.6;
    }
    50% {
      transform: translateY(-5px) scaleY(1.1);
      opacity: 0.8;
    }
    100% {
      transform: translateY(0px) scaleY(1);
      opacity: 0.6;
    }
  }
`;

// Inyectar keyframes en el documento
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = liquidGlassKeyframes;
  document.head.appendChild(styleSheet);
}

// ================ STYLED COMPONENTS ================ 

// Footer principal con LIQUID GLASS WWDC 2025
const FooterPrivate = styled(Box)(({ theme }) => ({
  width: '100%',
  fontFamily: "'Mona Sans', sans-serif",
  position: 'relative',
  zIndex: 10,
  
  // BASE LIQUID GLASS - Fondo translúcido con gradiente azul MÁS OSCURO
  background: `
    linear-gradient(135deg, 
      rgba(15, 50, 95, 0.95) 0%,
      rgba(2, 22, 83, 0.90) 50%,
      rgba(2, 8, 95, 0.92) 100%
    )
  `,
  backdropFilter: 'blur(60px) saturate(200%)',
  WebkitBackdropFilter: 'blur(60px) saturate(200%)',
  borderTop: '2px solid rgba(255, 255, 255, 0.3)',
  // LIQUID GLASS SHADOW SYSTEM
  boxShadow: `
    0 -2px 8px rgba(0, 0, 0, 0.04),
    0 -8px 24px rgba(0, 0, 0, 0.06),
    0 -24px 48px rgba(0, 0, 0, 0.08),
    inset 0 2px 0 rgba(255, 255, 255, 0.3),
    inset 0 -2px 0 rgba(255, 255, 255, 0.1)
  `,
  paddingTop: '40px',
  marginTop: 'auto',
  marginBottom: '0px',
  overflow: 'hidden',
  boxSizing: 'border-box',
  // LIQUID GLASS TRANSITION
  transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  
  // EFECTO MÁRMOL AZUL OSCURO DESENFOCADO - POR DEBAJO DE ELEMENTOS
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    background: `
      radial-gradient(ellipse at 15% 30%, rgba(4, 48, 134, 0.8) 0%, transparent 40%),
      radial-gradient(ellipse at 85% 20%, rgba(1, 22, 83, 0.8) 0%, transparent 45%),
      radial-gradient(ellipse at 50% 80%, rgba(3, 8, 109, 0.6) 0%, transparent 50%),
      radial-gradient(ellipse at 25% 70%, rgba(5, 38, 105, 0.7) 0%, transparent 35%),
      radial-gradient(ellipse at 75% 30%, rgba(0, 28, 112, 0.69) 0%, transparent 40%)
    `,
    pointerEvents: 'none',
    zIndex: -1,
    // ANIMACIÓN MÁRMOL LENTA
    animation: 'marbleFlow 30s ease-in-out infinite',
    // MUCHÍSIMO BLUR PARA DESENFOQUE
    filter: 'blur(40px)',
    opacity: 0.6,
  },
  
  // LIQUID GLASS LAYER 2 - Línea superior simple (sin animación)
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '2px',
    background: 'rgba(255, 255, 255, 0.3)',
    zIndex: 2,
  },
  
  // Responsive
  [theme.breakpoints.down('md')]: {
    paddingTop: '32px',
  }
}));

// LIQUID GLASS SHIMMER EFFECT para el footer
const FooterLiquidGlassShimmer = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: `
    linear-gradient(
      45deg,
      transparent 70%,
      rgba(220, 230, 245, 0.4) 85%,
      rgba(235, 240, 250, 0.35) 115%,
      rgba(220, 230, 245, 0.4) 125%,
      transparent 140%
    ) 
  `,
  pointerEvents: 'none',
  zIndex: 3,
  animation: 'liquidGlassShimmer 15s ease-in-out infinite',
  opacity: 0.6,
  animationDelay: '3s',
  // MUCHÍSIMO BLUR para eliminar aristas
  filter: 'blur(1000px)',
  WebkitFilter: 'blur(100px)',
});

// Container principal del footer
const FooterContainer = styled(Container)(({ theme }) => ({
  maxWidth: '1400px !important',
  margin: '0 auto',
  padding: '0 32px !important',
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr',
  gap: '48px',
  alignItems: 'start',
  position: 'relative',
  zIndex: 2,
  
  [theme.breakpoints.down('lg')]: {
    gridTemplateColumns: '1fr 1fr',
    gap: '32px',
  },
  
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr',
    gap: '32px',
    padding: '0 20px !important',
  }
}));

// Sección del footer
const FooterSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  animation: 'fadeIn 0.6s ease-out forwards',
}));

// Título de sección
const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '16px',
  fontWeight: 700,
  color: '#FFFFFF',
  margin: '0 0 16px 0',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  position: 'relative',
  
  '&::before': {
    content: '""',
    width: '20px',
    height: '3px',
    background: 'linear-gradient(90deg, #FFFFFF, #E2E8F0)',
    borderRadius: '2px',
  }
}));

// Brand container
const BrandContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  marginBottom: '24px',
  position: 'relative',
  zIndex: 2,
}));

// Logo container
const LogoContainer = styled(Box)(({ theme }) => ({
  width: '48px',
  height: '48px',
  background: 'linear-gradient(135deg, #FFFFFF, #E2E8F0)',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 4px 15px rgba(255, 255, 255, 0.2)',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: '-2px',
    background: 'conic-gradient(from 0deg, #FFFFFF, #E2E8F0, #FFFFFF)',
    borderRadius: '50%',
    zIndex: -1,
    animation: 'logoRotate 4s linear infinite',
  },
  
  '&:hover': {
    transform: 'rotate(10deg) scale(1.05)',
    boxShadow: '0 6px 20px rgba(255, 255, 255, 0.3)',
  }
}));

// Logo image
const LogoImage = styled('img')(({ theme }) => ({
  width: '32px',
  height: '32px',
  objectFit: 'contain',
  filter: 'brightness(0) saturate(100%) invert(24%) sepia(98%) saturate(1833%) hue-rotate(210deg) brightness(93%) contrast(101%)',
}));

// Brand text
const BrandText = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
}));

const BrandName = styled(Typography)(({ theme }) => ({
  fontSize: '20px',
  fontWeight: 700,
  color: '#FFFFFF',
  margin: 0,
  background: 'linear-gradient(135deg, #FFFFFF, #E2E8F0)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
}));

const BrandSubtitle = styled(Typography)(({ theme }) => ({
  fontSize: '11px',
  color: '#CBD5E1',
  fontStyle: 'italic',
  letterSpacing: '1.5px',
  textTransform: 'lowercase',
  marginTop: '-2px',
}));

// Contact items
const ContactContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
}));

const ContactItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '10px 14px',
  // MISMO ESTILO QUE STATUSITEM
  background: 'rgba(255, 255, 255, 0.08)',
  border: '1px solid rgba(255, 255, 255, 0.12)',
  borderRadius: '10px',
  fontSize: '13px',
  fontWeight: 500,
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent)',
    transition: 'left 0.5s ease',
  },
  
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.12)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    transform: 'scale(1.02)',
    
    '&::before': {
      left: '100%',
    }
  }
}));

const ContactContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
}));

const ContactLabel = styled(Typography)(({ theme }) => ({
  fontSize: '11px',
  color: '#CBD5E1',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
}));

const ContactValue = styled(Typography)(({ theme }) => ({
  fontSize: '13px',
  color: '#FFFFFF',
  fontWeight: 600,
}));

// System status
const SystemStatusContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  marginBottom: '24px',
}));

const StatusItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '10px 14px',
  background: 'rgba(255, 255, 255, 0.08)',
  border: '1px solid rgba(255, 255, 255, 0.12)',
  borderRadius: '10px',
  fontSize: '13px',
  fontWeight: 500,
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent)',
    transition: 'left 0.5s ease',
  },
  
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.12)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    transform: 'scale(1.02)',
    
    '&::before': {
      left: '100%',
    }
  }
}));

const StatusText = styled(Typography)(({ theme }) => ({
  color: '#E2E8F0',
  flex: 1,
  fontSize: '13px',
}));

// Navigation sections
const NavigationContainer = styled(Box)(({ theme }) => ({
  maxWidth: '400px',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  marginBottom: '20px',
}));

const NavSection = styled(Box)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.08)',
  border: '1px solid rgba(255, 255, 255, 0.12)',
  borderRadius: '12px',
  overflow: 'hidden',
  // MÁXIMA OPTIMIZACIÓN: Transiciones ultra rápidas
  transition: 'background-color 0.1s ease, border-color 0.1s ease, box-shadow 0.1s ease',
  // PERFORMANCE: GPU acelerada + contenido compuesto
  transform: 'translate3d(0, 0, 0)',
  willChange: 'background-color, border-color, box-shadow',
  contain: 'layout style paint',
  
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.12)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    boxShadow: '0 2px 8px rgba(255, 255, 255, 0.1)',
  }
}));

const NavHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '12px 16px',
  cursor: 'pointer',
  // OPTIMIZACIÓN: Transición más rápida
  transition: 'background-color 0.15s ease',
  userSelect: 'none',
  // PERFORMANCE: Activar aceleración GPU
  transform: 'translate3d(0, 0, 0)',
  willChange: 'background-color',
  
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.08)',
  }
}));

const NavTitle = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  fontSize: '14px',
  fontWeight: 600,
  color: '#E2E8F0',
  
  '& svg': {
    color: '#FFFFFF',
    transition: 'all 0.3s ease',
  }
}));

const NavToggle = styled(IconButton)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '24px',
  height: '24px',
  borderRadius: '6px',
  background: 'rgba(255, 255, 255, 0.12)',
  color: '#FFFFFF',
  // OPTIMIZACIÓN: Transición más rápida y específica
  transition: 'background-color 0.15s ease, transform 0.15s ease',
  padding: 0,
  // PERFORMANCE: Activar aceleración GPU
  transform: 'translate3d(0, 0, 0) scale(1)',
  willChange: 'background-color, transform',
  
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.2)',
    transform: 'translate3d(0, 0, 0) scale(1.1)',
  }
}));

const NavLinks = styled(Collapse)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.05)',
  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
  // OPTIMIZACIÓN: Mejorar performance del Collapse
  '& .MuiCollapse-wrapper': {
    transform: 'translate3d(0, 0, 0)',
  },
  '& .MuiCollapse-wrapperInner': {
    transform: 'translate3d(0, 0, 0)',
  }
}));

const NavLink = styled(Link)(({ theme }) => ({
  display: 'block',
  padding: '10px 20px',
  color: '#CBD5E1',
  textDecoration: 'none',
  fontSize: '13px',
  fontWeight: 500,
  // OPTIMIZACIÓN: Transiciones específicas y más rápidas
  transition: 'color 0.2s ease, background-color 0.2s ease, padding-left 0.2s ease, font-weight 0.2s ease',
  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  position: 'relative',
  overflow: 'hidden',
  // PERFORMANCE: Activar aceleración GPU
  transform: 'translate3d(0, 0, 0)',
  willChange: 'color, background-color, padding-left, font-weight',
  
  '&::before': {
    content: '""',
    position: 'absolute',
    left: '-100%',
    top: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
    transition: 'left 0.3s ease',
    transform: 'translate3d(0, 0, 0)',
  },
  
  '&:hover': {
    color: '#FFFFFF',
    background: 'rgba(255, 255, 255, 0.08)',
    paddingLeft: '24px',
    fontWeight: 600,
    
    '&::before': {
      left: '100%',
    }
  }
}));

// Quick links
const QuickLinksContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '12px',
  marginTop: '16px',
  paddingTop: '16px',
  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
}));

const QuickLink = styled(Link)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '10px 14px',
  background: 'rgba(255, 255, 255, 0.08)',
  border: '1px solid rgba(255, 255, 255, 0.15)',
  borderRadius: '10px',
  color: '#E2E8F0',
  textDecoration: 'none',
  fontSize: '13px',
  fontWeight: 600,
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  
  '&::before': {
    content: '""',
    position: 'absolute',
    left: '-100%',
    top: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
    transition: 'left 0.5s ease',
  },
  
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.12)',
    borderColor: 'rgba(255, 255, 255, 0.25)',
    color: '#FFFFFF',
    transform: 'translateY(-1px)',
    boxShadow: '0 2px 8px rgba(255, 255, 255, 0.1)',
    
    '&::before': {
      left: '100%',
    },
    
    '& svg': {
      color: '#E2E8F0',
      transform: 'scale(1.1)',
    }
  },
  
  '& svg': {
    color: '#FFFFFF',
    transition: 'all 0.3s ease',
  }
}));

// Social container
const SocialContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
}));

const SocialTitle = styled(Typography)(({ theme }) => ({
  fontSize: '14px',
  fontWeight: 600,
  color: '#FFFFFF',
  margin: 0,
}));

const SocialIconsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '12px',
  flexWrap: 'wrap',
}));

const SocialLink = styled(Link)(({ theme }) => ({
  width: '40px',
  height: '40px',
  background: 'rgba(255, 255, 255, 0.08)',
  border: '2px solid rgba(255, 255, 255, 0.15)',
  borderRadius: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#E2E8F0',
  textDecoration: 'none',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.08))',
    opacity: 0,
    transition: 'opacity 0.3s ease',
  },
  
  '&:hover': {
    color: '#FFFFFF',
    borderColor: '#FFFFFF',
    transform: 'translateY(-2px) scale(1.05)',
    boxShadow: '0 4px 15px rgba(255, 255, 255, 0.15)',
    
    '&::before': {
      opacity: 1,
    }
  }
}));

const WhatsAppLink = styled(SocialLink)(({ theme }) => ({
  color: '#86EFAC',
  
  '&::before': {
    background: 'linear-gradient(135deg, rgba(134, 239, 172, 0.15), rgba(134, 239, 172, 0.08))',
  },
  
  '&:hover': {
    color: '#BBF7D0',
    borderColor: '#86EFAC',
    boxShadow: '0 4px 15px rgba(134, 239, 172, 0.2)',
  }
}));

// Barra inferior
const FooterBottom = styled(Box)(({ theme }) => ({
  // Ancho simple como el footer público
  width: '100%',
  
  // Estilos visuales
  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.04))',
  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
  padding: '20px 0',
  marginTop: '40px',
  zIndex: 2,
  
  // Prevenir scroll horizontal
  overflow: 'hidden',
  boxSizing: 'border-box',
}));

const FooterBottomContent = styled(Container)(({ theme }) => ({
  maxWidth: '1400px !important',
  margin: '0 auto',
  padding: '0 32px !important',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    gap: '12px',
    textAlign: 'center',
    padding: '0 20px !important',
  }
}));

const CopyrightContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
}));

const CopyrightText = styled(Typography)(({ theme }) => ({
  fontSize: '14px',
  color: '#FFFFFF',
  fontWeight: 600,
}));

const VersionText = styled(Typography)(({ theme }) => ({
  fontSize: '12px',
  color: '#CBD5E1',
  fontWeight: 500,
}));

const MadeWithContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '13px',
  color: '#CBD5E1',
  fontWeight: 500,
}));

const Footer = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();
  const [openDropdowns, setOpenDropdowns] = useState({});

  const toggleDropdown = (section) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // EXACTAMENTE LOS MISMOS APARTADOS QUE EL NAVBAR
  const navigationSections = {
    principales: {
      title: "Navegación Principal",
      icon: <House size={16} weight="duotone" />,
      isQuickAccess: true,
      links: [
        { to: "/dashboard", label: "Inicio", icon: <House size={14} />, description: "Panel principal" }
      ]
    },
    personal: {
      title: "Personal",
      icon: <Users size={16} weight="duotone" />,
      links: [
        { to: "/employees", label: "Empleados", icon: <UserList size={14} />, description: "Gestión de personal" },
        { to: "/users", label: "Usuarios", icon: <Users size={14} />, description: "Administración de usuarios" }
      ]
    },
    gestion: {
      title: "Gestión",
      icon: <Folders size={16} weight="duotone" />,
      links: [
        { to: "/catalog-management", label: "Productos", icon: <ChartBar size={14} />, description: "Gestión de productos" },
        { to: "/category-management", label: "Categorías", icon: <Folders size={14} />, description: "Organización" },
        { to: "/address-management", label: "Direcciones", icon: <MapPin size={14} />, description: "Direcciones de envío" },
        { to: "/ReviewsManagement", label: "Reseñas", icon: <Star size={14} />, description: "Opiniones" }
      ]
    },
    herramientas: {
      title: "Herramientas",
      icon: <PaintBrush size={16} weight="duotone" />,
      links: [
        { to: "/design-management", label: "Editor de Diseños", icon: <PaintBrush size={14} />, description: "Herramientas de diseño" },
        { to: "/orders", label: "Pedidos", icon: <ShoppingCart size={14} />, description: "Control de pedidos" }
      ]
    },
    analisis: {
      title: "Análisis",
      icon: <ChartBar size={16} weight="duotone" />,
      links: [
        { to: "/reports", label: "Reportes", icon: <FileText size={14} />, description: "Informes detallados" },
        { to: "/payment-methods", label: "Métodos de Pago", icon: <CreditCard size={14} />, description: "Gestión de pagos" }
      ]
    }
  };

  return (
    <FooterPrivate component="footer">
      {/* LIQUID GLASS SHIMMER EFFECT SUTIL */}
      <FooterLiquidGlassShimmer />
      
      <FooterContainer>
        
        {/* Sección izquierda - Información de contacto */}
        <FooterSection>
          <BrandContainer>
            <LogoContainer>
              <LogoImage src="/logo.png" alt="Diambars Logo" />
            </LogoContainer>
            <BrandText>
              <BrandName>DIAMBARS</BrandName>
              <BrandSubtitle>administración</BrandSubtitle>
            </BrandText>
          </BrandContainer>
          
          <ContactContainer>
            <ContactItem>
              <Phone size={16} weight="duotone" style={{ color: '#FFFFFF', minWidth: '20px' }} />
              <ContactContent>
                <ContactLabel>Teléfono</ContactLabel>
                <ContactValue>+503 2234-5678</ContactValue>
              </ContactContent>
            </ContactItem>
            
            <ContactItem>
              <MapPin size={16} weight="duotone" style={{ color: '#FFFFFF', minWidth: '20px' }} />
              <ContactContent>
                <ContactLabel>Ubicación</ContactLabel>
                <ContactValue>San Salvador, El Salvador</ContactValue>
              </ContactContent>
            </ContactItem>
            
            <ContactItem>
              <EnvelopeSimple size={16} weight="duotone" style={{ color: '#FFFFFF', minWidth: '20px' }} />
              <ContactContent>
                <ContactLabel>Correo</ContactLabel>
                <ContactValue>admin@diambars.com</ContactValue>
              </ContactContent>
            </ContactItem>
          </ContactContainer>

          {/* Estado del sistema */}
          <SystemStatusContainer>
            <StatusItem>
              <ChartPie size={16} weight="duotone" style={{ color: '#86EFAC', minWidth: '16px' }} />
              <StatusText>Sistema Operativo</StatusText>
            </StatusItem>
            <StatusItem>
              <Clock size={16} weight="duotone" style={{ color: '#FFFFFF', minWidth: '16px' }} />
              <StatusText>Última actualización: {new Date().toLocaleDateString()}</StatusText>
            </StatusItem>
          </SystemStatusContainer>
        </FooterSection>

        {/* Sección central - Navegación IDÉNTICA al navbar */}
        <FooterSection>
          <SectionTitle>Navegación del Sistema</SectionTitle>
          
          <NavigationContainer>
            {Object.entries(navigationSections).map(([key, section]) => (
              <NavSection key={key}>
                <NavHeader onClick={() => toggleDropdown(key)}>
                  <NavTitle>
                    {section.icon}
                    <Typography component="span" sx={{ fontSize: '14px', fontWeight: 600, color: '#E2E8F0' }}>
                      {section.title}
                    </Typography>
                  </NavTitle>
                  <NavToggle>
                    {openDropdowns[key] ? 
                      <CaretUp size={14} weight="bold" /> : 
                      <CaretDown size={14} weight="bold" />
                    }
                  </NavToggle>
                </NavHeader>
                
                <NavLinks 
                  in={openDropdowns[key]}
                  timeout={150}
                  easing={{
                    enter: 'cubic-bezier(0.4, 0, 0.2, 1)',
                    exit: 'cubic-bezier(0.4, 0, 0.6, 1)',
                  }}
                >
                  <Box>
                    {section.links.map((link, index) => (
                      <NavLink 
                        key={index} 
                        href={link.to}
                        title={link.description}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          {link.icon}
                          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography component="span" sx={{ fontWeight: '600', fontSize: '13px' }}>
                              {link.label}
                            </Typography>
                            <Typography component="span" sx={{ fontSize: '11px', opacity: '0.7', marginTop: '2px' }}>
                              {link.description}
                            </Typography>
                          </Box>
                        </Box>
                      </NavLink>
                    ))}
                  </Box>
                </NavLinks>
              </NavSection>
            ))}
          </NavigationContainer>

          {/* Enlace directo a perfil */}
          <QuickLinksContainer>
            <QuickLink href="/profile">
              <Gear size={16} weight="duotone" />
              Mi Perfil
            </QuickLink>
          </QuickLinksContainer>
        </FooterSection>

        {/* Sección derecha - Contacto y redes sociales */}
        <FooterSection>
          <SectionTitle>Contacto Rápido</SectionTitle>

          <SystemStatusContainer>
            <StatusItem>
              <Clock size={16} weight="duotone" style={{ color: '#FFFFFF', minWidth: '16px' }} />
              <StatusText>
                Horario: Lunes a Viernes<br />
                8:00 AM - 6:00 PM
              </StatusText>
            </StatusItem>
            
            <StatusItem>
              <ChartBar size={16} weight="duotone" style={{ color: '#86EFAC', minWidth: '16px' }} />
              <StatusText>
                Soporte Técnico<br />
                24/7 Disponible
              </StatusText>
            </StatusItem>
          </SystemStatusContainer>

          <SocialContainer>
            <SocialTitle>Soporte Inmediato</SocialTitle>
            <SocialIconsContainer>
              <WhatsAppLink 
                href="https://wa.me/50322345678" 
                target="_blank" 
                rel="noopener noreferrer" 
                title="Contactar por WhatsApp"
              >
                <WhatsappLogo size={20} weight="duotone" />
              </WhatsAppLink>
              
              <SocialLink 
                href="mailto:admin@diambars.com" 
                title="Enviar correo"
              >
                <EnvelopeSimple size={20} weight="duotone" />
              </SocialLink>
            </SocialIconsContainer>
          </SocialContainer>
        </FooterSection>
      </FooterContainer>

      {/* Barra inferior de copyright */}
      <FooterBottom>
        <FooterBottomContent>
          <CopyrightContainer>
            <CopyrightText>© {currentYear} DIAMBARS Administración. Todos los derechos reservados.</CopyrightText>
            <VersionText>Panel de Administración v2.1.0</VersionText>
          </CopyrightContainer>
          <MadeWithContainer>
            <Typography component="span">Desarrollado</Typography>
            <Typography component="span">para Diambars Sublimado</Typography>
          </MadeWithContainer>
        </FooterBottomContent>
      </FooterBottom>
    </FooterPrivate>
  );
};

export default Footer;