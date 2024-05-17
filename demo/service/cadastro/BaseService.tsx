

/* import { Cidade } from '@/types';
import { BaseService } from './BaseService';


export class CidadeService extends BaseService {
    inserirCidade(_objeto: any) {
        throw new Error('Method not implemented.');
    }
    excluirCidade(id: any) {
        throw new Error('Method not implemented.');
    }
    alterarCidade(_objeto: any) {
        throw new Error('Method not implemented.');
    }
    constructor(){
        super("/cidade")
    }
};
 */





/* import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: "http://localhost:8080"
});

export class BaseService{

    url: string;

    constructor(url: string) {
        this.url = url;
    }

    buscarTodos(){
        return axiosInstance.get(this.url);
    }

    buscarPorId(id : number) {
        return axiosInstance.post(this.url + "/" + id);
    }

    inserir(_objeto : any) {
        return axiosInstance.post(this.url, _objeto);
    }

    alterar(_objeto : any) {
        return axiosInstance.put(this.url, _objeto);
    }

    excluir(id : number) {
        return axiosInstance.delete(this.url + "/" + id);
    }
}
 */


/* import axios from 'axios';
import { BaseService } from './BaseService';


export class EstadoService extends BaseService {
    static excluirEstado(id: any) {
        throw new Error("Method not implemented.");
    }
    static inserirEstado(_objeto: any) {
        throw new Error("Method not implemented.");
    }
    static alterar(_objeto: any) {
        throw new Error("Method not implemented.");
    }
    constructor(){
        super("/estado")
    }
};
 */
