
import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: "http://localhost:8080"
});

export class EstadoService {
    inserirCidade(_objeto: any) {
        throw new Error("Method not implemented.");
    }
    alterarCidade(_objeto: any) {
        throw new Error("Method not implemented.");
    }
    static excluirEstado(id: any) {
        throw new Error("Method not implemented.");
    }
    static alterarEstado(_objeto: any) {
        throw new Error("Method not implemented.");
    }
    static inserirEstado(_objeto: any) {
        throw new Error("Method not implemented.");
    }
    async buscarTodos(): Promise<any> {
        return await axiosInstance.get('/api/estado/');
    }

    async alterarEstado(_objeto: any): Promise<any> {
        return await axiosInstance.put('/api/estado/', _objeto);
    }

    async inserirEstado(_objeto: any): Promise<any> {
        return await axiosInstance.post('/api/estado/', _objeto);
    }

    async excluirEstado(id: string): Promise<any> {
        return await axiosInstance.delete(`/api/cidade/${id}`);
    }
}





/* import { Estado } from '@/types';
import { axiosInstance } from './CidadeService';

const API_URL = 'http://localhost:3000'; // URL da API

export class EstadoService {
    alterarCidade(_objeto: Estado) {
        throw new Error("Method not implemented.");
    }
    inserirCidade(_objeto: Estado) {
        throw new Error("Method not implemented.");
    }
    excluirCidade(id: any) {
        throw new Error("Method not implemented.");
    }
    static alterar: any;
    static inserirEstado: any;
    static excluirEstado: any;



    buscarTodos() {
        return axiosInstance.get('/api/estado/');
    }

    inserir(_objeto: any) {
        return axiosInstance.post('/api/estado/', _objeto);
    }

    alterar(_objeto : any) {
        return axiosInstance.put('/api/estado/', _objeto);
    }

    excluir(id: number) {
        return axiosInstance.delete(`/api/estado/${id}`);
    }
}

 */
