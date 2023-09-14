import * as React from 'react';

//Nuevas importaciones
import { IPickerTerms, TaxonomyPicker } from '@pnp/spfx-controls-react';
import { DatePicker, Dropdown, IDropdownOption, PrimaryButton, TextField, Toggle } from 'office-ui-fabric-react';
import { UploadFiles } from '@pnp/spfx-controls-react/lib/UploadFiles';
import Taller4 from './Taller4';
import { ICodigoSector } from '../interface';
import { getSP } from '../pnpjsConfig';
import { SPFI } from '@pnp/sp';
import { PermissionKind } from '@pnp/sp/security';
import Read from '../crud/read';

interface IAddGroupProps {
    context: any | null;
}

interface IAddGroupState {
    //Boolean donde almacenará si estado es abierto o cerrado
    isSwitchOn: boolean;

    //String donde almacenará el codigo del grupo
    groupCode: string;

    //String donde almacenerá la denominación del grupo
    denomination: string;

    //String donde almacenará la descripción del grupo
    description: string;

    //Fecha donde almacenará la fecha de finalización del grupo
    endDate: Date | null;

    //String donde almacenará el tipo de grupo
    groupTypeSelected: string;

    //String donde almacenará la temática del grupo
    themeTypeSelected: string;

    //Termino donde se almacenará al ámbito del grupo
    ambitTermnSelected: IPickerTerms;

    //Termino donde se almacenará el país del grupo
    countryTermnSelected: IPickerTerms;

    //Termino donde se almacenará la ciudad del grupo
    cityTermnSelected: IPickerTerms;

    //Array donde se almacenará el item (codigo de sector) almacenado en la lista "Sectores"
    items: ICodigoSector[];
    errors: any[];

    //String donde almacenará el código de sector 
    sectorCodeCategory: string;

    //Fecha de almacenará la fecha actual
    creationDate: Date;

    //Boolean donde dependiendo de si su valor es "True" o "False" se volverá a mostrar la interfaz principal del WebPart
    showGroups: boolean;

    //String donde alamcenenará el mensaje del formulario
    bannerMessage: string;

    //String donde almacenará el tipo de mensaje del formulario
    bannerMessageType: 'error' | 'warning' | 'success' | 'info';

    //Boolean donde almacenará si tiene archivos adjuntados
    attachedFiles: boolean;

    //Boolean donde almacenará si el usuario tendrá permisos o no
    hasPermissions: boolean | null;
}

/**
 * Clase donde gestionaremos el formulario para añadir grupos
 */
export default class AddGroup extends React.Component<IAddGroupProps, IAddGroupState> {
    //Objeto de tipo SPFI
    private _sp: SPFI;

    //Array donde alacenará los ficheros adjuntados en el formulario
    private attachedFilesArray: Array<File> = [];

    constructor(props: IAddGroupProps) {
        super(props);

        //Inicializamos todos los elementos del estado del componente
        this.state = {
            isSwitchOn: true,
            groupCode: "",
            denomination: "",
            description: "",
            endDate: null,
            groupTypeSelected: "",
            themeTypeSelected: "",
            ambitTermnSelected: [],
            countryTermnSelected: [],
            cityTermnSelected: [],
            items: [],
            errors: [],
            sectorCodeCategory: "",
            creationDate: new Date(),
            showGroups: false,
            bannerMessage: "",
            bannerMessageType: 'success',
            attachedFiles: false,
            hasPermissions: null
        };

        this._sp = getSP();
    }

    /**
     * Método donde gestionaremos el Banner y los mensajes del formulario
     * @param message Variable de tipo String que reprsenta el mensaje
     * @param messageType Variable de tipo String que representa el tipo de mensaje
     */
    private showBannerMessage(message: string, messageType: 'error' | 'warning' | 'success' | 'info'): void {
        this.setState({
            bannerMessage: message,
            bannerMessageType: messageType,
        });
    }

    /**
     * Método que se ejecutará cuando la interfaz del WebPart se añada
     */
    public async componentDidMount(): Promise<void> {
        //this._readAllFilesSize().catch;

        //Creamos e instanciamos una contante de Read() para acceder a sus métodos
        const readInstance = new Read();

        //Invocamos al método para que realice la consulta para obtener los grupos
        readInstance.readSelectorCode()
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

        await this.checkUserPermissions();
    }

