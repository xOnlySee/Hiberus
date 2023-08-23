import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneChoiceGroup,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'Taller3WebPartStrings';
import Taller3 from './components/Taller3';
import { ITaller3Props } from './components/ITaller3Props';

//Importaciones nuevas
import { getSP } from './pnpjsConfig';

export interface ITaller3WebPartProps {
  description: string;

  //Añadimos las posibles opciones del grupo de RadioButtons
  viewMode: "listado" | "tarjeta";
}

export default class Taller3WebPart extends BaseClientSideWebPart<ITaller3WebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  public render(): void {
    const element: React.ReactElement<ITaller3Props> = React.createElement(
      Taller3,
      {
        description: this.properties.description,
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName,

        //Instanciamos la propiedad
        viewMode: this.properties.viewMode
      }
    );

    ReactDom.render(element, this.domElement);
  }


  public async onInit(): Promise<void> {
    await super.onInit();

    getSP(this.context);
  }


  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const {
      semanticColors
    } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
      this.domElement.style.setProperty('--link', semanticColors.link || null);
      this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
    }

  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                }),
                
                //Añadimos la propiedad al PropertyPane del WebPart para controlar el tipo de vista del listado
                PropertyPaneChoiceGroup("viewMode", {
                  label: "Opción de vista",
                  options: [
                    { key: "listado", text: "Listado" },
                    { key: "tarjeta", text: "Tarjeta" }
                  ]
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
