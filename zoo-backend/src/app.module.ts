import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AnimauxModule } from './animaux/animaux.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { EnclosModule } from './enclos/enclos.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const config = {
          type: 'postgres' as const,
          host: configService.get('DB_HOST', 'localhost'),
          port: parseInt(configService.get('DB_PORT', '5432')),
          username: configService.get('DB_USERNAME', 'postgres'),
          password: configService.get('DB_PASSWORD', 'postgres'),
          database: configService.get('DB_DATABASE', 'zoo'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: configService.get('NODE_ENV') === 'development',
        };
        console.log('🐘 PostgreSQL Config:', {
          host: config.host,
          port: config.port,
          username: config.username,
          database: config.database,
          synchronize: config.synchronize,
        });
        return config;
      },
      inject: [ConfigService],
    }),
    AnimauxModule,
    AuthModule,
    EnclosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