    /**
     * Método donde comprobaremos si los campos del formulario estan completados
     * @returns Devuelve un Boolean donde dependiendo de si es "True" o "False" hará una cosa u otra
     */
    private validateFormFields(): boolean {
        const errors: string[] = [];

        if (this.state.groupCode.trim() === '') {
            errors.push("ID del grupo es requerido");
        } else if (this.state.denomination.trim() === '') {
            errors.push("La denominacion es requerida");
        } else if (this.state.description.trim() === '') {
            errors.push("La descripcion es requerida");
        } else if (this.state.sectorCodeCategory.trim() === '') {
            errors.push("El codigo de sector es requerido");
        } else if (this.state.groupTypeSelected.trim() === '') {
            errors.push("El tipo de grupo es requerido");
        }

        return errors.length === 0;
    }


    /**
     * Método donde delcararemos la funcionabilidad del botón "Guardar"
     */
    private handleSave = async () => {
        //En caso de que no se haya adjuntado ningun archivo
        if (!this.state.attachedFiles) {
            //Mostramos un error en el banner para informar al usuario
            this.showBannerMessage("Debes de adjuntar un archivo", "error");
            return;
        }

        this.attachedFilesArray.forEach((file, index) => {
            console.log(`Archivo ${index + 1}:`);
            console.log("Nombre del archivo:", file.name);
            console.log("Tipo de archivo:", file.type);
        });


        if (this.validateFormFields()) {
            try {
                //Mostramos por consola las opciones que el usuario ha rellenado en el formulario
                console.log("Estado: " + this.state.isSwitchOn +
                    "\nCódigo del grupo: " + this.state.groupCode +
                    "\nDenominacion: " + this.state.denomination +
                    "\nDescripción: " + this.state.description +
                    "\nCodigo sector: " + this.state.sectorCodeCategory +
                    "\nFecha de creación: " + this.state.creationDate +
                    "\nFecha finalización: " + this.state.endDate +
                    "\nTipo grupo: " + this.state.groupTypeSelected +
                    "\nTemática: " + this.state.themeTypeSelected +
                    "\nAmbito: " + this.state.ambitTermnSelected[0].name +
                    "\nPaís: " + this.state.countryTermnSelected[0].name +
                    "\nCiudad: " + this.state.cityTermnSelected[0].name);

                //Constante utilizada para almacenar la taxonomia seleccionada del ámbito
                const ambitTermnSelected = {
                    Label: this.state.ambitTermnSelected[0].name,
                    TermGuid: this.state.ambitTermnSelected[0].key,
                    WssId: -1
                }

                //Contante utilizada para almacenar la taxonomia seleccionada del país
                const countryTermnSelected = {
                    Label: this.state.countryTermnSelected[0].name,
                    TermGuid: this.state.countryTermnSelected[0].key,
                    WssId: -1,
                }

                //Contante utilizada para almacenar la taxonomia seleccionada de la ciudad
                const cityTermnSelected = {
                    Label: this.state.cityTermnSelected[0].name,
                    TermGuid: this.state.cityTermnSelected[0].key,
                    WssId: -1,
                }

                //Almacenamos en la constante "newItems" todos los datos que queremos almacenar en la lista
                const newItems = {
                    CodigoGrupo: this.state.groupCode,
                    CodigoSector_2: this.state.sectorCodeCategory,
                    Denominacion: this.state.denomination,
                    Descripcion: this.state.description,
                    FechaCreacion: this.state.creationDate,
                    FechaFinalizacion: this.state.endDate,
                    Estado: this.state.isSwitchOn,
                    TipoGrupo: this.state.groupTypeSelected,
                    Tematica: this.state.themeTypeSelected,
                    Ambito: ambitTermnSelected,
                    Pais: countryTermnSelected,
                    Ciudad: cityTermnSelected
                }

                //Almacenamos en la constante "groupCode" el ID del grupo castaeado a número entero
                const groupCode = parseInt(this.state.groupCode, 10);

                try {
                    //Almacenamos en la constante "items" el resultado de la búsqueda del ID código del grupo
                    const items = await this._sp.web.lists.getByTitle("Grupos")
                        .items.filter(`CodigoGrupo eq ${groupCode}`)
                        .select("Id")();

                    //En caso de que obtenga los valores
                    if (items && items.length == 1) {
                        console.log("Ya existe una lista con el código de grupo: " + groupCode);

                        //Mostramos en el banner que el grupo ya existe y no se ha podido añadir
                        this.showBannerMessage("El grupo ya existe y no se puede añadir", "error");

                        //En cualquier otro caso
                    } else {
                        console.log("La lista se puede añadir");

                        //Usamos el objeto "_sp" donde indicamos el nombre de la lista y los items que queremos añadir
                        await this._sp.web.lists.getByTitle("Grupos").items.add(newItems)
                            //En caso de que los items se hayan podido añadir a la lista
                            .then((response) => {
                                //Mostramos por consola un mensaje junto a la respuesta
                                console.log("Elemento agregado correctamente:", response);

                                this.showBannerMessage("Los cambios se han guardado de forma exitosa", "success");
                            })
                            //En caso de que haya ocurrido un error
                            .catch((error) => {
                                //Mostramos por consola el mensaje de error segiuido del código de error
                                console.error("Error al agregar el elemento:", error);

                                if (error.response) {
                                    console.error("Detalles de la respuesta: " + error.response.data);
                                }
                            });
                    }

                } catch (error) {
                    console.error("Error al obtener el ID del elemento", error);
                }


                //Mostramos el mensaje de error en el Banner
            } catch (error) {
                this.showBannerMessage("Ha ocurrido un error al guardar los cambios", "error");
            }
        }
    }

