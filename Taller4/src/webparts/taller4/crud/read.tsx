//Importaciones
import { SPFI, spfi } from '@pnp/sp'
import { Caching } from "@pnp/queryable";
import { Logger, LogLevel } from '@pnp/logging';
import { ICodigoSector, ICodigoSectorResponse, IFile, IResponseItem } from '../interface';
import { getSP } from '../pnpjsConfig';

/**
 * Clase donde añadiremos los métodos para realizar consultas a las listas
 */
export default class Read {
    //Objeto de tipo SPFI
    private _sp: SPFI;

    //Constructor de la clase "Read"
    constructor() {
        this._sp = getSP();
    }

    /**
     * Método donde obtendremos los items mediante una consulta para obtener los grupos de la lista "Grupos"
     * @returns Devuelve los items obtenidos de la consulta a "Grupos"
     */
    public async readAllGroups(): Promise<IFile[]> {
        try {
            const spCache = spfi(this._sp).using(Caching({ store: "session" }));

            const response: IResponseItem[] = await spCache.web.lists
                .getByTitle("Grupos")
                .items
                .select("CodigoGrupo", "Denominacion", "Descripcion", "FechaCreacion", "FechaFinalizacion", "Estado", "TipoGrupo", "Tematica")();

            const items: IFile[] = response.map((item: IResponseItem) => {
                return {
                    CodigoGrupo: item.CodigoGrupo,
                    Denominacion: item.Denominacion,
                    Descripcion: item.Descripcion,
                    FechaCreacion: item.FechaCreacion,
                    FechaFinalizacion: item.FechaFinalizacion,
                    Estado: item.Estado,
                    TipoGrupo: item.TipoGrupo,
                    Tematica: item.Tematica
                };
            });

            return items;
        } catch (err) {
            Logger.write(`${"Read"} (_readAllGroups) - ${JSON.stringify(err)} - `, LogLevel.Error);
            throw err;
        }
    }

    /**
     * Método donde obtendremos los items de la columna "CodigoSector" de la lista "Sectores"
     */
    public async readSelectorCode(): Promise<ICodigoSector[]> {
        try {
            const spCache = spfi(this._sp).using(Caching({ store: "session" }));

            const response: ICodigoSectorResponse[] = await spCache.web.lists
                .getByTitle("Sectores")
                .items
                .select("CodigoSelector")();

            const items: ICodigoSector[] = response.map((item: ICodigoSectorResponse) => {
                return {
                    CodigoSelector: item.CodigoSelector
                };
            });

            return items
        } catch (err) {
            Logger.write(`${"Read"} (_selectorCode) - ${JSON.stringify(err)} - `, LogLevel.Error);
        }
    }
}
