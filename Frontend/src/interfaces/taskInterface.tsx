export interface TaskInterface {
    id: number;
    title: string;
    description: string;
    due_date: string;
    complete: number;
    id_account: number;
}

export interface TaskFormInterface {
    id?: number;
    title: string;
    description: string;
    due_date: string;
    complete: number;
    id_account: number;
}