    /**
     * Método donde gestionará el botón de volver a grupos
     */
    private handleReturnToGroups = () => {
        //En caso de que sea pulsado, pondrá en valor "True" la variable "showGroups"
        this.setState({
            showGroups: true
        });
    }

    /**
     * Método donde gestionaremos el Toggle del estado del grupo
     * @param event Variable de tipo event
     * @param checked Variable de tipo Boolean
     */
    private handleSwitchChange = (event: React.MouseEvent<HTMLElement>, checked?: boolean) => {
        //En caso de que el Toggle sea pulsado, cambiaremos el estado del valor de la variable "isSwitchOn"
        if (checked !== undefined) {
            this.setState({
                isSwitchOn: checked
            });
        }
    }

    /**
     * Método donde gestionaremos el campo de texto de codigo del grupo
     * @param event Variable de tipo event
     * @param newValue Variable de tipo String
     */
    private handleGroupCode = (event: React.FormEvent<HTMLInputElement>, newValue?: string) => {
        //En caso de que se añada contenido en la barra de texto, se añadirá el contenido a la variable "groupCode"
        if (newValue !== undefined) {
            this.setState({
                groupCode: newValue
            });
        }
    }

    /**
     * Método donde gestionaremos el campo de texto de denominación del grupo
     * @param event Variable de tipo event
     * @param newValue Variable de tipo String
     */
    private handleDenomination = (event: React.FormEvent<HTMLInputElement>, newValue?: string) => {
        //En caso de que se añada contenido en la barra de texto, se añadirá el contenido a la variable "denomination"
        if (newValue !== undefined) {
            this.setState({
                denomination: newValue
            });
        }
    }

    /**
     * Método donde gestionaremos el campo multi-linea de la descripción del grupo
     * @param event Variable de tipo event
     * @param newValue Variable de tipo String
     */
    private handleDescription = (event: React.FormEvent<HTMLInputElement>, newValue?: string) => {
        //En caso de que se añada contenido en la barra de texto, se añadirá el contenido a la variable "description"
        if (newValue !== undefined) {
            this.setState({
                description: newValue
            });
        }
    }

    /**
     * Método donde gestionaremos el DropDown del código de sector
     * @param event Variable de tipo event
     * @param option Variable de tipo IDropdownOption
     */
    private handleSectorCodeChange = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => {
        //En caso de que se elija una opción, se almacenará la opción en "sectorCodeCategory"
        if (option) {
            this.setState({ sectorCodeCategory: option.key?.toString() || '' });
        }
    }

