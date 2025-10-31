import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import Consul from 'consul';
import * as os from 'os';

export interface ConsulConfig {
  host?: string;
  port?: number;
  serviceName: string;
  servicePort: number;
  serviceAddress?: string;
  healthCheckPath?: string;
  healthCheckInterval?: string;
  healthCheckTimeout?: string;
}

@Injectable()
export class ConsulService implements OnModuleInit, OnModuleDestroy {
  private consul: Consul;
  private serviceId: string;
  private config: ConsulConfig;

  constructor(config: ConsulConfig) {
    this.config = {
      host: config.host || '127.0.0.1',
      port: config.port || 8500,
      serviceAddress: config.serviceAddress || 'localhost',
      healthCheckPath: config.healthCheckPath || '/health',
      healthCheckInterval: config.healthCheckInterval || '10s',
      healthCheckTimeout: config.healthCheckTimeout || '5s',
      ...config,
    };

    this.consul = new Consul({
      host: this.config.host,
      port: this.config.port,
    });

    this.serviceId = `${this.config.serviceName}-${this.getHostName()}-${this.config.servicePort}`;
  }

  async onModuleInit() {
    await this.register();
  }

  async onModuleDestroy() {
    await this.deregister();
  }

  private getHostName(): string {
    return os.hostname();
  }

  private async register(): Promise<void> {
    const serviceDef = {
      id: this.serviceId,
      name: this.config.serviceName,
      address: this.config.serviceAddress!,
      port: this.config.servicePort,
      check: {
        name: `${this.config.serviceName}-health-check`,
        http: `http://${this.config.serviceAddress}:${this.config.servicePort}${this.config.healthCheckPath}`,
        interval: this.config.healthCheckInterval!,
        timeout: this.config.healthCheckTimeout!,
      },
    };

    await this.consul.agent.service.register(serviceDef);
    console.log(`Registered service ${this.config.serviceName} on port ${this.config.servicePort}`);
  }

  private async deregister(): Promise<void> {
    await this.consul.agent.service.deregister(this.serviceId);
    console.log(`Deregistered service ${this.config.serviceName}`);
  }

  /**
   * Resolve service URL from Consul
   * @param serviceName - Name of the service to resolve
   * @returns Service URL (http://address:port)
   */
  async resolveService(serviceName: string): Promise<string> {
    const result = await this.consul.catalog.service.nodes(serviceName);
    if (result.length === 0) {
      throw new Error(`Service ${serviceName} not found in Consul`);
    }
    return `http://${result[0].Address}:${result[0].ServicePort}`;
  }

  /**
   * Get all instances of a service
   * @param serviceName - Name of the service
   * @returns Array of service instances
   */
  async getServiceInstances(serviceName: string): Promise<any[]> {
    const result = await this.consul.catalog.service.nodes(serviceName);
    return result;
  }

  /**
   * Get Consul client for advanced operations
   */
  getConsulClient(): Consul {
    return this.consul;
  }
}
