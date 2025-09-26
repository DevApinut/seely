// keycloak-payload.dto.ts
export interface KeycloakPayload {
  sub: string; // keycloakId
  preferred_username: string; // username
}