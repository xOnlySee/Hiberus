import * as React from 'react';
import { ITaller4Props } from './ITaller4Props';

//Nuevas importaciones
import { IFile, /*IResponseItem*/ } from '../interface';
import { DetailsList, PrimaryButton, SelectionMode } from 'office-ui-fabric-react';
import AddGroup from './AddGroup';
import EditGroup from './EditGroup';
import Read from '../crud/read';

export interface ITaller4State {
  items: IFile[];
  errors: string[];
  showAddGroupForm: boolean;
  selectedFile: IFile | null;
  showEditGroup: boolean;
}

/**
 * Clase donde mostraremos la lista de los grupos en el menu principal del WebPart
 */
export default class Taller4 extends React.Component<ITaller4Props, ITaller4State> {
  //Variable donde almacenaremos la URL original (sin el identificador del grupo)
  private originalUrl: string = window.location.href.split("?")[0];

  constructor(props: ITaller4Props) {
    super(props);

    this.state = {
      items: [],
      errors: [],
      showAddGroupForm: false,
      selectedFile: null,
      showEditGroup: false
    };
  }

  /**
   * Método que se ejecutará cuando el WebPart se añada
   */
  public componentDidMount(): void {
    //Creamos e instanciamos una contante de Read() para acceder a sus métodos
    const readInstance = new Read();

    //Invocamos al método para que realice la consulta para obtener los grupos
    readInstance.readAllGroups()
      //En caso de que se haya ejecutado correctamente
      .then((items) => {
        //Mostramos por consola los items obtenidos
        console.log("Items de la lista:", items);

        //Actualizaos el estado con los items obtenidos
        this.setState({ items });
      })

      //En caso de que ocurra un error
      .catch((error) => {
        //Mostramos un mensaje de error por consola
        console.error("Error al ejecutar readAllGroups:", error);
      });
  }

  /**
   * Método donde declararemos la funcionabilidad del botón "Añadir grupo"
   */
  private handleAddGroupClic = () => {
    this.setState({ showAddGroupForm: true });
  }

  /**
   * Método donde declararemos la funcionabilidad del los items al ser pulsados
   */
  private showEditGroup = (): void => {
    this.setState({ showEditGroup: true });
  }

  /**
   * Método donde añadiremos la funcionabilidad cuando el usuario haga doble clic sobre el item que quiera editar
   * @param item Variable de tipo IFile que representa el items seleccionado de la lista de grupos
   */
  private handleItemInvoked = (item: IFile): void => {
    this.setState({ selectedFile: item }, () => {
      this.showEditGroup();
    });
  }


  /**
   * Método utilizado para definir y devolver la estructura y el contenido de la GUI del componente a renderizar
   * @returns Devuelve el diseño de la interfaz del WebPart
   */
  public render(): React.ReactElement<ITaller4Props> {
    //Actualizamos la URL quitando el identificador del grupo
    window.history.replaceState({ path: this.originalUrl }, '', this.originalUrl);

    //Constante utilizado para definicir las columnas y sus ajustes
    const columns = [
      { key: 'CodigoGrupo', name: 'Código del grupo', fieldName: 'CodigoGrupo', minWidth: 100, maxWidth: 200, isResizable: true },
      { key: 'Denominacion', name: 'Denominación', fieldName: 'Denominacion', minWidth: 100, maxWidth: 200, isResizable: true },
      { key: 'FechaCreacion', name: 'Fecha de creación', fieldName: 'FechaCreacion', minWidth: 100, maxWidth: 200, isResizable: true },
      { key: 'FechaFinalizacion', name: 'Fecha de finalización', fieldName: 'FechaFinalizacion', minWidth: 100, maxWidth: 200, isResizable: true },
      { key: 'Estado', name: 'Estado', fieldName: 'Estado', minWidth: 100, maxWidth: 200, isResizable: true },
      { key: 'TipoGrupo', name: 'Tipo de grupo', fieldName: 'TipoGrupo', minWidth: 100, maxWidth: 200, isResizable: true },
      { key: 'Tematica', name: 'Temática', fieldName: 'Tematica', minWidth: 100, maxWidth: 200, isResizable: true }
    ];

    return (
      <div>
        {!this.state.showAddGroupForm && !this.state.showEditGroup && (
          <PrimaryButton onClick={this.handleAddGroupClic}>Añadir grupo</PrimaryButton>
        )}
        {this.state.showAddGroupForm ? (
          <AddGroup context={this.props.context} />
        ) : this.state.showEditGroup ? (
          <EditGroup
            context={this.props.context}
            selectedItem={this.state.selectedFile} />
        ) : (
          <div>
            <DetailsList
              items={this.state.items}
              columns={columns}
              selectionMode={SelectionMode.none}
              onItemInvoked={this.handleItemInvoked} />
          </div>
        )}
      </div>
    );

  }
}