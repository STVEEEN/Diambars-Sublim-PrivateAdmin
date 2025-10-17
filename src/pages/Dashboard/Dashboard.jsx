// src/pages/Dashboard/Dashboard.jsx - DASHBOARD UNIFICADO CON ANIMACIONES MEJORADAS
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  styled,
  useTheme,
  alpha,
  Avatar,
  IconButton,
  LinearProgress,
  Chip,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Stack,
  Container,
  useMediaQuery
} from '@mui/material';
import {
  Target,
  Clock,
  User,
  Users,
  Package,
  ShoppingCart,
  PaintBrush,
  ChartLine,
  Gear,
  ArrowRight,
  ArrowDown,
  CheckCircle,
  Warning,
  Info,
  Heart,
  Star,
  Rocket,
  Code,
  Database,
  Shield,
  Lightning,
  Coffee,
  MapPin,
  Crown,
  Sparkle,
  MagicWand
} from '@phosphor-icons/react';
import { useAuth } from '../../context/AuthContext';
import { usePermissions } from '../../utils/permissions';
import { useNavigate } from 'react-router-dom';

// ================ KEYFRAMES PARA ANIMACIÓN DE MÁRMOL MEJORADA ================ 
const marbleFlowKeyframes = `
@keyframes marbleFlow {
  0% {
    transform: translate(5%, 5%) rotate(0deg) scale(1);
  }
  25% {
    transform: translate(-12%, -12%) rotate(8deg) scale(1.1);
  }
  50% {
    transform: translate(-20%, 12%) rotate(-5deg) scale(1.15);
  }
  75% {
    transform: translate(-15%, -8%) rotate(3deg) scale(1.08);
  }
  100% {
    transform: translate(5%, 5%) rotate(0deg) scale(1);
  }
}

@keyframes footerGlow {
  0%, 100% { opacity: 0.6; transform: scaleX(1); }
  50% { opacity: 1; transform: scaleX(1.2); }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.08); }
}

@keyframes mouseTracking {
  0% { opacity: 0; }
  100% { opacity: 1; }
}
`;

// Inyectar keyframes en el documento
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = marbleFlowKeyframes;
  document.head.appendChild(styleSheet);
}

// ================ STYLED COMPONENTS ================ 

// Container principal - IGUAL AL CATALOG MANAGEMENT
const DashboardPageContainer = styled(Box)({
  minHeight: '100vh',
  fontFamily: "'Mona Sans'",
  background: 'white',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
});

// Content wrapper usando Container de MUI con breakpoints estándar
const DashboardContentWrapper = styled(Container)(({ theme }) => ({
  paddingTop: '120px',
  paddingBottom: '40px',
  minHeight: 'calc(100vh - 120px)',
  fontFamily: "'Mona Sans'",
  // Breakpoints estándar de MUI: xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536
  [theme.breakpoints.down('lg')]: { paddingTop: '110px', paddingBottom: '32px' },
  [theme.breakpoints.down('md')]: { paddingTop: '100px', paddingBottom: '28px' },
  [theme.breakpoints.down('sm')]: { paddingTop: '90px', paddingBottom: '24px' }
}));

// Modern card - IGUAL AL CATALOG
const DashboardModernCard = styled(Paper)(({ theme }) => ({
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

// Header section - IGUAL AL CATALOG
const DashboardHeaderSection = styled(DashboardModernCard)(({ theme }) => ({
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

// Header content con mejor responsividad
const DashboardHeaderContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '32px',
  width: '100%',
  // Breakpoints estándar de MUI: xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536
  [theme.breakpoints.down('lg')]: { gap: '24px' },
  [theme.breakpoints.down('md')]: { 
    flexDirection: 'column', 
    alignItems: 'center', 
    textAlign: 'center', 
    gap: '20px' 
  },
  [theme.breakpoints.down('sm')]: { 
    gap: '16px',
    padding: '0 16px' // Evitar overflow en móviles
  }
}));

// Header info - IGUAL AL CATALOG
const DashboardHeaderInfo = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
    alignItems: 'flex-start',
  justifyContent: 'center',
  [theme.breakpoints.down('md')]: { alignItems: 'center', textAlign: 'center' }
}));

// Main title - IGUAL AL CATALOG
const DashboardMainTitle = styled(Typography)(({ theme }) => ({
  fontSize: '2.5rem',
  fontWeight: 700,
  color: '#010326',
  margin: '0 0 8px 0',
  display: 'flex',
  alignItems: 'center',
    gap: '16px',
  fontFamily: "'Mona Sans'",
  [theme.breakpoints.down('xl')]: { fontSize: '2.3rem' },
  [theme.breakpoints.down('lg')]: { fontSize: '2.1rem' },
  [theme.breakpoints.down('md')]: { fontSize: '1.9rem', justifyContent: 'center' },
  [theme.breakpoints.down('sm')]: { fontSize: '1.7rem', flexDirection: 'column', gap: '8px' }
}));

