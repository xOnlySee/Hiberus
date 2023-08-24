import * as React from 'react';
import styles from './Taller4.module.scss';
import { ITaller4Props } from './ITaller4Props';

//Nuevas importaciones
import { PrimaryButton } from 'office-ui-fabric-react';
import { Toggle } from 'office-ui-fabric-react';

interface ITaller4State {
  isSwitchOn: boolean;
}

export default class Taller4 extends React.Component<ITaller4Props, ITaller4State> {
  constructor(props: ITaller4Props) {
    super(props);
    this.state = {
      isSwitchOn: false
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

  public render(): React.ReactElement<ITaller4Props> {
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
        </div>
      </section>
    );
  }
}
