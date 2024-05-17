import { Estado } from ".";

declare namespace Estado {
    type Task = {
        id?: number;
        name?: string;
        sigla?: string;
        inventoryStatus?: InventoryStatus;
        [key: string]: string | string[] | number | boolean | undefined | ProductOrder[] | InventoryStatus;
    };
}

