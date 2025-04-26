import { TaskProject } from "@/types/index";
import { Fragment } from "react";
import { Menu, MenuButton, MenuItem, Transition, MenuItems } from '@headlessui/react';
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid"
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDraggable } from "@dnd-kit/core";
import { deleteTask } from "@/api/TaskAPI";
import { toast } from "react-toastify";

type TaskCardProps = {
    task: TaskProject,
    canEdit: boolean
}

export default function TaskCard({ task, canEdit }: TaskCardProps) {

    //drag and drop
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: task._id
    })

    const navigate = useNavigate();

    const queryClient = useQueryClient()


    //Obtener projectId
    const params = useParams()
    const projectId = params.projectId!

    const { mutate } = useMutation({
        mutationFn: deleteTask,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["project", projectId] })
            toast.success(data)
            navigate(location.pathname, { replace: true })
        }
    })

    const style = {
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        transition: isDragging ? 'none' : 'transform 0.2s ease',
        zIndex: isDragging ? 1000 : 1,
        boxShadow: isDragging ? '0px 4px 12px rgba(0, 0, 0, 0.15)' : undefined,
        position: isDragging ? 'relative' : undefined,
      } as React.CSSProperties;

    return (
        <li
            style={style}
            className="p-5 bg-white relative border-slate-300 flex justify-between gap-3">
            <button
                // drag and drop
                {...attributes}
                {...listeners}
                ref={setNodeRef}
                type="button"
                className="min-w-0 flex flex-col gap-y-4 cursor-move"
                onDoubleClick={() => navigate(location.pathname + `?viewTask=${task._id}`)}
                >
                <p
                    //type="button"
                    className="text-xl font-bold text-slate-600 flex justify-between gap-3">
                    {task.name}
                </p>
                <p className="text-slate-500">{task.description}</p>
            </button>
            <div className="flex shrink-0  gap-x-6">
                <Menu as="div" className="relative flex-none">
                    <MenuButton className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                        <span className="sr-only">opciones</span>
                        <EllipsisVerticalIcon className="h-9 w-9 cursor-pointer" aria-hidden="true" />
                    </MenuButton>
                    <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
                        <MenuItems
                            className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                            <MenuItem>
                                <button
                                    type='button'
                                    className='block px-3 py-1 text-sm leading-6 text-gray-900 cursor-pointer'
                                    onClick={() => navigate(location.pathname + `?viewTask=${task._id}`)}
                                >
                                    Ver Tarea
                                </button>
                            </MenuItem>
                            {canEdit && (
                                <>
                                    <MenuItem>
                                        <button
                                            type='button'
                                            className='block px-3 py-1 text-sm leading-6 text-gray-900 cursor-pointer'
                                            onClick={() => navigate(location.pathname + `?editTask=${task._id}`)}
                                        >
                                            Editar Tarea
                                        </button>
                                    </MenuItem>

                                    <MenuItem>
                                        <button
                                            type='button'
                                            className='block px-3 py-1 text-sm leading-6 text-red-500 cursor-pointer'
                                            onClick={() => mutate({ projectId, taskId: task._id })}
                                        >
                                            Eliminar Tarea
                                        </button>
                                    </MenuItem>
                                </>
                            )}
                        </MenuItems>
                    </Transition>
                </Menu>
            </div>
        </li>
    )
}
