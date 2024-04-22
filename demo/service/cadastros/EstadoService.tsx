import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: "http://localhost:8080"
})

export class EstadoService {
    static excluirEstado(id: any) {
        throw new Error("Method not implemented.");
    }
    static inserirEstado(_objeto: any) {
        throw new Error("Method not implemented.");
    }
    static alterar(_objeto: any) {
        throw new Error("Method not implemented.");
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
