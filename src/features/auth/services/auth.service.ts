
import { AUTH_ENDPOINTS } from "./endpoints";

import { AxiosInstance } from "axios";
import { LoginSchema, RegisterSchema } from "../types/auth.schema";
 /*
export async function register<TRequest extends Record<string, any>, TResponse = any>(payload: TRequest): Promise<TResponse> {
  const { data } = await api.post<TResponse>(AUTH_ENDPOINTS.register, payload);
  return data;
}
*/
export const makeAuthService = (API_CLIENT: AxiosInstance) => ({

  async registerUser(payload: RegisterSchema){
    const response = await API_CLIENT.post(AUTH_ENDPOINTS.register, payload)
    return response.data
  },

  async loginUser(payload: LoginSchema){
    const response = await API_CLIENT.post(AUTH_ENDPOINTS.login, payload)
    return response.data
  },

  async logoutUser(){
    const response = await API_CLIENT.post(AUTH_ENDPOINTS.logout)
    return response.data
  },

  async recoverPasswordUser(payload: { email: string; nueva_contrasena: string }){
    const response = await API_CLIENT.post(AUTH_ENDPOINTS.recoverPassword, payload)
    return response.data
  }
})