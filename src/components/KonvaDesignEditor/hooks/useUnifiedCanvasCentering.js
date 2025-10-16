// hooks/useUnifiedCanvasCentering.js
// Hook unificado para centrado y escalado del canvas - COPIADO DEL EDITOR PÚBLICO QUE FUNCIONA

import { useState, useEffect, useCallback, useMemo } from 'react';
import { CANVAS_CONFIG } from '../constants/canvasConfig';

export const useUnifiedCanvasCentering = (image, containerRef) => {
  // ✅ SIMPLIFICADO: Stage fijo del tamaño del canvas, centrado automáticamente
  const [stageScale, setStageScale] = useState(1);
  const [stagePosition, setStagePosition] = useState({ x: 0, y: 0 });

  console.log('🎯 [useUnifiedCanvasCentering] Stage simplificado:', {
    stageScale: 1,
    stagePosition: { x: 0, y: 0 },
    canvasSize: { width: CANVAS_CONFIG.width, height: CANVAS_CONFIG.height },
    note: 'Stage fijo del tamaño del canvas, centrado con CSS'
  });

  // Funciones de control de zoom (SIMPLIFICADAS PARA STAGE FIJO)
  const zoomIn = useCallback(() => {
    setStageScale(prev => Math.min(prev * 1.2, 3));
  }, []);

  const zoomOut = useCallback(() => {
    setStageScale(prev => Math.max(prev / 1.2, 0.1));
  }, []);

  const resetZoom = useCallback(() => {
    setStageScale(1);
    setStagePosition({ x: 0, y: 0 });
  }, []);

  const fitToContainer = useCallback(() => {
    setStageScale(1);
    setStagePosition({ x: 0, y: 0 });
  }, []);

  const centerCanvas = useCallback(() => {
    setStagePosition({ x: 0, y: 0 });
  }, []);

  const handleWheel = useCallback((e) => {
    e.evt.preventDefault();
    
    const scaleBy = 1.1;
    const stage = e.target.getStage();
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    
    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };
    
    const newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;
    const clampedScale = Math.max(0.1, Math.min(3, newScale));
    
    setStageScale(clampedScale);
    setStagePosition({
      x: pointer.x - mousePointTo.x * clampedScale,
      y: pointer.y - mousePointTo.y * clampedScale,
    });
  }, []);

  return {
    // Estado del stage (SIMPLIFICADO)
    stageScale,
    stagePosition,
    
    // Funciones de control
    zoomIn,
    zoomOut,
    resetZoom,
    fitToContainer,
    centerCanvas,
    
    // Funciones de utilidad
    setStageScale,
    setStagePosition,
    handleWheel
  };
};
