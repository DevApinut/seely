import { Configuration, Value } from "@itgorillaz/configify";

@Configuration()
export class KeycloakConfig {

  @Value('OAUTH2_ISSUER')
  issuer: string

  @Value('OAUTH2_CLIENT_ID')
  clientId: string;

  @Value('OAUTH2_CLIENT_SECRET')
  clientSecret: string;

  @Value('OAUTH2_CALLBACK_URL')
  callbackUrl: string;

  @Value('OAUTH2_SCOPE')
  scope: string;

  @Value('OAUTH2_POST_LOGOUT_REDIRECT_URI')
  postLogoutRedirectUri: string;

}
