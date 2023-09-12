import * as React from 'react';

//Nuevas importaciones
import { DatePicker, PrimaryButton, TextField } from 'office-ui-fabric-react';
import { IFile } from '../interface';
import Taller4 from './Taller4';

interface IEditGroupProps {
    context: any | null;

    //Estado donde se almacenará la información del item que el usuario haya realizado un doble clic para editar la información del grupo
    selectedItem: IFile | null;
}

interface IEditGroupState {
    //String donde se almacenará la denominación del grupo
    denomination: string;

    //String donde se almacenará la descripción del grupo
    description: string

    //Date que almacenará la fecha de creación del grupo
    creationDate: Date;

    //Date que almacenará la fecha de finalización del grupo
    endDate: Date;

    //Boolean donde dependiendo de si su valor es "True" o "False" se volverá a mostrar la interfaz principal del WebPart
    showGroups: boolean;
}

export default class AddGroup extends React.Component<IEditGroupProps, IEditGroupState> {
    constructor(props: IEditGroupProps) {
        super(props);

        //Inicializamos todos los elementos del estado del componente
        this.state = {
            denomination: this.props.selectedItem.Denominacion,
            description: this.props.selectedItem.Descripcion,
            creationDate: new Date(this.props.selectedItem.FechaCreacion),
            endDate: new Date(this.props.selectedItem.FechaFinalizacion),
            showGroups: false
        };
    }

    /**
     * Método donde gestionaremos el campo de texto de denominación del grupo
     * @param event Variable de tipo event
     * @param newValue Variable de tipo String
     */
    private handleDenomination = (event: React.FormEvent<HTMLInputElement>, newValue?: string) => {
        // En caso de que se añada contenido en la barra de texto, se añadirá el contenido a la variable "denomination" en el estado
        if (newValue !== undefined) {
            this.setState({
                denomination: newValue
            });
        }
    }

    /**
     * Método donde gestionaremos el campo de texto la descripción del grupo
     * @param event Variable de tipo event
     * @param newValue Variable de tipo String
     */
    private handleDescription = (event: React.FormEvent<HTMLInputElement>, newValue?: string) => {
        // En caso de que se añada contenido en la barra de texto, se añadirá el contenido a la variable "denomination" en el estado
        if (newValue !== undefined) {
            this.setState({
                description: newValue
            });
        }
    }

    /**
     * Método donde gestionaremos el DatePicker para la fecha de creacion del grupo
     * @param date Varibale de tipo Date
     */
    private handleCreationDate = (date: Date | null | undefined): void => {
        //En caso de que la fecha sea configurado, se añadirá el contenido en la variable "endDate"
        if (date) {
            this.setState({
                creationDate: date
            });
        }
    }

    /**
     * Método donde gestionaremos el DatePicker para la fecha de creacion del grupo
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
     * Método donde gestionará el botón de volver a grupos
     */
    private handleReturnToGroups = () => {
        //En caso de que sea pulsado, pondrá en valor "True" la variable "showGroups"
        this.setState({
            showGroups: true
        });
    }

    render() {

        //En caso de que la variable "showGruops" sea "True"
        if (this.state.showGroups) {
            return (
                //Renderizamos la interfaz gráfica principal del WebPart
                <Taller4 context={this.props.context} />
            )
        }

        //Devolvemos la interfaz del WebPart para que los usuarios puedan editar la información de un determinado grupo
        return (
            <section>
                {/* Añadimos los botones con sus respectivos métodos para darles funcionabilidad */}
                <div>
                    <PrimaryButton>Guardar</PrimaryButton>
                    <PrimaryButton onClick={this.handleReturnToGroups}>Salir</PrimaryButton>
                </div>

                {/* Añadimos el TextField para que el usuario pueda cambiar la denominacion del grupo */}
                <div>
                    <TextField
                        label='Denominación'
                        value={this.state.denomination}
                        onChange={this.handleDenomination} />
                </div>

                {/* Añadimos el TextField para que el usuario pueda cambiar la descrición del grupo */}
                <div>
                    <TextField
                        label='Descripción del grupo'
                        value={this.state.description}
                        multiline={true}
                        onChange={this.handleDescription} />
                </div>

                {/* Añadimos el DatePicker para que el usuario pueda configurar la fecha de creación del grupo */}
                <div>
                    <DatePicker
                        label='Fecha de creación'
                        value={this.state.creationDate}
                        formatDate={(date: Date) => new Intl.DateTimeFormat('es').format(date)}
                        onSelectDate={this.handleCreationDate} />
                </div>

                 {/* Añadimos el DatePicker para que el usuario pueda configurar la fecha de finalización del grupo */}
                <div>
                    <DatePicker
                        label='Fecha de finalización'
                        value={this.state.endDate}
                        formatDate={(date: Date) => new Intl.DateTimeFormat('es').format(date)}
                        onSelectDate={this.handleEndDate} />
                </div>
            </section>
        );

    }
}