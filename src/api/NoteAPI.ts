import api from "@/lib/axios";
import { Note, NoteFormData, Project, Task } from "../types";
import { isAxiosError } from "axios";

type NoteAPIType = {
  formData: NoteFormData;
  projectId: Project["_id"];
  taskId: Task["_id"];
  noteId: Note["_id"]
};

export async function createNote({
  formData,
  projectId,
  taskId,
}: Pick<NoteAPIType, "formData" | "projectId" | "taskId">) {
  try {
    const { data } = await api.post<string>(
      `/projects/${projectId}/tasks/${taskId}/notes`,
      formData
    );
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}


export async function deleteNote({
    projectId,
    taskId,
    noteId
  }: Pick<NoteAPIType, "projectId" | "taskId" | "noteId" >) {
    try {
      const { data } = await api.delete<string>(`/projects/${projectId}/tasks/${taskId}/notes/${noteId}`);
      return data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.error);
      }
    }
  }