// Subtitle - IGUAL AL CATALOG
const DashboardSubtitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.1rem',
  color: '#64748b',
  margin: '0',
  fontWeight: 500,
  fontFamily: "'Mona Sans'",
  [theme.breakpoints.down('lg')]: { fontSize: '1rem' },
  [theme.breakpoints.down('md')]: { fontSize: '0.95rem' },
  [theme.breakpoints.down('sm')]: { fontSize: '0.9rem' }
}));

// Time display
const TimeDisplay = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginTop: '12px',
  color: '#64748b',
    fontSize: '0.9rem',
  fontWeight: 500,
  [theme.breakpoints.down('md')]: { justifyContent: 'center' }
}));

// Header actions - IGUAL AL CATALOG
const DashboardHeaderActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  flexShrink: 0,
  [theme.breakpoints.down('md')]: { justifyContent: 'center' }
}));

// Primary button - IGUAL AL CATALOG
const DashboardPrimaryButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1F64BF, #032CA6)',
      color: '#FFFFFF',
  borderRadius: '12px',
  padding: '12px 24px',
  fontSize: '0.95rem',
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: '0 2px 8px rgba(31, 100, 191, 0.3)',
  transition: 'all 0.3s ease',
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
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
    transition: 'left 0.5s ease',
    zIndex: 0
  },
  '& > *': { position: 'relative', zIndex: 1 },
    '&:hover': {
    background: 'linear-gradient(135deg, #032CA6, #040DBF)',
    boxShadow: '0 4px 12px rgba(31, 100, 191, 0.4)',
    transform: 'translateY(-1px)',
    '&::before': { left: '100%' }
  },
  [theme.breakpoints.down('lg')]: { padding: '10px 20px', fontSize: '0.9rem' },
  [theme.breakpoints.down('md')]: { padding: '10px 20px', fontSize: '0.9rem' },
  [theme.breakpoints.down('sm')]: { padding: '8px 16px', fontSize: '0.85rem' }
}));

// Welcome container con efecto mármol siempre presente y mouse tracking
const WelcomeContainer = styled(DashboardModernCard)(({ theme }) => ({
  padding: '50px',
  marginBottom: '40px',
  // ESTILOS BÁSICOS COMO STATS CARDS
  background: 'white',
  borderRadius: '16px',
  border: '1px solid rgba(31, 100, 191, 0.08)',
  boxShadow: '0 2px 16px rgba(1, 3, 38, 0.06)',
  color: '#000000', // TEXTO NEGRO
  position: 'relative',
  overflow: 'hidden',
  cursor: 'default',
  
  // Mouse tracking effect
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: `
      radial-gradient(
        600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
        rgba(31, 100, 191, 0.08) 0%,
        rgba(31, 100, 191, 0.05) 20%,
        rgba(31, 100, 191, 0.03) 40%,
        rgba(31, 100, 191, 0.01) 60%,
        transparent 80%
      )
    `,
    opacity: 0,
    transition: 'opacity 0.3s ease',
    pointerEvents: 'none',
    zIndex: 1,
  },
  
  // Efecto de mouse tracking activado
  '&.mouse-tracking::before': {
    opacity: 1,
  },
  
  // Efecto mármol de fondo
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    // EFECTO MÁRMOL SIEMPRE VISIBLE - VALORES MARBLE POR DEFECTO
    background: `
      radial-gradient(ellipse at 15% 30%, rgba(31, 100, 191, 0.08) 0%, transparent 40%),
      radial-gradient(ellipse at 85% 20%, rgba(3, 44, 166, 0.15) 0%, transparent 45%),
      radial-gradient(ellipse at 50% 80%, rgba(100, 150, 220, 0.25) 0%, transparent 50%),
      radial-gradient(ellipse at 25% 70%, rgba(31, 100, 191, 0.05) 0%, transparent 35%),
      radial-gradient(ellipse at 75% 30%, rgba(3, 44, 166, 0.12) 0%, transparent 40%)
    `,
    animation: 'marbleFlow 25s ease-in-out infinite',
    pointerEvents: 'none',
    zIndex: 0,
  },
  
  '& > *': { position: 'relative', zIndex: 2 },
  [theme.breakpoints.down('lg')]: { padding: '40px' },
  [theme.breakpoints.down('md')]: { padding: '32px', marginBottom: '32px' },
  [theme.breakpoints.down('sm')]: { padding: '28px', marginBottom: '28px' }
}));

// Welcome content con mejor responsividad
const WelcomeContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '32px',
  // Breakpoints estándar de MUI: xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536
  [theme.breakpoints.down('md')]: { 
    flexDirection: 'column', 
    textAlign: 'center', 
    gap: '24px' 
  },
  [theme.breakpoints.down('sm')]: { 
    gap: '20px',
    padding: '0 16px' // Evitar overflow en móviles
  }
}));

