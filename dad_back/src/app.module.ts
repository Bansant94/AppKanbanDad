import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ColumnasController } from './controllers/columnas.controller';
import { TareasController } from './controllers/tareas.controller';
import { ColumnasService } from './services/columnas.service';
import { TareasService } from './services/tareas.service';
import { Columna, ColumnaSchema } from './schemas/columna.schema';
import { Tarea, TareaSchema } from './schemas/tarea.schema';
import { WebsocketGateway } from './websockets/websocket.gateway';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/kanban'),
    MongooseModule.forFeature([
      { name: Columna.name, schema: ColumnaSchema },
      { name: Tarea.name, schema: TareaSchema },
    ]),
  ],
  controllers: [ColumnasController, TareasController],
  providers: [ColumnasService, TareasService, WebsocketGateway],
})
export class AppModule { }
