import axios from 'axios';

export class EstadoService {

    url = process.env.REACT_APP_URL_API;
     estados() {
        return axios.get(this.url+'/estado/');
     }

     inserir(objeto: any) {
        return axios.post(this.url+'/estado/', objeto);
     }

     alterar(objeto: any) {
        return axios.put(this.url+'/estado/',objeto);
     }

     excluir(id: string) {
        return axios.delete(this.url+'/estado/'+id)
     }
}
