
import { Cidade } from '@/types';
import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: "http://localhost:8080"
})

export class CidadeService {
    static buscarCidade() {
        throw new Error("Method not implemented.");
    }
    buscarCidades() {
        throw new Error("Method not implemented.");
    }
    static alterarCidade(_objeto: any) {
        throw new Error("Method not implemented.");
    }
    static buscarTodos() {
        throw new Error("Method not implemented.");
    }
    static atualizarCidade(_objeto: any) {
        throw new Error("Method not implemented.");
    }
    static inserirCidade(_objeto: any) {
        throw new Error("Method not implemented.");
    }
    static excluirCidade(id: any) {
        throw new Error("Method not implemented.");
    }
    async buscarTodos(): Promise<any> {
        return await axios.get('/api/cidade/');
    }

    async inserirCidade(cidade: Cidade): Promise<any> {
        return await axios.post('/api/cidade/', cidade);
    }

    async alterarCidade(cidade: Cidade): Promise<any> {
        return await axios.put(`${'/api/cidade/'}/${cidade.id}`, cidade);
    }

    async excluirCidade(id: string): Promise<any> {
        return await axios.delete(`${'/api/cidade/'}/${id}`);
    }
}


// import axios from 'axios';
// import { Cidade } from '@/types';

// const API_URL = 'http://localhost:3000'; // URL da API

// export class CidadeService {
//     static buscarCidadesPorEstado(selectedEstado: string) {
//         throw new Error('Method not implemented.');
//     }
//     // Método para buscar todas as cidades
//     static async buscarTodos(): Promise<Cidade[]> {
//         const response = await axios.get<Cidade[]>(`${API_URL}/cidades`);
//         return response.data;
//     }

//     // Método para buscar uma cidade pelo ID
//     static async buscarPorId(id: string): Promise<Cidade | null> {
//         const response = await axios.get<Cidade>(`${API_URL}/cidades/${id}`);
//         return response.data;
//     }

//     // Método para inserir uma nova cidade
//     static async inserirCidade(cidade: Cidade): Promise<Cidade> {
//         const response = await axios.post<Cidade>(`${API_URL}/cidades`, cidade);
//         return response.data;
//     }

//     // Método para atualizar uma cidade existente
//     static async atualizarCidade(cidade: Cidade): Promise<Cidade> {
//         const response = await axios.put<Cidade>(`${API_URL}/cidades/${cidade.id}`, cidade);
//         return response.data;
//     }

//     // Método para excluir uma cidade pelo ID
//     static async excluirCidade(id: string): Promise<void> {
//         await axios.delete(`${API_URL}/cidades/${id}`);
//     }
// }


