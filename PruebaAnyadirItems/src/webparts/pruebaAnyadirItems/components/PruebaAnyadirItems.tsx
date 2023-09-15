import * as React from 'react';
import { IPruebaAnyadirItemsProps } from './IPruebaAnyadirItemsProps';
import { PrimaryButton, TextField } from 'office-ui-fabric-react';
import { SPFI } from '@pnp/sp';
import { getSP } from '../pnpjsConfig';
import { IPickerTerms, TaxonomyPicker } from '@pnp/spfx-controls-react';
import { PermissionKind } from '@pnp/sp/security';
import { SPHttpClient, SPHttpClientResponse, ISPHttpClientOptions } from '@microsoft/sp-http';

interface IPruebaAnyadirItemsState {
  Title: string;
  cityTermnSelected: IPickerTerms;

  hasPermissions: boolean | null;
}

export default class PruebaAnyadirItems extends React.Component<IPruebaAnyadirItemsProps, IPruebaAnyadirItemsState> {
  private _sp: SPFI;

  constructor(props: IPruebaAnyadirItemsProps) {
    super(props);

    this.state = {
      Title: "",
      cityTermnSelected: [],
      hasPermissions: null
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

  private async checkUserPermissions() {
    const listTitle = "Grupos"; // Reemplaza "TuLista" con el título de tu lista

    try {

      // Verificar los permisos específicos aquí
      const permissions = await this._sp.web.lists.getByTitle(listTitle).effectiveBasePermissions();
      if (this.hasPermission(permissions, PermissionKind.ViewListItems)) {
        // El usuario tiene permiso para ver elementos de la lista
        console.log("El usuario tiene permiso para ver elementos de la lista.");
      } else {
        // El usuario no tiene permiso para ver elementos de la lista
        console.log("El usuario no tiene permiso para ver elementos de la lista.");
      }
    } catch (error) {
      console.error("Error al verificar los permisos:", error);
    }
  }

  private hasPermission(permissions: { High: number; Low: number }, permissionKind: PermissionKind): boolean {
    const permissionMask = 1 << permissionKind;
    return (permissions.Low & permissionMask) > 0 || (permissions.High & permissionMask) > 0;
  }


  private readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && event.target.result) {
          resolve(event.target.result as ArrayBuffer);
        } else {
          reject(new Error("No se pudo leer el archivo."));
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  }

  private async uploadAttachments(listTitle: string, itemId: number, files: FileList) {
    try {
      const webUrl = this.props.context.pageContext.web.absoluteUrl;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const arrayBuffer = await this.readFileAsArrayBuffer(file);
        const endpoint = `${webUrl}/_api/web/lists/getByTitle('${listTitle}')/items(${itemId})/AttachmentFiles/add(FileName='${file.name}')`;

        try {
          const response = await this.uploadFile(endpoint, arrayBuffer);
          console.log(`Archivo adjunto "${file.name}" agregado correctamente. Response:`, response);
        } catch (error) {
          console.error(`Error al cargar el archivo adjunto "${file.name}":`, error);
        }
      }
    } catch (error) {
      console.error("Error al cargar archivos adjuntos:", error);
    }
  }



  private async uploadFile(endpoint: string, arrayBuffer: ArrayBuffer): Promise<SPHttpClientResponse> {
    const spOpts: ISPHttpClientOptions = {
      body: arrayBuffer,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Content-Length': arrayBuffer.byteLength.toString(),
      },
    };

    return this.props.context.spHttpClient.post(endpoint, SPHttpClient.configurations.v1, spOpts);
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

      // Llamar a la función para cargar archivos adjuntos
      const listTitle = "Prueba"; // Reemplaza con el título de tu lista
      const itemId = response.data.Id; // Obtén el ID del elemento recién creado
      const files = document.getElementById("fileInput") as HTMLInputElement;

      if (files && files.files) {
        await this.uploadAttachments(listTitle, itemId, files.files);
      }

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
          <button onClick={() => this.checkUserPermissions()}>Verificar Permisos</button>
        </div>

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
          <input
            type="file"
            id="fileInput"
            multiple={true}
            accept=".doc,.docx,.pdf,.jpg,.png" // Puedes ajustar las extensiones permitidas
          />
        </div>

      </section>
    );
  }
}