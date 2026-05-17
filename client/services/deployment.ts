import apiClient from "./api";

type DeployResponse = {
  message: string;
  url: string;
  files?: string[];
  timestamp: string;
};

type ApiErrorShape = {
  response?: {
    data?: {
      error?: string;
      message?: string;
    };
  };
  message?: string;
};

export async function deployProject(payload: {
  projectId: string;
  files: Record<string, string>;
}): Promise<DeployResponse> {
  try {
    const { data } = await apiClient.post("/api/deploy", payload, { timeout: 30000 });
    return data;
  } catch (error) {
    const apiError = error as ApiErrorShape;
    const message =
      apiError.response?.data?.error ||
      apiError.response?.data?.message ||
      apiError.message ||
      "Deployment failed before the server returned a response.";

    throw new Error(message);
  }
}
