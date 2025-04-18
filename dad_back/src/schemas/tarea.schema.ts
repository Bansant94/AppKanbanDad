import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Columna } from './columna.schema';

export type TareaDocument = Tarea & Document;

@Schema()
export class Tarea {
    @Prop({ required: true })
    contenido: string;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Columna', required: true })
    columnaId: Columna;

    @Prop({ required: true })
    orden: number;
}

export const TareaSchema = SchemaFactory.createForClass(Tarea); 