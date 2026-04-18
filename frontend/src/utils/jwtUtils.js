// JWT utility functions for token decoding and role checking
export const decodeJWT = (token) => {
  try {
    if (!token) {
      console.log('JWT Debug: No token provided');
      return null;
    }
    
    // JWT tokens have 3 parts separated by dots
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.log('JWT Debug: Invalid token format, parts:', parts.length);
      return null;
    }
    
    // Decode the payload (second part)
    const payload = parts[1];
    
    // Add padding if needed for base64 decoding
    const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
    
    // Decode base64
    const decodedPayload = atob(paddedPayload.replace(/-/g, '+').replace(/_/g, '/'));
    
    const parsed = JSON.parse(decodedPayload);
    console.log('JWT Debug: Decoded token payload:', parsed);
    
    return parsed;
  } catch (error) {
    console.error('JWT Debug: Error decoding JWT:', error);
    return null;
  }
};

export const getUserRoles = (token) => {
  const decoded = decodeJWT(token);
  if (!decoded) {
    console.log('JWT Debug: No decoded token for role extraction');
    return [];
  }
  
  console.log('JWT Debug: Looking for roles in token claims...');
  
  // ASP.NET Core Identity can store roles in different claim types
  // Common claim types for roles:
  const roleClaims = [
    'role',
    'roles', 
    'http://schemas.microsoft.com/ws/2008/06/identity/claims/role',
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role'
  ];
  
  // Log all available claims
  console.log('JWT Debug: All available claims:', Object.keys(decoded));
  
  for (const claim of roleClaims) {
    if (decoded[claim]) {
      console.log(`JWT Debug: Found roles in claim '${claim}':`, decoded[claim]);
      // Roles can be a string or array
      const roles = Array.isArray(decoded[claim]) ? decoded[claim] : [decoded[claim]];
      console.log('JWT Debug: Processed roles array:', roles);
      return roles;
    }
  }
  
  console.log('JWT Debug: No roles found in any standard claim');
  return [];
};

export const hasRole = (token, roleName) => {
  const roles = getUserRoles(token);
  const hasRoleResult = roles.includes(roleName);
  console.log(`JWT Debug: Checking for role '${roleName}' in roles:`, roles, 'Result:', hasRoleResult);
  return hasRoleResult;
};

export const isAdmin = (token) => {
  const result = hasRole(token, 'Admin');
  console.log('JWT Debug: isAdmin check result:', result);
  return result;
};

export const isTokenExpired = (token) => {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) {
    console.log('JWT Debug: Token has no expiration or is invalid');
    return true;
  }
  
  // exp is in seconds, Date.now() is in milliseconds
  const isExpired = decoded.exp * 1000 < Date.now();
  console.log('JWT Debug: Token expiration check - exp:', decoded.exp, 'now:', Date.now() / 1000, 'expired:', isExpired);
  return isExpired;
};