export interface ITaller3Props {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;

  //Propiedad declarada con los modos de vista
  viewMode?: "listado" | "tarjeta";
}
