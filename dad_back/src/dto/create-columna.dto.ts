import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateColumnaDto {
    @IsString()
    @IsNotEmpty()
    titulo: string;

    @IsNumber()
    @IsOptional()
    orden?: number;
} 