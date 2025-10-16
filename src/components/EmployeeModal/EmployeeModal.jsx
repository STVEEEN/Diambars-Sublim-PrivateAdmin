// src/components/EmployeeModal/EmployeeModal.jsx
import React, { useState, useEffect } from 'react';
import { 
  UserPlus, 
  User, 
  X, 
  Eye, 
  EyeSlash,
  Calendar,
  MapPin,
  Phone,
  Envelope,
  IdentificationCard,
  Shield,
  CheckCircle,
  Warning,
  PencilSimple,
  Trash,
  Lock,
  Crown,
  Truck,
  Camera,
  Image
} from '@phosphor-icons/react';
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Container,
  styled,
  useTheme,
  alpha,
  Paper,
  CircularProgress,
  Modal,
  Backdrop
} from '@mui/material';
import useEmployees from '../../hooks/useEmployees';
import Swal from 'sweetalert2';

// Global keyframes/styles for modal animations
const GlobalStyles = () => (
  <style>
    {`
      @keyframes flowMove {
        0% { opacity: 0.2; transform: scale(1); }
        50% { opacity: 0.4; transform: scale(1.02); }
        100% { opacity: 0.3; transform: scale(1); }
      }

      @keyframes shineMove {
        0% { transform: translateX(-120%) skewX(-15deg); }
        20% { transform: translateX(-120%) skewX(-15deg); }
        80% { transform: translateX(160%) skewX(-15deg); }
        100% { transform: translateX(160%) skewX(-15deg); }
      }

      @keyframes fadeIn {
        from { opacity: 0; } to { opacity: 1; }
      }

      @keyframes slideUp {
        0% { transform: translateY(20px); opacity: 0; }
        100% { transform: translateY(0); opacity: 1; }
      }
    `}
  </style>
);

// ================ ESTILOS MODERNOS RESPONSIVE - EMPLOYEE MODAL ================
const ModernModalBackdrop = styled(Backdrop)({
  background: 'rgba(1, 3, 38, 0.2)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
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
  zIndex: 1300,
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
  maxWidth: '900px',
  width: '100%',
  maxHeight: '90vh',
  overflow: 'hidden',
  position: 'relative',
  fontFamily: "'Mona Sans'",
  [theme.breakpoints.down('lg')]: {
    maxWidth: '800px',
  },
  [theme.breakpoints.down('md')]: {
    maxWidth: '700px',
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
  transition: 'all 0.3s cubic-bezier(0.23, 1, 0.320, 1)',
  boxShadow: '0 1px 4px rgba(31, 100, 191, 0.1)',
  zIndex: 10,
  '&:hover': {
    background: 'linear-gradient(135deg,rgb(180, 179, 247) 0%,rgb(188, 179, 247) 100%)',
    transform: 'translateY(-1px) scale(1.05)',
    boxShadow: '0 2px 8px rgba(31, 100, 191, 0.2)',
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
    '&:hover': { background: alpha('#1F64BF', 0.3) }
  },
  [theme.breakpoints.down('md')]: {
    maxHeight: 'calc(85vh - 160px)',
  },
  [theme.breakpoints.down('sm')]: {
    maxHeight: 'calc(95vh - 140px)',
  }
}));

const EmployeeModalForm = styled(Box)({
  fontFamily: "'Mona Sans'",
});

const EmployeeModalSection = styled(Box)(({ theme }) => ({
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

const EmployeeModalSectionTitle = styled(Typography)(({ theme }) => ({
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

const EmployeeModalField = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  marginBottom: '20px',
});

const EmployeeModalLabel = styled(Typography)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '0.875rem',
  fontWeight: 500,
  color: '#032CA6',
  marginBottom: '4px',
  fontFamily: "'Mona Sans'",
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.8rem',
  }
}));

const EmployeeModalInput = styled(TextField)(({ theme, error }) => ({
  width: '100%',
  fontFamily: "'Mona Sans'",
  '& .MuiOutlinedInput-root': {
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
      boxShadow: error ? 'inset 0 1px 0 rgba(255, 255, 255, 0.6), 0 2px 8px rgba(239, 68, 68, 0.08)' : 'inset 0 1px 0 rgba(255, 255, 255, 0.6), 0 2px 8px rgba(31, 100, 191, 0.08)',
      transform: 'translateY(-1px)',
      border: error ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(31, 100, 191, 0.3)',
    },
    '& input': {
      color: '#010326',
      fontSize: '0.9rem',
      fontWeight: 500,
      fontFamily: "'Mona Sans'",
      padding: '16px 20px',
      '&::placeholder': {
        color: '#64748b',
        opacity: 0.7,
      }
    },
    '& textarea': {
      color: '#010326',
      fontSize: '0.9rem',
      fontWeight: 500,
      fontFamily: "'Mona Sans'",
      '&::placeholder': {
        color: '#64748b',
        opacity: 0.7,
      }
    }
  }
}));

