import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: "http://localhost:8080"
})

export class CidadeService {
    static buscarTodos: any;
    static alterarCidade(_objeto: any) {
        return axiosInstance.put('/api/cidade/', _objeto);
    }

    static excluirCidade(id: any) {
        return axiosInstance.delete(`/api/cidade/${id}`);
    }

    static inserirCidade(_objeto: any) {
        return axiosInstance.post('/api/cidade/', _objeto);
    }

    buscarTodos() {
        return axiosInstance.get('/api/cidade/');
    }

    inserir(cidade: any) {
        return axiosInstance.post('/api/cidade/', cidade);
    }

    alterar(cidade: any) {
        return axiosInstance.put('/api/cidade/', cidade);
    }

    excluir(id: string) {
        return axiosInstance.delete(`/api/cidade/${id}`);
    }
}
