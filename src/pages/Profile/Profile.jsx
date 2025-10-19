// src/pages/Profile/Profile.jsx
import React, { useState, useEffect } from 'react';
import { 
  User, 
  EnvelopeSimple, 
  Phone, 
  Calendar,
  PencilSimple,
  Check,
  X,
  Eye,
  EyeSlash,
  Lock,
  Shield,
  Camera,
  MapPin,
  Briefcase
} from '@phosphor-icons/react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  TextField,
  Typography,
  InputAdornment,
  Grid,
  IconButton,
  CircularProgress,
  Chip,
  Paper,
  styled,
  useTheme,
  alpha,
  Avatar,
  InputLabel,
  FormControl,
  OutlinedInput
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import ProfileService from '../../api/profileService';
import useEmployees from '../../hooks/useEmployees';
import Swal from 'sweetalert2';

// ================ ESTILOS MODERNOS RESPONSIVE - PROFILE ================
const ProfilePageContainer = styled(Box)({
  minHeight: '100vh',
  fontFamily: "'Mona Sans'",
  background: 'white',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
});

const ProfileContentWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: '1200px',
  margin: '0 auto',
  paddingTop: '120px',
  paddingBottom: '40px',
  paddingLeft: '32px',
  paddingRight: '32px',
  minHeight: 'calc(100vh - 120px)',
  fontFamily: "'Mona Sans'",
  [theme.breakpoints.down('xl')]: {
    maxWidth: '1000px',
    paddingLeft: '28px',
    paddingRight: '28px',
  },
  [theme.breakpoints.down('lg')]: {
    maxWidth: '900px',
    paddingLeft: '24px',
    paddingRight: '24px',
  },
  [theme.breakpoints.down('md')]: {
    paddingTop: '110px',
    paddingLeft: '20px',
    paddingRight: '20px',
  },
  [theme.breakpoints.down('sm')]: {
    paddingTop: '100px',
    paddingLeft: '16px',
    paddingRight: '16px',
  }
}));

const ProfileModernCard = styled(Paper)(({ theme }) => ({
  background: 'white',
  borderRadius: '20px',
  border: `1px solid ${alpha('#040DBF', 0.1)}`,
  boxShadow: '0 8px 25px rgba(4, 13, 191, 0.08)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  fontFamily: "'Mona Sans'",
  '&:hover': {
    boxShadow: '0 12px 35px rgba(4, 13, 191, 0.15)',
    transform: 'translateY(-2px)',
    borderColor: alpha('#040DBF', 0.2),
  }
}));

const ProfileHeaderSection = styled(ProfileModernCard)(({ theme }) => ({
  padding: '40px',
  marginBottom: '32px',
  background: 'linear-gradient(135deg, rgba(4, 13, 191, 0.05), rgba(31, 100, 191, 0.02))',
  position: 'relative',
  zIndex: 1,
  width: '100%',
  boxSizing: 'border-box',
  [theme.breakpoints.down('lg')]: {
    padding: '32px',
  },
  [theme.breakpoints.down('md')]: {
    padding: '24px',
    marginBottom: '24px',
  },
  [theme.breakpoints.down('sm')]: {
    padding: '20px',
    marginBottom: '20px',
  }
}));

const ProfileHeaderContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '32px',
  width: '100%',
  [theme.breakpoints.down('lg')]: {
    gap: '24px',
  },
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '20px',
  },
  [theme.breakpoints.down('sm')]: {
    gap: '16px',
  }
}));

const ProfileMainTitle = styled(Typography)(({ theme }) => ({
  fontSize: '2rem',
  fontWeight: '700 !important',
  color: '#010326',
  marginBottom: '12px',
  letterSpacing: '-0.025em',
  lineHeight: 1.2,
  textAlign: 'center',
  fontFamily: "'Mona Sans'",
  background: 'linear-gradient(135deg, #040DBF, #1F64BF)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  [theme.breakpoints.down('lg')]: {
    fontSize: '1.8rem',
  },
  [theme.breakpoints.down('md')]: {
    fontSize: '1.6rem',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.4rem',
  }
}));