    /**
     * Método donde gestionaremos el DatePicker para la fecha de finalización del grupo
     * @param date Varibale de tipo Date
     */
    private handleEndDate = (date: Date | null | undefined): void => {
        //En caso de que la fecha sea configurado, se añadirá el contenido en la variable "endDate"
        if (date) {
            this.setState({
                endDate: date
            });
        }
    }

    /**
     * Método donde gestionaremos el DropDown del tipo de grupo
     * @param event Variable de tipo event
     * @param option Variable de tipo IDropDownOption
     */
    private handleGroupTypeChange = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => {
        //En caso de que se elija una opción, se almacenará la opción en "groupTypeSelected"
        if (option) {
            this.setState({ groupTypeSelected: option.key?.toString() || '' });
        }
    }

    /**
     * Método donde gestionaremos el DropDown de la temática del grupo
     * @param event Variable de tipo event
     * @param option Variable de tipo IDropDown
     */
    private handleThemeChange = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => {
        //En caso de que se elija una opción, se almacenrá la opción en "themeTypeSelected"
        if (option) {
            this.setState({ themeTypeSelected: option.key?.toString() || '' });
        }
    }

    /**
     * Método donde gestionaremos la taxonomia del tipo de ámbito del grupo
     * @param terms Variable de tipo IPickerTerms
     */
    private handleTaxonomyPickerChange_ambit = (terms: IPickerTerms) => {
        this.setState({
            ambitTermnSelected: terms
        });
    }

    /**
     * Método donde gestionaremos la taxonomia del país
     * @param terms Variable de tipo IPickerTerms
     */
    private handleTaxonomyPickerChange_country = (terms: IPickerTerms) => {
        this.setState({
            countryTermnSelected: terms
        });
    }

    /**
     * Método donde gestionaremos la taxonomia de la ciudad
     * @param terms Variable de tipo IPickerTerms
     */
    private handleTaxonomyPickerChange_city = (terms: IPickerTerms) => {
        this.setState({
            cityTermnSelected: terms
        });
    }

    /**
     * Método donde gestionaremos el apartado de subir archivos al WebPart
     * @param files Variable de tipo File
     */
    private handleFileUpload = (files: File[]) => {
        this.setState({ attachedFiles: files.length > 0 });
        this.attachedFilesArray = this.attachedFilesArray.concat(files);
    }

    /**
     * Método donde gestionaremos el botón de cancelar
     */
    private handleCancel = () => {
        //Reseteamos las variables necesarias
        this.setState({
            isSwitchOn: true,
            groupCode: "",
            denomination: "",
            description: "",
            endDate: null,
            groupTypeSelected: "",
            themeTypeSelected: "",
            ambitTermnSelected: [],
            countryTermnSelected: [],
            cityTermnSelected: [],
            items: [],
            errors: [],
            sectorCodeCategory: "",
            creationDate: new Date(),
            showGroups: false,
            bannerMessage: "",
            bannerMessageType: 'success'
        });
    };

    /**
     * Método que verifica los permisos del usuario para ver elementos de la lista
     * Actualiza el estado "hasPermissions" en función de si el usuario tiene permisos para ver elementos de la lista o no
     */
    private async checkUserPermissions() {
        try {
            //Obtenemos los permisos del usuario para la lista "Grupos".
            const permissions = await this._sp.web.lists.getByTitle("Grupos").effectiveBasePermissions();

            //Comprobamos si el usuario tiene el permiso específico para ver elementos de la lista.
            if (this.hasPermission(permissions, PermissionKind.ViewListItems)) {
                //Si el usuario tiene permiso, mostramos un mensaje en la consola.
                console.log("El usuario tiene permiso para ver elementos de la lista.");

                //Actualizamos el estado "hasPermissions" a "true" para indicar que el usuario tiene permisos.
                this.setState({
                    hasPermissions: true
                });

                
            } else {
                //Si el usuario no tiene permiso, mostramos un mensaje en la consola.
                console.log("El usuario no tiene permiso para ver elementos de la lista.");

                //Actualizamos el estado "hasPermissions" a "false" para indicar que el usuario no tiene permisos.
                this.setState({
                    hasPermissions: false
                });

                this.showBannerMessage("No tiene permisos para ver el formulario", "error");
            }
        } catch (error) {
            //Si ocurre un error durante la verificación de permisos, mostramos un mensaje de error en la consola.
            console.error("Error al verificar los permisos:", error);
        }
    }


