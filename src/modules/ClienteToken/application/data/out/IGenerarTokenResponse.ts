export interface IGenerarTokenResponse {
    isError: boolean;
    autorizado: boolean;
    message: string;
    token: string | null;
}
