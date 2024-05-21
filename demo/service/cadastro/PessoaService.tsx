
import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: "http://localhost:8080"
});

export class PessoaService {
    // inserirCidade(_objeto: any) {
    //     throw new Error("Method not implemented.");
    // }
    // alterarCidade(_objeto: any) {
    //     throw new Error("Method not implemented.");
    // }
    // static excluirPessoa(id: any) {
    //     throw new Error("Method not implemented.");
    // }
    // static alterarPessoa(_objeto: any) {
    //     throw new Error("Method not implemented.");
    // }
    // static inserirPessoa(_objeto: any) {
    //     throw new Error("Method not implemented.");
    // }
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
