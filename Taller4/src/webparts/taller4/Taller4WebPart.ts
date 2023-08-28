import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'Taller4WebPartStrings';
import Taller4 from './components/Taller4';
import { ITaller4Props } from './components/ITaller4Props';

//Nuevas importaciones
import { getSP } from './pnpjsConfig';

export interface ITaller4WebPartProps {
  description: string;
}

export default class Taller4WebPart extends BaseClientSideWebPart<ITaller4WebPartProps> {
  public render(): void {
    const element: React.ReactElement<ITaller4Props> = React.createElement(
      Taller4,
      {
        context: this.context
      }
    );

    ReactDom.render(element, this.domElement);
  }

public async onInit(): Promise<void> {
  await super.onInit();

  getSP(this.context);
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
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
