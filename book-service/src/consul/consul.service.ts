import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import Consul from 'consul';

import * as os from 'os';

@Injectable()
export class ConsulService implements OnModuleInit, OnModuleDestroy {
  private consul = new Consul({ host: '127.0.0.1', port: 8500 });
  private serviceId: string;

  constructor(
    private readonly serviceName: string,
    private readonly servicePort: number,
  ) {
    this.serviceId = `${serviceName}-${this.getHostName()}-${servicePort}`;
  }

  async onModuleInit() {
    await this.register();
  }

  async onModuleDestroy() {
    await this.deregister();
  }

  private getHostName() {
    return os.hostname();
  }

  private async register() {
    const serviceDef = {
      id: this.serviceId,
      name: this.serviceName,
      address: 'localhost',
      port: this.servicePort,
      check: {
        name: `${this.serviceName}-health-check`,
        http: `http://localhost:${this.servicePort}/health`,
        interval: '10s',
        timeout: '5s',
      },
    };

    await this.consul.agent.service.register(serviceDef);
    console.log(` Registered service ${this.serviceName} on port ${this.servicePort}`);
  }

  private async deregister() {
    await this.consul.agent.service.deregister(this.serviceId);
    console.log(` Deregistered service ${this.serviceName}`);
  }

  //  Hàm dùng để gọi thông tin service khác
  async resolveService(name: string) {
    const result = await this.consul.catalog.service.nodes(name);
    if (result.length === 0) throw new Error(`Service ${name} not found`);
    return `http://${result[0].Address}:${result[0].ServicePort}`;
  }
}
