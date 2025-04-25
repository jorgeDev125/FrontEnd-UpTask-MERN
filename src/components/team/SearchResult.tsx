import { addUserToProject } from "@/api/TeamAPI"
import { TeamMember } from "@/types/index"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate , useParams } from "react-router-dom"
import { toast } from "react-toastify"


type SearchResultProps = {
    user: TeamMember,
    reset: () => void
}

export default function SearchResult({ user, reset }: SearchResultProps) {

    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const params = useParams()
    const projectId = params.projectId!

    const { mutate } = useMutation({
        mutationFn: addUserToProject,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["TeamProject", projectId] })
            toast.success(data)
            reset()
            navigate(location.pathname, { replace: true })

        }
    })

    const handleAddUserToProject = () => {
        const data = {
            id: user._id,
            projectId
        }
        mutate(data)
    }




    return (

        <>
            <p className="mt-10 text-center font-bold">Resultado:</p>
            <div className="flex justify-between items-center">
                <p
                    className=" font-medium"
                >{user.name}</p>
                <button
                    type="button"
                    className=" hover:bg-purple-100 px-10 py-3  text-purple-600 font-bold cursor-pointer"
                    onClick={handleAddUserToProject}
                >Agregar al proyecto</button>


            </div>

        </>
    )
}
