"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: async (configService) => {
                    const dbType = configService.get('DB_TYPE', 'postgres');
                    if (dbType === 'sqlite') {
                        return {
                            type: 'sqlite',
                            database: configService.get('SQLITE_DB_PATH', 'dev.sqlite'),
                            autoLoadEntities: true,
                            synchronize: true,
                            logging: true,
                        };
                    }
                    return {
                        type: 'postgres',
                        host: configService.get('DB_HOST', 'localhost'),
                        port: configService.get('DB_PORT', 5432),
                        username: configService.get('DB_USER', 'postgres'),
                        password: configService.get('DB_PASSWORD', '12345678'),
                        database: configService.get('DB_NAME', 'whspr'),
                        autoLoadEntities: true,
                        synchronize: configService.get('NODE_ENV') !== 'production',
                        logging: true,
                    };
                },
            }),
        ],
    })
], DatabaseModule);
//# sourceMappingURL=database.module.js.map