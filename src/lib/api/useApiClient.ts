import { useMemo } from "react";
import type { AxiosInstance } from "axios";
import { api } from "@/lib/api/client";

export const useApiClient = (): AxiosInstance => {
  const client = useMemo(() => api, []);
  return client;
};
