import * as React from 'react';
import { ITaller4Props } from './ITaller4Props';

//Nuevas importaciones
import { Caching } from "@pnp/queryable";
import { IFile, IResponseItem } from '../interface';
import { SPFI, spfi } from '@pnp/sp';
import { getSP } from '../pnpjsConfig';
import { LogLevel, Logger } from '@pnp/logging';
import { DetailsList, PrimaryButton } from 'office-ui-fabric-react';
import AddGroup from './AddGroup';

export interface ITaller4State {
  items: IFile[];
  errors: string[];
  showAddGroupForm: boolean;
}

/**
 * Clase donde mostraremos la lista de los grupos en el menu principal del WebPart
 */
export default class Taller4 extends React.Component<ITaller4Props, ITaller4State> {
  private LOG_SOURCE = "Taller4"
  private LIBRARY_NAME = "Grupos"
  private _sp: SPFI;

  constructor(props: ITaller4Props) {
    super(props);

    this.state = {
      items: [],
      errors: [],
      showAddGroupForm: false
    };
    this._sp = getSP();
  }

  /**
   * Método que se ejecutará cuando el WebPart se añada
   */
  public componentDidMount(): void {
    this._readAllFilesSize().catch;
  }

  /**
   * Método donde obtendremos los elementos de la lista "Grupos"
   */
  private _readAllFilesSize = async (): Promise<void> => {
    try {
      const spCache = spfi(this._sp).using(Caching({ store: "session" }));

      const response: IResponseItem[] = await spCache.web.lists
        .getByTitle(this.LIBRARY_NAME)
        .items
        .select("Title", "CodigoGrupo", "Denominacion", "FechaCreacion", "FechaFinalizacion", "Estado", "TipoGrupo", "Tematica")();

      const items: IFile[] = response.map((item: IResponseItem) => {
        return {
          Title: item.Title,
          CodigoGrupo: item.CodigoGrupo,
          Denominacion: item.Denominacion,
          FechaCreacion: item.FechaCreacion,
          FechaFinalizacion: item.FechaFinalizacion,
          Estado: item.Estado,
          TipoGrupo: item.TipoGrupo,
          Tematica: item.Tematica
        };
      });

      this.setState({ items });
    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (_readAllFilesSize) - ${JSON.stringify(err)} - `, LogLevel.Error);
    }
  }

  /**
   * Método donde declararemos la funcionabilidad del botón "Añadir grupo"
   */
  private handleAddGroupClic = () => {
    console.log("Botón de añadir grupo pulsado");
    this.setState({ showAddGroupForm: true }); // Cambiado a showAddGroupForm
  }


  /**
   * Método utilizado para definir y devolver la estructura y el contenido de la GUI del componente a renderizar
   * @returns Devuelve el diseño de la interfaz del WebPart
   */
  public render(): React.ReactElement<ITaller4Props> {
    //Constante utilizado para definicir las columnas y sus ajustes
    const columns = [
      { key: 'IDGrupo', name: 'ID del grupo', fieldName: 'Title', minWidth: 100, maxWidth: 200, isResizable: true },
      { key: 'CodigoGrupo', name: 'Código del grupo', fieldName: 'CodigoGrupo', minWidth: 100, maxWidth: 200, isResizable: true },
      { key: 'Denominacion', name: 'Denominación', fieldName: 'Denominacion', minWidth: 100, maxWidth: 200, isResizable: true },
      { key: 'FechaCreacion', name: 'Fecha de creación', fieldName: 'FechaCreacion', minWidth: 100, maxWidth: 200, isResizable: true },
      { key: 'FechaFinalizacion', name: 'Fecha de finalización', fieldName: 'FechaFinalizacion', minWidth: 100, maxWidth: 200, isResizable: true },
      { key: 'Estado', name: 'Estado', fieldName: 'Estado', minWidth: 100, maxWidth: 200, isResizable: true },
      { key: 'TipoGrupo', name: 'Tipo de grupo', fieldName: 'TipoGrupo', minWidth: 100, maxWidth: 200, isResizable: true },
      { key: 'Tematica', name: 'Temática', fieldName: 'Tematica', minWidth: 100, maxWidth: 200, isResizable: true }
    ];

    let listView = <DetailsList items={this.state.items} columns={columns} />;

    return (
      <div>
        {!this.state.showAddGroupForm && (
          <PrimaryButton onClick={this.handleAddGroupClic}>Añadir grupo</PrimaryButton>
        )}
        {this.state.showAddGroupForm ? (
          <AddGroup context={this.props.context} />
        ) : (
          listView
        )}
      </div>
    );
  }
}