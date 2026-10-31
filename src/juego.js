// Logica del juego: ganador, empate y jugadas del bot.

const LINEAS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // filas
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columnas
  [0, 4, 8], [2, 4, 6],            // diagonales
]

// Probabilidad de que el bot juegue una casilla al azar, para que se pueda ganar
const PROBABILIDAD_ERROR_BOT = 0.2

export const otroSimbolo = (simbolo) => (simbolo === 'X' ? 'O' : 'X')

// Devuelve { tipo: 'victoria', simbolo, linea }, { tipo: 'empate' } o null
export function calcularResultado(tablero) {
  for (const [a, b, c] of LINEAS) {
    if (tablero[a] && tablero[a] === tablero[b] && tablero[a] === tablero[c]) {
      return { tipo: 'victoria', simbolo: tablero[a], linea: [a, b, c] }
    }
  }
  if (tablero.every(Boolean)) return { tipo: 'empate' }
  return null
}

function buscarJugadaGanadora(tablero, simbolo) {
  for (let i = 0; i < 9; i++) {
    if (!tablero[i]) {
      const copia = [...tablero]
      copia[i] = simbolo
      const resultado = calcularResultado(copia)
      if (resultado && resultado.tipo === 'victoria') return i
    }
  }
  return null
}

function elegirAlAzar(opciones) {
  return opciones[Math.floor(Math.random() * opciones.length)]
}

// Estrategia: ganar, bloquear al rival, centro, esquinas y cualquier casilla
export function elegirJugadaBot(tablero, simboloBot, simboloRival) {
  const libres = tablero.map((valor, i) => (valor ? null : i)).filter((i) => i !== null)

  if (Math.random() < PROBABILIDAD_ERROR_BOT) return elegirAlAzar(libres)

  const ganar = buscarJugadaGanadora(tablero, simboloBot)
  if (ganar !== null) return ganar

  const bloquear = buscarJugadaGanadora(tablero, simboloRival)
  if (bloquear !== null) return bloquear

  if (!tablero[4]) return 4

  const esquinas = [0, 2, 6, 8].filter((i) => !tablero[i])
  if (esquinas.length > 0) return elegirAlAzar(esquinas)

  return elegirAlAzar(libres)
}