const ProfileMainDescription = styled(Typography)(({ theme }) => ({
  fontSize: '1rem',
  color: '#64748b',
  fontWeight: '500 !important',
  lineHeight: 1.6,
  textAlign: 'center',
  maxWidth: '600px',
  fontFamily: "'Mona Sans'",
  [theme.breakpoints.down('lg')]: {
    fontSize: '0.95rem',
  },
  [theme.breakpoints.down('md')]: {
    fontSize: '0.9rem',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.85rem',
  }
}));

const ProfileAvatarSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '32px',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    textAlign: 'center',
    gap: '24px',
  }
}));

const ProfileAvatarContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '16px',
});

const ProfileAvatarCircle = styled(Avatar)(({ theme }) => ({
  width: '120px',
  height: '120px',
  background: 'linear-gradient(135deg, #040DBF, #1F64BF)',
  fontSize: '48px',
  fontWeight: '700',
  color: '#ffffff',
  boxShadow: '0 8px 30px rgba(4, 13, 191, 0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 12px 40px rgba(4, 13, 191, 0.4)',
  },
  [theme.breakpoints.down('md')]: {
    width: '100px',
    height: '100px',
    fontSize: '40px',
  },
  [theme.breakpoints.down('sm')]: {
    width: '80px',
    height: '80px',
    fontSize: '32px',
  }
}));

const ProfileAvatarUpload = styled(Button)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '8px 16px',
  background: alpha('#040DBF', 0.1),
  border: `1px solid ${alpha('#040DBF', 0.2)}`,
  borderRadius: '20px',
  color: '#040DBF',
  fontSize: '13px',
  fontWeight: '600',
  textTransform: 'none',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: alpha('#040DBF', 0.15),
    borderColor: alpha('#040DBF', 0.3),
    transform: 'translateY(-1px)',
  }
}));

const ProfileMainInfo = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  [theme.breakpoints.down('md')]: {
    alignItems: 'center',
  }
}));

const ProfileName = styled(Typography)(({ theme }) => ({
  fontSize: '28px',
  fontWeight: '700',
  color: '#010326',
  margin: 0,
  [theme.breakpoints.down('md')]: {
    fontSize: '24px',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '20px',
  }
}));

const ProfileRole = styled(Typography)(({ theme }) => ({
  fontSize: '16px',
  color: '#64748b',
  fontWeight: '500',
  margin: 0,
}));

const ProfileBadges = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '12px',
  marginTop: '8px',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  }
}));

const ProfileBadge = styled(Chip)(({ variant }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  padding: '6px 12px',
  borderRadius: '12px',
  fontSize: '12px',
  fontWeight: '600',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  ...(variant === 'admin' ? {
    background: alpha('#040DBF', 0.1),
    color: '#040DBF',
    border: `1px solid ${alpha('#040DBF', 0.2)}`,
  } : {
    background: alpha('#10b981', 0.1),
    color: '#059669',
    border: `1px solid ${alpha('#10b981', 0.2)}`,
  })
}));

const ProfileGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '24px',
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr',
    gap: '20px',
  }
}));

const ProfileCardHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '24px 24px 0 24px',
  marginBottom: '20px',
  [theme.breakpoints.down('md')]: {
    padding: '20px 20px 0 20px',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '12px',
  },
  [theme.breakpoints.down('sm')]: {
    padding: '16px 16px 0 16px',
  }
}));

const ProfileCardTitle = styled(Typography)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  fontSize: '18px',
  fontWeight: '700',
  color: '#010326',
  margin: 0,
}));

const ProfileEditBtn = styled(Button)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '8px 16px',
  background: alpha('#040DBF', 0.1),
  border: `1px solid ${alpha('#040DBF', 0.2)}`,
  borderRadius: '12px',
  color: '#040DBF',
  fontSize: '13px',
  fontWeight: '600',
  textTransform: 'none',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: '#040DBF',
    color: '#ffffff',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(4, 13, 191, 0.2)',
  }
}));

const ProfileCardBody = styled(Box)(({ theme }) => ({
  padding: '0 24px 24px 24px',
  [theme.breakpoints.down('md')]: {
    padding: '0 20px 20px 20px',
  },
  [theme.breakpoints.down('sm')]: {
    padding: '0 16px 16px 16px',
  }
}));

const ProfileForm = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
});

const ProfileField = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

