import { SPFI } from '@pnp/sp';
import { Logger, LogLevel } from '@pnp/logging';
import { getSP } from '../pnpjsConfig';
import { IPickerTerms } from '@pnp/spfx-controls-react';

interface ICreate {
    CodigoGrupo: string;
    CodigoSector_2: string;
    Denominacion: string;
    Descripcion: string;
    FechaCreacion: Date;
    FechaFinalizacion: Date;
    Estado: boolean;
    TipoGrupo: string;
    Tematica: string;
    Ambito: IPickerTerms;
    Pais: IPickerTerms;
    Ciudad: IPickerTerms;
}

export default class Create {
    private LOG_SOURCE = "Create";
    private LIBRARY_NAME = "Grupos";
    private _sp: SPFI;

    constructor() {
        this._sp = getSP();
    }

    public async createGroup(newItems: ICreate): Promise<void> {
        try {
            const response = await this._sp.web.lists.getByTitle(this.LIBRARY_NAME).items.add(newItems);

            //Usamos el objeto "_sp" donde indicamos el nombre de la lista y los items que queremos añadir
            await this._sp.web.lists.getByTitle("Grupos").items.add(response)
                //En caso de que los items se hayan podido añadir a la lista
                .then((response) => {
                    //Mostramos por consola un mensaje junto a la respuesta
                    console.log("Elemento agregado correctamente:", response);
                })
                //En caso de que haya ocurrido un error
                .catch((error) => {
                    //Mostramos por consola el mensaje de error segiuido del código de error
                    console.error("Error al agregar el elemento:", error);

                });
        } catch (err) {
            Logger.write(`${this.LOG_SOURCE} (createGroup) - ${JSON.stringify(err)} - `, LogLevel.Error);
        }
    }
}
