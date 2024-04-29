import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: "http://localhost:8080"
})

export class EstadoService {
    static alterar(_objeto: any) {
        throw new Error("Method not implemented.");
    }
    static buscarTodos() {
        throw new Error("Method not implemented.");
    }
    static alterarEstado(_objeto: any) {
        return axiosInstance.put('/api/estado/', _objeto);
    }

    static excluirEstado(id: any) {
        return axiosInstance.delete(`/api/estado/${id}`);
    }

    static inserirEstado(_objeto: any) {
        return axiosInstance.post('/api/estado/', _objeto);
    }

    buscarTodos() {
        return axiosInstance.get('/api/estado/');
    }

    inserir(estado: any) {
        return axiosInstance.post('/api/estado/', estado);
    }

    alterar(estado: any) {
        return axiosInstance.put('/api/estado/', estado);
    }

    excluir(id: string) {
        return axiosInstance.delete(`/api/estado/${id}`);
    }
}