const ProfileLabel = styled(Typography)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '14px',
  fontWeight: '600',
  color: '#334155',
  marginBottom: '4px',
});

const ProfileTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    fontSize: '14px',
    '& fieldset': {
      borderColor: '#e2e8f0',
      borderWidth: '2px',
    },
    '&:hover fieldset': {
      borderColor: '#040DBF',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#040DBF',
      boxShadow: '0 0 0 4px rgba(4, 13, 191, 0.1)',
    },
  },
  '& .MuiInputBase-input': {
    padding: '12px 16px',
    color: '#010326',
  }
}));

const ProfilePasswordInput = styled(Box)({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
});

const ProfilePasswordToggle = styled(IconButton)({
  position: 'absolute',
  right: '16px',
  background: 'none',
  color: '#64748b',
  padding: '4px',
  borderRadius: '6px',
  transition: 'all 0.3s ease',
  '&:hover': {
    color: '#040DBF',
    background: alpha('#040DBF', 0.1),
  }
});

const ProfileActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '12px',
  marginTop: '8px',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
  }
}));

const ProfileBtn = styled(Button)(({ variant }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '12px 20px',
  borderRadius: '12px',
  fontSize: '14px',
  fontWeight: '600',
  textTransform: 'none',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  ...(variant === 'primary' ? {
    background: 'linear-gradient(135deg, #040DBF, #1F64BF)',
    color: '#ffffff',
    boxShadow: '0 4px 15px rgba(4, 13, 191, 0.3)',
    '&:hover': {
      background: 'linear-gradient(135deg, #1F64BF, #040DBF)',
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(4, 13, 191, 0.4)',
    }
  } : {
    background: '#ffffff',
    color: '#64748b',
    border: '2px solid #e2e8f0',
    '&:hover': {
      background: '#f8fafc',
      color: '#334155',
      borderColor: '#cbd5e1',
      transform: 'translateY(-1px)',
    }
  })
}));

const ProfileInfoDisplay = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

const ProfileInfoItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  padding: '16px',
  background: alpha('#f8fafc', 0.6),
  border: `1px solid ${alpha('#040DBF', 0.1)}`,
  borderRadius: '12px',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: alpha('#040DBF', 0.05),
    borderColor: alpha('#040DBF', 0.2),
    transform: 'translateX(4px)',
  },
  [theme.breakpoints.down('sm')]: {
    padding: '12px',
  }
}));

const ProfileInfoIcon = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '40px',
  height: '40px',
  background: alpha('#040DBF', 0.1),
  color: '#040DBF',
  borderRadius: '10px',
  minWidth: '40px',
});

const ProfileInfoContent = styled(Box)({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
});

const ProfileInfoLabel = styled(Typography)({
  fontSize: '12px',
  color: '#64748b',
  fontWeight: '600',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
});

const ProfileInfoValue = styled(Typography)({
  fontSize: '14px',
  color: '#010326',
  fontWeight: '600',
});

const ProfileSecurityInfo = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

const ProfileSecurityItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  padding: '16px',
  background: alpha('#f8fafc', 0.6),
  border: `1px solid ${alpha('#040DBF', 0.1)}`,
  borderRadius: '12px',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: alpha('#040DBF', 0.05),
    borderColor: alpha('#040DBF', 0.2),
  },
  [theme.breakpoints.down('sm')]: {
    padding: '12px',
  }
}));

const ProfileSecurityIcon = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '40px',
  height: '40px',
  background: alpha('#040DBF', 0.1),
  color: '#040DBF',
  borderRadius: '10px',
  minWidth: '40px',
});

const ProfileSecurityContent = styled(Box)({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
});

const ProfileSecurityLabel = styled(Typography)({
  fontSize: '12px',
  color: '#64748b',
  fontWeight: '600',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
});

const ProfileSecurityValue = styled(Typography)({
  fontSize: '14px',
  color: '#010326',
  fontWeight: '600',
});

const ProfileSecurityStatus = styled(Chip)(({ variant }) => ({
  padding: '4px 12px',
  borderRadius: '12px',
  fontSize: '12px',
  fontWeight: '600',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  ...(variant === 'good' ? {
    background: alpha('#10b981', 0.1),
    color: '#059669',
    border: `1px solid ${alpha('#10b981', 0.2)}`,
  } : {})
}));

