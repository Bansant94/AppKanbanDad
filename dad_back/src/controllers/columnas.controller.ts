import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ColumnasService } from '../services/columnas.service';
import { CreateColumnaDto } from '../dto/create-columna.dto';
import { Columna } from '../schemas/columna.schema';

@Controller('columnas')
export class ColumnasController {
    constructor(private readonly columnasService: ColumnasService) { }

    @Post()
    async create(@Body() createColumnaDto: CreateColumnaDto): Promise<Columna> {
        return this.columnasService.create(createColumnaDto);
    }

    @Get()
    async findAll(): Promise<Columna[]> {
        return this.columnasService.findAll();
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() updateColumnaDto: Partial<CreateColumnaDto>,
    ): Promise<Columna> {
        return this.columnasService.update(id, updateColumnaDto);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<Columna> {
        return this.columnasService.delete(id);
    }

    @Put(':id/orden')
    async updateOrden(
        @Param('id') id: string,
        @Body('orden') orden: number,
    ): Promise<Columna> {
        return this.columnasService.updateOrden(id, orden);
    }
} 