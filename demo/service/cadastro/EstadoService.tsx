import { axiosInstance } from './CidadeService';

const API_URL = 'http://localhost:3000'; // URL da API

export class EstadoService {
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

