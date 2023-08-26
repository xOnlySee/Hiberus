import * as React from 'react';
//import styles from './Taller3.module.scss';
import { ITaller3Props } from './ITaller3Props';

//Nuevas importaciones
import { Caching } from "@pnp/queryable";
import { getSP } from '../pnpjsConfig';
import { SPFI, spfi } from "@pnp/sp";
import { Logger, LogLevel } from "@pnp/logging";
import { DetailsList, Dropdown, TextField } from 'office-ui-fabric-react';
import { IFile, IResponseItem } from './interface';
import CardComponent from './CardComponent';

export interface IAsyncAwaitPnPJsProps {
  description: string;
}

export interface Italler3State {
  items: IFile[];
  errors: string[];
}

interface ITaller3State {
  items: IFile[];
  errors: any[];

  //Término que ha ingresado el usuario en la barra de búsqueda
  searchTerm: string;

  //Categoría seleccionada por el usuario a la hora de filtrar
  selectedCategory: string;

  //Responsable seleccionado por el usuario a la hora de filtrar
  selectedResponsible: string;
}

/**
 * Clase donde gestionaremos la lógica del WebPart
 */
export default class Taller3 extends React.Component<ITaller3Props, ITaller3State> {
  private LOG_SOURCE = "Taller3";
  private LIBRARY_NAME = "Listado noticias";
  private _sp: SPFI;

  constructor(props: ITaller3Props) {
    super(props);
    
    this.state = {
      items: [],
      errors: [],

      //Inicializamos los campos
      searchTerm: "",
      selectedCategory: "",
      selectedResponsible: ""
    };
    this._sp = getSP();
  }

  /**
   * Método que se ejecutará cuando el WebPart se haya añadido
   */
  public componentDidMount(): void {
    this._readAllFilesSize().catch;
  }

  /**
   * Método que se ejecuta cada vez que el componente se haya actualizado
   * @param prevProps Propiedades del componente antes de actualizar
   * @param prevState Estado del componente que tenía antes de actualizar
   */
  public componentDidUpdate(prevProps: ITaller3Props, prevState: ITaller3State) {
    if (prevState.searchTerm !== this.state.searchTerm) {
      this.handleSearchChange(this.state.searchTerm);
    }
  }  

  /**
   * Manejador de eventos que se llama cada vez que el usuario realiza cambios en el campo de búsqueda
   * @param newValue Variable de tipo String que representa el valor del campo de búsqueda
   */
  handleSearchChange = (newValue: string) => {
    //Inicializamos un creamos un Array para almacenar los elementos filtrados
    let filteredItems: IFile[] = [];
  
    //En caso de que la variable "newValue" no esta vacía
    if (newValue !== "") {
      //Usamos el método .filter() sobre el Array de elementos filtrados donde realizaremos la configuración para que busque sobre el titulo o la descripción
      filteredItems = this.state.items.filter(item =>
        item.Title.toLowerCase().indexOf(newValue.toLowerCase()) !== -1 ||
        item.Description.toLowerCase().indexOf(newValue.toLowerCase()) !== -1
      );

    //En caso de que la variable "newValue" este vácia
    } else {
      filteredItems = this.state.items;
    }
  
    //Actualizamos el estado de la función "handleSearchChange"
    this.setState({
      searchTerm: newValue,
      items: filteredItems,
    });
  }

  /**
   * Manejador de eventos para cada vez que se eliga un tipo de categoria
   * @param selectedCategory Variable de tipo String que representa el tipo de categoria seleccionada por el usuario
   */
  handleCategoryChange = (selectedCategory: string) => {
    //Constante que almacenará los items filtrados
    const filteredItems = this.state.items.filter(item =>
      !selectedCategory || item.Category === selectedCategory
    );
  
    //Actualizamos el estado de la función "handleCategoryChange"
    this.setState({
      selectedCategory,
      items: filteredItems,
    });
  }

  /**
   * Manejador de eventos para cada vez que se eliga un tipo de categoria
   * @param selectedResponsible 
   */
  handleResponsibleChange = (selectedResponsible: string) => {
    //Constante que almacenará los items filtrados
    const filteredItems = this.state.items.filter(item =>
      !selectedResponsible || item.Responsible === selectedResponsible);

    //Actualizamos el estado de la función "handleResponsibleChange"
    this.setState({
      selectedResponsible,
      items: filteredItems
    })
  }

