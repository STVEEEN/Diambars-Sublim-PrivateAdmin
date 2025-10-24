// src/hooks/useEmployees.js
import { useCallback, useEffect, useState } from 'react';
import employeeService from '../api/EmployeeService';
import profileService from '../api/profileService';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const handleError = (error, defaultMessage) => {
  const errorData = error.response?.data || {};
  const errorMessage = errorData.message || errorData.error || error.message || defaultMessage;

  console.error('Error:', { error, response: error.response, config: error.config });
  toast.error(errorMessage);
  throw new Error(errorMessage);
};

const useEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { updateUserProfile } = useAuth();

  // Función para formatear empleados con campos faltantes
  const formatEmployee = (employee) => {
    const formattedEmployee = {
      ...employee,
      id: employee._id || employee.id,
      phone: employee.phoneNumber || employee.phone || '', // Mapear phoneNumber a phone para compatibilidad
      phoneNumber: employee.phoneNumber || employee.phone || '', // Mantener ambos
      status: employee.active !== false ? 'active' : 'inactive', // Mapear active a status
      fullName: employee.name || '', // Alias para nombre completo
      duiFormatted: employee.dui || '', // DUI formateado si es necesario
      roleDisplay: employee.role ? employee.role.charAt(0).toUpperCase() + employee.role.slice(1) : 'Employee'
    };
    
    // Debug detallado para empleados inactivos
    if (employee.active === false) {
      console.log('🚨 [EMPLEADO INACTIVO ENCONTRADO]:', {
        id: formattedEmployee.id,
        name: formattedEmployee.name,
        originalActive: employee.active,
        formattedActive: formattedEmployee.active,
        originalStatus: employee.status,
        formattedStatus: formattedEmployee.status
      });
    }
    
    console.log('[formatEmployee] Empleado formateado:', {
      id: formattedEmployee.id,
      name: formattedEmployee.name,
      role: formattedEmployee.role,
      status: formattedEmployee.status,
      active: formattedEmployee.active
    });
    
    return formattedEmployee;
  };

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await employeeService.getAll();
      console.log("👉 Empleados recibidos:", data);

      if (!Array.isArray(data)) {
        throw new Error("Formato de empleados inválido");
      }

      const formattedEmployees = data.map(formatEmployee);
      
      // Debug: Contar empleados por estado
      const activeCount = formattedEmployees.filter(e => e.active === true).length;
      const inactiveCount = formattedEmployees.filter(e => e.active === false).length;
      
      console.log('📈 [EMPLEADOS CARGADOS] Resumen:', {
        total: formattedEmployees.length,
        activos: activeCount,
        inactivos: inactiveCount,
        empleadosInactivos: formattedEmployees.filter(e => e.active === false).map(e => ({
          name: e.name,
          active: e.active,
          status: e.status
        }))
      });
      
      setEmployees(formattedEmployees);

    } catch (err) {
      console.error("❌ Error al cargar empleados:", err);
      setError(err.message || "Error al cargar empleados");
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const createEmployee = useCallback(async (employeeData) => {
    try {
      const response = await employeeService.createEmployee(employeeData);
      toast.success('Empleado registrado exitosamente');
      await fetchEmployees(); // Recargar lista
      return response;
    } catch (error) {
      handleError(error, 'Error al crear empleado');
    }
  }, [fetchEmployees]);

  const updateEmployee = useCallback(async (id, employeeData) => {
    try {
      const response = await employeeService.updateEmployee(id, employeeData);
      toast.success('Empleado actualizado exitosamente');
      await fetchEmployees(); // Recargar lista
      return response;
    } catch (error) {
      handleError(error, 'Error al actualizar empleado');
    }
  }, [fetchEmployees]);

  const inactivateEmployee = useCallback(async (id) => {
    try {
      const response = await employeeService.inactivateEmployee(id);
      toast.success('Empleado inactivado exitosamente');
      await fetchEmployees(); // Recargar lista
      return response;
    } catch (error) {
      handleError(error, 'Error al inactivar empleado');
    }
  }, [fetchEmployees]);

  const hardDeleteEmployee = useCallback(async (id) => {
    try {
      const response = await employeeService.hardDeleteEmployee(id);
      toast.success('Empleado eliminado permanentemente');
      await fetchEmployees(); // Recargar lista
      return response;
    } catch (error) {
      handleError(error, 'Error al eliminar empleado');
    }
  }, [fetchEmployees]);

  // Función para validar datos antes de crear/actualizar
  const validateEmployeeData = useCallback((employeeData) => {
    return employeeService.validateEmployeeData(employeeData);
  }, []);

  const changePassword = useCallback(async (id, passwordData) => {
    try {
      const response = await employeeService.changePassword(id, passwordData);
      toast.success('Contraseña cambiada exitosamente');
      return response;
    } catch (error) {
      handleError(error, 'Error al cambiar contraseña');
    }
  }, []);

  const getEmployeeById = useCallback(async (id) => {
    try {
      const response = await employeeService.getEmployeeById(id);
      return formatEmployee(response);
    } catch (error) {
      handleError(error, 'Error al obtener empleado');
    }
  }, []);

  const updateOwnProfile = useCallback(async (employeeData) => {
    try {
      const response = await employeeService.updateOwnProfile(employeeData);
      toast.success('Perfil actualizado exitosamente');
      return response;
    } catch (error) {
      handleError(error, 'Error al actualizar perfil');
    }
  }, []);

  // Funciones para manejo de fotos de perfil
  const uploadProfilePicture = useCallback(async (id, file) => {
    try {
      console.log('[useEmployees] Iniciando subida de foto de perfil:', {
        employeeId: id,
        fileName: file?.name,
        fileSize: file?.size,
        fileType: file?.type
      });

      const response = await profileService.uploadProfilePicture(id, file);
      if (response.success) {
        console.log('[useEmployees] Foto de perfil subida exitosamente:', response.data);
        
        toast.success('Foto de perfil actualizada exitosamente');
        await fetchEmployees(); // Recargar lista para actualizar las fotos
        
        // Actualizar la información del usuario en el contexto de autenticación
        // Esto asegura que todos los componentes tengan la información actualizada
        try {
          await updateUserProfile();
          console.log('[useEmployees] Información del usuario actualizada en contexto de autenticación');
        } catch (updateError) {
          console.warn('[useEmployees] Error actualizando información del usuario:', updateError);
          // No lanzar error, la subida de la foto fue exitosa
        }
        
        return response.data;
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error('[useEmployees] Error subiendo foto de perfil:', error);
      handleError(error, 'Error al subir foto de perfil');
    }
  }, [fetchEmployees, updateUserProfile]);

  const deleteProfilePicture = useCallback(async (id) => {
    try {
      const response = await profileService.deleteProfilePicture(id);
      if (response.success) {
        toast.success('Foto de perfil eliminada exitosamente');
        await fetchEmployees(); // Recargar lista para actualizar las fotos
        return response.data;
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      handleError(error, 'Error al eliminar foto de perfil');
    }
  }, [fetchEmployees]);

  // Funciones específicas para empleados
  const getEmployeesByRole = useCallback(async (role) => {
    try {
      const data = await employeeService.getEmployeesByRole(role);
      return data.map(formatEmployee);
    } catch (error) {
      handleError(error, 'Error al obtener empleados por rol');
    }
  }, []);

  const getActiveEmployees = useCallback(async () => {
    try {
      const data = await employeeService.getActiveEmployees();
      return data.map(formatEmployee);
    } catch (error) {
      handleError(error, 'Error al obtener empleados activos');
    }
  }, []);

  const checkEmailAvailability = useCallback(async (email) => {
    // Como no hay endpoint específico, podemos hacer validación en frontend
    // o intentar crear y manejar el error de duplicado
    try {
      const allEmployees = await employeeService.getAll();
      const emailExists = allEmployees.some(emp => emp.email?.toLowerCase() === email.toLowerCase());
      return { available: !emailExists, message: emailExists ? 'Email ya está en uso' : 'Email disponible' };
    } catch (error) {
      console.error('Error al verificar email:', error);
      return { available: false, message: 'Error al verificar email' };
    }
  }, []);

  const checkDuiAvailability = useCallback(async (dui) => {
    // Como no hay endpoint específico, podemos hacer validación en frontend
    try {
      const allEmployees = await employeeService.getAll();
      const duiExists = allEmployees.some(emp => emp.dui === dui);
      return { available: !duiExists, message: duiExists ? 'DUI ya está en uso' : 'DUI disponible' };
    } catch (error) {
      console.error('Error al verificar DUI:', error);
      return { available: false, message: 'Error al verificar DUI' };
    }
  }, []);

  // Funciones de estadísticas
  const getEmployeeStats = useCallback(() => {
    const total = employees.length;
    const active = employees.filter(e => e.active === true).length;
    const inactive = employees.filter(e => e.active === false).length;
    
    // Estadísticas por rol
    const managers = employees.filter(e => e.role?.toLowerCase() === 'manager').length;
    const employeesCount = employees.filter(e => e.role?.toLowerCase() === 'employee').length;
    const delivery = employees.filter(e => e.role?.toLowerCase() === 'delivery').length;

    return { 
      total, 
      active, 
      inactive,
      roles: {
        managers,
        employees: employeesCount,
        delivery
      }
    };
  }, [employees]);

  // Funciones de filtrado útiles
  const getEmployeesByStatus = useCallback((status) => {
    if (status === 'active') {
      return employees.filter(employee => employee.active === true);
    } else if (status === 'inactive') {
      return employees.filter(employee => employee.active === false);
    }
    return employees;
  }, [employees]);

  const searchEmployees = useCallback((searchTerm) => {
    const term = searchTerm.toLowerCase();
    return employees.filter(employee => 
      employee.name?.toLowerCase().includes(term) ||
      employee.email?.toLowerCase().includes(term) ||
      employee.phoneNumber?.includes(term) ||
      employee.dui?.includes(term) ||
      employee.role?.toLowerCase().includes(term)
    );
  }, [employees]);

  // Cargar empleados al inicializar
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  return {
    employees,
    loading,
    error,
    fetchEmployees,
    createEmployee,
    updateEmployee,
    inactivateEmployee,
    hardDeleteEmployee,
    changePassword,
    getEmployeeById,
    getEmployeesByRole,
    getActiveEmployees,
    checkEmailAvailability,
    checkDuiAvailability,
    validateEmployeeData,
    getEmployeeStats,
    getEmployeesByStatus,
    searchEmployees,
    updateOwnProfile,
    uploadProfilePicture,
    deleteProfilePicture
  };
};

export default useEmployees;