const EmployeeModalError = styled(Typography)({
  fontSize: '0.75rem',
  color: '#EF4444',
  fontWeight: 500,
  marginTop: '4px',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  fontFamily: "'Mona Sans'",
});

const EmployeeModalRoleCard = styled(Paper)(({ selected, theme }) => ({
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

const EmployeeModalRoleContent = styled(CardContent)(({ theme }) => ({
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

const EmployeeModalRoleHeader = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  marginBottom: '8px',
});

const EmployeeModalRoleTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1rem',
  fontWeight: 600,
  color: '#010326',
  margin: 0,
  fontFamily: "'Mona Sans'",
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.9rem',
  }
}));

// FOOTER CON GLASSMORPHISM ANIMADO
const EmployeeModalActions = styled(Box)(({ theme }) => ({
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

const EmployeeModalBtn = styled(Button)(({ variant, theme }) => ({
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
  minWidth: '120px',
  
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
      transform: 'translateY(-2px)',
      '&::before': {
        left: '100%',
      }
    }
  } : variant === 'danger' ? {
    background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
    color: '#ffffff',
    boxShadow: '0 2px 8px rgba(220, 38, 38, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.25)',
    '&:hover': {
      background: 'linear-gradient(135deg, #b91c1c, #dc2626)',
      transform: 'translateY(-2px)',
      boxShadow: '0 3px 12px rgba(220, 38, 38, 0.25)',
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
      transform: 'translateY(-2px)',
      '&::before': {
        left: '100%',
      }
    }
  }),
  
  [theme.breakpoints.down('sm')]: {
    minWidth: 'auto',
    justifyContent: 'center',
    width: '100%',
  }
}));

// Componente del Header con efectos animados
const AnimatedModalHeader = ({ children, ...props }) => {
  return (
    <ModernModalHeader {...props}>
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
      
      {children}
    </ModernModalHeader>
  );
};

