import { useMemo, useState } from "react";
import Borrar from "../assets/icons/borrar";
import { Columna as ColumnaType, Id } from "../types";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities"
import NuevaTarea from "../assets/icons/nuevaTarea";
import { Tarea } from "../types";
import TareaCard from "./TareaCard";

interface Props {
    columnas: ColumnaType;
    borrarColumna: (id: Id) => void;
    updateColumnas: (id: Id, title: string) => void;
    crearTarea: (columnaId: Id) => void;
    borrarTarea: (id: Id) => void;
    updateTarea: (id: Id, contenido: string) => void;
    tareas: Tarea[];
}

const ColumnaConteiner = (props: Props) => {
    const { columnas, borrarColumna, updateColumnas, crearTarea, tareas, borrarTarea, updateTarea } = props;
    const [editMode, setEditMode] = useState(false);

    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
        id: columnas._id,
        data: {
            type: "Columna",
            columnas,
        },
        disabled: editMode,
    })

    const style = {
        transition,
        transform: CSS.Transform.toString(transform)
    }

    const tareasIds = useMemo(() => {
        return tareas.map((tarea) => tarea._id);
    }, [tareas])

    if (isDragging) {
        return <div ref={setNodeRef}
            style={style} className="bg-colorSecundario w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col border-orange-500 border-dashed opacity-40 border-2 border-red-500"></div>
    }

    return (
        <div ref={setNodeRef}
            style={style}
            className="bg-colorSecundario w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col border-orange-500 border-2">
            <div
                {...attributes}
                {...listeners}
                onClick={() => setEditMode(true)}
                className="bg-colorPrincipal text.md h-[60px] cursor-grab rounded-md rounded-b-none p-3 font-bold border-orange-500 border-2 flex items-center justify-between">
                <div className="flex gap-2">
                    <div className="flex justify-center items-center bg-colorsecundario px-2 py-1 text-sm rounded-full">
                        <span className="ml-2"></span>
                        {!editMode && columnas.titulo}
                        {editMode && (<input
                            className="bg-black focus:border-orange-500 border rounded outline-none px-2 focus:ring-0"
                            value={columnas.titulo}
                            onChange={(e) => updateColumnas(columnas._id, e.target.value)}
                            autoFocus
                            onBlur={() => setEditMode(false)}
                            onKeyDown={(e) => {
                                if (e.key !== "Enter") return;
                                setEditMode(false);
                            }}
                        />)}
                    </div>
                </div>
                <button
                    onClick={() => borrarColumna(columnas._id)}
                    className="stroke-orange-500 hover:stroke-white hover:bg-colorSecundario rounded px-1 py-1"
                >
                    <Borrar />
                </button>
            </div>
            <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
                <SortableContext items={tareasIds}>
                    {tareas.map((tarea) => (
                        <TareaCard key={tarea._id} tarea={tarea} borrarTarea={borrarTarea} updateTarea={updateTarea} />
                    ))
                    }</SortableContext></div>
            <button
                className="
            flex gap-2 items-center border-colorSecundario border-2 rounded-md p-4 border-x-colorSecundario
            hover:colorSecundario hover:text-orange-500 active:bg-black"
                onClick={() => crearTarea(columnas._id)}
            ><NuevaTarea />Crear Tarea</button>
        </div>
    );
};

export default ColumnaConteiner