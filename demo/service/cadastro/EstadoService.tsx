import { axiosInstance } from './CidadeService';

const API_URL = 'http://localhost:3000'; // URL da API

export class EstadoService {
    static buscarTodos() {
        throw new Error('Method not implemented.');
    }
    static alterarEstado(_objeto: any) {
        throw new Error('Method not implemented.');
    }
    static inserirEstado(_objeto: any) {
        throw new Error('Method not implemented.');
    }
    static excluirEstado(id: any) {
        throw new Error('Method not implemented.');
    }
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


// export class EstadoService {

//     static excluirEstado(id: any) {
//         throw new Error('Method not implemented.');
//     }
//     static inserirEstado(_objeto: any) {
//         throw new Error('Method not implemented.');
//     }
//     excluirEstado(id: any) {
//         throw new Error('Method not implemented.');
//     }
//     static alterarEstado(_objeto: any) {
//         throw new Error('Method not implemented.');
//     }
//     // Método para buscar todos os registros de um determinado tipo
//     static async buscarTodos(): Promise<any[]> {
//         const response = await axios.get<any[]>(`${API_URL}/estados`);
//         return response.data;
//     }

//     // Método para buscar um registro de um determinado tipo pelo ID
//     static async buscarPorId(tipo: string, id: string): Promise<any | null> {
//         const response = await axios.get<any>(`${API_URL}/${tipo}/${id}`);
//         return response.data;
//     }

//     // Método para inserir um novo registro de um determinado tipo
//     static async inserirRegistro(tipo: string, registro: any): Promise<any> {
//         const response = await axios.post<any>(`${API_URL}/${tipo}`, registro);
//         return response.data;
//     }

//     // Método para atualizar um registro existente de um determinado tipo
//     static async atualizarRegistro(tipo: string, registro: any): Promise<any> {
//         const response = await axios.put<any>(`${API_URL}/${tipo}/${registro.id}`, registro);
//         return response.data;
//     }

//     // Método para excluir um registro de um determinado tipo pelo ID
//     static async excluirRegistro(tipo: string, id: string): Promise<void> {
//         await axios.delete(`${API_URL}/${tipo}/${id}`);
//     }
// }