const Profile = () => {
  const { user, refreshAuth } = useAuth();
  const { uploadProfilePicture, deleteProfilePicture } = useEmployees();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  
  // Estados para edición de perfil
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    location: '',
    bio: '',
    role: '',
    hireDate: '',
    dui: ''
  });
  
  // Estados para cambio de contraseña
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Cargar datos del usuario al iniciar
  useEffect(() => {
    loadUserProfile();
  }, [user]);

  const loadUserProfile = async () => {
    if (!user || !user.id) {
      setProfileLoading(false);
      return;
    }

    try {
      setProfileLoading(true);
      const response = await ProfileService.getUserProfile(user.id);
      
      if (response.success) {
        const userData = response.data;
        console.log('📸 [Profile] loadUserProfile - userData received:', {
          name: userData.name,
          email: userData.email,
          profilePicture: userData.profilePicture
        });
        
        setProfileData({
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phoneNumber || '',
          position: getRoleDisplayName(userData.role) || 'Empleado',
          location: userData.address || 'No especificado',
          bio: userData.bio || `${getRoleDisplayName(userData.role)} en DIAMBARS Sublimado`,
          role: userData.role || 'employee',
          hireDate: userData.hireDate ? new Date(userData.hireDate).toLocaleDateString() : '',
          dui: userData.dui || 'No especificado',
          profilePicture: userData.profilePicture || ''
        });
        
        console.log('📸 [Profile] loadUserProfile - profileData set with profilePicture:', userData.profilePicture || '');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo cargar la información del perfil',
          confirmButtonColor: '#040DBF'
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error de conexión al cargar el perfil',
        confirmButtonColor: '#040DBF'
      });
    } finally {
      setProfileLoading(false);
    }
  };

  // Función para obtener el nombre del rol en español
  const getRoleDisplayName = (role) => {
    const roleNames = {
      'admin': 'Administrador',
      'manager': 'Gerente',
      'employee': 'Empleado',
      'delivery': 'Repartidor',
      'production': 'Producción'
    };
    return roleNames[role?.toLowerCase()] || 'Empleado';
  };

  const handleProfileChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);

      // Validaciones básicas
      if (!profileData.name.trim()) {
        Swal.fire({
          icon: 'error',
          title: 'Error de validación',
          text: 'El nombre es obligatorio',
          confirmButtonColor: '#040DBF'
        });
        return;
      }

      if (!profileData.email.trim() || !profileData.email.includes('@')) {
        Swal.fire({
          icon: 'error',
          title: 'Error de validación',
          text: 'Ingresa un email válido',
          confirmButtonColor: '#040DBF'
        });
        return;
      }

      // Llamada a la API
      const response = await ProfileService.updateUserProfile(user.id, profileData);

      if (response.success) {
        Swal.fire({
          icon: 'success',
          title: 'Perfil actualizado',
          text: 'Los cambios se han guardado exitosamente',
          confirmButtonColor: '#040DBF',
          timer: 2000,
          showConfirmButton: false
        });

        setIsEditing(false);
        
        // Refrescar autenticación si es necesario
        if (refreshAuth) {
          await refreshAuth();
        }
        
        // Recargar datos del perfil
        await loadUserProfile();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.error || 'No se pudo actualizar el perfil',
          confirmButtonColor: '#040DBF'
        });
      }

    } catch (error) {
      console.error('Error updating profile:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar el perfil. Inténtalo de nuevo.',
        confirmButtonColor: '#040DBF'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      setLoading(true);

      // Validaciones
      if (!passwordData.currentPassword) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ingresa tu contraseña actual',
          confirmButtonColor: '#040DBF'
        });
        return;
      }

      if (passwordData.newPassword.length < 6) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'La nueva contraseña debe tener al menos 6 caracteres',
          confirmButtonColor: '#040DBF'
        });
        return;
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Las contraseñas no coinciden',
          confirmButtonColor: '#040DBF'
        });
        return;
      }

      // Llamada a la API
      const response = await ProfileService.changePassword(user.id, passwordData);

      if (response.success) {
        Swal.fire({
          icon: 'success',
          title: 'Contraseña cambiada',
          text: 'Tu contraseña se ha actualizado exitosamente',
          confirmButtonColor: '#040DBF',
          timer: 2000,
          showConfirmButton: false
        });

        setIsChangingPassword(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.error || 'No se pudo cambiar la contraseña',
          confirmButtonColor: '#040DBF'
        });
      }

    } catch (error) {
      console.error('Error changing password:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo cambiar la contraseña. Verifica tu contraseña actual.',
        confirmButtonColor: '#040DBF'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    // Recargar datos originales
    loadUserProfile();
    setIsEditing(false);
  };

  // Función para manejar la subida de foto de perfil
  const handleProfilePictureUpload = async (event) => {
    console.log('📸 [Profile] handleProfilePictureUpload called', event.target.files);
    const file = event.target.files[0];
    if (!file) {
      console.log('📸 [Profile] No file selected');
      return;
    }

    console.log('📸 [Profile] File selected:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    // Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      console.log('📸 [Profile] Invalid file type:', file.type);
      Swal.fire({
        icon: 'error',
        title: 'Tipo de archivo no válido',
        text: 'Solo se permiten archivos de imagen (JPEG, JPG, PNG, GIF, WEBP)',
        confirmButtonColor: '#1F64BF'
      });
      return;
    }

    // Validar tamaño (5MB máximo)
    if (file.size > 5 * 1024 * 1024) {
      console.log('📸 [Profile] File too large:', file.size);
      Swal.fire({
        icon: 'error',
        title: 'Archivo muy grande',
        text: 'El archivo debe ser menor a 5MB',
        confirmButtonColor: '#1F64BF'
      });
      return;
    }

    try {
      setLoading(true);
      console.log('📸 [Profile] Starting upload...');
      
      const result = await uploadProfilePicture(user.id, file);
      console.log('📸 [Profile] Upload result:', result);
      
      setProfileData(prev => ({
        ...prev,
        profilePicture: result.profilePicture
      }));
      
      // Actualizar el contexto de autenticación para que el navbar se actualice
      if (refreshAuth) {
        console.log('📸 [Profile] Refrescando contexto de autenticación...');
        await refreshAuth();
      }
      
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      // El error ya se maneja en el hook con toast
    } finally {
      setLoading(false);
    }
  };

  // Función para eliminar foto de perfil
  const handleDeleteProfilePicture = async () => {
    const result = await Swal.fire({
      title: '¿Eliminar foto de perfil?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        
        await deleteProfilePicture(user.id);
        setProfileData(prev => ({
          ...prev,
          profilePicture: ''
        }));
        
        // Actualizar el contexto de autenticación para que el navbar se actualice
        if (refreshAuth) {
          console.log('📸 [Profile] Refrescando contexto de autenticación después de eliminar foto...');
          await refreshAuth();
        }
        
      } catch (error) {
        console.error('Error deleting profile picture:', error);
        // El error ya se maneja en el hook con toast
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancelPasswordChange = () => {
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setIsChangingPassword(false);
  };

  // Mostrar loading mientras carga el perfil
  if (profileLoading) {
    return (
      <ProfilePageContainer>
        <ProfileContentWrapper>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '50vh',
            fontSize: '18px',
            color: '#64748b'
          }}>
            Cargando perfil...
          </Box>
        </ProfileContentWrapper>
      </ProfilePageContainer>
    );
  }

  return (
    <ProfilePageContainer>
      <ProfileContentWrapper>
        
        {/* Header */}
        <ProfileHeaderSection>
          <ProfileHeaderContent>
            <ProfileMainTitle>Mi Perfil</ProfileMainTitle>
            <ProfileMainDescription>
              Gestiona tu información personal y configuración de cuenta
            </ProfileMainDescription>
          </ProfileHeaderContent>
        </ProfileHeaderSection>

        {/* Card de Avatar y Info Principal */}
        <ProfileHeaderSection>
          <ProfileAvatarSection>
            <ProfileAvatarContainer>
              <ProfileAvatarCircle src={profileData.profilePicture}>
                {profileData.name ? profileData.name.charAt(0).toUpperCase() : 'U'}
              </ProfileAvatarCircle>
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePictureUpload}
                style={{ display: 'none' }}
                id="profile-picture-upload"
                disabled={loading}
              />
              <ProfileAvatarUpload
                onClick={() => {
                  console.log('📸 [Profile] Button clicked, loading:', loading);
                  const fileInput = document.getElementById('profile-picture-upload');
                  console.log('📸 [Profile] File input found:', fileInput);
                  if (fileInput && !loading) {
                    fileInput.click();
                    console.log('📸 [Profile] File input clicked');
                  } else {
                    console.log('📸 [Profile] File input not found or loading!');
                  }
                }}
                style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
              >
                <Camera size={16} weight="duotone" />
                <span>
                  {loading 
                    ? 'Subiendo...' 
                    : profileData.profilePicture 
                      ? 'Cambiar foto de perfil' 
                      : 'Agregar foto de perfil'
                  }
                </span>
              </ProfileAvatarUpload>
              {profileData.profilePicture && (
                <IconButton
                  onClick={handleDeleteProfilePicture}
                  disabled={loading}
                  sx={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    background: 'rgba(220, 38, 38, 0.1)',
                    color: '#dc2626',
                    '&:hover': {
                      background: 'rgba(220, 38, 38, 0.2)',
                    },
                    width: '32px',
                    height: '32px'
                  }}
                >
                  <X size={16} weight="bold" />
                </IconButton>
              )}
            </ProfileAvatarContainer>
            
            <ProfileMainInfo>
              <ProfileName>{profileData.name || 'Nombre del Usuario'}</ProfileName>
              <ProfileRole>{profileData.position}</ProfileRole>
              <ProfileBadges>
                <ProfileBadge 
                  variant={profileData.role === 'admin' ? 'admin' : 'active'}
                  icon={<Shield size={14} weight="duotone" />}
                  label={profileData.position}
                />
                <ProfileBadge 
                  variant="active"
                  icon={<Box sx={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%' }} />}
                  label="En línea"
                />
              </ProfileBadges>
            </ProfileMainInfo>
          </ProfileAvatarSection>
        </ProfileHeaderSection>

        <ProfileGrid>
          
          {/* Card de Información Personal */}
          <ProfileModernCard>
            <ProfileCardHeader>
              <ProfileCardTitle>
                <User size={20} weight="duotone" />
                Información Personal
              </ProfileCardTitle>
              {!isEditing && (
                <ProfileEditBtn
                  onClick={() => setIsEditing(true)}
                  disabled={loading}
                >
                  <PencilSimple size={16} weight="duotone" />
                  Editar
                </ProfileEditBtn>
              )}
            </ProfileCardHeader>

            <ProfileCardBody>
              {isEditing ? (
                <ProfileForm>
                  <ProfileField>
                    <ProfileLabel>
                      <User size={16} weight="duotone" />
                      Nombre completo
                    </ProfileLabel>
                    <ProfileTextField
                      type="text"
                      value={profileData.name}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value.length <= 9) {
                          handleProfileChange('name', value);
                        }
                      }}
                      placeholder="Tu nombre completo (máx. 9 caracteres)"
                      disabled={loading}
                      fullWidth
                      inputProps={{ maxLength: 9 }}
                      helperText={`${profileData.name.length}/9 caracteres`}
                    />
                  </ProfileField>

                  <ProfileField>
                    <ProfileLabel>
                      <EnvelopeSimple size={16} weight="duotone" />
                      Correo electrónico
                    </ProfileLabel>
                    <ProfileTextField
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleProfileChange('email', e.target.value)}
                      placeholder="tu@email.com"
                      disabled={loading}
                      fullWidth
                    />
                  </ProfileField>

                  <ProfileField>
                    <ProfileLabel>
                      <Phone size={16} weight="duotone" />
                      Teléfono
                    </ProfileLabel>
                    <ProfileTextField
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => handleProfileChange('phone', e.target.value)}
                      placeholder="+503 1234-5678"
                      disabled={loading}
                      fullWidth
                    />
                  </ProfileField>

                  <ProfileField>
                    <ProfileLabel>
                      <MapPin size={16} weight="duotone" />
                      Dirección
                    </ProfileLabel>
                    <ProfileTextField
                      type="text"
                      value={profileData.location}
                      onChange={(e) => handleProfileChange('location', e.target.value)}
                      placeholder="Tu dirección"
                      disabled={loading}
                      fullWidth
                    />
                  </ProfileField>

                  <ProfileActions>
                    <ProfileBtn 
                      variant="primary"
                      onClick={handleSaveProfile}
                      disabled={loading}
                    >
                      <Check size={16} weight="duotone" />
                      {loading ? 'Guardando...' : 'Guardar cambios'}
                    </ProfileBtn>
                    <ProfileBtn 
                      variant="secondary"
                      onClick={handleCancelEdit}
                      disabled={loading}
                    >
                      <X size={16} weight="duotone" />
                      Cancelar
                    </ProfileBtn>
                  </ProfileActions>
                </ProfileForm>
              ) : (
                <ProfileInfoDisplay>
                  <ProfileInfoItem>
                    <ProfileInfoIcon>
                      <User size={16} weight="duotone" />
                    </ProfileInfoIcon>
                    <ProfileInfoContent>
                      <ProfileInfoLabel>Nombre</ProfileInfoLabel>
                      <ProfileInfoValue>{profileData.name}</ProfileInfoValue>
                    </ProfileInfoContent>
                  </ProfileInfoItem>

                  <ProfileInfoItem>
                    <ProfileInfoIcon>
                      <EnvelopeSimple size={16} weight="duotone" />
                    </ProfileInfoIcon>
                    <ProfileInfoContent>
                      <ProfileInfoLabel>Email</ProfileInfoLabel>
                      <ProfileInfoValue>{profileData.email}</ProfileInfoValue>
                    </ProfileInfoContent>
                  </ProfileInfoItem>

                  <ProfileInfoItem>
                    <ProfileInfoIcon>
                      <Phone size={16} weight="duotone" />
                    </ProfileInfoIcon>
                    <ProfileInfoContent>
                      <ProfileInfoLabel>Teléfono</ProfileInfoLabel>
                      <ProfileInfoValue>{profileData.phone || 'No especificado'}</ProfileInfoValue>
                    </ProfileInfoContent>
                  </ProfileInfoItem>

                  <ProfileInfoItem>
                    <ProfileInfoIcon>
                      <Briefcase size={16} weight="duotone" />
                    </ProfileInfoIcon>
                    <ProfileInfoContent>
                      <ProfileInfoLabel>Cargo</ProfileInfoLabel>
                      <ProfileInfoValue>{profileData.position}</ProfileInfoValue>
                    </ProfileInfoContent>
                  </ProfileInfoItem>

                  <ProfileInfoItem>
                    <ProfileInfoIcon>
                      <MapPin size={16} weight="duotone" />
                    </ProfileInfoIcon>
                    <ProfileInfoContent>
                      <ProfileInfoLabel>Dirección</ProfileInfoLabel>
                      <ProfileInfoValue>{profileData.location}</ProfileInfoValue>
                    </ProfileInfoContent>
                  </ProfileInfoItem>

                  <ProfileInfoItem>
                    <ProfileInfoIcon>
                      <Calendar size={16} weight="duotone" />
                    </ProfileInfoIcon>
                    <ProfileInfoContent>
                      <ProfileInfoLabel>Fecha de contratación</ProfileInfoLabel>
                      <ProfileInfoValue>{profileData.hireDate}</ProfileInfoValue>
                    </ProfileInfoContent>
                  </ProfileInfoItem>

                  {profileData.dui !== 'No especificado' && (
                    <ProfileInfoItem>
                      <ProfileInfoIcon>
                        <User size={16} weight="duotone" />
                      </ProfileInfoIcon>
                      <ProfileInfoContent>
                        <ProfileInfoLabel>DUI</ProfileInfoLabel>
                        <ProfileInfoValue>{profileData.dui}</ProfileInfoValue>
                      </ProfileInfoContent>
                    </ProfileInfoItem>
                  )}
                </ProfileInfoDisplay>
              )}
            </ProfileCardBody>
          </ProfileModernCard>

          {/* Card de Seguridad */}
          <ProfileModernCard>
            <ProfileCardHeader>
              <ProfileCardTitle>
                <Lock size={20} weight="duotone" />
                Seguridad
              </ProfileCardTitle>
              {!isChangingPassword && (
                <ProfileEditBtn
                  onClick={() => setIsChangingPassword(true)}
                  disabled={loading}
                >
                  <PencilSimple size={16} weight="duotone" />
                  Cambiar contraseña
                </ProfileEditBtn>
              )}
            </ProfileCardHeader>

            <ProfileCardBody>
              {isChangingPassword ? (
                <ProfileForm>
                  <ProfileField>
                    <ProfileLabel>
                      <Lock size={16} weight="duotone" />
                      Contraseña actual
                    </ProfileLabel>
                    <ProfilePasswordInput>
                      <ProfileTextField
                        type={showCurrentPassword ? "text" : "password"}
                        value={passwordData.currentPassword}
                        onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                        placeholder="Tu contraseña actual"
                        disabled={loading}
                        fullWidth
                      />
                      <ProfilePasswordToggle
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        disabled={loading}
                      >
                        {showCurrentPassword ? <EyeSlash size={16} /> : <Eye size={16} />}
                      </ProfilePasswordToggle>
                    </ProfilePasswordInput>
                  </ProfileField>

                  <ProfileField>
                    <ProfileLabel>
                      <Lock size={16} weight="duotone" />
                      Nueva contraseña
                    </ProfileLabel>
                    <ProfilePasswordInput>
                      <ProfileTextField
                        type={showNewPassword ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                        placeholder="Nueva contraseña (min. 6 caracteres)"
                        disabled={loading}
                        fullWidth
                      />
                      <ProfilePasswordToggle
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        disabled={loading}
                      >
                        {showNewPassword ? <EyeSlash size={16} /> : <Eye size={16} />}
                      </ProfilePasswordToggle>
                    </ProfilePasswordInput>
                  </ProfileField>

                  <ProfileField>
                    <ProfileLabel>
                      <Lock size={16} weight="duotone" />
                      Confirmar nueva contraseña
                    </ProfileLabel>
                    <ProfilePasswordInput>
                      <ProfileTextField
                        type={showConfirmPassword ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                        placeholder="Confirma tu nueva contraseña"
                        disabled={loading}
                        fullWidth
                      />
                      <ProfilePasswordToggle
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        disabled={loading}
                      >
                        {showConfirmPassword ? <EyeSlash size={16} /> : <Eye size={16} />}
                      </ProfilePasswordToggle>
                    </ProfilePasswordInput>
                  </ProfileField>

                  <ProfileActions>
                    <ProfileBtn 
                      variant="primary"
                      onClick={handleChangePassword}
                      disabled={loading}
                    >
                      <Check size={16} weight="duotone" />
                      {loading ? 'Cambiando...' : 'Cambiar contraseña'}
                    </ProfileBtn>
                    <ProfileBtn 
                      variant="secondary"
                      onClick={handleCancelPasswordChange}
                      disabled={loading}
                    >
                      <X size={16} weight="duotone" />
                      Cancelar
                    </ProfileBtn>
                  </ProfileActions>
                </ProfileForm>
              ) : (
                <ProfileSecurityInfo>
                  <ProfileSecurityItem>
                    <ProfileSecurityIcon>
                      <Lock size={16} weight="duotone" />
                    </ProfileSecurityIcon>
                    <ProfileSecurityContent>
                      <ProfileSecurityLabel>Contraseña</ProfileSecurityLabel>
                      <ProfileSecurityValue>••••••••</ProfileSecurityValue>
                    </ProfileSecurityContent>
                    <ProfileSecurityStatus variant="good">
                      Segura
                    </ProfileSecurityStatus>
                  </ProfileSecurityItem>

                  <ProfileSecurityItem>
                    <ProfileSecurityIcon>
                      <Shield size={16} weight="duotone" />
                    </ProfileSecurityIcon>
                    <ProfileSecurityContent>
                      <ProfileSecurityLabel>Rol</ProfileSecurityLabel>
                      <ProfileSecurityValue>{profileData.position}</ProfileSecurityValue>
                    </ProfileSecurityContent>
                  </ProfileSecurityItem>
                </ProfileSecurityInfo>
              )}
            </ProfileCardBody>
          </ProfileModernCard>

        </ProfileGrid>
      </ProfileContentWrapper>
    </ProfilePageContainer>
  );
};

export default Profile;