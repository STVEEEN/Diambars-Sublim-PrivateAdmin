import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Envelope, 
  Lock, 
  Warning, 
  CheckCircle,
  ArrowRight, 
  CircleNotch 
} from '@phosphor-icons/react';
import { useLogin } from '../../hooks/useLogin';
import './Login.css';

const LoginPage = () => {
  const location = useLocation();
  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    onSubmit
  } = useLogin();

  const successMessage = location.state?.message;
  const messageType = location.state?.type;

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

  const handleFormSubmit = async (data) => {
    await onSubmit(data);
  };

  return (
    <div className="diambars-login-container">
      {/* Partículas de fondo */}
      <div className="diambars-login-particles">
        <div className="login-particle login-particle-1"></div>
        <div className="login-particle login-particle-2"></div>
        <div className="login-particle login-particle-3"></div>
        <div className="login-particle login-particle-4"></div>
        <div className="login-particle login-particle-5"></div>
        <div className="login-particle login-particle-6"></div>
        <div className="login-particle login-particle-7"></div>
        <div className="login-particle login-particle-8"></div>
        <div className="login-particle login-particle-9"></div>
        <div className="login-particle login-particle-10"></div>
        <div className="login-particle login-particle-11"></div>
        <div className="login-particle login-particle-12"></div>
        <div className="login-particle login-particle-13"></div>
        <div className="login-particle login-particle-14"></div>
        <div className="login-particle login-particle-15"></div>
        <div className="login-particle login-particle-16"></div>
        <div className="login-particle login-particle-17"></div>
        <div className="login-particle login-particle-18"></div>
        <div className="login-particle login-particle-19"></div>
        <div className="login-particle login-particle-20"></div>
      </div>

      {/* Card principal */}
      <div className="diambars-login-card">
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
              <div className="login-brand-tagline">Acceso Administrativo</div>
            </div>
          </div>
        </div>

        {/* Sección derecha - Formulario */}
        <div className="diambars-login-form-section">
          <div className="login-form-container">
            <div className="login-form-header">
              <h2 className="login-form-title">Iniciar Sesión</h2>
              <p className="login-form-description">Accede a tu panel administrativo</p>
            </div>
            
            {/* Mensaje de éxito de recuperación */}
            {successMessage && messageType === 'success' && (
              <div className="login-form-success">
                <CheckCircle className="login-success-icon" weight="fill" />
                {successMessage}
              </div>
            )}
            
            {errors.root && (
              <div className="login-form-error">
                <Warning className="login-error-icon" weight="fill" />
                {errors.root.message}
              </div>
            )}
            
            <form className='login-form' onSubmit={handleSubmit(handleFormSubmit)} noValidate>
              <div className="login-form-group">
                <label className="login-form-label">Correo electrónico</label>
                <div className="login-input-wrapper">
                  <Envelope className="login-input-icon" weight="duotone" />
                  <input
                    type="email"
                    placeholder="Correo electrónico"
                    className={`login-form-input ${errors.email ? 'login-input-error' : ''}`}
                    {...register('email', {
                      required: 'Este campo es requerido',
                      pattern: {
                        value: /^\S+@\S+\.\S+$/,
                        message: 'Email inválido'
                      }
                    })}
                  />
                </div>
                {errors.email && (
                  <div className="login-input-error-message">
                    <Warning className="login-error-icon-small" weight="fill" />
                    <span>{errors.email.message}</span>
                  </div>
                )}
              </div>
              
              <div className="login-form-group">
                <label className="login-form-label">Contraseña</label>
                <div className="login-input-wrapper">
                  <Lock className="login-input-icon" weight="duotone" />
                  <input
                    type="password"
                    placeholder="Contraseña"
                    className={`login-form-input ${errors.password ? 'login-input-error' : ''}`}
                    {...register('password', {
                      required: 'Este campo es requerido',
                      minLength: {
                        value: 6,
                        message: 'Mínimo 6 caracteres'
                      }
                    })}
                  />
                </div>
                {errors.password && (
                  <div className="login-input-error-message">
                    <Warning className="login-error-icon-small" weight="fill" />
                    <span>{errors.password.message}</span>
                  </div>
                )}
              </div>
              
              <Link to="/recovery-password" className="login-recovery-link">
                ¿Olvidaste tu contraseña?
              </Link>
              
              <button
                type="submit"
                className="login-submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <CircleNotch className="login-button-spinner" weight="bold" />
                ) : (
                  <>
                    <span>Iniciar sesión</span>
                    <ArrowRight className="login-button-icon" weight="bold" />
                  </>
                )}
              </button>
            </form>

            <div className="login-form-footer">
              <div className="login-divider">
                <span className="login-divider-text">Acceso autorizado</span>
              </div>
              <p className="login-footer-text">
                Portal administrativo con autenticación de múltiples factores y encriptación.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;