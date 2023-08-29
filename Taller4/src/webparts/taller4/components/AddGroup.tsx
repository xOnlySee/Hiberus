import * as React from 'react';

//Nuevas importaciones
import { IPickerTerms, TaxonomyPicker } from '@pnp/spfx-controls-react';
import { Dropdown, PrimaryButton, Toggle } from 'office-ui-fabric-react';
import { UploadFiles } from '@pnp/spfx-controls-react/lib/UploadFiles';
import Taller4 from './Taller4';
import { getSP } from '../pnpjsConfig';
import { SPFI, spfi } from '@pnp/sp';
import { IFile, IResponseItem } from '../interface';
import { LogLevel, Logger } from '@pnp/logging';
import { Caching } from "@pnp/queryable";

interface IAddGroupProps {
    context: any | null;
}

interface IAddGroupState {
    isSwitchOn: boolean;
    groupTypeSelected: string;
    themeTypeSelected: string;
    ambitTermnSelected: IPickerTerms;
    countryTermnSelected: IPickerTerms;
    cityTermnSelected: IPickerTerms;
    items: IFile[];
    errors: any[];

    showGroups: boolean;
}

export default class AddGroup extends React.Component<IAddGroupProps, IAddGroupState> {
    private LOG_SOURCE = "Taller4_AddGroup"
    private LIBRARY_NAME = "Grupos"
    private _sp: SPFI

    constructor(props: IAddGroupProps) {
        super(props);
        this.state = {
            isSwitchOn: false,
            groupTypeSelected: "",
            themeTypeSelected: "",
            ambitTermnSelected: [],
            countryTermnSelected: [],
            cityTermnSelected: [],
            items: [],
            errors: [],

            showGroups: false
        };
        this._sp = getSP();
    }

    public componentDidMount(): void {
        this._readAllFileSize().catch;
    }

    private handleReturnToGroups = () => {
        this.setState({
            showGroups: true
        });
    }

    private handleSwitchChange = (event: React.MouseEvent<HTMLElement>, checked?: boolean) => {
        if (checked !== undefined) {
            this.setState({
                isSwitchOn: checked
            });
        }
        console.log("Toggle pulsado");
    }

    private handleTaxonomyPickerChange_ambit = (terms: IPickerTerms) => {
        this.setState({
        });
    }

    private handleTaxonomyPickerChange_country = (terms: IPickerTerms) => {
        this.setState({
        });
    }

    private handleTaxonomyPickerChange_city = (terms: IPickerTerms) => {
        this.setState({
        });
    }

    private handleFileUpload = (files: File[]) => {
        console.log("Archhivo subido: " + files)
    }

    private _readAllFileSize = async (): Promise<void> => {
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
                    Tematica: item.Tematica,
                };
            });

            this.setState({ items });
        } catch (err) {
            Logger.write(`${this.LOG_SOURCE} (_readAllFilesSize) - ${JSON.stringify(err)} - `, LogLevel.Error);
        }
    }


    render() {
        const groupTypes = Array.from(new Set(this.state.items.map(item => item.TipoGrupo)))

        const groupTypesOptions = groupTypes.map(groupType => ({
            key: groupType,
            text: groupType
        }));

        const themes = Array.from(new Set(this.state.items.map(item => item.Tematica)))

        const themesOptions = themes.map(theme => ({
            key: theme,
            text: theme
        }));


        if (this.state.showGroups) {
            return (
                <Taller4 context={this.props.context} /> // Renderiza la interfaz Taller4
            )
        }

        return (
            <section>
                <div>
                    <div>
                        <PrimaryButton>Guardar</PrimaryButton>
                        <PrimaryButton>Cancelar</PrimaryButton>
                        <PrimaryButton onClick={this.handleReturnToGroups}>Volver a grupos</PrimaryButton>
                    </div>

                    <div>
                        <Toggle
                            label="Estado"
                            checked={this.state.isSwitchOn}
                            onChange={this.handleSwitchChange} />
                    </div>

                    <div>
                        <Dropdown
                            label='Tipo de grupo'
                            selectedKey={this.state.themeTypeSelected}
                            options={groupTypesOptions} />
                    </div>

                    <div>
                        <Dropdown
                            label='Temática'
                            selectedKey={this.state.themeTypeSelected}
                            options={themesOptions} />
                    </div>

                    <div>
                        <TaxonomyPicker
                            label='Ámbito'
                            allowMultipleSelections={true}
                            termsetNameOrID='35209b03-db22-4535-abe2-9095cd35e586'
                            onChange={this.handleTaxonomyPickerChange_ambit}
                            isTermSetSelectable={false}
                            includeDefaultTermActions={true}
                            panelTitle='Ámbito'
                            context={this.props.context} />
                    </div>

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

                    <div>
                        <TaxonomyPicker
                            label='Ciudad'
                            allowMultipleSelections={false}
                            termsetNameOrID='8d4abd88-58fe-4eda-a1c2-63dd04a3939e'
                            onChange={this.handleTaxonomyPickerChange_city}
                            isTermSetSelectable={false}
                            includeDefaultTermActions={false}
                            panelTitle='Ciudad'
                            context={this.props.context} />
                    </div>

                    <br />

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
