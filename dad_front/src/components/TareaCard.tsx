import { useState } from "react";
import Borrar from "../assets/icons/borrar";
import { Tarea } from "../types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities"

interface Props {
    tarea: Tarea;
    borrarTarea: (id: string) => void;
    updateTarea: (id: string, contenido: string) => void;
}

const TareaCard = (props: Props) => {
    const { tarea, borrarTarea, updateTarea } = props;
    const [mouseIsOver, setMouseIsOver] = useState(false);
    const [editMode, setEditMode] = useState(false);

    const switchEditMode = () => {
        setEditMode((prev) => !prev);
        setMouseIsOver(false);
    }

    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
        id: tarea._id,
        data: {
            type: "Tarea",
            tarea,
        },
        disabled: editMode,
    })
    const style = {
        transition,
        transform: CSS.Transform.toString(transform)
    }
    if (isDragging) {
        return <div ref={setNodeRef}
            style={style} className="opacity-30 bg-black p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl border-2 border-red-500  border-dashed cursor-grab relative"></div>
    }
    if (editMode) {
        return (
            <div ref={setNodeRef}
                style={style}
                {...attributes}
                {...listeners}
                className="bg-black p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-orange-500 cursor-grab relative">
                <textarea
                    className="
                h-[90%] w-full resize-none border-none rounded bg-transparent text-white focus:outline-none"
                    value={tarea.contenido}
                    autoFocus
                    placeholder="Contenido de la tarea"
                    onBlur={switchEditMode}
                    onKeyDown={e => { if (e.key === "Enter" && e.shiftKey) { switchEditMode() } }}
                    onChange={e => updateTarea(tarea._id, e.target.value)}
                ></textarea>
            </div>
        )
    }
    return (

        <div ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={switchEditMode}
            className="bg-black p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-orange-500 cursor-grab relative tarea "
            onMouseEnter={() =>
                setMouseIsOver(true)
            }
            onMouseLeave={() => setMouseIsOver(false)}
        >
            <p className="my-auto h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap"
            >{tarea.contenido}</p>
            {mouseIsOver && (<button onClick={() => {
                borrarTarea(tarea._id)
            }
            } className="stroke-white absolute right-4 top-1/2 -trasnlate-y-1/2 bg-colorSecundario p-2 rounded opacity-60 hover:opacity-100
            "><Borrar /></button>)}
        </div>
    )
}

export default TareaCard
