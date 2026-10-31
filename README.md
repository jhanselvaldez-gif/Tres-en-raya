# Nombre completo 

Jhansel Ariel Valdez Breton

## Brebe descripción del juego

Este juego de tres en raya está hecho con React, Vite, JavaScript y CSS. Le brinda al usuario la opción de jugar en el mismo dispositivo contra un bot o con un amigo, lo cuál lo hace un poco más entretenido.

## Qué aprendiste

- A usar `useState` para guardar el estado del juego (el tablero, el turno y los jugadores) y a actualizarlo creando copias, sin modificar el estado anterior.

- A usar `useEffect` tanto para guardar la partida en `localStorage` como hacer que el bot juegue solo después de un momento.

- A mostrar pantallas distintas según la variable (`fase`): elegir el modo, pedir los datos y jugar.

- A dividir el programa en componentes y pasarles datos y funciones con props, y a hacer formularios con inputs controlados y validaciones.

- A separar la lógica del juego (en este caso con el archivo `juego.js`) de la parte visual (`App.jsx`).

- A usar CSS grid y flexbox, variables de CSS y una ventana emergente para mostrar al ganador.

- A manejar un proyecto con Vite, npm y Git, incluyendo solucionar un problema que tuve con las versiones de Vite y el plugin de React.

## Qué parte fue más difícil

La parte más difícil fue lograr que el bot jugara solo en su turno. Había que revisar varias condiciones con `useEffect` (que sea modo bot, que el jugador haya hecho su jugada para evitar que el bot juegue fuera de turno y que la partida no haya terminado) y usar `setTimeout` con `clearTimeout` para que no jugara fuera de lugar si se reiniciaba el juego. También duré un buen tiempo pensando en las reglas del bot en orden de prioridad: ganar, bloquear al rival, tomar el centro, una esquina o cualquier casilla libre.

## Enlace de GitHub 


