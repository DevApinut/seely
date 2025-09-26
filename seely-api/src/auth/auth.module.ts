import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '@app/users/users.module';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshJwtStrategy } from './strategies/refresh-jwt.strategy';
import { KeycloakController } from './keycloak.controller';
import { KeycloakService } from './keycloak.service';
import { KeycloakConfig } from './keycloak.config';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => {
        const jwtOpts: JwtModuleOptions = {
          secret: process.env.JWT_SECRET,
          signOptions: {
            expiresIn: process.env.JWT_EXPIRES_IN
          }
        }
        return jwtOpts;
      }
    }),
    UsersModule
  ],
  controllers: [AuthController, KeycloakController],
  providers: [
    AuthService, 
    JwtStrategy, 
    RefreshJwtStrategy, 
    KeycloakService,
    {
      provide: KeycloakConfig,
      useFactory: () => {
        const config = new KeycloakConfig();
        config.issuer = process.env.OAUTH2_ISSUER || '';
        config.clientId = process.env.OAUTH2_CLIENT_ID || '';
        config.clientSecret = process.env.OAUTH2_CLIENT_SECRET || '';
        config.callbackUrl = process.env.OAUTH2_CALLBACK_URL || '';
        config.scope = process.env.OAUTH2_SCOPE || '';
        config.postLogoutRedirectUri = process.env.OAUTH2_POST_LOGOUT_REDIRECT_URI || '';
        return config;
      }
    }
  ],
})
export class AuthModule {}
