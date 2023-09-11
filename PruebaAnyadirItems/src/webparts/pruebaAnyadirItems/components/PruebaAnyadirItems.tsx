import * as React from 'react';
import { IPruebaAnyadirItemsProps } from './IPruebaAnyadirItemsProps';
import { PrimaryButton, TextField } from 'office-ui-fabric-react';
import { SPFI } from '@pnp/sp';
import { getSP } from '../pnpjsConfig';
import { IPickerTerms, TaxonomyPicker } from '@pnp/spfx-controls-react';

interface IPruebaAnyadirItemsState {
  Title: string;
  cityTermnSelected: IPickerTerms;
  SectorCode: string;
}

export default class PruebaAnyadirItems extends React.Component<IPruebaAnyadirItemsProps, IPruebaAnyadirItemsState> {
  private _sp: SPFI;

  constructor(props: IPruebaAnyadirItemsProps) {
    super(props);

    this.state = {
      Title: "",
      cityTermnSelected: [],
      SectorCode: ""
    }

    this._sp = getSP();
  }

  private handleTitleChange = (event: React.FormEvent<HTMLInputElement>, newValue?: string) => {
    if (newValue !== undefined) {
      this.setState({
        Title: newValue
      });
    }
  }

  private handleTaxonomyPickerChange_city = (terms: IPickerTerms) => {
    this.setState({
      cityTermnSelected: terms
    });
  }

  private handleSectorCodeChange = (event: React.FormEvent<HTMLInputElement>, newValue?: string) => {
    //En caso de que se añada contenido en la barra de texto, se añadirá el contenido a la variable "groupID"
    if (newValue !== undefined) {
      this.setState({
        SectorCode: newValue
      });
    }
  }

  private async addItemToList() {
    try {
      const { Title, SectorCode } = this.state;
  
      // Agrega el elemento a la lista de origen (Prueba)
      const newItem = await this._sp.web.lists.getByTitle("Prueba").items.add({
        Title: Title,
      });
  
      // Obtiene el ID del elemento recién creado
      const newItemId = newItem.data.Id;
  
      // Crea el objeto Lookup para el campo "CodigoSector"
      const sectorLookupField = {
        LookupId: newItemId,
      };
  
      // Actualiza el elemento en la lista de destino (TuListaDestino) con el campo Lookup
      await sp.web.lists.getByTitle("TuListaDestino").items.add({
        Title: Title, // Puedes agregar otros campos según sea necesario
        CodigoSector: sectorLookupField,
      });
  
      console.log("Elemento agregado correctamente a la lista con Lookup.");
    } catch (error) {
      console.error("Error al agregar el elemento:", error);
      // Manejo de errores
    }
  }
  


  private handleSave = async () => {
    try {
      const taxonomyField = {
        Label: this.state.cityTermnSelected[0].name,
        TermGuid: this.state.cityTermnSelected[0].key,
        WssId: -1,
      };

      const response = await this._sp.web.lists.getByTitle("Prueba").items.add({
        Title: this.state.Title,
        Ciudad: taxonomyField, // Usar un objeto en lugar de un array
      });

      console.log("Elemento agregado correctamente:", response);

      // Resto de la lógica después de agregar el elemento
    } catch (error) {
      console.error("Error al agregar el elemento:", error);
      // Manejo de errores
    }
  }


  public render(): React.ReactElement<IPruebaAnyadirItemsProps> {
    return (
      <section>
        <div>
          <PrimaryButton onClick={this.handleSave}>Guardar</PrimaryButton>
        </div>

        <div>
          <TextField
            label='Title'
            value={this.state.Title}
            onChange={this.handleTitleChange} />
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
            context={this.props.context}
            required={true} />
        </div>

        <div>
          <TextField
            label='Código de Sector'
            value={this.state.SectorCode} // Agregar el valor del estado correspondiente
            onChange={this.handleSectorCodeChange} // Agregar el manejador correspondiente
          />
        </div>
      </section>
    );
  }
}
