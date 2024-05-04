import { Estado } from ".";

declare namespace Estado {
    type Task = {
        id?: number;
        name: string;
        sigla: string;
    };
}
