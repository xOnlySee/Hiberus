import * as React from 'react';

//Nuevas importaciones
import { IPickerTerms, TaxonomyPicker } from '@pnp/spfx-controls-react';
import { DatePicker, Dropdown, IDropdownOption, PrimaryButton, TextField, Toggle } from 'office-ui-fabric-react';
import { UploadFiles } from '@pnp/spfx-controls-react/lib/UploadFiles';
import Taller4 from './Taller4';
import { ICodigoSector, ICodigoSectorResponse } from '../interface';
import { getSP } from '../pnpjsConfig';
import { SPFI, spfi } from '@pnp/sp';
import { LogLevel, Logger } from '@pnp/logging';
import { Caching } from "@pnp/queryable";

interface IAddGroupProps {
    context: any | null;
}

interface IAddGroupState {
    //Boolean donde almacenará si estado es abierto o cerrado
    isSwitchOn: boolean;

    //String donde almacenará el ID del grupo
    groupID: string;

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
}

/**
 * Clase donde gestionaremos el formulario para añadir grupos
 */
export default class AddGroup extends React.Component<IAddGroupProps, IAddGroupState> {
    //Nombre del log
    private LOG_SOURCE = "AddGroups"

    //Nombre de la librería donde recuperaremos el ID del grupo
    private LIBRARY_NAME = "Sectores";
    private _sp: SPFI;

    constructor(props: IAddGroupProps) {
        super(props);

        //Inicializamos todos los elementos del estado del componente
        this.state = {
            isSwitchOn: true,
            groupID: "",
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

            showGroups: false
        };
        this._sp = getSP();
    }

    /**
     * Método que se ejecutará cuando la interfaz del WebPart se añada
     */
    public componentDidMount(): void {
        this._readAllFilesSize().catch;
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
     * Método donde gestionaremos el campo de texto del ID del grupo
     * @param event Variable de tipo event
     * @param newValue Variable de tipo String
     */
    private handleIdGrupoChange = (event: React.FormEvent<HTMLInputElement>, newValue?: string) => {
        //En caso de que se añada contenido en la barra de texto, se añadirá el contenido a la variable "groupID"
        if (newValue !== undefined) {
            this.setState({
                groupID: newValue
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

        });
    }

    /**
     * Método donde gestionaremos la taxonomia del país
     * @param terms Variable de tipo IPickerTerms
     */
    private handleTaxonomyPickerChange_country = (terms: IPickerTerms) => {
        this.setState({

        });
    }

    /**
     * Método donde gestionaremos la taxonomia de la ciudad
     * @param terms Variable de tipo IPickerTerms
     */
    private handleTaxonomyPickerChange_city = (terms: IPickerTerms) => {
        this.setState({

        });
    }

    /**
     * Método donde gestionaremos el apartado de subir archivos al WebPart
     * @param files Variable de tipo File
     */
    private handleFileUpload = (files: File[]) => {
        console.log("Archhivo subido: " + files)
    }

    /**
     * Método donde gestionaremos el botón de cancelar
     */
    private handleCancel = () => {
        //Reseteamos las variables necesarias
        this.setState({
            isSwitchOn: true,
            groupID: "",
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

            creationDate: new Date()
        });
    };

    /**
     * Método donde obtendremos los items de la columna "CodigoSector" de la lista "Sectores"
     */
    private _readAllFilesSize = async (): Promise<void> => {
        try {
            const spCache = spfi(this._sp).using(Caching({ store: "session" }));

            const response: ICodigoSectorResponse[] = await spCache.web.lists
                .getByTitle(this.LIBRARY_NAME)
                .items
                .select("CodigoSelector")();

            const items: ICodigoSector[] = response.map((item: ICodigoSectorResponse) => {
                console.log("Codigo: " + item.CodigoSector);
                return {
                    CodigoSector: item.CodigoSector
                };
            });

            this.setState({ items });
        } catch (err) {
            Logger.write(`${this.LOG_SOURCE} (_readAllFilesSize) - ${JSON.stringify(err)} - `, LogLevel.Error);
        }
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

        const sectorsCode = Array.from(new Set(this.state.items.map(item => item.CodigoSector)))

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

        //Devolvemos la interfaz del formulario para añadir grupos
        return (
            <section>
                <div>
                    {/* Añadimos los botones con sus respectivos métodos para darles funcionabilidad */}
                    <div>
                        <PrimaryButton>Guardar</PrimaryButton>
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

                    {/* Añadimos el campo de texto para configurar el ID del grupo */}
                    <div>
                        <TextField
                            label='ID del grupo'
                            value={this.state.groupID}
                            onChange={this.handleIdGrupoChange}
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
                            options={sectorsCodeOptions} />
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
                            context={this.props.context} />
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
            </section>
        );
    }
}
