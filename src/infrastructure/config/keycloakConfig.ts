//Archivo de Configuración para Keycloak.
// Archivo de Configuración para Keycloak.
export const keycloakConfig = {
  clientId: 'api-redeco', // ID del cliente configurado en Keycloak
  clientSecret: '0cc1VdSxFr2zR73XGvccFltIhpgASjQL', // Secreto del cliente
  realm: 'API_REDECO', // Nombre del Realm
  authServerUrl: 'http://10.33.21.86:8090/realms/API_REDECO/protocol/openid-connect/auth', // URL de autenticación
  tokenUrl: 'http://10.33.21.86:8090/realms/API_REDECO/protocol/openid-connect/token', // URL para obtener tokens
  adminUserUrl: 'http://10.33.21.86:8090/admin/realms/API_REDECO/users', // Endpoint de administración de usuarios
  clientUuid: '673b301d-72cd-4025-abfa-c24992ebeba5', // UUID del cliente de Keycloak
  adminUserId: '6b78dbd2-c3b9-4c81-9783-07732d646569', // ID de usuario admin
};







/*
export const keycloakConfig = {
    clientId: 'api-redeco', // ID del cliente configurado en Keycloak
    clientSecret: '0cc1VdSxFr2zR73XGvccFltIhpgASjQL', // Secreto del cliente
    realm: 'API_REDECO', // Nombre del Realm
    authServerUrl: 'http://10.33.21.86:8090/realms/API_REDECO/protocol/openid-connect/auth', // URL del servidor Keycloak
  };
*/