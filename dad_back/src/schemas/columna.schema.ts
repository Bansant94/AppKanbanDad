import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ColumnaDocument = Columna & Document;

@Schema()
export class Columna {
    @Prop({ required: true })
    titulo: string;

    @Prop({ required: true })
    orden: number;
}

export const ColumnaSchema = SchemaFactory.createForClass(Columna); 