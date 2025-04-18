import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tarea, TareaDocument } from '../schemas/tarea.schema';
import { CreateTareaDto } from '../dto/create-tarea.dto';

@Injectable()
export class TareasService {
    constructor(
        @InjectModel(Tarea.name) private tareaModel: Model<TareaDocument>,
    ) { }

    async create(createTareaDto: CreateTareaDto): Promise<Tarea> {
        const createdTarea = new this.tareaModel(createTareaDto);
        const tarea = await createdTarea.save();
        return this.transformTarea(tarea);
    }

    async findAll(): Promise<Tarea[]> {
        const tareas = await this.tareaModel.find().sort('orden').exec();
        return tareas.map(tarea => this.transformTarea(tarea));
    }

    async findOne(id: string): Promise<Tarea> {
        const tarea = await this.tareaModel.findById(id).exec();
        if (!tarea) {
            throw new NotFoundException(`Tarea con ID ${id} no encontrada`);
        }
        return this.transformTarea(tarea);
    }

    async findByColumna(columnaId: string): Promise<Tarea[]> {
        const tareas = await this.tareaModel.find({ columnaId }).sort('orden').exec();
        return tareas.map(tarea => this.transformTarea(tarea));
    }

    async update(id: string, updateTareaDto: Partial<CreateTareaDto>): Promise<Tarea> {
        const updatedTarea = await this.tareaModel.findByIdAndUpdate(id, updateTareaDto, { new: true }).exec();
        if (!updatedTarea) {
            throw new NotFoundException(`Tarea con ID ${id} no encontrada`);
        }
        return this.transformTarea(updatedTarea);
    }

    async delete(id: string): Promise<Tarea> {
        const deletedTarea = await this.tareaModel.findByIdAndDelete(id).exec();
        if (!deletedTarea) {
            throw new NotFoundException(`Tarea con ID ${id} no encontrada`);
        }
        return this.transformTarea(deletedTarea);
    }

    async updateOrden(id: string, orden: number, columnaId?: string): Promise<Tarea> {
        const updateData: any = { orden };
        if (columnaId) {
            updateData.columnaId = columnaId;
        }
        const updatedTarea = await this.tareaModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
        if (!updatedTarea) {
            throw new NotFoundException(`Tarea con ID ${id} no encontrada`);
        }
        return this.transformTarea(updatedTarea);
    }

    private transformTarea(tarea: TareaDocument): any {
        const tareaObject = tarea.toObject();
        return {
            ...tareaObject,
            _id: tareaObject._id.toString(),
            columnaId: tareaObject.columnaId.toString()
        };
    }
} 