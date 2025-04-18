import { Draggable, Droppable } from "@hello-pangea/dnd";
import { Columna, Tarea } from "../types";
import { TareaComponent } from "./TareaComponent";

interface Props {
    columna: Columna;
    index: number;
    tareas: Tarea[];
    onAgregarTarea: (columnaId: string, titulo: string) => Promise<void>;
    onBorrarTarea: (tareaId: string) => Promise<void>;
}

export const ColumnaComponent = ({ columna, index, tareas, onAgregarTarea, onBorrarTarea }: Props) => {
    const handleAgregarTarea = async () => {
        await onAgregarTarea(columna._id, "Nueva tarea");
    };

    return (
        <Draggable draggableId={columna._id} index={index}>
            {(provided) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className="bg-white rounded-lg shadow-md p-4 w-80"
                >
                    <div
                        {...provided.dragHandleProps}
                        className="flex justify-between items-center mb-4"
                    >
                        <h2 className="text-xl font-bold">{columna.titulo}</h2>
                        <button
                            onClick={handleAgregarTarea}
                            className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                        >
                            +
                        </button>
                    </div>

                    <Droppable droppableId={columna._id} type="tarea">
                        {(provided) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className="space-y-2 min-h-[200px]"
                            >
                                {tareas.map((tarea, index) => (
                                    <TareaComponent
                                        key={tarea._id}
                                        tarea={tarea}
                                        index={index}
                                        columnaId={columna._id}
                                        onBorrarTarea={onBorrarTarea}
                                    />
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </div>
            )}
        </Draggable>
    );
}; 