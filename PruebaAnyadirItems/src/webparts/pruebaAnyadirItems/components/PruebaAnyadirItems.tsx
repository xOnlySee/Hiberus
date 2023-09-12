import * as React from 'react';
import { IPruebaAnyadirItemsProps } from './IPruebaAnyadirItemsProps';
import { PrimaryButton, TextField } from 'office-ui-fabric-react';
import { SPFI } from '@pnp/sp';
import { getSP } from '../pnpjsConfig';
import { IPickerTerms, TaxonomyPicker, UploadFiles } from '@pnp/spfx-controls-react';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';

interface IPruebaAnyadirItemsState {
  Title: string;
  cityTermnSelected: IPickerTerms;
  uploadedFiles: any[]; // Agrega esta propiedad para rastrear los archivos seleccionados
}

export default class PruebaAnyadirItems extends React.Component<IPruebaAnyadirItemsProps, IPruebaAnyadirItemsState> {
  private _sp: SPFI;

  constructor(props: IPruebaAnyadirItemsProps) {
    super(props);

    this.state = {
      Title: "",
      cityTermnSelected: [],
      uploadedFiles: []
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

  private async handleSave() {
    try {
      const taxonomyField = {
        Label: this.state.cityTermnSelected[0].name,
        TermGuid: this.state.cityTermnSelected[0].key,
        WssId: -1,
      };
  
      // Obtener el token de solicitud antes de la llamada a la función handleSave
      const digestResponse: SPHttpClientResponse = await this.props.context.spHttpClient.fetch(`${this.props.context.pageContext.web.absoluteUrl}/_api/contextinfo`, SPHttpClient.configurations.v1);
      const digestData = await digestResponse.json();
      const requestDigest = digestData.d.GetContextWebInformation.FormDigestValue;
  
      // Crear el elemento en la lista
      const response = await this._sp.web.lists.getByTitle("Prueba").items.add({
        Title: this.state.Title,
        Ciudad: taxonomyField,
      });
  
      console.log('Elemento agregado correctamente:', response);
  
      if (response && response.data && response.data.Id) {
        // Obtener el ID del elemento agregado
        const itemId = response.data.Id;
  
        // Ahora puedes usar itemId en la construcción de la URL de carga
        const uploadUrl = `${this.props.context.pageContext.web.absoluteUrl}/_api/web/lists/getByTitle('Prueba')/items(${itemId})/AttachmentFiles/add(FileName='nombre_del_archivo')`;
  
        // Antes de hacer la solicitud POST, agrega mensajes de depuración
        console.log('Token de solicitud:', requestDigest);
        console.log('URL de carga:', uploadUrl);
  
        // Resto del código para cargar archivos adjuntos
        // ...
      } else {
        console.error('No se pudo obtener el ID del elemento agregado.');
      }
  
      return response; // Devolver la respuesta de la adición del elemento
    } catch (error) {
      console.error('Error al agregar el elemento:', error);
      throw error; // Propagar el error
    }
  }
  
  private async _onUploadFiles(fileInfos: any[], itemId: number) {
    if (fileInfos && fileInfos.length > 0) {
      const uploadedFiles = [...this.state.uploadedFiles, ...fileInfos];
      this.setState({ uploadedFiles });
  
      for (const fileInfo of fileInfos) {
        if (fileInfo && fileInfo.name) {
          try {
            // Obtener el token de solicitud
            const digestResponse: SPHttpClientResponse = await this.props.context.spHttpClient.fetch(`${this.props.context.pageContext.web.absoluteUrl}/_api/contextinfo`, SPHttpClient.configurations.v1);
            const digestData = await digestResponse.json();
            const requestDigest = digestData.d.GetContextWebInformation.FormDigestValue;
  
            // Construir la URL de carga
            const uploadUrl = `${this.props.context.pageContext.web.absoluteUrl}/_api/web/lists/getByTitle('Prueba')/items(${itemId})/AttachmentFiles/add(FileName='${fileInfo.name}')`;
  
            // Incluir el token de solicitud en el encabezado
            const uploadResponse: SPHttpClientResponse = await this.props.context.spHttpClient.post(uploadUrl, SPHttpClient.configurations.v1, {
              headers: {
                'Accept': 'application/json;odata=verbose',
                'X-RequestDigest': requestDigest,
              },
              body: fileInfo.content,
            });
  
            if (uploadResponse.ok) {
              console.log(`Archivo '${fileInfo.name}' subido con éxito.`);
            } else {
              console.error(`Error al subir el archivo '${fileInfo.name}':`, uploadResponse.statusText);
            }
          } catch (error) {
            console.error(`Error al subir el archivo '${fileInfo.name}':`, error);
          }
        } else {
          console.error('El objeto fileInfo es inválido o no tiene la propiedad "name".');
        }
      }
    }
  }
  

  public render(): React.ReactElement<IPruebaAnyadirItemsProps> {
    return (
      <section>
        <div>
          <PrimaryButton onClick={async () => {
            const response = await this.handleSave();
            if (response && response.data && response.data.Id) {
              await this._onUploadFiles(this.state.uploadedFiles, response.data.Id);
            } else {
              console.error('No se pudo obtener el ID del elemento agregado.');
            }
          }}>Guardar</PrimaryButton>
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
          <UploadFiles
            context={this.props.context}
            title='Documentos adjuntos'
            onUploadFiles={async (fileInfos) => {
              const response = await this.handleSave();
              if (response && response.data && response.data.Id) {
                this._onUploadFiles(fileInfos, response.data.Id).catch;
              } else {
                console.error('No se pudo obtener el ID del elemento agregado.');
              }
            }}
          />
        </div>
      </section>
    );
  }
}
