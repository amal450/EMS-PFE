import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt'; // <-- IL MANQUE SÛREMENT ÇA

@Module({
  imports: [
    // On configure le module JWT ici
    JwtModule.register({
      global: true, // Permet d'utiliser le JwtService partout sans le ré-importer
      secret: 'ma_cle_secrete_pfe', // Utilise la même clé que dans ton AuthService
      signOptions: { expiresIn: '1d' }, // Le token dure 1 jour
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}