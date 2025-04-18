import { Draggable } from "@hello-pangea/dnd";
import { Tarea } from "../types";

interface Props {
    tarea: Tarea;
    index: number;
    columnaId: string;
    onBorrarTarea: (tareaId: string) => Promise<void>;
}

export const TareaComponent = ({ tarea, index, columnaId, onBorrarTarea }: Props) => {
    return (
        <Draggable draggableId={tarea._id} index={index}>
            {(provided) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="bg-gray-100 p-3 rounded shadow-sm relative group"
                >
                    <p className="text-sm text-gray-600">{tarea.contenido}</p>
                    <button
                        onClick={() => onBorrarTarea(tarea._id)}
                        className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        ×
                    </button>
                </div>
            )}
        </Draggable>
    );
}; 