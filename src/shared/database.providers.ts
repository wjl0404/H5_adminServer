import * as path from 'path';
import { ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from 'src/user/entities/user.mongo.entity';
import { Content } from 'src/cms/entities/content.mongo.entity';

// 设置数据库类型
const databaseType: DataSourceOptions['type'] = 'mongodb';
console.log(path.join(__dirname, '../../**/*.mongo.entity{.js,.ts}'));

// 数据库注入
export const DatabaseProviders = [
  {
    provide: 'MONGODB_DATA_SOURCE',
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      const config = {
        type: databaseType,
        url: configService.get<string>('database.url'),
        username: configService.get<string>('database.user'),
        password: configService.get<string>('database.pass'),
        database: configService.get<string>('database.name'),
        autoLoadEntities: configService.get<string>(
          'database.autoLoadEntities',
        ),
        // entities: [path.join(__dirname, '../../**/*.mongo.entity{.js,.ts}')],
        entities: [User, Content],
        logging: configService.get<boolean>('database.logging'),
        synchronize: configService.get<boolean>('database.synchronize'),
      };
      console.log('=====config', config);

      const ds = new DataSource(config);
      await ds.initialize();
      console.log('init..');
      return ds;
    },
  },
];