  /**
   * Método utilizado para definir y devolver la estructura y el contenido de la GUI del componente a renderizar
   * @returns Devuelve el diseño de la interfaz del WebPart
   */
  public render(): React.ReactElement<ITaller3Props> {
    //Constante utilizado para definicir las columnas y sus ajustes
    const columns = [
      { key: 'title', name: 'Titulo de la noticia', fieldName: 'Title', minWidth: 100, maxWidth: 200, isResizable: true },
      { key: 'description', name: 'Descripción de la noticia', fieldName: 'Description', minWidth: 100, maxWidth: 200, isResizable: true },
      { key: 'category', name: 'Categoria', fieldName: 'Category', minWidth: 100, maxWidth: 200, isResizable: true },
      { key: 'publicationDate', name: 'Fecha de publicación', fieldName: 'PublicationDate', minWidth: 100, maxWidth: 200, isResizable: true },
      { key: 'Responsible', name: 'Responsable', fieldName: 'Responsible', minWidth: 100, maxWidth: 200, isResizable: true },
      { key: 'URL', name: 'URL de la imagen', fieldName: 'URL', minWidth: 100, maxWidth: 200, isResizable: true },
    ];

    //Declaramos la variable "listView" que va a ser donde se almacené la lista formateada
    let listView;

    //Comprobamos el contenido de la propiedad "viewMode"
    //En caso de que la propiedad que haya sido pulsada sea "listado". Añadimos la barra de búsqueda y el ListView con los elementos
    if (this.props.viewMode === "listado") {
      listView = (
        <div>
          <TextField
            label="Buscar"
            value={this.state.searchTerm}
            onChange={(_, newValue) => this.handleSearchChange(newValue)}
          />
          <DetailsList items={this.state.items} columns={columns}/>
        </div>
      );

    //En caso de que la propiedades que haya sido pulsada sea "tarjeta". Añadimos la barra de búsqueda y el CardView con los elementos
    } else if (this.props.viewMode === "tarjeta") {
      listView = (
        <div>
          <TextField
            label="Buscar"
            value={this.state.searchTerm}
            onChange={(_, newValue) => this.handleSearchChange(newValue)}
          />
          {this.state.items.map(item => (
            <CardComponent key={item.Id} item={item} />
          ))}
        </div>
      );
    }

    //Almacenamos en la constante "categories" el listado de todas las categorias disponibles
    const categories = Array.from(new Set(this.state.items.map(item => item.Category)))

    //Constante utilizado para crear las opciones de las categorias (añadirlas al DropDown)
    const categoryOptions = categories.map(category => ({
      key: category,
      text: category
    }));

    //Componente que permitirá al usuario filtrar por categoria
    const categoryDropdown = (
      <Dropdown
        label="Filtrar por categoría"
        selectedKey={this.state.selectedCategory}
        options={categoryOptions}

        //Permite definir la funcionabilidad en que caso de que el usuario eliga una categoria para filtrar
        onChange={(_, option) => this.handleCategoryChange(option?.key as string)}
      />
    );

    //Guardamos en la constante "getRespnsibleText" el contenido de la columna "Responsable"
    const getResponsibleText = (responsible: string | { Title: string }): string => {

      //En caso de que "responsible" es de tipo String
      if (typeof responsible === 'string') {
        //Devolvemos el contenido del parámetro de entrada
        return responsible;

      //En cualquier otro caso
      } else {

        //Devolvemos el contenido almacenado de "Title"
        return responsible.Title;
      }
    };

    //Almacenamos en la constante "responsibles" el listado de todos los responsables disponibles
    const responsibles = Array.from(new Set(this.state.items.map(item => item.Responsible)))

    //Contante utilizado para crear las opciones del responsable (añadirlas al DropDown)
    const responsibleOptions = responsibles.map(responsible => {
      const responsibleText = getResponsibleText(responsible);
      return {
        key: responsibleText,
        text: responsibleText
      };
    });

    //Componente que permitirá al usuario filtrar por responsable
    const responsibleDropdown = (
      <Dropdown
        label="Filtrar por responsable"
        selectedKey={this.state.selectedResponsible}
        options={responsibleOptions}

        //Permite definir la funcionabilidad en que caso de que el usuario eliga un responsable para filtrar
        onChange={(_, option) => this.handleResponsibleChange(option?.key as string)}
      />
    );  
    
    //Por último devolvemos la variable donde contiene la lista formateada con todos los items
    return (
      <><div>
        {categoryDropdown}
        {responsibleDropdown}
      </div><div>
        {listView}
      </div></>
    )
  }

  /**
   * Método donde obtendremos todos los elementos de la lista
   */
  private _readAllFilesSize = async (): Promise<void> => {
    try {
      const spCache = spfi(this._sp).using(Caching({store:"session"}));

      const response: IResponseItem[] = await spCache.web.lists
        .getByTitle(this.LIBRARY_NAME)
        .items
        .select("Title", "Description", "Category", "PublicationDate", "URL", "Responsible/Title")
        .expand("Responsible")();

      const items: IFile[] = response.map((item: IResponseItem) => {
        return {
          Id: item.Id,
          Title: item.Title || "Unknown",
          Description: item.Description,
          Category: item.Category,
          PublicationDate: item.PublicationDate,
          URL: item.URL || "Unknown",
          Responsible: item.Responsible
            ? typeof item.Responsible === "string"
              ? item.Responsible
              : item.Responsible.Title || "Unknown"
            : null,
              };
      });

      this.setState({ items });
    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (_readAllFilesSize) - ${JSON.stringify(err)} - `, LogLevel.Error);
    }
  }
}