// Profile section
const ProfileSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '20px'
}));

// Profile avatar
const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: '90px',
  height: '90px',
  border: '4px solid rgba(255, 255, 255, 0.3)',
  boxShadow: '0 6px 20px rgba(255, 255, 255, 0.3)',
  animation: 'pulse 3s ease-in-out infinite',
  // Optimización para URLs de Cloudinary
  '& img': {
    objectFit: 'cover',
    objectPosition: 'center',
    borderRadius: '50%',
    width: '100%',
    height: '100%',
    // Optimización para Cloudinary
    loading: 'lazy',
    decoding: 'async',
  },
  [theme.breakpoints.down('sm')]: { width: '80px', height: '80px' }
}));

// Profile info
const ProfileInfo = styled(Box)(({ theme }) => ({
  textAlign: 'center'
}));

// Welcome text unificado
const WelcomeText = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '12px'
}));

// Welcome title unificado
const WelcomeTitle = styled(Typography)(({ theme }) => ({
  fontSize: '2.2rem',
  fontWeight: 700,
  color: '#FFFFFF',
  margin: 0,
  background: 'linear-gradient(135deg, #FFFFFF, #E2E8F0)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  [theme.breakpoints.down('lg')]: { fontSize: '2rem' },
  [theme.breakpoints.down('md')]: { fontSize: '1.8rem' },
  [theme.breakpoints.down('sm')]: { fontSize: '1.6rem' }
}));

// Welcome subtitle unificado
const WelcomeSubtitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.2rem',
  color: '#CBD5E1',
  margin: 0,
  fontWeight: 500,
  [theme.breakpoints.down('md')]: { fontSize: '1.1rem' },
  [theme.breakpoints.down('sm')]: { fontSize: '1rem' }
}));

// System status card con diseño minimalista
const SystemStatusCard = styled(DashboardModernCard)(({ theme }) => ({
  padding: '32px',
  marginBottom: '32px',
  background: 'white',
  borderRadius: '24px',
  border: '1px solid #F2F2F2',
  boxShadow: '0 2px 16px rgba(1, 3, 38, 0.04)',
  transform: 'translateY(-0.1px)',
  color: '#010326',
  position: 'relative',
  overflow: 'hidden',
  // SIN LÍNEA SUPERIOR - DISEÑO LIMPIO
  [theme.breakpoints.down('lg')]: { padding: '28px' },
  [theme.breakpoints.down('md')]: { padding: '24px' },
  [theme.breakpoints.down('sm')]: { padding: '20px' }
}));


// Actions grid con breakpoints estándar de MUI
const ActionsGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gap: '24px',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  marginBottom: '48px', // Aumentar espaciado inferior
  // Breakpoints estándar de MUI: xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536
  [theme.breakpoints.down('lg')]: { 
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
    gap: '20px',
    marginBottom: '40px'
  },
  [theme.breakpoints.down('md')]: { 
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
    gap: '18px',
    marginBottom: '36px'
  },
  [theme.breakpoints.down('sm')]: { 
    gridTemplateColumns: '1fr', 
    gap: '16px',
    marginBottom: '32px'
  }
}));

// Action card con efectos marbleFlow como CatalogManagement
const ActionCard = styled(DashboardModernCard)(({ theme, color }) => ({
  padding: '20px',
  cursor: 'pointer',
  background: 'white',
  borderRadius: '16px',
  border: '1px solid #F2F2F2',
  boxShadow: '0 2px 12px rgba(1, 3, 38, 0.04)',
  transition: 'all 0.3s cubic-bezier(0.23, 1, 0.320, 1)',
  position: 'relative',
  overflow: 'hidden',
  boxSizing: 'border-box',
  
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
      radial-gradient(ellipse at 15% 30%, rgba(31, 100, 191, 0.08) 0%, transparent 40%),
      radial-gradient(ellipse at 85% 20%, rgba(3, 44, 166, 0.15) 0%, transparent 45%),
      radial-gradient(ellipse at 50% 80%, rgba(100, 150, 220, 0.25) 0%, transparent 50%),
      radial-gradient(ellipse at 70% 50%, rgba(31, 100, 191, 0.08) 0%, transparent 35%),
      radial-gradient(ellipse at 30% 70%, rgba(3, 44, 166, 0.15) 0%, transparent 40%),
      radial-gradient(ellipse at 90% 90%, rgba(100, 150, 220, 0.25) 0%, transparent 45%),
      radial-gradient(ellipse at 10% 90%, rgba(31, 100, 191, 0.05) 0%, transparent 30%),
      linear-gradient(125deg, 
        rgba(31, 100, 191, 0.08) 0%, 
        transparent 25%, 
        rgba(3, 44, 166, 0.15) 50%, 
        transparent 75%, 
        rgba(100, 150, 220, 0.25) 100%
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
    background: 'linear-gradient(90deg, transparent, rgba(31, 100, 191, 0.1), transparent)',
    transition: 'left 0.6s ease',
    zIndex: 1,
    pointerEvents: 'none',
  },

  '&:hover': {
    transform: 'translateY(-1px) scale(1.02)',
    boxShadow: '0 4px 20px rgba(1, 3, 38, 0.08)',
    '&::before': {
      opacity: 1,
    },
    '&::after': {
      left: '100%',
    }
  },

  '&:active': {
    transform: 'translateY(0)',
    transition: 'transform 0.1s ease-out',
  },

  '& > *': {
    position: 'relative',
    zIndex: 2,
  },

  [theme.breakpoints.down('lg')]: { padding: '18px' },
  [theme.breakpoints.down('md')]: { padding: '16px' },
  [theme.breakpoints.down('sm')]: { padding: '14px' }
}));

