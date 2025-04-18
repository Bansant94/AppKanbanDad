import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { TareasService } from '../services/tareas.service';
import { CreateTareaDto } from '../dto/create-tarea.dto';
import { Tarea } from '../schemas/tarea.schema';

@Controller('tareas')
export class TareasController {
    constructor(private readonly tareasService: TareasService) { }

    @Post()
    async create(@Body() createTareaDto: CreateTareaDto): Promise<Tarea> {
        return this.tareasService.create(createTareaDto);
    }

    @Get()
    async findAll(@Query('columnaId') columnaId?: string): Promise<Tarea[]> {
        if (columnaId) {
            return this.tareasService.findByColumna(columnaId);
        }
        return this.tareasService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Tarea> {
        return this.tareasService.findOne(id);
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() updateTareaDto: Partial<CreateTareaDto>,
    ): Promise<Tarea> {
        return this.tareasService.update(id, updateTareaDto);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<Tarea> {
        return this.tareasService.delete(id);
    }

    @Put(':id/orden')
    async updateOrden(
        @Param('id') id: string,
        @Body('orden') orden: number,
        @Body('columnaId') columnaId?: string,
    ): Promise<Tarea> {
        return this.tareasService.updateOrden(id, orden, columnaId);
    }
} 