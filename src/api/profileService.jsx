// src/services/profileService.js
import apiClient from './ApiClient';

class ProfileService {
  
  // Obtener perfil del usuario actual
  async getUserProfile(userId) {
    try {
      console.log('📸 [ProfileService] getUserProfile called for userId:', userId);
      const data = await apiClient.get(`/employees/${userId}`);
      
      console.log('📸 [ProfileService] getUserProfile response:', {
        hasData: !!data,
        profilePicture: data?.profilePicture,
        name: data?.name
      });
      
      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('📸 [ProfileService] Error fetching user profile:', error);
      return {
        success: false,
        error: error.message || 'Error al cargar el perfil'
      };
    }
  }

  // Actualizar perfil del usuario
  async updateUserProfile(userId, profileData) {
    try {
      // Filtrar campos que no deben ser enviados
      const allowedFields = {
        name: profileData.name,
        email: profileData.email,
        phoneNumber: profileData.phone, // Nota: el backend usa 'phoneNumber'
        address: profileData.location,
        // No enviamos password, se maneja por separado
      };

      const data = await apiClient.put(`/employees/${userId}`, allowedFields);
      
      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error updating user profile:', error);
      return {
        success: false,
        error: error.message || 'Error al actualizar el perfil'
      };
    }
  }

  // Cambiar contraseña
  async changePassword(userId, passwordData) {
    try {
      const requestBody = {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      };

      const data = await apiClient.patch(`/employees/${userId}/password`, requestBody);
      
      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error changing password:', error);
      return {
        success: false,
        error: error.message || 'Error al cambiar la contraseña'
      };
    }
  }

  // Subir foto de perfil
  async uploadProfilePicture(userId, file) {
    try {
      console.log('📸 [ProfileService] uploadProfilePicture called:', {
        userId,
        file: file ? {
          name: file.name,
          type: file.type,
          size: file.size
        } : 'No file'
      });
      
      const formData = new FormData();
      formData.append('profilePicture', file);
      
      console.log('📸 [ProfileService] FormData created, entries:', Array.from(formData.entries()));
      
      const data = await apiClient.post(`/employees/${userId}/profile-picture`, formData);
      
      console.log('📸 [ProfileService] Upload successful:', data);
      
      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('📸 [ProfileService] Upload error:', error);
      return {
        success: false,
        error: error.message || 'Error al subir la foto de perfil'
      };
    }
  }

  // Eliminar foto de perfil
  async deleteProfilePicture(userId) {
    try {
      const data = await apiClient.delete(`/employees/${userId}/profile-picture`);
      
      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error deleting profile picture:', error);
      return {
        success: false,
        error: error.message || 'Error al eliminar la foto de perfil'
      };
    }
  }
}

export default new ProfileService();