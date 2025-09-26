import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { KeycloakService } from './keycloak.service';

@Controller('keycloak')
export class KeycloakController {
  constructor(private keycloakService: KeycloakService) {}

  @Get('login')
  async login(@Res() res: Response) {
    await this.keycloakService.handleRedirectToLogin(res);
  }

  @Get('callback')
  async callback(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.keycloakService.handleCallback(req, res);
  }

  @Get('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    console.log('Logout endpoint called');
    console.log('Cookies:', req.cookies);    
    const idToken = req.cookies?.idToken;
    console.log('IdToken from cookies:', idToken ? 'Present' : 'Not found');    
    try {
      await this.keycloakService.handleRedirectToLogout(idToken, res);
    } catch (error) {
      console.error('Logout controller error:', error);
      res.status(500).json({ 
        error: 'Logout failed', 
        message: error.message 
      });
    }
  }

  @Get('logout-success')
  async logoutSuccess(@Res() res: Response) {
    res.clearCookie('idToken');
    res.clearCookie('refreshToken');
    res.clearCookie('state');
    res.clearCookie('codeVerifier');    
   
    return res.json({
      success: true,
      message: 'Logout successful',
      timestamp: new Date().toISOString()
    });
  }
}
