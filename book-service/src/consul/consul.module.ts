// src/consul/consul.module.ts
import { Module, DynamicModule } from '@nestjs/common';
import { ConsulService } from './consul.service';

@Module({})
export class ConsulModule {
  static register(serviceName: string, servicePort: number): DynamicModule {
    return {
      module: ConsulModule,
      providers: [
        {
          provide: ConsulService,
          useFactory: () => new ConsulService(serviceName, servicePort),
        },
      ],
      exports: [ConsulService],
    };
  }
}
