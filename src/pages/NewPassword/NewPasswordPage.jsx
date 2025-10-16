import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, 
  Lock, 
  Eye,
  EyeSlash,
  Warning, 
  CheckCircle,
  CircleNotch,
  ShieldCheck
} from '@phosphor-icons/react';
import { usePasswordRecovery } from '../../hooks/usePasswordRecovery';
import './NewPasswordPage.css';

const NewPasswordPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    handleResetPassword,
    isSubmitting,
    error,
    verificationToken
  } = usePasswordRecovery();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  // Obtener datos del estado de navegación
  const stateEmail = location.state?.email;
  const stateToken = location.state?.verificationToken;
  const fromCodeConfirmation = location.state?.fromCodeConfirmation;
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();

  const requirements = [
    { id: 'length', label: 'Al menos 8 caracteres', regex: /.{8,}/ },
    { id: 'letters', label: 'Al menos una mayúscula y una minúscula', regex: /^(?=.*[a-z])(?=.*[A-Z])/ },
    { id: 'number', label: 'Al menos un número', regex: /[0-9]/ },
    { id: 'special', label: 'Al menos un carácter especial', regex: /[!@#$%^&*]/ }
  ];

  const password = watch("password");
  
  // Verificar que tenemos el token de verificación
  useEffect(() => {
    const currentToken = stateToken || verificationToken;
    
    if (!currentToken) {
      console.error('No se encontró token de verificación - Redirigiendo...');
      navigate('/code-confirmation', {
        state: { 
          error: 'Debes verificar el código primero',
          email: stateEmail 
        }
      });
      return;
    }

    // Verificar que venimos del flujo correcto
    if (!fromCodeConfirmation && !verificationToken) {
      console.warn('Acceso directo a nueva contraseña sin verificación');
      navigate('/recovery-password', {
        state: { 
          error: 'Debes completar el proceso de verificación' 
        }
      });
      return;
    }
  }, [stateToken, verificationToken, fromCodeConfirmation, stateEmail, navigate]);

  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }
    
    const metRequirements = requirements.filter(req => 
      req.regex.test(password)
    ).length;
    
    setPasswordStrength((metRequirements / requirements.length) * 100);
  }, [password, requirements]);

  // Agregar/quitar clase al body para controlar el scroll
  useEffect(() => {
    // Agregar clase al body y html cuando se monte el componente
    document.body.classList.add('login-page');
    document.documentElement.classList.add('login-page');

    // Cleanup: quitar la clase cuando se desmonte el componente
    return () => {
      document.body.classList.remove('login-page');
      document.documentElement.classList.remove('login-page');
    };
  }, []);

  const getStrengthColor = () => {
    if (passwordStrength <= 25) return '#dc2626';
    if (passwordStrength <= 50) return '#f59e0b';
    if (passwordStrength <= 75) return '#eab308';
    return '#10b981';
  };

  const getStrengthText = () => {
    if (passwordStrength <= 25) return 'Muy débil';
    if (passwordStrength <= 50) return 'Débil';
    if (passwordStrength <= 75) return 'Media';
    return 'Fuerte';
  };

  const onSubmit = async (data) => {
    const currentToken = stateToken || verificationToken;
    
    if (!currentToken) {
      console.error('No hay token de verificación');
      navigate('/code-confirmation', {
        state: { 
          error: 'Token de verificación expirado',
          email: stateEmail 
        }
      });
      return;
    }

    // El hook ya maneja la navegación internamente
    await handleResetPassword(data.password);
  };

  const handleBack = () => {
    navigate('/code-confirmation', {
      state: { 
        email: stateEmail,
        fromRecovery: true 
      }
    });
  };

  return (
    <div className="diambars-login-container">
      {/* Partículas de fondo */}
      <div className="diambars-login-particles">
        {[...Array(15)].map((_, i) => (
          <div key={i} className={`login-particle login-particle-${i + 1}`}></div>
        ))}
      </div>

      {/* Card principal */}
      <div className="diambars-login-card">
        {/* Navegación dentro del card */}
        <button 
          className="recovery-back-button"
          onClick={handleBack}
          aria-label="Volver"
        >
          <ArrowLeft size={24} weight="bold" />
        </button>

        {/* Sección izquierda - Branding */}
        <div className="diambars-login-brand">
          <div className="login-brand-content">
            <div className="login-logo-wrapper">
              <div className="login-logo-glow"></div>
              <img 
                src="/logo.png" 
                alt="Logo Diambars" 
                className="login-logo-img"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="login-logo-placeholder" style={{ display: 'none' }}>
                D
              </div>
            </div>
            
            <div className="login-brand-text">
              <h1 className="login-brand-title">DIAMBARS</h1>
              <p className="login-brand-subtitle">sublimado</p>
              <div className="login-brand-tagline">Nueva Contraseña</div>
            </div>
          </div>
        </div>

        {/* Sección derecha - Formulario */}
        <div className="diambars-login-form-section">
          <div className="login-form-container">
            <div className="login-form-header">
              <h2 className="login-form-title">Crea tu nueva contraseña</h2>
            </div>
            
            {error && (
              <div className="login-form-error">
                <Warning className="login-error-icon" weight="fill" />
                {error}
              </div>
            )}
            
            <form className='login-form' onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="login-form-group">
                <label className="login-form-label">Nueva contraseña</label>
                <div className="login-input-wrapper">
                  <Lock className="login-input-icon" weight="duotone" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={`login-form-input ${errors.password ? 'login-input-error' : ''}`}
                    {...register('password', {
                      required: 'Este campo es requerido',
                      minLength: {
                        value: 8,
                        message: 'Mínimo 8 caracteres'
                      },
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
                        message: 'Debe incluir mayúscula, minúscula, número y carácter especial'
                      }
                    })}
                  />
                  <div
                    className="newpass-toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ cursor: 'pointer' }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setShowPassword(!showPassword);
                      }
                    }}
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword ? (
                      <EyeSlash size={20} weight="duotone" />
                    ) : (
                      <Eye size={20} weight="duotone" />
                    )}
                  </div>
                </div>
                
                {/* Contenedor que siempre reserva espacio */}
                <div className="newpass-error-placeholder">
                  {errors.password && (
                    <div className="login-input-error-message">
                      <Warning className="login-error-icon-small" weight="fill" />
                      <span>{errors.password.message}</span>
                    </div>
                  )}
                </div>

                {/* Contenedor que siempre reserva espacio */}
                <div className="newpass-strength-placeholder">
                  {password && (
                    <div className="newpass-strength-indicator">
                      <div className="newpass-strength-bar">
                        <div 
                          className="newpass-strength-fill"
                          style={{
                            width: `${passwordStrength}%`,
                            backgroundColor: getStrengthColor()
                          }}
                        />
                      </div>
                      <span className="newpass-strength-text" style={{ color: getStrengthColor() }}>
                        {getStrengthText()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="login-form-group">
                <label className="login-form-label">Confirmar contraseña</label>
                <div className="login-input-wrapper">
                  <Lock className="login-input-icon" weight="duotone" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={`login-form-input ${errors.confirmPassword ? 'login-input-error' : ''}`}
                    {...register('confirmPassword', {
                      required: 'Este campo es requerido',
                      validate: value => 
                        value === password || 'Las contraseñas no coinciden'
                    })}
                  />
                  <div
                    className="newpass-toggle-password"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{ cursor: 'pointer' }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setShowConfirmPassword(!showConfirmPassword);
                      }
                    }}
                    aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showConfirmPassword ? (
                      <EyeSlash size={20} weight="duotone" />
                    ) : (
                      <Eye size={20} weight="duotone" />
                    )}
                  </div>
                </div>
                
                {/* Contenedor que siempre reserva espacio */}
                <div className="newpass-error-placeholder">
                  {errors.confirmPassword && (
                    <div className="login-input-error-message">
                      <Warning className="login-error-icon-small" weight="fill" />
                      <span>{errors.confirmPassword.message}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="newpass-requirements">
                <h4 className="newpass-requirements-title">Requisitos de la contraseña:</h4>
                <div className="newpass-requirements-list">
                  {requirements.map((req) => (
                    <div 
                      key={req.id} 
                      className={`newpass-requirement ${password && req.regex.test(password) ? 'met' : ''}`}
                    >
                      <CheckCircle 
                        className="newpass-requirement-icon" 
                        weight={password && req.regex.test(password) ? "fill" : "regular"} 
                      />
                      <span className="newpass-requirement-text">{req.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <button
                type="submit"
                className="login-submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <CircleNotch className="login-button-spinner" weight="bold" />
                ) : (
                  <>
                    <span>Guardar nueva contraseña</span>
                    <ShieldCheck className="login-button-icon" weight="bold" />
                  </>
                )}
              </button>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPasswordPage;