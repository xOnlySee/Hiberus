import * as React from 'react';
import styles from './Taller4.module.scss';
import { ITaller4Props } from './ITaller4Props';

//Nuevas importaciones
import { Dropdown, IDropdownOption, PrimaryButton } from 'office-ui-fabric-react';
import { Toggle } from 'office-ui-fabric-react';
import { TaxonomyPicker, IPickerTerms } from '@pnp/spfx-controls-react'

interface ITaller4State {
  isSwitchOn: boolean;
  groupTypeSelected: string;
  themeTypeSelected: string,
  ambitTermnSelected: IPickerTerms;
}

export default class Taller4 extends React.Component<ITaller4Props, ITaller4State> {
  constructor(props: ITaller4Props) {
    super(props);
    this.state = {
      isSwitchOn: false,
      groupTypeSelected: "",
      themeTypeSelected: "",
      ambitTermnSelected: []
    };
  }

  private handleSaveClick = () => {
    console.log('Guardar datos. Estado del interruptor:', this.state.isSwitchOn);
  }

  private handleCancelClick = () => {
    console.log('Cancelar');
  }

  private handleSwitchChange = (isChecked: boolean) => {
    this.setState({
      isSwitchOn: isChecked
    });
  }

  private handleTaxonomyPickerChange_ambit = (terms: IPickerTerms) => {
    this.setState({
      //selectedTerms: terms
    });
  }


  public render(): React.ReactElement<ITaller4Props> {
    const groupDropDownOptions: IDropdownOption[] = [
      { key: 'option1', text: 'Opción 1' },
      { key: 'option2', text: 'Opción 2' },
      { key: 'option3', text: 'Opción 3' }
    ];

    const themeDropDownOptions: IDropdownOption[] = [
      { key: 'option1', text: 'Opción 1' },
      { key: 'option2', text: 'Opción 2' },
      { key: 'option3', text: 'Opción 3' }
    ];

    return (
      <section className={styles.taller4}>
        <div className={styles.buttonToggleContainer}>
          <div className={styles.buttonContainer}>
            <PrimaryButton className={styles.actionButton} onClick={this.handleSaveClick}>Guardar</PrimaryButton>
            <PrimaryButton className={styles.actionButton} onClick={this.handleCancelClick}>Cancelar</PrimaryButton>
            <PrimaryButton className={styles.actionButton} onClick={this.handleCancelClick}>Volver a Grupos</PrimaryButton>
          </div>

          <div className={styles.toggleContainer}>
            <Toggle
              label="Estado"
              checked={this.state.isSwitchOn}
              onChanged={this.handleSwitchChange}
            />
          </div>

          <div>
            <Dropdown
              label='Tipo de grupo'
              selectedKey={this.state.groupTypeSelected}
              options={groupDropDownOptions}
              className={styles.customDropDown}
              />
          </div>

          <div>
            <Dropdown
              label='Temática'
              selectedKey={this.state.themeTypeSelected}
              options={themeDropDownOptions}
              className={styles.customDropDown}
            />
          </div>

          <div>
            <TaxonomyPicker
              label='Ámbito'
              allowMultipleSelections={true}
              termsetNameOrID='' //Poner el ID de la taxonmia de ambito
              onChange={this.handleTaxonomyPickerChange_ambit}
              isTermSetSelectable={false}
              includeDefaultTermActions={true}
              panelTitle='Ámbito' 
              context={this.props.context}
              />
          </div>
        </div>
      </section>
    );
  }
}
