
import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: "http://localhost:8080"
});

export class PessoaService {

    async buscarTodos(): Promise<any> {
        return await axiosInstance.get('/api/estado/');
    }

    async alterarPessoa(_objeto: any): Promise<any> {
        return await axiosInstance.put('/api/pessoa/', _objeto);
    }

    async inserirPessoa(_objeto: any): Promise<any> {
        return await axiosInstance.post('/api/pessoa/', _objeto);
    }

    async excluirPessoa(id: string): Promise<any> {
        return await axiosInstance.delete(`/api/pessoa/${id}`);
    }
}