const EmployeeModal = ({ 
  isOpen, 
  onClose, 
  mode = 'create',
  employeeId = null,
  employee = null,
  onSuccess 
}) => {
  console.log('[EmployeeModal] Props recibidos:', { isOpen, mode, employeeId, employee });
  const { 
    getEmployeeById, 
    createEmployee, 
    updateEmployee, 
    hardDeleteEmployee,
    uploadProfilePicture,
    loading 
  } = useEmployees();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    dui: '',
    address: '',
    birthday: '',
    hireDate: '',
    password: '',
    confirmPassword: '',
    role: 'employee',
    profilePicture: null
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const [isUploadingPicture, setIsUploadingPicture] = useState(false);
  const [isLoadingEmployee, setIsLoadingEmployee] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const roles = [
    { value: 'employee', label: 'Empleado', icon: User },
    { value: 'manager', label: 'Gerente', icon: Crown },
    { value: 'delivery', label: 'Repartidor', icon: Truck }
  ];

  // Manejar scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      
      // Guardar los estilos originales del body y html
      const prevOverflowBody = document.body.style.overflow || '';
      const prevPositionBody = document.body.style.position || '';
      const prevWidthBody = document.body.style.width || '';
      const prevTopBody = document.body.style.top || '';
      const prevOverflowHtml = document.documentElement.style.overflow || '';

      // Aplicar estilos para prevenir scroll
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${scrollY}px`;

      // Función de limpieza
      const cleanup = () => {
        // Restaurar estilos originales con valores por defecto seguros
        document.documentElement.style.overflow = prevOverflowHtml || '';
        document.body.style.overflow = prevOverflowBody || '';
        document.body.style.position = prevPositionBody || '';
        document.body.style.width = prevWidthBody || '';
        document.body.style.top = prevTopBody || '';
        
        // Restaurar posición de scroll
        window.scrollTo(0, scrollY);
        
        // Forzar reflow para asegurar que los estilos se apliquen
        document.body.offsetHeight;
      };

      return cleanup;
    }
  }, [isOpen]);

  // Limpieza adicional cuando el componente se desmonta
  useEffect(() => {
    return () => {
      // Asegurar que el scroll se restaure al desmontar el componente
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    };
  }, []);

  // Cargar datos del empleado si está en modo edición
  useEffect(() => {
    console.log('[EmployeeModal] useEffect triggered:', { isOpen, mode, employeeId, employee });
    
    if (isOpen && mode === 'edit' && employeeId) {
      if (employee) {
        console.log('[EmployeeModal] Usando datos del empleado recibidos:', employee);
        // Usar los datos del empleado que ya tenemos
        setFormData({
          name: employee.name || '',
          email: employee.email || '',
          phoneNumber: employee.phoneNumber || employee.phone || '',
          dui: employee.dui || '',
          address: employee.address || '',
          birthday: employee.birthday ? new Date(employee.birthday).toISOString().split('T')[0] : '',
          hireDate: employee.hireDate ? new Date(employee.hireDate).toISOString().split('T')[0] : '',
          password: '',
          confirmPassword: '',
          role: employee.role || 'employee',
          profilePicture: employee.profilePicture || null
        });
        
        // Establecer preview si hay foto existente
        if (employee.profilePicture) {
          setProfilePicturePreview(employee.profilePicture);
        }
      } else {
        console.log('[EmployeeModal] No hay datos del empleado, cargando desde API');
        // Si no tenemos los datos, cargarlos desde la API
        loadEmployeeData();
      }
    } else if (isOpen && mode === 'create') {
      console.log('[EmployeeModal] Modo crear, reseteando formulario');
      resetForm();
    }
  }, [isOpen, mode, employeeId, employee]);

  const loadEmployeeData = async () => {
    setIsLoadingEmployee(true);
    try {
      const employee = await getEmployeeById(employeeId);
      if (employee) {
        setFormData({
          name: employee.name || '',
          email: employee.email || '',
          phoneNumber: employee.phoneNumber || employee.phone || '',
          dui: employee.dui || '',
          address: employee.address || '',
          birthday: employee.birthday ? new Date(employee.birthday).toISOString().split('T')[0] : '',
          hireDate: employee.hireDate ? new Date(employee.hireDate).toISOString().split('T')[0] : '',
          password: '',
          confirmPassword: '',
          role: employee.role || 'employee',
          profilePicture: employee.profilePicture || null
        });
        
        // Establecer preview si hay foto existente
        if (employee.profilePicture) {
          setProfilePicturePreview(employee.profilePicture);
        }
      }
    } catch (error) {
      console.error('Error loading employee:', error);
    } finally {
      setIsLoadingEmployee(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phoneNumber: '',
      dui: '',
      address: '',
      birthday: '',
      hireDate: '',
      password: '',
      confirmPassword: '',
      role: 'employee',
      profilePicture: null
    });
    setErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
    setProfilePicturePreview(null);
    // Limpiar el input file
    const fileInput = document.getElementById('profile-picture-upload');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    validateField(name, value);
  };

  // Función para manejar la selección de foto de perfil
  const handleProfilePictureChange = (event) => {
    console.log('📸 [EmployeeModal] handleProfilePictureChange called', event.target.files);
    const file = event.target.files[0];
    if (!file) {
      console.log('📸 [EmployeeModal] No file selected');
      return;
    }

    console.log('📸 [EmployeeModal] File selected:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    // Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      console.log('📸 [EmployeeModal] Invalid file type:', file.type);
      Swal.fire({
        icon: 'error',
        title: 'Tipo de archivo no válido',
        text: 'Solo se permiten archivos de imagen (JPEG, JPG, PNG, GIF, WEBP)',
        confirmButtonColor: '#040DBF'
      });
      return;
    }

    // Validar tamaño (5MB máximo)
    if (file.size > 5 * 1024 * 1024) {
      console.log('📸 [EmployeeModal] File too large:', file.size);
      Swal.fire({
        icon: 'error',
        title: 'Archivo demasiado grande',
        text: 'El archivo debe ser menor a 5MB',
        confirmButtonColor: '#040DBF'
      });
      return;
    }

    // Crear preview
    const reader = new FileReader();
    reader.onload = (e) => {
      console.log('📸 [EmployeeModal] Preview created');
      setProfilePicturePreview(e.target.result);
    };
    reader.readAsDataURL(file);

    // Guardar archivo en el estado
    setFormData(prev => ({
      ...prev,
      profilePicture: file
    }));
    
    console.log('📸 [EmployeeModal] File saved to formData');
  };

  // Función para eliminar foto de perfil
  const handleRemoveProfilePicture = () => {
    setFormData(prev => ({
      ...prev,
      profilePicture: null
    }));
    setProfilePicturePreview(null);
    // Limpiar el input file
    const fileInput = document.getElementById('profile-picture-upload');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const validateField = (fieldName, value) => {
    let errorMessage = '';

    switch (fieldName) {
      case 'name':
        if (value.trim() && value.trim().length < 2) {
          errorMessage = 'El nombre debe tener al menos 2 caracteres';
        } else if (value.trim() && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value.trim())) {
          errorMessage = 'El nombre solo puede contener letras y espacios';
        }
        break;

      case 'email':
        if (value.trim() && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(value.trim())) {
          errorMessage = 'El formato del email no es válido';
        }
        break;

      case 'phoneNumber':
        if (value.trim() && !/^[0-9]{8,15}$/.test(value.trim())) {
          errorMessage = 'El teléfono debe contener entre 8 y 15 dígitos numéricos';
        }
        break;

      case 'dui':
        if (value.trim() && !/^[0-9]{8}-[0-9]{1}$/.test(value.trim())) {
          errorMessage = 'El DUI debe tener el formato 12345678-9';
        }
        break;

      case 'address':
        if (value.trim() && value.trim().length < 5) {
          errorMessage = 'La dirección debe tener al menos 5 caracteres';
        }
        break;

      case 'password':
        if (value && value.length < 6) {
          errorMessage = 'La contraseña debe tener al menos 6 caracteres';
        }
        break;

      case 'confirmPassword':
        if (value && formData.password && value !== formData.password) {
          errorMessage = 'Las contraseñas no coinciden';
        }
        break;
    }

    if (errorMessage || !value.trim()) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: errorMessage
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.name.trim())) {
      newErrors.name = 'El nombre solo puede contener letras y espacios';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(formData.email.trim())) {
      newErrors.email = 'El formato del email no es válido';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'El teléfono es requerido';
    } else if (!/^[0-9]{8,15}$/.test(formData.phoneNumber.trim())) {
      newErrors.phoneNumber = 'El teléfono debe contener entre 8 y 15 dígitos numéricos';
    }

    if (!formData.dui.trim()) {
      newErrors.dui = 'El DUI es requerido';
    } else if (!/^[0-9]{8}-[0-9]{1}$/.test(formData.dui.trim())) {
      newErrors.dui = 'El DUI debe tener el formato 12345678-9';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'La dirección es requerida';
    } else if (formData.address.trim().length < 5) {
      newErrors.address = 'La dirección debe tener al menos 5 caracteres';
    }

    if (!formData.birthday) {
      newErrors.birthday = 'La fecha de nacimiento es requerida';
    } else {
      const birthDate = new Date(formData.birthday);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      
      if (birthDate > today) {
        newErrors.birthday = 'La fecha de nacimiento no puede ser futura';
      } else if (age < 16) {
        newErrors.birthday = 'El empleado debe ser mayor de 16 años';
      } else if (age > 80) {
        newErrors.birthday = 'La edad parece incorrecta';
      }
    }

    if (!formData.hireDate) {
      newErrors.hireDate = 'La fecha de contratación es requerida';
    } else {
      const hireDate = new Date(formData.hireDate);
      const today = new Date();
      
      if (hireDate > today) {
        newErrors.hireDate = 'La fecha de contratación no puede ser futura';
      }
      
      if (formData.birthday) {
        const birthDate = new Date(formData.birthday);
        if (birthDate > hireDate) {
          newErrors.hireDate = 'La fecha de contratación debe ser posterior al nacimiento';
        }
      }
    }

    if (mode === 'create') {
      if (!formData.password) {
        newErrors.password = 'La contraseña es requerida';
      } else if (formData.password.length < 6) {
        newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Confirma la contraseña';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden';
      }
    } else if (formData.password) {
      if (formData.password.length < 6) {
        newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
      }

      if (formData.confirmPassword && formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const employeeData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phoneNumber: formData.phoneNumber.trim(),
        dui: formData.dui.trim(),
        address: formData.address.trim(),
        birthday: formData.birthday,
        hireDate: formData.hireDate,
        role: formData.role,
        active: true
      };

      if (mode === 'create' || formData.password) {
        employeeData.password = formData.password;
      }

      let createdEmployeeId = employeeId;
      
      if (mode === 'create') {
        const result = await createEmployee(employeeData);
        createdEmployeeId = result?.id || result?._id;
      } else {
        await updateEmployee(employeeId, employeeData);
      }

      // Subir foto de perfil a Cloudinary si se seleccionó una
      if (formData.profilePicture && createdEmployeeId) {
        try {
          setIsUploadingPicture(true);
          console.log('📸 [EmployeeModal] Subiendo foto de perfil a Cloudinary:', {
            employeeId: createdEmployeeId,
            fileName: formData.profilePicture.name,
            fileSize: formData.profilePicture.size
          });
          
          const uploadResult = await uploadProfilePicture(createdEmployeeId, formData.profilePicture);
          console.log('✅ [EmployeeModal] Foto subida exitosamente:', uploadResult);
        } catch (error) {
          console.error('❌ [EmployeeModal] Error uploading profile picture:', error);
          // No cancelamos la operación si falla la foto, pero mostramos un warning
          Swal.fire({
            icon: 'warning',
            title: 'Foto no subida',
            text: 'El empleado se creó correctamente, pero hubo un problema subiendo la foto de perfil. Puedes intentar subirla más tarde.',
            confirmButtonColor: '#040DBF'
          });
        } finally {
          setIsUploadingPicture(false);
        }
      }

      if (mode === 'create') {
        onSuccess?.(employeeData);
      } else {
        onSuccess?.(employeeId, employeeData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving employee:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await hardDeleteEmployee(employeeId);
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  const formatDui = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 8) {
      return numbers;
    } else if (numbers.length === 9) {
      return `${numbers.slice(0, 8)}-${numbers.slice(8)}`;
    }
    return value;
  };

  if (!isOpen) return null;

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      closeAfterTransition
      disableScrollLock={true}
      BackdropComponent={ModernModalBackdrop}
    >
      <ModernModalContainer>
        <GlobalStyles />
        <ModernModalCard>
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

          <AnimatedModalHeader>
            <ModernModalCloseButton
              onClick={onClose}
              aria-label="Cerrar modal"
            >
              <X size={18} weight="bold" color="#000000" />
            </ModernModalCloseButton>
            
            <ModernModalTitle>
              {mode === 'create' ? (
                <>
                  <UserPlus size={28} weight="duotone" />
                  Crear Nuevo Empleado
                </>
              ) : (
                <>
                  <PencilSimple size={28} weight="duotone" />
                  Editar Empleado
                </>
              )}
            </ModernModalTitle>
            <ModernModalSubtitle>
              {mode === 'create' 
                ? 'Configura la información y rol del empleado'
                : 'Modifica la información del empleado'
              }
            </ModernModalSubtitle>
          </AnimatedModalHeader>

          {isLoadingEmployee ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px', gap: '16px' }}>
              <CircularProgress size={40} />
              <Typography sx={{ color: '#64748b', fontSize: '14px' }}>
                Cargando datos del empleado...
              </Typography>
            </Box>
          ) : (
            <ModernModalContent>
              <EmployeeModalForm component="form" onSubmit={handleSubmit}>
                <Container maxWidth="lg" disableGutters>
                  <Grid container>
                    {/* Información Personal */}
                    <Grid item xs={12} md={6}>
                      <EmployeeModalSection>
                        <EmployeeModalSectionTitle>
                          <User size={18} weight="duotone" />
                          Información Personal
                        </EmployeeModalSectionTitle>
                        
                        <EmployeeModalField>
                          <EmployeeModalLabel>
                            <User size={14} weight="duotone" />
                            Nombre Completo *
                          </EmployeeModalLabel>
                          <EmployeeModalInput
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            error={!!errors.name}
                            placeholder="Ej: Juan Pérez"
                          />
                          {errors.name && (
                            <EmployeeModalError>
                              <Warning size={12} weight="fill" />
                              {errors.name}
                            </EmployeeModalError>
                          )}
                        </EmployeeModalField>

                        {/* Campo de Foto de Perfil */}
                        <EmployeeModalField>
                          <EmployeeModalLabel>
                            <Camera size={14} weight="duotone" />
                            Foto de Perfil
                          </EmployeeModalLabel>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            {/* Avatar Preview */}
                            <Box sx={{ 
                              width: 80, 
                              height: 80, 
                              borderRadius: '50%', 
                              background: 'linear-gradient(135deg, #040DBF, #1F64BF)', // Siempre fondo azul para PNG sin fondo
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              overflow: 'hidden',
                              border: '2px solid #e2e8f0',
                              position: 'relative'
                            }}>
                              {profilePicturePreview || formData.profilePicture ? (
                                <img 
                                  src={profilePicturePreview || formData.profilePicture} 
                                  alt="Preview" 
                                  style={{ 
                                    width: '100%', 
                                    height: '100%', 
                                    objectFit: 'cover',
                                    borderRadius: '50%' // Asegurar forma circular
                                  }} 
                                />
                              ) : (
                                <User size={32} weight="duotone" color="#ffffff" />
                              )}
                            </Box>

                            {/* Botones de acción */}
                            <Box sx={{ 
                              display: 'flex', 
                              flexDirection: 'column', 
                              gap: 1,
                              width: '120px', // Ancho fijo para mantener el layout
                              flexShrink: 0 // No se encoge
                            }}>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleProfilePictureChange}
                                style={{ display: 'none' }}
                                id="profile-picture-upload"
                              />
                              <EmployeeModalBtn
                                variant="primary"
                                size="small"
                                startIcon={<Camera size={16} />}
                                onClick={() => {
                                  console.log('📸 [EmployeeModal] Button clicked');
                                  const fileInput = document.getElementById('profile-picture-upload');
                                  console.log('📸 [EmployeeModal] File input found:', fileInput);
                                  if (fileInput) {
                                    fileInput.click();
                                    console.log('📸 [EmployeeModal] File input clicked');
                                  } else {
                                    console.log('📸 [EmployeeModal] File input not found!');
                                  }
                                }}
                                sx={{
                                  fontSize: '12px',
                                  padding: '8px 16px',
                                  width: '100%', // Ocupa todo el ancho del contenedor
                                  minWidth: 'auto',
                                  '&:hover': {
                                    transform: 'translateY(-0.1px)' // Solo 0.1px como pediste
                                  }
                                }}
                              >
                                {profilePicturePreview || formData.profilePicture ? 'Cambiar' : 'Agregar'}
                              </EmployeeModalBtn>
                              
                              <EmployeeModalBtn
                                variant="danger"
                                size="small"
                                startIcon={<X size={16} />}
                                onClick={handleRemoveProfilePicture}
                                sx={{
                                  fontSize: '12px',
                                  padding: '8px 16px',
                                  width: '100%', // Ocupa todo el ancho del contenedor
                                  minWidth: 'auto',
                                  opacity: (profilePicturePreview || formData.profilePicture) ? 1 : 0,
                                  visibility: (profilePicturePreview || formData.profilePicture) ? 'visible' : 'hidden',
                                  transition: 'opacity 0.3s ease, visibility 0.3s ease',
                                  '&:hover': {
                                    transform: 'translateY(-0.1px)' // Solo 0.1px como pediste
                                  }
                                }}
                              >
                                Eliminar
                              </EmployeeModalBtn>
                            </Box>
                          </Box>
                        </EmployeeModalField>

                        <EmployeeModalField>
                          <EmployeeModalLabel>
                            <Envelope size={14} weight="duotone" />
                            Correo Electrónico *
                          </EmployeeModalLabel>
                          <EmployeeModalInput
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            error={!!errors.email}
                            placeholder="juan.perez@empresa.com"
                          />
                          {errors.email && (
                            <EmployeeModalError>
                              <Warning size={12} weight="fill" />
                              {errors.email}
                            </EmployeeModalError>
                          )}
                        </EmployeeModalField>

                        <EmployeeModalField>
                          <EmployeeModalLabel>
                            <Phone size={14} weight="duotone" />
                            Teléfono *
                          </EmployeeModalLabel>
                          <EmployeeModalInput
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            error={!!errors.phoneNumber}
                            placeholder="7777-7777"
                          />
                          {errors.phoneNumber && (
                            <EmployeeModalError>
                              <Warning size={12} weight="fill" />
                              {errors.phoneNumber}
                            </EmployeeModalError>
                          )}
                        </EmployeeModalField>

                        <EmployeeModalField>
                          <EmployeeModalLabel>
                            <IdentificationCard size={14} weight="duotone" />
                            DUI *
                          </EmployeeModalLabel>
                          <EmployeeModalInput
                            type="text"
                            name="dui"
                            value={formData.dui}
                            onChange={(e) => {
                              const formatted = formatDui(e.target.value);
                              setFormData(prev => ({ ...prev, dui: formatted }));
                            }}
                            error={!!errors.dui}
                            placeholder="12345678-9"
                            inputProps={{ maxLength: 10 }}
                          />
                          {errors.dui && (
                            <EmployeeModalError>
                              <Warning size={12} weight="fill" />
                              {errors.dui}
                            </EmployeeModalError>
                          )}
                        </EmployeeModalField>

                        <EmployeeModalField>
                          <EmployeeModalLabel>
                            <MapPin size={14} weight="duotone" />
                            Dirección *
                          </EmployeeModalLabel>
                          <EmployeeModalInput
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            error={!!errors.address}
                            placeholder="Dirección completa del empleado"
                            multiline
                            rows={3}
                          />
                          {errors.address && (
                            <EmployeeModalError>
                              <Warning size={12} weight="fill" />
                              {errors.address}
                            </EmployeeModalError>
                          )}
                        </EmployeeModalField>
                      </EmployeeModalSection>
                    </Grid>

                    {/* Fechas y Contraseña */}
                    <Grid item xs={12} md={6}>
                      <EmployeeModalSection>
                        <EmployeeModalSectionTitle>
                          <Calendar size={18} weight="duotone" />
                          Fechas y Seguridad
                        </EmployeeModalSectionTitle>

                        <EmployeeModalField>
                          <EmployeeModalLabel>
                            <Calendar size={14} weight="duotone" />
                            Fecha de Nacimiento *
                          </EmployeeModalLabel>
                          <EmployeeModalInput
                            type="date"
                            name="birthday"
                            value={formData.birthday}
                            onChange={handleInputChange}
                            error={!!errors.birthday}
                          />
                          {errors.birthday && (
                            <EmployeeModalError>
                              <Warning size={12} weight="fill" />
                              {errors.birthday}
                            </EmployeeModalError>
                          )}
                        </EmployeeModalField>

                        <EmployeeModalField>
                          <EmployeeModalLabel>
                            <Calendar size={14} weight="duotone" />
                            Fecha de Contratación *
                          </EmployeeModalLabel>
                          <EmployeeModalInput
                            type="date"
                            name="hireDate"
                            value={formData.hireDate}
                            onChange={handleInputChange}
                            error={!!errors.hireDate}
                          />
                          {errors.hireDate && (
                            <EmployeeModalError>
                              <Warning size={12} weight="fill" />
                              {errors.hireDate}
                            </EmployeeModalError>
                          )}
                        </EmployeeModalField>

                        <EmployeeModalField>
                          <EmployeeModalLabel>
                            <Lock size={14} weight="duotone" />
                            {mode === 'create' ? 'Contraseña *' : 'Nueva Contraseña (opcional)'}
                          </EmployeeModalLabel>
                          <EmployeeModalInput
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            error={!!errors.password}
                            placeholder={mode === 'create' ? 'Mínimo 6 caracteres' : 'Dejar vacío para mantener la actual'}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    onClick={() => setShowPassword(!showPassword)}
                                    edge="end"
                                    sx={{ color: '#64748b' }}
                                  >
                                    {showPassword ? <EyeSlash size={16} /> : <Eye size={16} />}
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                          />
                          {errors.password && (
                            <EmployeeModalError>
                              <Warning size={12} weight="fill" />
                              {errors.password}
                            </EmployeeModalError>
                          )}
                        </EmployeeModalField>

                        {(mode === 'create' || formData.password) && (
                          <EmployeeModalField>
                            <EmployeeModalLabel>
                              <Lock size={14} weight="duotone" />
                              Confirmar Contraseña *
                            </EmployeeModalLabel>
                            <EmployeeModalInput
                              type={showConfirmPassword ? 'text' : 'password'}
                              name="confirmPassword"
                              value={formData.confirmPassword}
                              onChange={handleInputChange}
                              error={!!errors.confirmPassword}
                              placeholder="Repite la contraseña"
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton
                                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                      edge="end"
                                      sx={{ color: '#64748b' }}
                                    >
                                      {showConfirmPassword ? <EyeSlash size={16} /> : <Eye size={16} />}
                                    </IconButton>
                                  </InputAdornment>
                                ),
                              }}
                            />
                            {errors.confirmPassword && (
                              <EmployeeModalError>
                                <Warning size={12} weight="fill" />
                                {errors.confirmPassword}
                              </EmployeeModalError>
                            )}
                          </EmployeeModalField>
                        )}
                      </EmployeeModalSection>
                    </Grid>

                    {/* Rol */}
                    <Grid item xs={12}>
                      <EmployeeModalSection>
                        <EmployeeModalSectionTitle>
                          <Shield size={18} weight="duotone" />
                          Rol y Permisos
                        </EmployeeModalSectionTitle>

                        <EmployeeModalField>
                          <EmployeeModalLabel>
                            <Shield size={14} weight="duotone" />
                            Selecciona el Rol *
                          </EmployeeModalLabel>
                          <Grid container spacing={2}>
                            {roles.map(role => {
                              const IconComponent = role.icon;
                              return (
                                <Grid item xs={12} sm={6} md={3} key={role.value}>
                                  <EmployeeModalRoleCard
                                    selected={formData.role === role.value}
                                    onClick={() => setFormData(prev => ({ ...prev, role: role.value }))}
                                  >
                                    <EmployeeModalRoleContent>
                                      <EmployeeModalRoleHeader>
                                        <IconComponent size={24} weight="duotone" />
                                        <EmployeeModalRoleTitle>{role.label}</EmployeeModalRoleTitle>
                                      </EmployeeModalRoleHeader>
                                    </EmployeeModalRoleContent>
                                  </EmployeeModalRoleCard>
                                </Grid>
                              );
                            })}
                          </Grid>
                        </EmployeeModalField>
                      </EmployeeModalSection>
                    </Grid>
                  </Grid>
                </Container>

                <EmployeeModalActions>
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

                  {mode === 'edit' && (
                    <EmployeeModalBtn
                      type="button"
                      variant="danger"
                      onClick={() => setShowDeleteConfirm(true)}
                      disabled={isSubmitting}
                    >
                      <Trash size={16} weight="duotone" />
                      Eliminar
                    </EmployeeModalBtn>
                  )}

                  <Box sx={{ display: 'flex', gap: '12px', marginLeft: 'auto' }}>
                    <EmployeeModalBtn
                      type="button"
                      variant="secondary"
                      onClick={onClose}
                      disabled={isSubmitting}
                    >
                      <X size={16} weight="duotone" />
                      Cancelar
                    </EmployeeModalBtn>
                    <EmployeeModalBtn
                      type="submit"
                      variant="primary"
                      disabled={isSubmitting || isUploadingPicture}
                    >
                      {isSubmitting || isUploadingPicture ? (
                        <>
                          <CircularProgress size={16} color="inherit" />
                          {isUploadingPicture ? 'Subiendo foto...' : (mode === 'create' ? 'Creando...' : 'Guardando...')}
                        </>
                      ) : (
                        <>
                          <CheckCircle size={16} weight="duotone" />
                          {mode === 'create' ? 'Crear Empleado' : 'Guardar Cambios'}
                        </>
                      )}
                    </EmployeeModalBtn>
                  </Box>
                </EmployeeModalActions>
              </EmployeeModalForm>
            </ModernModalContent>
          )}

          <Dialog
            open={showDeleteConfirm}
            onClose={() => setShowDeleteConfirm(false)}
            maxWidth="sm"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 12px 25px -6px rgba(0, 0, 0, 0.15)',
              }
            }}
          >
            <DialogTitle sx={{ 
              textAlign: 'center', 
              padding: '32px 32px 0 32px',
              background: 'linear-gradient(135deg, #f8fafc, #ffffff)',
            }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                <Box sx={{ 
                  width: '80px', 
                  height: '80px', 
                  borderRadius: '50%', 
                  background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.1), rgba(185, 28, 28, 0.1))', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(220, 38, 38, 0.15)',
                }}>
                  <Trash size={40} weight="duotone" color="#dc2626" />
                </Box>
                <Typography variant="h4" sx={{ 
                  fontWeight: '700', 
                  color: '#010326',
                  fontSize: '24px',
                  lineHeight: 1.2,
                }}>
                  ¿Eliminar empleado permanentemente?
                </Typography>
              </Box>
            </DialogTitle>
            <DialogContent sx={{ 
              textAlign: 'center', 
              padding: '24px 32px',
              background: '#ffffff',
            }}>
              <Typography sx={{ 
                color: '#64748b', 
                lineHeight: 1.6,
                fontSize: '16px',
              }}>
                Esta acción no se puede deshacer. El empleado será eliminado completamente del sistema.
              </Typography>
            </DialogContent>
            <DialogActions sx={{ 
              padding: '24px 32px 32px 32px', 
              justifyContent: 'center', 
              gap: '16px',
              background: 'linear-gradient(135deg, #f8fafc, #ffffff)',
            }}>
              <EmployeeModalBtn
                variant="secondary"
                onClick={() => setShowDeleteConfirm(false)}
                sx={{ minWidth: '160px' }}
              >
                Cancelar
              </EmployeeModalBtn>
              <EmployeeModalBtn
                variant="danger"
                onClick={handleDelete}
                sx={{ minWidth: '200px' }}
              >
                <Trash size={16} weight="duotone" />
                Eliminar Permanentemente
              </EmployeeModalBtn>
            </DialogActions>
          </Dialog>
        </ModernModalCard>
      </ModernModalContainer>
    </Modal>
  );
};

export default EmployeeModal;