// Action header
const ActionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '12px'
}));

// Action icon con paleta de colores actualizada
const ActionIcon = styled(Box)(({ theme, color }) => ({
  width: '56px',
  height: '56px',
  borderRadius: '14px',
  background: alpha('#1F64BF', 0.1),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#1F64BF',
  flexShrink: 0,
  transition: 'all 0.3s ease',
  [theme.breakpoints.down('lg')]: { width: '48px', height: '48px', borderRadius: '12px' },
  [theme.breakpoints.down('md')]: { width: '44px', height: '44px', borderRadius: '10px' },
  [theme.breakpoints.down('sm')]: { width: '40px', height: '40px', borderRadius: '10px' }
}));

// Action title con paleta de colores actualizada
const ActionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.2rem',
  fontWeight: 700,
  color: '#010326',
  margin: 0,
  fontFamily: "'Mona Sans'",
  [theme.breakpoints.down('lg')]: { fontSize: '1.1rem' },
  [theme.breakpoints.down('md')]: { fontSize: '1rem' },
  [theme.breakpoints.down('sm')]: { fontSize: '0.95rem' }
}));

// Action description con paleta de colores actualizada
const ActionDescription = styled(Typography)(({ theme }) => ({
  fontSize: '0.95rem',
  color: '#032CA6',
  margin: 0,
  lineHeight: 1.5,
  fontWeight: 500,
  fontFamily: "'Mona Sans'",
  opacity: 0.8,
  [theme.breakpoints.down('lg')]: { fontSize: '0.9rem' },
  [theme.breakpoints.down('md')]: { fontSize: '0.85rem' },
  [theme.breakpoints.down('sm')]: { fontSize: '0.8rem' }
}));

