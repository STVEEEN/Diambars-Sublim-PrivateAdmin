import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Warning, 
  CheckCircle,
  CircleNotch,
  PaperPlaneTilt
} from '@phosphor-icons/react';
import { usePasswordRecovery } from '../../hooks/usePasswordRecovery';
import './CodeConfirmationPage.css';

const CodeConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Obtener el email del estado de navegación
  const stateEmail = location.state?.email;
  const fromRecovery = location.state?.fromRecovery;

  const {
    email,
    setEmail,
    code,
    setCode,
    isSubmitting,
    error,
    timer,
    setTimer,
    canResend,
    setCanResend,
    handleVerifyCode,
    handleResendCode,
    handleInputChange,
    handleKeyDown
  } = usePasswordRecovery();

  // Verificar que venimos del flujo correcto
  useEffect(() => {
    if (!stateEmail && !email) {
      console.warn('No hay email disponible, redirigiendo a recovery');
      navigate('/recovery-password', {
        state: { 
          error: 'Debes ingresar tu email primero' 
        }
      });
      return;
    }

    if (stateEmail && stateEmail !== email) {
      setEmail(stateEmail);
    }
  }, [stateEmail, email, setEmail, navigate]);

  // Inicializar el estado cuando se carga la página
  useEffect(() => {
    if (email && timer === 30 && !canResend) {
      // Al cargar la página por primera vez, permitir reenvío inmediatamente
      setCanResend(true);
      setTimer(0);
    }
  }, [email]);

  const onSubmit = async (e) => {
    e.preventDefault();
    
    // Validar que el código esté completo
    if (code.length !== 6 || code.some(digit => !digit)) {
      return;
    }

    // El hook ya maneja la navegación internamente
    await handleVerifyCode();
  };

  const handleBack = () => {
    // Decidir a dónde volver según de dónde venimos
    if (fromRecovery) {
      navigate('/recovery-password');
    } else {
      navigate('/recovery-password');
    }
  };

  const handleResend = async () => {
    if (!canResend || isSubmitting) return;
    
    // Bloquear inmediatamente y mostrar "Enviando..."
    setCanResend(false);
    
    try {
      // Llamar a la función del hook
      await handleResendCode();
      
      // Después de reenviar exitosamente, iniciar el contador de 30 segundos
      startCountdown();
      
    } catch (error) {
      // Si hay error, permitir reenvío inmediatamente
      setCanResend(true);
      setTimer(0);
    }
  };

  // Ref para manejar el intervalo del contador
  const countdownRef = useRef(null);

  // Función optimizada para iniciar el countdown
  const startCountdown = () => {
    // Limpiar intervalo anterior si existe
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }
    
    setCanResend(false);
    setTimer(30);
    
    let currentTime = 30;
    countdownRef.current = setInterval(() => {
      currentTime -= 1;
      setTimer(currentTime);
      
      if (currentTime <= 0) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
        setCanResend(true);
        setTimer(0);
      }
    }, 1000);
  };

  // Limpiar intervalo al desmontar el componente
  useEffect(() => {
    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, []);

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
              <div className="login-brand-tagline">Verificación de Código</div>
            </div>
          </div>
        </div>

        {/* Sección derecha - Formulario */}
        <div className="diambars-login-form-section">
          <div className="login-form-container">
            <div className="login-form-header">
              <h2 className="login-form-title">Verifica tu código</h2>
              <p className="login-form-description">
                Ingresa el código de 6 dígitos enviado a tu correo
              </p>
              
              {email && (
                <div className="login-email-display">
                  <span className="login-email-text">{email}</span>
                </div>
              )}
            </div>
            
            {error && (
              <div className="login-form-error">
                <Warning className="login-error-icon" weight="fill" />
                {error}
              </div>
            )}
            
            <form className='code-form' onSubmit={onSubmit} noValidate>
              <div className="code-input-group">
                {[...Array(6)].map((_, index) => (
                  <input
                    key={index}
                    id={`code-input-${index}`}
                    type="text"
                    inputMode='numeric'
                    maxLength={1}
                    value={code[index] || ''}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={(e) => {
                      e.preventDefault();
                      const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
                      if (pasteData.length > 0) {
                        // Crear un nuevo array de código con los datos pegados
                        const newCode = ['', '', '', '', '', ''];
                        for (let i = 0; i < pasteData.length && i < 6; i++) {
                          newCode[i] = pasteData[i];
                        }
                        // Actualizar el estado del código directamente
                        setCode(newCode);
                        // Enfocar el último input llenado
                        const nextIndex = Math.min(pasteData.length - 1, 5);
                        setTimeout(() => {
                          const nextInput = document.getElementById(`code-input-${nextIndex}`);
                          if (nextInput) nextInput.focus();
                        }, 0);
                      }
                    }}
                    className="code-input"
                    autoComplete="off"
                  />
                ))}
              </div>
              
              <button
                type="submit"
                className="code-submit-button"
                disabled={isSubmitting || code.length !== 6 || code.some(digit => !digit)}
              >
                {isSubmitting ? (
                  <CircleNotch className="code-button-spinner" weight="bold" />
                ) : (
                  <>
                    <span>Verificar código</span>
                    <CheckCircle className="code-button-icon" weight="bold" />
                  </>
                )}
              </button>
            </form>

            <div className="code-form-footer">
              <div className="code-divider">
                <span className="code-divider-text">¿No recibiste el código?</span>
              </div>
              <div 
                className={`code-resend-text ${!canResend ? 'disabled' : ''}`}
                onClick={canResend && !isSubmitting ? handleResend : undefined}
                style={{ 
                  cursor: canResend && !isSubmitting ? 'pointer' : 'default',
                  color: '#032CA6',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  textAlign: 'center',
                  padding: '8px',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease',
                  opacity: canResend && !isSubmitting ? 1 : 0.7
                }}
                onMouseEnter={(e) => {
                  if (canResend && !isSubmitting) {
                    e.target.style.backgroundColor = 'rgba(3, 44, 166, 0.05)';
                    e.target.style.transform = 'translateY(-1px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (canResend && !isSubmitting) {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.transform = 'translateY(0)';
                  }
                }}
              >
                {isSubmitting ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <CircleNotch size={16} weight="bold" style={{ animation: 'spin 1s linear infinite' }} />
                    Enviando...
                  </span>
                ) : (
                  <span>
                    {canResend ? 'Reenviar código' : `Reenviar en ${timer}s`}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeConfirmationPage;