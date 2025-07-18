export interface User {
    id: number;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    authorities: Array<{ authority: string }>;
    token: string;
}