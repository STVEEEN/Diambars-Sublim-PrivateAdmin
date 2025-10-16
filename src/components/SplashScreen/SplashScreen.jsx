import React, { useEffect, useState } from 'react';
import './SplashScreen.css';

const SplashScreen = ({ onComplete }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [shouldShow, setShouldShow] = useState(true);
  const [isFirstTime, setIsFirstTime] = useState(true);

  useEffect(() => {
    // Verificar si ya se mostró el splash screen en esta sesión
    const splashShown = sessionStorage.getItem('diambars-splash-shown');
    
    if (splashShown === 'true') {
      // Si ya se mostró, es un refresh - usar duración mínima
      setIsFirstTime(false);
      console.log("[SplashScreen] Refresh detectado - usando duración mínima");
    } else {
      // Primera vez - usar duración completa
      setIsFirstTime(true);
      console.log("[SplashScreen] Primera vez - usando duración completa");
    }

    // Marcar que el splash screen se mostró en esta sesión
    sessionStorage.setItem('diambars-splash-shown', 'true');

    // Configurar duraciones según el tipo de carga
    const loadDelay = isFirstTime ? 200 : 50; // Delay inicial
    const progressSpeed = isFirstTime ? 2 : 8; // Velocidad de progreso
    const progressInterval = isFirstTime ? 200 : 50; // Intervalo de progreso
    const totalDuration = isFirstTime ? 2500 : 800; // Duración total

    // Animación de carga inicial
    const loadTimer = setTimeout(() => {
      setIsLoaded(true);
    }, loadDelay);

    // Simulación de progreso de carga
    const progressTimer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return prev + progressSpeed;
      });
    }, progressInterval);

    // Completar splash después de la animación
    const navigationTimer = setTimeout(() => {
      if (onComplete) {
        onComplete();
      }
    }, totalDuration);

    return () => {
      clearTimeout(loadTimer);
      clearTimeout(navigationTimer);
      clearInterval(progressTimer);
    };
  }, [onComplete, isFirstTime]);

  // Si no debe mostrarse, retornar null (no renderizar nada)
  if (!shouldShow) {
    return null;
  }

  return (
    <div className={`diambars-welcome-screen ${!isFirstTime ? 'splash-quick' : ''}`}>
      {/* Overlay suave adicional */}
      <div className="background-overlay"></div>
      
      {/* Partículas de fondo */}
      <div className="background-particles">
        {[...Array(20)].map((_, i) => (
          <div key={i} className={`particle particle-${i + 1}`}></div>
        ))}
      </div>

      {/* Contenedor principal */}
      <div className={`diambars-main-container ${isLoaded ? 'loaded' : ''}`}>
        
        {/* Logo y contenido principal */}
        <div className="diambars-logo-section">
          <div className="diambars-logo-wrapper">
            <div className="logo-glow"></div>
            <img
              src="/logo.png"
              alt="Logo Diambars"
              className="diambars-logo-img"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="diambars-logo-placeholder" style={{ display: 'none' }}>
              D
            </div>
          </div>
          
          <div className="diambars-text-content">
            <h1 className="diambars-main-logo">
              <span className="letter">D</span>
              <span className="letter">I</span>
              <span className="letter">A</span>
              <span className="letter">M</span>
              <span className="letter">B</span>
              <span className="letter">A</span>
              <span className="letter">R</span>
              <span className="letter">S</span>
            </h1>
            <p className="diambars-sublogo">sublimado</p>
          </div>
        </div>

        {/* Barra de progreso */}
        <div className="progress-section">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="loading-text">
            {isFirstTime ? 'Cargando experiencia...' : 'Conectando...'}
          </div>
        </div>

        {/* Elementos decorativos */}
        <div className="decorative-elements">
          <div className="floating-shape shape-1"></div>
          <div className="floating-shape shape-2"></div>
          <div className="floating-shape shape-3"></div>
        </div>
      </div>

      {/* Overlay de transición */}
      <div className="transition-overlay"></div>
    </div>
  );
};

export default SplashScreen;