// src/context/AuthContext.jsx - PANEL ADMIN CORREGIDO
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import * as authService from '../api/AuthService';
import ProfileService from '../api/profileService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      console.log("[AuthContext-ADMIN] Verificando autenticación...");
      
      // Verificar si hay token en localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.log("[AuthContext-ADMIN] No hay token, usuario no autenticado");
        setIsAuthenticated(false);
        setUser(null);
        return;
      }

      console.log("[AuthContext-ADMIN] Token encontrado, verificando con servidor...");
      const response = await authService.getCurrentUser();
      
      if (response?.authenticated && response?.user) {
        console.log("[AuthContext-ADMIN] Usuario autenticado:", response.user);
        
        // Obtener información actualizada del perfil para asegurar datos frescos
        try {
          const profileResponse = await ProfileService.getUserProfile(response.user.id);
          if (profileResponse.success) {
            // Combinar datos del token con datos actualizados del perfil
            const updatedUser = {
              ...response.user,
              ...profileResponse.data
            };
            
            console.log("[AuthContext-ADMIN] Usuario actualizado con datos de perfil:", {
              id: updatedUser.id,
              name: updatedUser.name,
              profilePicture: updatedUser.profilePicture,
              hasProfilePicture: !!updatedUser.profilePicture
            });
            
            setUser(updatedUser);
            setIsAuthenticated(true);
          } else {
            console.log("[AuthContext-ADMIN] No se pudo obtener perfil actualizado, usando datos del token");
            setUser(response.user);
            setIsAuthenticated(true);
          }
        } catch (profileError) {
          console.warn("[AuthContext-ADMIN] Error obteniendo perfil actualizado:", profileError);
          // Si falla obtener el perfil, usar los datos del token
          setUser(response.user);
          setIsAuthenticated(true);
        }
      } else {
        console.log("[AuthContext-ADMIN] Usuario no autenticado según servidor");
        setIsAuthenticated(false);
        setUser(null);
        // Limpiar token si la respuesta indica que no está autenticado
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.warn('[AuthContext-ADMIN] Error verificando autenticación:', error);
      setIsAuthenticated(false);
      setUser(null);
      
      // Si el error es 401 o 403, limpiar tokens
      if (error.status === 401 || error.status === 403) {
        console.log('[AuthContext-ADMIN] Limpiando token por error de auth');
        localStorage.removeItem('token');
      }
    } finally {
      console.log("[AuthContext-ADMIN] Verificación de auth completada");
      setLoading(false);
    }
  };

  useEffect(() => {
    // Delay para permitir que el splash se muestre
    const authTimer = setTimeout(() => {
      checkAuth();
    }, 2000);

    return () => clearTimeout(authTimer);
  }, []);

  const login = async (credentials) => {
    try {
      console.log("[AuthContext-ADMIN] Iniciando proceso de login...");
      setLoading(true);
      
      const user = await authService.login(credentials);
      console.log("[AuthContext-ADMIN] Login exitoso, usuario:", user);
      
      // Obtener información actualizada del perfil después del login
      try {
        const profileResponse = await ProfileService.getUserProfile(user.id);
        if (profileResponse.success) {
          // Combinar datos del login con datos actualizados del perfil
          const updatedUser = {
            ...user,
            ...profileResponse.data
          };
          
          console.log("[AuthContext-ADMIN] Usuario actualizado con datos de perfil después del login:", {
            id: updatedUser.id,
            name: updatedUser.name,
            profilePicture: updatedUser.profilePicture,
            hasProfilePicture: !!updatedUser.profilePicture
          });
          
          setUser(updatedUser);
          setIsAuthenticated(true);
          setLoading(false);
          
          return updatedUser;
        } else {
          console.log("[AuthContext-ADMIN] No se pudo obtener perfil actualizado después del login, usando datos del login");
          setUser(user);
          setIsAuthenticated(true);
          setLoading(false);
          
          return user;
        }
      } catch (profileError) {
        console.warn("[AuthContext-ADMIN] Error obteniendo perfil actualizado después del login:", profileError);
        // Si falla obtener el perfil, usar los datos del login
        setUser(user);
        setIsAuthenticated(true);
        setLoading(false);
        
        return user;
      }
    } catch (error) {
      console.error("[AuthContext-ADMIN] Error en login:", error);
      setLoading(false);
      
      // Asegurar que el estado esté limpio después de error
      setUser(null);
      setIsAuthenticated(false);
      
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log("[AuthContext-ADMIN] Iniciando cierre de sesión...");
      setLoading(true);
      
      await authService.logout();
      
      // Limpiar estado
      setUser(null);
      setIsAuthenticated(false);
      
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Sesión cerrada correctamente',
        showConfirmButton: false,
        timer: 2000,
        toast: true,
        background: '#ffffff',
        color: '#1f2937',
        iconColor: '#10b981'
      });
      
      // Esperar un momento antes de redirigir
      setTimeout(() => {
        setLoading(false);
        navigate('/login', { replace: true });
      }, 1000);
      
    } catch (error) {
      console.error("[AuthContext-ADMIN] Error al cerrar sesión:", error);
      
      // Limpiar estado local aunque falle el servidor
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
      
      navigate('/login', { replace: true });
    }
  };

  // Función para refrescar la autenticación sin loading
  const refreshAuth = async () => {
    try {
      console.log("[AuthContext-ADMIN] Refrescando autenticación...");
      
      // Primero verificar que el token sigue siendo válido
      const authResponse = await authService.getCurrentUser();
      
      if (authResponse?.authenticated && authResponse?.user) {
        // Si el token es válido, obtener los datos actualizados del usuario desde la base de datos
        const profileResponse = await ProfileService.getUserProfile(authResponse.user.id);
        
        if (profileResponse.success) {
          // Combinar los datos del token con los datos actualizados de la base de datos
          const updatedUser = {
            ...authResponse.user,
            ...profileResponse.data
          };
          
          console.log("[AuthContext-ADMIN] Usuario actualizado con datos de perfil:", {
            id: updatedUser.id,
            name: updatedUser.name,
            profilePicture: updatedUser.profilePicture,
            hasProfilePicture: !!updatedUser.profilePicture
          });
          
          console.log("[AuthContext-ADMIN] Usuario anterior vs nuevo:", {
            anterior: {
              id: authResponse.user.id,
              name: authResponse.user.name,
              profilePicture: authResponse.user.profilePicture
            },
            nuevo: {
              id: updatedUser.id,
              name: updatedUser.name,
              profilePicture: updatedUser.profilePicture
            }
          });
          
          setUser(updatedUser);
          setIsAuthenticated(true);
        } else {
          console.log("[AuthContext-ADMIN] No se pudo obtener perfil, usando datos del token");
          // Si no se puede obtener el perfil, usar los datos del token
          setUser(authResponse.user);
          setIsAuthenticated(true);
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.warn('[AuthContext-ADMIN] Error refrescando autenticación:', error);
      if (error.status === 401 || error.status === 403) {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem('token');
      }
    }
  };

  // Función para actualizar información del usuario después de cambios en el perfil
  const updateUserProfile = async () => {
    try {
      console.log("[AuthContext-ADMIN] Actualizando información del usuario...");
      
      if (!user?.id) {
        console.log("[AuthContext-ADMIN] No hay usuario para actualizar");
        return;
      }

      const profileResponse = await ProfileService.getUserProfile(user.id);
      
      if (profileResponse.success) {
        const updatedUser = {
          ...user,
          ...profileResponse.data
        };
        
        console.log("[AuthContext-ADMIN] Perfil del usuario actualizado:", {
          id: updatedUser.id,
          name: updatedUser.name,
          profilePicture: updatedUser.profilePicture,
          hasProfilePicture: !!updatedUser.profilePicture
        });
        
        setUser(updatedUser);
      } else {
        console.warn("[AuthContext-ADMIN] No se pudo actualizar el perfil del usuario");
      }
    } catch (error) {
      console.error("[AuthContext-ADMIN] Error actualizando perfil del usuario:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        logout,
        checkAuth,
        refreshAuth,
        updateUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};