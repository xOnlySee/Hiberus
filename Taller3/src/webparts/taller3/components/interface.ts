export interface IFile {
    Id: number;
    Title: string;
    Description: string;
    Category: string;
    PublicationDate: string;
    URL: string;
    Responsible: string | { Title: string } | null; // Agrega null para manejar el caso cuando no hay responsable
}

export interface IResponseItem {
    Id: number;
    FileLeafRef: string;
    Title: string;
    Description: string;
    Category: string;
    PublicationDate: string;
    URL: string;
    Responsible: string | { Title: string } | null; // Agrega null para manejar el caso cuando no hay responsable
}