import { createPortal } from "react-dom";
import { useMemo, useState, useEffect } from "react";
import { Columna, Id, Tarea, CardMoveData, ColumnMoveData } from "../types"
import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors, UniqueIdentifier } from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import NuevaCarpeta from "../assets/icons/nuevaCarpeta";
import ColumnaConteiner from '../components/ColumnaConteiner'
import TareaCard from "./TareaCard";
import { apiService } from "../services/api.service";
import { websocketService } from "../services/websocket.service";

const Tablero = () => {
    const [columna, setColumnas] = useState<Columna[]>([]);
    const columnasId = useMemo(() => columna.map((col) => col._id), [columna])
    const [tareas, setTareas] = useState<Tarea[]>([]);
    const [actvarTarea, setActivarTarea] = useState<Tarea | null>(null)
    const [activarColumnas, setActivarColumnas] = useState<Columna | null>(null)

    // Configurar WebSocket
    useEffect(() => {
        // Conectar al WebSocket
        websocketService.connect();

        // Configurar listeners de eventos
        websocketService.onColumnMoved((data: ColumnMoveData) => {
            console.log('Recibido evento columnMoved:', data);
            setColumnas(prev => {
                // Verificar si la columna ya está en la posición correcta
                const currentIndex = prev.findIndex(col => col._id === data.columnId);
                if (currentIndex === data.newOrder) return prev;

                const newColumnas = [...prev];
                const [movedColumn] = newColumnas.splice(currentIndex, 1);
                newColumnas.splice(data.newOrder, 0, movedColumn);
                return newColumnas;
            });
        });

        websocketService.onColumnAdded((newColumn: Columna) => {
            console.log('Recibido evento columnAdded:', newColumn);
            setColumnas(prev => {
                // Verificar si la columna ya existe
                if (prev.some(col => col._id === newColumn._id)) return prev;
                return [...prev, newColumn];
            });
        });

        websocketService.onColumnUpdated((updatedColumn: Columna) => {
            console.log('Recibido evento columnUpdated:', updatedColumn);
            setColumnas(prev => {
                // Verificar si la columna existe y si necesita actualización
                const columnIndex = prev.findIndex(col => col._id === updatedColumn._id);
                if (columnIndex === -1) return prev;
                if (JSON.stringify(prev[columnIndex]) === JSON.stringify(updatedColumn)) return prev;

                const newColumnas = [...prev];
                newColumnas[columnIndex] = updatedColumn;
                return newColumnas;
            });
        });

        websocketService.onColumnDeleted((columnId: string) => {
            console.log('Recibido evento columnDeleted:', columnId);
            setColumnas(prev => {
                // Verificar si la columna existe
                if (!prev.some(col => col._id === columnId)) return prev;
                return prev.filter(col => col._id !== columnId);
            });
        });

        websocketService.onCardMoved((data: CardMoveData) => {
            console.log('Recibido evento cardMoved:', data);
            setTareas(prev => {
                // Verificar si la tarjeta ya está en la posición correcta
                const task = prev.find(t => t._id === data.cardId);
                if (!task) return prev;
                if (task.columnaId === data.targetColumnId && task.orden === data.newOrder) return prev;

                return prev.map(tarea => {
                    if (tarea._id === data.cardId) {
                        return { ...tarea, columnaId: data.targetColumnId, orden: data.newOrder };
                    }
                    return tarea;
                });
            });
        });

        websocketService.onCardAdded((newCard: Tarea) => {
            console.log('Recibido evento cardAdded:', newCard);
            setTareas(prev => {
                // Verificar si la tarjeta ya existe
                if (prev.some(t => t._id === newCard._id)) return prev;
                return [...prev, newCard];
            });
        });

        websocketService.onCardUpdated((updatedCard: Tarea) => {
            console.log('Recibido evento cardUpdated:', updatedCard);
            setTareas(prev => {
                // Verificar si la tarjeta existe y si necesita actualización
                const cardIndex = prev.findIndex(card => card._id === updatedCard._id);
                if (cardIndex === -1) return prev;
                if (JSON.stringify(prev[cardIndex]) === JSON.stringify(updatedCard)) return prev;

                const newTareas = [...prev];
                newTareas[cardIndex] = updatedCard;
                return newTareas;
            });
        });

        websocketService.onCardDeleted((data: { cardId: string, columnId: string }) => {
            console.log('Recibido evento cardDeleted:', data);
            setTareas(prev => {
                // Verificar si la tarjeta existe
                if (!prev.some(t => t._id === data.cardId)) return prev;
                return prev.filter(tarea => tarea._id !== data.cardId);
            });
        });

        // Limpiar al desmontar
        return () => {
            websocketService.disconnect();
        };
    }, []);

    // Cargar datos iniciales
    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const [columnasData, tareasData] = await Promise.all([
                    apiService.getColumnas(),
                    apiService.getTareas()
                ]);
                setColumnas(columnasData);
                setTareas(tareasData);
            } catch (error) {
                console.error('Error al cargar datos:', error);
            }
        };
        cargarDatos();
    }, []);

    const crearNuevColumna = async () => {
        try {
            const nuevaColumna = await apiService.createColumna(`Columna ${columna.length + 1}`);
            setColumnas([...columna, nuevaColumna]);
            websocketService.emitAddColumn(nuevaColumna);
        } catch (error) {
            console.error('Error al crear columna:', error);
        }
    }

    const borrarColumna = async (id: Id) => {
        try {
            await apiService.deleteColumna(id);
            setColumnas(columna.filter(col => col._id !== id));
            websocketService.emitDeleteColumn(id);
        } catch (error) {
            console.error('Error al borrar columna:', error);
        }
    }

    const updateColumnas = async (id: Id, titulo: string) => {
        try {
            const updatedColumna = await apiService.updateColumna(id, titulo);
            setColumnas(columna.map(col => col._id === id ? updatedColumna : col));
            websocketService.emitUpdateColumn(updatedColumna);
        } catch (error) {
            console.error('Error al actualizar columna:', error);
        }
    }

    const crearTarea = async (columnaId: Id) => {
        try {
            const nuevaTarea = await apiService.createTarea("Nueva tarea", columnaId, tareas.length);
            setTareas([...tareas, nuevaTarea]);
            websocketService.emitAddCard(nuevaTarea);
        } catch (error) {
            console.error('Error al crear tarea:', error);
        }
    }

    const updateTarea = async (id: Id, contenido: string) => {
        try {
            const updatedTarea = await apiService.updateTarea(id, contenido);
            setTareas(tareas.map(tarea => tarea._id === id ? updatedTarea : tarea));
            websocketService.emitUpdateCard(updatedTarea);
        } catch (error) {
            console.error('Error al actualizar tarea:', error);
        }
    }

    const borrarTarea = async (id: Id) => {
        try {
            const tarea = tareas.find(t => t._id === id);
            if (tarea) {
                await apiService.deleteTarea(id);
                setTareas(tareas.filter((tarea) => tarea._id !== id));
                websocketService.emitDeleteCard({ cardId: id, columnId: tarea.columnaId });
            }
        } catch (error) {
            console.error('Error al borrar tarea:', error);
        }
    }

    const onDragStart = (event: DragStartEvent) => {
        if (event.active.data.current?.type === "Columna") {
            setActivarColumnas(event.active.data.current.columnas)
            return
        }

        if (event.active.data.current?.type === "Tarea") {
            setActivarTarea(event.active.data.current.tarea)
            return
        }
    }

    const onDragEnd = async (event: DragEndEvent) => {
        setActivarColumnas(null)
        setActivarTarea(null)
        const { active, over } = event;
        if (!over) return;

        const activeColumnaId = active.id as string;
        const overColumnaId = over.id as string;

        if (activeColumnaId === overColumnaId) return;

        try {
            const activeColumnaIndex = columna.findIndex((col) => col._id === activeColumnaId);
            const overColumnaIndex = columna.findIndex((col) => col._id === overColumnaId);

            const newColumnas = arrayMove(columna, activeColumnaIndex, overColumnaIndex);
            setColumnas(newColumnas);

            // Actualizar órdenes en el backend y emitir evento
            await Promise.all(newColumnas.map((col, index) => {
                apiService.updateColumnaOrden(col._id, index);
                websocketService.emitMoveColumn({ columnId: col._id, newOrder: index });
            }));
        } catch (error) {
            console.error('Error al actualizar orden de columnas:', error);
        }
    }

    const onDragOver = async (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activarId = active.id as string;
        const overId = over.id as string;
        if (activarId === overId) return;

        const activarTarea = active.data.current?.type === "Tarea"
        const overTarea = over.data.current?.type === "Tarea"

        if (!activarTarea) return;

        try {
            if (activarTarea && overTarea) {
                const activarIndex = tareas.findIndex((tarea) => tarea._id === activarId);
                const overIndex = tareas.findIndex((tarea) => tarea._id === overId);

                const newTareas = arrayMove(tareas, activarIndex, overIndex);
                setTareas(newTareas);

                // Actualizar órdenes en el backend y emitir evento
                await Promise.all(newTareas.map((tarea, index) => {
                    apiService.updateTareaOrden(tarea._id, index, tarea.columnaId);
                    websocketService.emitMoveCard({
                        cardId: tarea._id,
                        sourceColumnId: tarea.columnaId,
                        targetColumnId: tarea.columnaId,
                        newOrder: index
                    });
                }));
            }

            const overColumnas = over.data.current?.type === "Columna";
            if (activarTarea && overColumnas) {
                const activarIndex = tareas.findIndex((tarea) => tarea._id === activarId);
                const tarea = tareas[activarIndex];

                // Actualizar tarea en el backend y emitir evento
                await apiService.updateTareaOrden(tarea._id, tarea.orden, overId);
                websocketService.emitMoveCard({
                    cardId: tarea._id,
                    sourceColumnId: tarea.columnaId,
                    targetColumnId: overId,
                    newOrder: tarea.orden
                });

                const newTareas = tareas.map(t => {
                    if (t._id === activarId) {
                        return { ...t, columnaId: overId };
                    }
                    return t;
                });
                setTareas(newTareas);
            }
        } catch (error) {
            console.error('Error al actualizar orden de tareas:', error);
        }
    }

    const sensors = useSensors(useSensor(PointerSensor, {
        activationConstraint: {
            distance: 3,
        }
    }))

    return (
        <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-[40px] ">
            <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragOver={onDragOver}>
                <div className="m-auto flex gap-4">
                    <div className="flex gap-4">
                        <SortableContext items={columnasId}>
                            {columna.map((col) => (
                                <ColumnaConteiner
                                    key={col._id}
                                    columnas={col}
                                    borrarColumna={borrarColumna}
                                    updateColumnas={updateColumnas}
                                    crearTarea={crearTarea}
                                    updateTarea={updateTarea}
                                    borrarTarea={borrarTarea}
                                    tareas={tareas.filter(tarea => tarea.columnaId === col._id)} />
                            ))}
                        </SortableContext>
                    </div>
                    <button onClick={crearNuevColumna}
                        className={`h-[60px] w-[350px] min-w-[350px] cursor-pointer rounded-lg bg-colorPrincipal border-2 border-colorSecundario p-4 ring-orange-500 hover:ring-2 flex gap-2`}
                    >
                        <NuevaCarpeta /> Crear Columna
                    </button>
                </div>
                {createPortal(
                    actvarTarea && (
                        <DragOverlay>
                            <TareaCard
                                tarea={actvarTarea}
                                borrarTarea={borrarTarea}
                                updateTarea={updateTarea}
                            />
                        </DragOverlay>
                    ),
                    document.body
                )}
                {createPortal(
                    activarColumnas && (
                        <DragOverlay>
                            <ColumnaConteiner
                                columnas={activarColumnas}
                                borrarColumna={borrarColumna}
                                updateColumnas={updateColumnas}
                                crearTarea={crearTarea}
                                updateTarea={updateTarea}
                                borrarTarea={borrarTarea}
                                tareas={tareas.filter(tarea => tarea.columnaId === activarColumnas._id)}
                            />
                        </DragOverlay>
                    ),
                    document.body
                )}
            </DndContext>
        </div>
    )
}

export default Tablero;