import { Pessoa } from ".";

declare namespace Pessoa {
        interface Task {
        id?: number | null;
        nomeCompleto?: string;
        cpf?: string;
        email?: string;
        endereco?: string;
        cep?: string;
    };
}
