export interface IFile {
    Title: string;
    CodigoGrupo: string;
    Denominacion: string;
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
    FechaCreacion: string;
    FechaFinalizacion: string;
    Estado: string;
    TipoGrupo: string;
    Tematica: string;
}

export interface ICodigoSector {
    CodigoSector: string;
}

export interface ICodigoSectorResponse {
    CodigoSector: string;
}