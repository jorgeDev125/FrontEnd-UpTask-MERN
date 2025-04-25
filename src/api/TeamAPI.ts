import api from "@/lib/axios";
import { isAxiosError } from "axios";
import { Project, TeamMember, TeamMemberForm, teamMembersSchema } from "../types";

export async function findUserByEmail({
  formData,
  projectId,
}: {
  formData: TeamMemberForm;
  projectId: Project["_id"];
}) {
  try {
    const { data } = await api.post(
      `/projects/${projectId}/team/find`,
      formData
    );
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function addUserToProject({
  id,
  projectId,
}: {
  id: TeamMember["_id"];
  projectId: Project["_id"];
}) {
  try {
    const { data } = await api.post(`/projects/${projectId}/team`, { id });
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function getTeamProject(projectId: Project["_id"]) {
  try {
    const { data } = await api(`/projects/${projectId}/team`);
    const response = teamMembersSchema.safeParse(data);

    if (response.success) {
      return response.data;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function removeUserFromProject({ userId, projectId }: {userId: TeamMember["_id"], projectId: Project["_id"] }) {
    try {
      const { data } = await api.delete<string>(`/projects/${projectId}/team/${userId}` );
      return data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.error);
      }
    }
  }