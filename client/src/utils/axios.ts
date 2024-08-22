import axios, { Axios, AxiosError, AxiosResponse } from "axios";
import { apiUrl } from "./constants";
import { ErrorResponse, SuccessResponse } from "@/types/response";

export const post = async <P, R>(
    endpoint: string,
    token: string | undefined,
    payload: P
): Promise<R | undefined> => {
    try {
        const result = await axios.post(`${apiUrl}/api${endpoint}`, payload, {
            headers: { Authorization: `Bearer ${token}` },
        });

        const response: SuccessResponse<R> = result.data;
        const data = response.data!;

        return data;
    } catch (error) {
        const data: ErrorResponse = (error as AxiosError).response
            ?.data as ErrorResponse;
        throw new Error(`${data.status}:${data.message}`);
    }
};

export const get = async <R>(
    endpoint: string,
    token: string | undefined,
    query: string | undefined
): Promise<R | undefined> => {
    try {
        const result = await axios.get(
            `${apiUrl}/api${endpoint}${query ? `?${query}` : ""}`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        const response: SuccessResponse<R> = result.data;
        const data = response.data!;

        return data;
    } catch (error) {
        const data: ErrorResponse = (error as AxiosError).response
            ?.data as ErrorResponse;
        throw new Error(`${data.status}:${data.message}`);
    }
};