const Dashboard = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const { hasPermission, userRole } = usePermissions();
  const navigate = useNavigate();

  // Función para optimizar URLs de Cloudinary
  const getOptimizedImageUrl = (url) => {
    if (!url) return null;
    
    // Si es una URL de Cloudinary, aplicar optimizaciones
    if (url.includes('cloudinary.com')) {
      // Aplicar transformaciones para optimización
      return url.replace('/upload/', '/upload/w_150,h_150,c_fill,f_auto,q_auto/');
    }
    
    return url;
  };
  const [currentTime, setCurrentTime] = useState(new Date());
  const [systemStatus, setSystemStatus] = useState('online');
  const welcomeContainerRef = useRef(null);
  
  // Media queries para lógica JavaScript responsiva
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Mouse tracking para el container de bienvenida
  useEffect(() => {
    const welcomeContainer = welcomeContainerRef.current;
    if (!welcomeContainer) return;

    let mouseThrottle = false;
    let animationId = null;
    
    const handleMouseMove = (e) => {
      if (!mouseThrottle) {
        mouseThrottle = true;
        if (animationId) cancelAnimationFrame(animationId);
        animationId = requestAnimationFrame(() => {
          const rect = welcomeContainer.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          
          welcomeContainer.style.setProperty('--mouse-x', `${x}px`);
          welcomeContainer.style.setProperty('--mouse-y', `${y}px`);
          mouseThrottle = false;
        });
      }
    };

    const handleMouseEnter = () => {
      welcomeContainer.classList.add('mouse-tracking');
    };

    const handleMouseLeave = () => {
      welcomeContainer.classList.remove('mouse-tracking');
    };

    welcomeContainer.addEventListener('mousemove', handleMouseMove, { passive: true });
    welcomeContainer.addEventListener('mouseenter', handleMouseEnter, { passive: true });
    welcomeContainer.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      welcomeContainer.removeEventListener('mousemove', handleMouseMove);
      welcomeContainer.removeEventListener('mouseenter', handleMouseEnter);
      welcomeContainer.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);


  const getGreeting = () => { 
    const hour = currentTime.getHours(); 
    if (hour < 12) return 'Buenos días'; 
    if (hour < 18) return 'Buenas tardes'; 
    return 'Buenas noches'; 
  };
  
  const formatTime = (date) => {
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit',
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRoleDisplayName = (role) => {
    const roleNames = {
      admin: 'Administrador',
      manager: 'Gerente',
      employee: 'Empleado',
      delivery: 'Repartidor'
    };
    return roleNames[role] || 'Usuario';
  };

  // Frases administrativas que cambian cada vez que hay un login
  const getDailyInspiration = useCallback(() => {
    const dailyMessages = [
      {
        title: "Bienvenido al panel",
        message: "Los mejores resultados en sublimación vienen de una gestión organizada. ¡Tienes todo bajo control!",
        icon: Shield
      },
      {
        title: "Gestión eficiente",
        message: "Una buena planificación de producción es la clave para cumplir con los tiempos de entrega.",
        icon: Clock
      },
      {
        title: "Calidad ante todo",
        message: "Cada producto sublimado que sale de aquí lleva nuestro sello de calidad. ¡Mantengamos ese estándar!",
        icon: Star
      },
      {
        title: "Productividad del día",
        message: "Los pedidos personalizados requieren atención especial. Cada detalle cuenta para la satisfacción del cliente.",
        icon: Target
      },
      {
        title: "Organización inteligente",
        message: "Un inventario bien gestionado es la base de un negocio de sublimación exitoso. ¡Revisa tus stocks!",
        icon: Package
      },
      {
        title: "Enfoque en el cliente",
        message: "Cada diseño personalizado es una oportunidad de superar expectativas. ¡Hagámoslo genial!",
        icon: Heart
      },
      {
        title: "Innovación continua",
        message: "La sublimación evoluciona constantemente. Mantente actualizado con las últimas técnicas y materiales.",
        icon: Rocket
      },
      {
        title: "Trabajo en equipo",
        message: "La comunicación fluida entre diseño, producción y envío garantiza la excelencia en cada pedido.",
        icon: Users
      },
      {
        title: "Optimización de procesos",
        message: "Pequeñas mejoras en el flujo de trabajo pueden generar grandes resultados en productividad.",
        icon: Lightning
      },
      {
        title: "Experiencia del cliente",
        message: "Desde el primer contacto hasta la entrega, cada interacción debe reflejar nuestra profesionalidad.",
        icon: CheckCircle
      }
    ];
    
    // Usar timestamp del login para cambiar la frase cada vez que se ingresa
    const loginTimestamp = localStorage.getItem('lastLoginTimestamp') || Date.now();
    const seed = Math.floor(parseInt(loginTimestamp) / 1000) % dailyMessages.length;
    return dailyMessages[seed];
  }, []);

  // Acciones rápidas según rol y permisos con paleta de colores actualizada
  const getQuickActions = () => {
    const baseActions = [
      {
        title: 'Ver Órdenes',
        description: 'Gestionar pedidos del sistema',
        icon: ShoppingCart,
        path: '/orders',
        permission: 'canViewOrders',
        color: '#1F64BF' 
      },
      {
        title: 'Ver Direcciones',
        description: 'Gestionar direcciones de envío',
        icon: MapPin,
        path: '/address-management',
        permission: 'canViewAddresses',
        color: '#032CA6'
      }
    ];

    const adminActions = [
      {
        title: 'Gestión de Usuarios',
        description: 'Administrar usuarios del sistema',
        icon: Users,
        path: '/users',
        permission: 'canViewUsers',
        color: '#040DBF'
      },
      {
        title: 'Gestión de Empleados',
        description: 'Administrar personal de la empresa',
        icon: User,
        path: '/employees',
        permission: 'canViewEmployees',
        color: '#1F64BF'
      },
      {
        title: 'Gestión de Productos',
        description: 'Administrar catálogo de productos',
        icon: Package,
        path: '/catalog-management',
        permission: 'canViewProducts',
        color: '#032CA6'
      },
      {
        title: 'Editor de Diseños',
        description: 'Crear y editar diseños',
        icon: PaintBrush,
        path: '/design-management',
        permission: 'canViewDesigns',
        color: '#040DBF'
      },
      {
        title: 'Reportes',
        description: 'Ver estadísticas y análisis',
        icon: ChartLine,
        path: '/reports',
        permission: 'canViewReports',
        color: '#1F64BF'
      },
      {
        title: 'Configuración',
        description: 'Ajustes del sistema',
        icon: Gear,
        path: '/settings',
        permission: 'canViewSettings',
        color: '#032CA6'
      }
    ];

    return [...baseActions, ...adminActions].filter(action => 
      hasPermission(action.permission)
    );
  };

  const quickActions = getQuickActions();
  const inspiration = getDailyInspiration();

  return (
    <DashboardPageContainer>
      <DashboardContentWrapper maxWidth="xl" sx={{ maxWidth: '1650px !important' }} disableGutters={false}>
        
        {/* Container de Bienvenida Unificado con Mouse Tracking - TONOS AZULES COMO CATALOG MANAGEMENT */}
        <WelcomeContainer ref={welcomeContainerRef}>
          {/* Reloj y fecha en esquina superior derecha */}
          <Box sx={{ 
            position: 'absolute',
            top: '24px',
            right: '24px',
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            color: '#64748b',
            fontSize: '1rem',
            fontWeight: 500,
            zIndex: 3,
            [theme.breakpoints.down('md')]: { 
              position: 'relative',
              top: 'auto',
              right: 'auto',
              justifyContent: 'center',
              marginBottom: '20px',
              fontSize: '0.95rem' 
            },
            [theme.breakpoints.down('sm')]: { 
              fontSize: '0.9rem',
              gap: '8px'
            }
          }}>
            <Clock size={18} />
            <Typography variant="body1" sx={{ fontSize: 'inherit', margin: 0 }}>
              {formatTime(currentTime)}
            </Typography>
          </Box>

          <WelcomeContent>
            <ProfileSection>
              <ProfileAvatar 
                src={getOptimizedImageUrl(user?.profilePicture) || '/default-avatar.png'} 
                alt={`Foto de perfil de ${user?.name || 'Usuario'}`}
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </ProfileAvatar>
              <ProfileInfo>
                <Typography variant="h6" sx={{ color: '#000000', fontWeight: 600, margin: 0 }}>
                  {user?.name || 'Usuario'}
              </Typography>
                <Typography variant="body2" sx={{ color: '#64748b', margin: 0 }}>
                  {getRoleDisplayName(userRole)}
                </Typography>
              </ProfileInfo>
            </ProfileSection>
            
            <WelcomeText>
              {/* Subtítulo del panel */}
              <Typography variant="h6" sx={{ 
                fontSize: '1.3rem', 
                color: '#64748b', 
                margin: '0 0 24px 0',
                fontWeight: 500,
                textAlign: 'left',
                alignSelf: 'flex-start',
                width: '100%',
                [theme.breakpoints.down('md')]: { fontSize: '1.2rem', textAlign: 'left' },
                [theme.breakpoints.down('sm')]: { fontSize: '1.1rem' }
              }}>
                Panel de control administrativo - Sistema DIAMBARS
              </Typography>
              
              {/* Frase de inspiración centrada */}
              <Box sx={{ 
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                minHeight: '120px',
                padding: '20px',
                borderRadius: '16px',
                background: 'rgba(31, 100, 191, 0.05)',
                border: '1px solid rgba(31, 100, 191, 0.1)',
                [theme.breakpoints.down('md')]: { 
                  minHeight: '100px',
                  padding: '16px'
                },
                [theme.breakpoints.down('sm')]: { 
                  minHeight: '80px',
                  padding: '12px'
                }
              }}>
                <Box sx={{ 
                  width: '60px', 
                  height: '60px', 
                  borderRadius: '16px', 
                  background: alpha('#1F64BF', 0.1), 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  color: '#1F64BF',
                  marginBottom: '16px',
                  [theme.breakpoints.down('md')]: { 
                    width: '50px', 
                    height: '50px',
                    marginBottom: '12px'
                  },
                  [theme.breakpoints.down('sm')]: { 
                    width: '45px', 
                    height: '45px',
                    marginBottom: '10px'
                  }
                }}>
                  <inspiration.icon size={28} weight="duotone" />
                </Box>
                <Typography variant="h5" sx={{ 
                  fontWeight: 700, 
                  color: '#010326', 
                  margin: '0 0 8px 0', 
                  fontSize: '1.4rem',
                  [theme.breakpoints.down('md')]: { fontSize: '1.3rem' },
                  [theme.breakpoints.down('sm')]: { fontSize: '1.2rem' }
                }}>
                  {inspiration.title}
                </Typography>
                <Typography variant="body1" sx={{ 
                  color: '#1F64BF', 
                  margin: 0, 
                  fontSize: '1.1rem', 
                  lineHeight: 1.5,
                  fontWeight: 500,
                  maxWidth: '500px',
                  [theme.breakpoints.down('md')]: { fontSize: '1rem' },
                  [theme.breakpoints.down('sm')]: { fontSize: '0.95rem' }
                }}>
                  {inspiration.message}
                </Typography>
              </Box>
            </WelcomeText>

          </WelcomeContent>
        </WelcomeContainer>

        {/* Quick Actions Grid - SEGUNDA POSICIÓN */}
        <ActionsGrid>
          {quickActions.map((action, index) => (
            <ActionCard 
              key={index}
              onClick={() => navigate(action.path)}
            >
              <ActionHeader>
                <ActionIcon color={action.color}>
                  <action.icon size={24} weight="duotone" />
                </ActionIcon>
                <ActionTitle>{action.title}</ActionTitle>
              </ActionHeader>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                gap: '12px'
              }}>
                <ActionDescription sx={{ margin: 0, flex: 1 }}>
                  {action.description}
                </ActionDescription>
                <IconButton 
                  size="small" 
                  sx={{ 
                    color: '#1F64BF',
                    background: alpha('#1F64BF', 0.1),
                    borderRadius: '8px',
                    transition: 'all 0.3s ease',
                    flexShrink: 0,
                    '&:hover': {
                      background: alpha('#1F64BF', 0.15),
                      transform: 'translateX(2px)',
                      color: '#032CA6'
                    }
                  }}
                >
                  <ArrowRight size={16} weight="bold" />
                </IconButton>
              </Box>
            </ActionCard>
          ))}
        </ActionsGrid>


        {/* Estado del Sistema - POSICIÓN FINAL */}
        <SystemStatusCard>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
              <Box sx={{ 
              width: 56, 
              height: 56, 
              borderRadius: '16px', 
              background: alpha('#1F64BF', 0.08), 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: '#1F64BF' 
              }}>
              <Database size={28} weight="duotone" />
              </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600, color: '#010326', margin: 0, mb: 0.5 }}>
                Estado del Sistema
              </Typography>
              <Typography variant="body2" sx={{ color: '#1F64BF', margin: 0, fontWeight: 500 }}>
                Métricas de rendimiento en tiempo real
              </Typography>
            </Box>
            </Box>
            
          <Box sx={{ 
            width: '100%',
            display: 'grid',
            gap: '16px',
            gridTemplateColumns: 'repeat(6, 1fr)',
            // Breakpoints estándar de MUI: xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536
            [theme.breakpoints.down('lg')]: { gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' },
            [theme.breakpoints.down('md')]: { gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' },
            [theme.breakpoints.down('sm')]: { gridTemplateColumns: '1fr', gap: '12px' }
          }}>
            {/* Latencia API */}
            <Box sx={{ display: 'flex', minWidth: 0 }}> {/* minWidth: 0 previene overflow */}
              <Box sx={{ 
                p: 2, 
                borderRadius: '16px', 
                border: '1px solid #F2F2F2',
                background: 'white',
                minHeight: '140px',
                height: 'auto',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                width: '100%',
                minWidth: 0, // Previene overflow
                overflow: 'hidden' // Previene desbordamiento de contenido
              }}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <ArrowDown size={16} weight="bold" color="#1F64BF" />
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#010326' }}>Latencia API</Typography>
                  </Box>
                  <Typography variant="h4" sx={{ color: '#032CA6', fontWeight: 700, fontFamily: 'monospace', mb: 1 }}>
                    127ms
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#1F64BF', fontWeight: 500 }}>
                    -15ms vs ayer
                  </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                  value={85} 
                sx={{ 
                  height: 6, 
                  borderRadius: 3, 
                    backgroundColor: '#F2F2F2',
                    '& .MuiLinearProgress-bar': { backgroundColor: '#040DBF' }
                }} 
              />
            </Box>
            </Box>
            
            {/* Ping del Servidor */}
            <Box sx={{ display: 'flex', minWidth: 0 }}>
              <Box sx={{ 
                p: 2, 
                borderRadius: '16px', 
                border: '1px solid #F2F2F2',
                background: 'white',
                minHeight: '140px',
                height: 'auto',
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'space-between',
                width: '100%',
                minWidth: 0,
                overflow: 'hidden'
              }}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <CheckCircle size={16} weight="bold" color="#1F64BF" />
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#010326' }}>Ping Servidor</Typography>
              </Box>
                  <Typography variant="h4" sx={{ color: '#032CA6', fontWeight: 700, fontFamily: 'monospace', mb: 1 }}>
                    23ms
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#1F64BF', fontWeight: 500 }}>
                    Excelente
                  </Typography>
              </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={95} 
                  sx={{ 
                    height: 6, 
                    borderRadius: 3,
                    backgroundColor: '#F2F2F2',
                    '& .MuiLinearProgress-bar': { backgroundColor: '#040DBF' }
                  }} 
                />
            </Box>
            </Box>

            {/* Errores por Minuto */}
            <Box sx={{ display: 'flex', minWidth: 0 }}>
              <Box sx={{ 
                p: 2, 
                borderRadius: '16px', 
                border: '1px solid #F2F2F2',
                background: 'white',
                minHeight: '140px',
                height: 'auto',
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'space-between',
                width: '100%',
                minWidth: 0,
                overflow: 'hidden'
              }}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Warning size={16} weight="bold" color="#1F64BF" />
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#010326' }}>Errores/min</Typography>
              </Box>
                  <Typography variant="h4" sx={{ color: '#1F64BF', fontWeight: 700, fontFamily: 'monospace', mb: 1 }}>
                    0.2
              </Typography>
                  <Typography variant="caption" sx={{ color: '#1F64BF', fontWeight: 500 }}>
                    +0.1 vs ayer
              </Typography>
              </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={20} 
                    sx={{ 
                    height: 6, 
                    borderRadius: 3,
                    backgroundColor: '#F2F2F2',
                    '& .MuiLinearProgress-bar': { backgroundColor: '#1F64BF' }
                  }} 
                />
            </Box>
            </Box>

            {/* Tiempo de Respuesta */}
            <Box sx={{ display: 'flex', minWidth: 0 }}>
              <Box sx={{ 
                p: 2, 
                borderRadius: '16px', 
                border: '1px solid #F2F2F2',
                background: 'white',
                minHeight: '140px',
                height: 'auto',
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'space-between',
                width: '100%',
                minWidth: 0,
                overflow: 'hidden'
              }}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Lightning size={16} weight="bold" color="#1F64BF" />
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#010326' }}>Tiempo Respuesta</Typography>
              </Box>
                  <Typography variant="h4" sx={{ color: '#032CA6', fontWeight: 700, fontFamily: 'monospace', mb: 1 }}>
                    45ms
                </Typography>
                  <Typography variant="caption" sx={{ color: '#1F64BF', fontWeight: 500 }}>
                    Rápido
              </Typography>
            </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={90} 
                  sx={{ 
                    height: 6, 
                    borderRadius: 3,
                    backgroundColor: '#F2F2F2',
                    '& .MuiLinearProgress-bar': { backgroundColor: '#040DBF' }
                  }} 
                />
            </Box>
            </Box>

            {/* Última Actualización */}
            <Box sx={{ display: 'flex', minWidth: 0 }}>
              <Box sx={{ 
                p: 2, 
                borderRadius: '16px', 
                border: '1px solid #F2F2F2',
                background: 'white',
                minHeight: '140px',
                height: 'auto',
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'space-between',
                width: '100%',
                minWidth: 0,
                overflow: 'hidden'
              }}>
            <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Rocket size={16} weight="bold" color="#1F64BF" />
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#010326' }}>Última Actualización</Typography>
              </Box>
                  <Typography variant="body1" sx={{ color: '#032CA6', fontWeight: 600, fontFamily: 'monospace', mb: 1 }}>
                    {new Date().toLocaleDateString()} 14:32
              </Typography>
                  <Typography variant="caption" sx={{ color: '#1F64BF', fontWeight: 500 }}>
                    v2.1.4
              </Typography>
              </Box>
                <Box sx={{ height: 6 }} />
            </Box>
            </Box>

            {/* Estado del Backend */}
            <Box sx={{ display: 'flex', minWidth: 0 }}>
          <Box sx={{ 
                p: 2, 
                borderRadius: '16px', 
                border: '1px solid #F2F2F2',
                background: 'white',
                minHeight: '140px',
                height: 'auto',
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'space-between',
                width: '100%',
                minWidth: 0,
                overflow: 'hidden'
              }}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <CheckCircle size={16} weight="bold" color="#1F64BF" />
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#010326' }}>Backend Status</Typography>
                </Box>
                <Chip 
                    label="Operativo" 
                  size="small" 
                  sx={{ 
                      backgroundColor: alpha('#1F64BF', 0.1),
                      color: '#1F64BF',
                    fontWeight: 600, 
                      borderRadius: '8px',
                      mb: 1
                  }} 
                />
                  <Typography variant="caption" sx={{ color: '#1F64BF', fontWeight: 500, display: 'block' }}>
                    Sin lag detectado
                    </Typography>
              </Box>
                <Box sx={{ height: 6 }} />
            </Box>
            </Box>
          </Box>

          {/* Uptime del Sistema */}
              <Box sx={{ 
            mt: 4, 
            p: 3, 
            borderRadius: '16px', 
            border: '1px solid #F2F2F2',
            background: 'white'
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircle size={20} weight="bold" color="#1F64BF" />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#010326' }}>Uptime (30 días)</Typography>
              </Box>
              <Typography variant="h5" sx={{ color: '#032CA6', fontWeight: 700, fontFamily: 'monospace' }}>
                99.94%
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={99.94} 
              sx={{ 
                height: 8, 
                borderRadius: 4,
                backgroundColor: '#F2F2F2',
                '& .MuiLinearProgress-bar': { backgroundColor: '#040DBF' }
              }} 
                    />
                  </Box>
        </SystemStatusCard>

      </DashboardContentWrapper>
    </DashboardPageContainer>
  );
};

export default Dashboard;