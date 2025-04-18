import { IsNotEmpty, IsString, IsNumber, IsMongoId } from 'class-validator';

export class CreateTareaDto {
    @IsString()
    @IsNotEmpty()
    contenido: string;

    @IsMongoId()
    @IsNotEmpty()
    columnaId: string;

    @IsNumber()
    orden: number;
} 