    /**
     * Método para verificar los permisos del usuario
     * @param permissions Objeto que contiene los permisos del usuario
     * @param permissionKind Tipo de permiso que se va a verificar.
     * @returns Devuelve true si el usuario tiene el permiso especificado, de lo contrario, devuelve false.
     */
    private hasPermission(permissions: { High: number; Low: number }, permissionKind: PermissionKind): boolean {
        // Calcula la máscara de permiso correspondiente para el tipo de permiso.
        const permissionMask = 1 << permissionKind;

        // Comprueba si el permiso está presente en los bits bajos (Low) o en los bits altos (High) de los permisos.
        return (permissions.Low & permissionMask) > 0 || (permissions.High & permissionMask) > 0;
    }


    render() {

        //Constante donde configuraremos las opciones del DropDown del tipo de grupo
        const groupTypeDropDownOptions: IDropdownOption[] = [
            { key: 'Grupo1', text: 'Grupo1' },
            { key: 'Grupo2', text: 'Grupo2' },
            { key: 'Grupo3', text: 'Grupo3' }
        ];

        //Constante donde configuraremos las opciones del DropDown de la temática del grupo
        const themeDropDownOptions: IDropdownOption[] = [
            { key: 'Tematica1', text: 'Tematica1' },
            { key: 'Tematica2', text: 'Tematica2' },
            { key: 'Tematica3', text: 'Tematica3' }
        ];

        //Constante donde almacenaremos las opciones del código de sector
        const sectorsCode = Array.from(new Set(this.state.items.map(item => item.CodigoSelector)))

        //Constante donde mapearemos las opciones del código de sector
        const sectorsCodeOptions = sectorsCode.map(sectorCode => ({
            key: sectorCode,
            text: sectorCode
        }));

        //En caso de que la variable "showGruops" sea "True"
        if (this.state.showGroups) {
            return (
                //Renderizamos la interfaz gráfica principal del WebPart
                <Taller4 context={this.props.context} />
            )
        }

        //Constante donde almacenaremos el estado de "hasPermissions"
        const { hasPermissions } = this.state;

        //Devolvemos la interfaz del formulario para añadir grupos
        return (
            <section>
                <div
                    style={{
                        backgroundColor:
                            this.state.bannerMessageType === "error"
                                ? "red"
                                : this.state.bannerMessageType === "warning"
                                    ? "yellow"
                                    : this.state.bannerMessageType === "success"
                                        ? "green"
                                        : this.state.bannerMessageType === "info"
                                            ? "gray"
                                            : "initial", //Color por defecto o cualquier otro estilo que desees
                        color: "white", // Color de texto para todos los tipos de mensaje
                    }}
                    className="banner"
                >
                    {this.state.bannerMessage}
                </div>

                {hasPermissions ? (
                    <div>
                        {/* Añadir aquí todo el contenido del formulario */}
                        <div>
                            {/* Añadimos los botones con sus respectivos métodos para darles funcionabilidad */}
                            <div>
                                <PrimaryButton onClick={this.handleSave}>Guardar</PrimaryButton>
                                <PrimaryButton onClick={this.handleCancel} >Cancelar</PrimaryButton>
                                <PrimaryButton onClick={this.handleReturnToGroups}>Volver a grupos</PrimaryButton>
                            </div>

                            {/* Añadimos el Toggle (Switch) para mostrar el estado del grupo */}
                            <div>
                                <Toggle
                                    label="Estado"
                                    checked={this.state.isSwitchOn}
                                    onChange={this.handleSwitchChange} />
                            </div>

                            {/* Añadimos el campo de texto para configurar el código del grupo */}
                            <div>
                                <TextField
                                    label='Código del grupo'
                                    value={this.state.groupCode}
                                    onChange={this.handleGroupCode}
                                    required={true} />
                            </div>

                            {/* Aádimos el campo de texto para configurar la denominación del grupo */}
                            <div>
                                <TextField
                                    label='Denominación'
                                    value={this.state.denomination}
                                    onChange={this.handleDenomination}
                                    required={true} />
                            </div>

                            {/* Añadimos el campo de texto multi-linea para añadir la descripción del grupo */}
                            <div>
                                <TextField
                                    label='Descripción'
                                    value={this.state.description}
                                    onChange={this.handleDescription}
                                    required={true}
                                    multiline={true} />
                            </div>

                            {/* Añadimos el DropDown con las opciones para selecionar el códifgo del sector */}
                            <div>
                                <Dropdown
                                    label='Codigo de sector'
                                    selectedKey={this.state.sectorCodeCategory}
                                    options={sectorsCodeOptions}
                                    required={true}
                                    onChange={this.handleSectorCodeChange} />
                            </div>

                            {/* Añadimos el DatePicker para que el usuario seleccione la fecha de finalización del grupo */}
                            <div>
                                <DatePicker
                                    label='Fecha finalización'
                                    value={this.state.endDate}
                                    onSelectDate={this.handleEndDate}
                                    formatDate={(date: Date) => new Intl.DateTimeFormat('es').format(date)} />
                            </div>

                            {/* Añadimos el DropDown para que el usuario seleccione el tipo de grupo */}
                            <div>
                                <Dropdown
                                    label='Tipo de grupo'
                                    selectedKey={this.state.groupTypeSelected}
                                    options={groupTypeDropDownOptions}
                                    onChange={this.handleGroupTypeChange}
                                    required={true} />
                            </div>

                            {/* Añadimos el DropDown para que el usuario seleccione la temática del grupo */}
                            <div>
                                <Dropdown
                                    label='Temática'
                                    selectedKey={this.state.themeTypeSelected}
                                    options={themeDropDownOptions}
                                    onChange={this.handleThemeChange}
                                    required={true} />
                            </div>

                            {/* Añadimos el TaxonomyPicker de multiselección para que el usuario pueda seleccionar el tipo de ámbito */}
                            <div>
                                <TaxonomyPicker
                                    label='Ámbito'
                                    allowMultipleSelections={true}
                                    termsetNameOrID='35209b03-db22-4535-abe2-9095cd35e586'
                                    onChange={this.handleTaxonomyPickerChange_ambit}
                                    isTermSetSelectable={false}
                                    includeDefaultTermActions={true}
                                    panelTitle='Ámbito'
                                    context={this.props.context}
                                    required={true} />
                            </div>

                            {/* Añadimos el TaxonomyPicker donde el usuario pueda seleccionar un páis */}
                            <div>
                                <TaxonomyPicker
                                    label='País'
                                    allowMultipleSelections={false}
                                    termsetNameOrID='c7defd80-bac0-4c6e-9127-6f36ddd6ca5b'
                                    onChange={this.handleTaxonomyPickerChange_country}
                                    isTermSetSelectable={false}
                                    includeDefaultTermActions={false}
                                    panelTitle='País'
                                    context={this.props.context}
                                    required={true} />
                            </div>

                            {/* Añadimos el TaxonomyPickler donde el usuario pueda seleccionar una ciudad */}
                            <div>
                                <TaxonomyPicker
                                    label='Ciudad'
                                    allowMultipleSelections={false}
                                    termsetNameOrID='8d4abd88-58fe-4eda-a1c2-63dd04a3939e'
                                    onChange={this.handleTaxonomyPickerChange_city}
                                    isTermSetSelectable={false}
                                    includeDefaultTermActions={false}
                                    panelTitle='Ciudad'
                                    context={this.props.context}
                                    required={true} />
                            </div>

                            <br />

                            {/* Añadimos el elemento UploadFiles para que el usuario pueda adjuntar ficheros */}
                            <div>
                                <UploadFiles
                                    context={this.props.context}
                                    title='Documentos adjuntos'
                                    onUploadFiles={this.handleFileUpload} />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div>
                        <PrimaryButton onClick={this.handleReturnToGroups}>Volver a grupos</PrimaryButton>
                    </div>
                )}
            </section>
        );
    }
}
