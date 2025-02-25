import { useQuery, useMutation } from "react-query";
import api from "./api";

export const useUserQuery = () =>
  useQuery("user", async () => {
    const { data } = await api.get("/user/profile");
    return data;
  });

export const useLoginMutation = () =>
  useMutation(async (credentials: { email: string; password: string }) => {
    const { data } = await api.get("/auth/login", credentials);
    return data;
  });
