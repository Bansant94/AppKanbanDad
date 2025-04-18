import { useState, useEffect } from "react";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import { Columna, Tarea } from "../types";
import { ColumnaComponent } from "./ColumnaComponent";
import axios from "axios";

export const KanbanBoard = () => {
    const [columnas, setColumnas] = useState<Columna[]>([]);
    const [tareas, setTareas] = useState<Tarea[]>([]);

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            const [columnasResponse, tareasResponse] = await Promise.all([
                axios.get("http://localhost:3000/columnas"),
                axios.get("http://localhost:3000/tareas")
            ]);

            console.log('Respuesta completa de columnas:', columnasResponse);
            console.log('Respuesta completa de tareas:', tareasResponse);

            const columnasData = columnasResponse.data;
            const tareasData = tareasResponse.data;

            console.log('Datos de columnas:', columnasData);
            console.log('Datos de tareas:', tareasData);

            if (Array.isArray(columnasData)) {
                setColumnas(columnasData);
                console.log('Columnas establecidas en el estado:', columnasData);
            }

            if (Array.isArray(tareasData)) {
                // Verificar la estructura de cada tarea
                tareasData.forEach((tarea, index) => {
                    console.log(`Tarea ${index}:`, {
                        id: tarea._id,
                        contenido: tarea.contenido,
                        columnaId: tarea.columnaId,
                        tipo: typeof tarea.columnaId
                    });
                });

                setTareas(tareasData);
                console.log('Tareas establecidas en el estado:', tareasData);
            }
        } catch (error) {
            console.error("Error al cargar los datos:", error);
        }
    };

    const getTareasColumna = (columnaId: string) => {
        const tareasColumna = tareas.filter(tarea => {
            console.log(`Comparando tarea.columnaId (${tarea.columnaId}) con columnaId (${columnaId})`);
            console.log('Tipo de tarea.columnaId:', typeof tarea.columnaId);
            console.log('Tipo de columnaId:', typeof columnaId);
            return tarea.columnaId === columnaId;
        });
        console.log(`Tareas encontradas para columna ${columnaId}:`, tareasColumna);
        return tareasColumna;
    };

    const agregarTarea = async (columnaId: string, titulo: string) => {
        try {
            const response = await axios.post(`http://localhost:3000/columnas/${columnaId}/tareas`, {
                contenido: titulo
            });
            console.log('Nueva tarea creada:', response.data);
            setTareas(prev => [...prev, response.data]);
        } catch (error) {
            console.error("Error al agregar tarea:", error);
        }
    };

    const borrarTarea = async (tareaId: string) => {
        try {
            await axios.delete(`http://localhost:3000/tareas/${tareaId}`);
            setTareas(prev => prev.filter(tarea => tarea._id !== tareaId));
        } catch (error) {
            console.error("Error al borrar tarea:", error);
        }
    };

    const onDragEnd = async (result: DropResult) => {
        const { destination, source, draggableId, type } = result;

        if (!destination) return;

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        if (type === "columna") {
            const nuevaColumnas = Array.from(columnas);
            const [columnaRemovida] = nuevaColumnas.splice(source.index, 1);
            nuevaColumnas.splice(destination.index, 0, columnaRemovida);

            setColumnas(nuevaColumnas);

            try {
                await axios.put(`http://localhost:3000/columnas/${columnaRemovida._id}/orden`, {
                    nuevoOrden: destination.index
                });
            } catch (error) {
                console.error("Error al actualizar el orden de la columna:", error);
            }
        }

        if (type === "tarea") {
            const tareaId = draggableId;
            const nuevaColumnaId = destination.droppableId;
            const orden = destination.index;

            try {
                const response = await axios.put(`http://localhost:3000/tareas/${tareaId}/orden`, {
                    orden,
                    columnaId: nuevaColumnaId
                });

                setTareas(prev => prev.map(tarea =>
                    tarea._id === tareaId ? response.data : tarea
                ));
            } catch (error) {
                console.error("Error al mover la tarea:", error);
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex gap-4 p-4">
                    <Droppable droppableId="board" direction="horizontal" type="columna">
                        {(provided) => (
                            <div
                                className="flex gap-4"
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                            >
                                {columnas.map((columna, index) => {
                                    const tareasColumna = getTareasColumna(columna._id);
                                    console.log(`Renderizando columna ${columna._id} con ${tareasColumna.length} tareas`);
                                    return (
                                        <ColumnaComponent
                                            key={columna._id}
                                            columna={columna}
                                            index={index}
                                            tareas={tareasColumna}
                                            onAgregarTarea={agregarTarea}
                                            onBorrarTarea={borrarTarea}
                                        />
                                    );
                                })}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </div>
            </DragDropContext>
        </div>
    );
}; 