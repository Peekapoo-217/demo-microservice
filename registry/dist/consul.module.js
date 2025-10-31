"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ConsulModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsulModule = void 0;
const common_1 = require("@nestjs/common");
const consul_service_1 = require("./consul.service");
let ConsulModule = ConsulModule_1 = class ConsulModule {
    static register(config) {
        return {
            module: ConsulModule_1,
            providers: [
                {
                    provide: consul_service_1.ConsulService,
                    useFactory: () => new consul_service_1.ConsulService(config),
                },
            ],
            exports: [consul_service_1.ConsulService],
        };
    }
    static registerAsync(options) {
        return {
            module: ConsulModule_1,
            providers: [
                {
                    provide: 'CONSUL_CONFIG',
                    useFactory: options.useFactory,
                    inject: options.inject || [],
                },
                {
                    provide: consul_service_1.ConsulService,
                    useFactory: (config) => new consul_service_1.ConsulService(config),
                    inject: ['CONSUL_CONFIG'],
                },
            ],
            exports: [consul_service_1.ConsulService],
        };
    }
};
exports.ConsulModule = ConsulModule;
exports.ConsulModule = ConsulModule = ConsulModule_1 = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({})
], ConsulModule);
//# sourceMappingURL=consul.module.js.map