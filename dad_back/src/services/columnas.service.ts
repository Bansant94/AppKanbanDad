import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Columna, ColumnaDocument } from '../schemas/columna.schema';
import { CreateColumnaDto } from '../dto/create-columna.dto';

@Injectable()
export class ColumnasService {
    constructor(
        @InjectModel(Columna.name) private columnaModel: Model<ColumnaDocument>,
    ) { }

    async create(createColumnaDto: CreateColumnaDto): Promise<Columna> {
        if (createColumnaDto.orden === undefined) {
            const maxOrdenColumna = await this.columnaModel.findOne().sort('-orden').exec();
            createColumnaDto.orden = maxOrdenColumna ? maxOrdenColumna.orden + 1 : 0;
        }

        const createdColumna = new this.columnaModel(createColumnaDto);
        return createdColumna.save();
    }

    async findAll(): Promise<Columna[]> {
        return this.columnaModel.find().sort('orden').exec();
    }

    async update(id: string, updateColumnaDto: Partial<CreateColumnaDto>): Promise<Columna> {
        const updatedColumna = await this.columnaModel.findByIdAndUpdate(id, updateColumnaDto, { new: true }).exec();
        if (!updatedColumna) {
            throw new NotFoundException(`Columna con ID ${id} no encontrada`);
        }
        return updatedColumna;
    }

    async delete(id: string): Promise<Columna> {
        const deletedColumna = await this.columnaModel.findByIdAndDelete(id).exec();
        if (!deletedColumna) {
            throw new NotFoundException(`Columna con ID ${id} no encontrada`);
        }
        return deletedColumna;
    }

    async updateOrden(id: string, orden: number): Promise<Columna> {
        const updatedColumna = await this.columnaModel.findByIdAndUpdate(id, { orden }, { new: true }).exec();
        if (!updatedColumna) {
            throw new NotFoundException(`Columna con ID ${id} no encontrada`);
        }
        return updatedColumna;
    }
} 