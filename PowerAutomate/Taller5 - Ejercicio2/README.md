# Flujo de Aprobación en SharePoint

## Descripción

Este flujo de trabajo se activará automáticamente cuando se añada un nuevo elemento a una lista específica alojada en SharePoint. El objetivo principal es gestionar la aprobación o denegación del nuevo elemento, notificando a través de Microsoft Teams y enviando correos electrónicos según la decisión tomada.

## Activación del Flujo

El flujo se inicia automáticamente cuando se detecta la adición de un nuevo elemento en la lista de SharePoint.

## Acciones del Flujo

1. **Notificación de Aprobación/Denegación en Microsoft Teams:**
   - Se envía un mensaje a través del bot de Microsoft Teams solicitando la aprobación o denegación del nuevo elemento.

2. **Decisión de Aprobación:**
   - Si se aprueba el nuevo elemento:
     - Se envía un correo electrónico al usuario que añadió el elemento, informando sobre la aprobación.
     - Se publica un mensaje en Microsoft Teams utilizando el bot disponible.
     - Se actualiza el estado del elemento en la lista como "Aprobado".

3. **Decisión de Denegación:**
   - Si se deniega el nuevo elemento:
     - Se envía un correo electrónico al usuario que añadió el elemento, informando sobre la denegación.
     - Se añade un mensaje en Microsoft Teams utilizando el bot disponible.
     - Se actualiza el estado del elemento en la lista como "Denegado".
