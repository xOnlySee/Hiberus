export interface IFile {
    Title: string;
    CodigoGrupo: string;
    Denominacion: string;
    Descripcion: string;
    FechaCreacion: string;
    FechaFinalizacion: string;
    Estado: string;
    TipoGrupo: string;
    Tematica: string;
}

export interface IResponseItem {
    Title: string;
    CodigoGrupo: string;
    Denominacion: string;
    Descripcion: string;
    FechaCreacion: string;
    FechaFinalizacion: string;
    Estado: string;
    TipoGrupo: string;
    Tematica: string;
}

export interface ICodigoSector {
    CodigoSelector: string;
}

export interface ICodigoSectorResponse {
    CodigoSelector: string;
}