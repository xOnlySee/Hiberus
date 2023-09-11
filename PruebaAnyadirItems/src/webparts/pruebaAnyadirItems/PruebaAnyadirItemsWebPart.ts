import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'PruebaAnyadirItemsWebPartStrings';
import PruebaAnyadirItems from './components/PruebaAnyadirItems';
import { IPruebaAnyadirItemsProps } from './components/IPruebaAnyadirItemsProps';

import { getSP } from './pnpjsConfig';

export interface IPruebaAnyadirItemsWebPartProps {
  description: string;
}

export default class PruebaAnyadirItemsWebPart extends BaseClientSideWebPart<IPruebaAnyadirItemsWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IPruebaAnyadirItemsProps> = React.createElement(
      PruebaAnyadirItems,
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
