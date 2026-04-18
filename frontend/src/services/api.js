import httpClient from '../utils/httpClient';

// Authentication API
export const authApi = {
  login: (credentials) => httpClient.post('/Authentication/Login', credentials),
  register: (userData) => httpClient.post('/Authentication/Register', userData),
  logout: () => httpClient.post('/Authentication/Logout'),
  refreshToken: () => httpClient.post('/Authentication/Refresh'),
  getCurrentUser: () => httpClient.get('/Authentication/Me')
};

// Stats API
export const statsApi = {
  getStats: () => httpClient.get('/Stats')
};

// Discipline API
export const disciplineApi = {
  getAll: () => httpClient.get('/Discipline'),
  create: (data) => httpClient.post('/Discipline', data),
  update: (id, data) => httpClient.patch(`/Discipline/${id}`, data),
  delete: (id) => httpClient.delete(`/Discipline/${id}`)
};

// WeaponType API - Updated to match your ASP.NET Core endpoints
export const weaponTypeApi = {
  // Get all weapons (no parameters)
  getAll: () => httpClient.get('/WeaponType'),
  // Get weapon by ID
  getById: (id) => httpClient.get(`/WeaponType/${id}`),
  // Get weapons filtered by discipline (if needed)
  getByDiscipline: (disciplineId) => httpClient.get(`/WeaponType?disciplineId=${disciplineId}`),
  // Create new weapon
  create: (data) => httpClient.post('/WeaponType', data),
  // Delete weapon (no update endpoint available)
  delete: (id) => httpClient.delete(`/WeaponType/${id}`)
};

// ExerciseTemplate API - Fixed to match your actual controller signature
export const exerciseTemplateApi = {
  getAll: () => httpClient.get('/exercise-templates'),
  create: (data) => httpClient.post('/exercise-templates', data),
  
  // Update - might not be available, but keeping the query parameter approach
  update: (id, data) => {
    console.warn('ExerciseTemplate UPDATE: This endpoint might not exist in your API');
    return httpClient.patch(`/exercise-templates?id=${id}`, data);
  },
  
  // Delete - Fixed to match your controller: DELETE /exercise-templates?id={id}
  delete: (id) => {
    console.log('ExerciseTemplate DELETE: Attempting to delete template with ID:', id);
    // Your controller expects: DELETE /exercise-templates?id={id} (query parameter, not path)
    return httpClient.delete(`/exercise-templates?id=${id}`);
  }
};

// ShootingSession API - Fixed to work with your actual API structure
export const shootingSessionApi = {
  getAll: () => {
    console.log('ShootingSession API: Fetching all sessions');
    return httpClient.get('/ShootingSession');
  },
  
  getById: (id) => {
    console.log('ShootingSession API: Fetching session by ID:', id);
    
    // Since your API doesn't have a specific getById endpoint,
    // we'll get all sessions and filter client-side
    return httpClient.get('/ShootingSession').then(response => {
      console.log('ShootingSession API: Got all sessions, filtering for ID:', id);
      console.log('ShootingSession API: All sessions:', response.data);
      
      const sessions = response.data || [];
      const session = sessions.find(s => s.id === id);
      
      if (!session) {
        throw new Error(`Session with ID ${id} not found`);
      }
      
      console.log('ShootingSession API: Found session:', session);
      
      // Return in the same format as the original response
      return {
        ...response,
        data: session
      };
    });
  },
  
  create: (data) => {
    console.log('ShootingSession API: Creating session with raw data:', data);
    
    // GUID validation function
    const validateGuid = (value, fieldName) => {
      if (value === null || value === undefined || value === '') {
        throw new Error(`${fieldName} is required and cannot be empty`);
      }
      
      // Convert to string if not already
      const guidString = value.toString();
      
      // Basic GUID format validation (8-4-4-4-12 characters)
      const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!guidRegex.test(guidString)) {
        throw new Error(`${fieldName} must be a valid GUID, received: "${guidString}" (type: ${typeof value})`);
      }
      
      return guidString;
    };
    
    // Prepare session data with GUID validation
    const sessionData = {
      disciplineId: validateGuid(data.disciplineId, 'disciplineId'),
      weaponTypeId: validateGuid(data.weaponTypeId, 'weaponTypeId'),
      shots: (data.shots || []).map(shot => ({
        x: parseFloat(shot.x),
        y: parseFloat(shot.y),
        score: parseFloat(shot.score)
      })),
      exerciseTemplateId: data.exerciseTemplateId ? validateGuid(data.exerciseTemplateId, 'exerciseTemplateId') : null,
      // Send trainingDuration as a simple string in HH:MM:SS format
      trainingDuration: data.trainingDuration || "00:00:00"
    };
    
    console.log('ShootingSession API: Final data for API (with validated GUIDs and TimeSpan):', sessionData);
    console.log('ShootingSession API: Data types check:', {
      disciplineId: typeof sessionData.disciplineId,
      weaponTypeId: typeof sessionData.weaponTypeId,
      exerciseTemplateId: typeof sessionData.exerciseTemplateId,
      trainingDuration: typeof sessionData.trainingDuration,
      trainingDurationValue: sessionData.trainingDuration,
      shotsCount: sessionData.shots.length
    });
    
    return httpClient.post('/ShootingSession', sessionData);
  },
  
  update: (id, data) => {
    console.log('ShootingSession API: Updating session ID:', id, 'with data:', data);
    
    // GUID validation function
    const validateGuid = (value, fieldName) => {
      if (value === null || value === undefined || value === '') {
        throw new Error(`${fieldName} is required and cannot be empty`);
      }
      
      // Convert to string if not already
      const guidString = value.toString();
      
      // Basic GUID format validation (8-4-4-4-12 characters)
      const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!guidRegex.test(guidString)) {
        throw new Error(`${fieldName} must be a valid GUID, received: "${guidString}" (type: ${typeof value})`);
      }
      
      return guidString;
    };
    
    // Transform data with GUID validation
    const sessionData = {
      disciplineId: validateGuid(data.disciplineId, 'disciplineId'),
      weaponTypeId: validateGuid(data.weaponTypeId, 'weaponTypeId'),
      shots: (data.shots || []).map(shot => ({
        x: parseFloat(shot.x),
        y: parseFloat(shot.y),
        score: parseFloat(shot.score)
      })),
      exerciseTemplateId: data.exerciseTemplateId ? validateGuid(data.exerciseTemplateId, 'exerciseTemplateId') : null,
      // Send trainingDuration as a simple string in HH:MM:SS format
      trainingDuration: data.trainingDuration || "00:00:00"
    };
    
    console.log('ShootingSession API: Transformed data for update:', sessionData);
    
    // Try PATCH first, fallback to PUT if needed
    return httpClient.patch(`/ShootingSession/${id}`, sessionData)
      .catch(error => {
        if (error.response?.status === 405) {
          console.log('ShootingSession API: PATCH not supported, trying PUT');
          return httpClient.put(`/ShootingSession/${id}`, sessionData);
        }
        throw error;
      });
  },
  
  delete: (id) => {
    console.log('ShootingSession API: Deleting session ID:', id);
    return httpClient.delete(`/ShootingSession/${id}`);
  }
};