import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: "http://localhost:8080"
});

export class CidadeService {
    static excluirCidade(id: any) {
        throw new Error("Method not implemented.");
    }
    static alterarCidade(_objeto: any) {
        throw new Error("Method not implemented.");
    }
    static inserirCidade(_objeto: any) {
        throw new Error("Method not implemented.");
    }
    async buscarTodos(): Promise<any> {
        return await axiosInstance.get('/api/cidade/');
    }

    async alterarCidade(_objeto: any): Promise<any> {
        return await axiosInstance.put('/api/cidade/', _objeto);
    }

    async inserirCidade(_objeto: any): Promise<any> {
        return await axiosInstance.post('/api/cidade/', _objeto);
    }

    async excluirCidade(id: string): Promise<any> {
        return await axiosInstance.delete(`/api/cidade/${id}`);
    }
}



