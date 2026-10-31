import { useEffect, useState } from 'react'
import { calcularResultado, elegirJugadaBot, otroSimbolo } from './juego'
import './App.css'

const CLAVE_ALMACENAMIENTO = 'tres en raya rd - estado'
const NOMBRE_BOT = 'Jugador Quisqueya'
const MAX_NOMBRE = 16
const TABLERO_VACIO = Array(9).fill(null)

// fase: 'modo' | 'configuracion' | 'juego'   modo: 'bot' | 'dos'
// jugadores[0] es el jugador 1 (casilla azul) y jugadores[1] el jugador 2 (casilla roja)
const ESTADO_INICIAL = {
  fase: 'modo',
  modo: null,
  jugadores: [
    { nombre: '', simbolo: 'X' },
    { nombre: '', simbolo: 'O' },
  ],
  tablero: TABLERO_VACIO,
  turno: 'X',
}

// Lee la partida guardada en el navegador (localStorage)
function cargarEstado() {
  try {
    const guardado = localStorage.getItem(CLAVE_ALMACENAMIENTO)
    if (!guardado) return ESTADO_INICIAL
    const dato = JSON.parse(guardado)
    const valido =
      dato &&
      Array.isArray(dato.tablero) && dato.tablero.length === 9 &&
      Array.isArray(dato.jugadores) && dato.jugadores.length === 2
    return valido ? { ...ESTADO_INICIAL, ...dato } : ESTADO_INICIAL
  } catch {
    return ESTADO_INICIAL
  }
}

function aplicarJugada(estado, posicion) {
  const tablero = [...estado.tablero]
  tablero[posicion] = estado.turno
  return { ...estado, tablero, turno: otroSimbolo(estado.turno) }
}

function SeleccionModo({ onElegir }) {
  return (
    <section className="panel" aria-labelledby="titulo-modo">
      <h2 id="titulo-modo">Elige el modo de partida</h2>
      <div className="botones-modo">
        <button type="button" className="boton-modo" onClick={() => onElegir('bot')}>
          <strong>Partida con bot</strong>
          <span>Juegas solo contra {NOMBRE_BOT}</span>
        </button>
        <button type="button" className="boton-modo" onClick={() => onElegir('dos')}>
          <strong>Partida de 2 jugadores</strong>
          <span>Dos personas juegan en el mismo dispositivo</span>
        </button>
      </div>
    </section>
  )
}

function SelectorSimbolo({ nombreGrupo, etiqueta, valor, onCambiar }) {
  return (
    <div className="simbolos" role="radiogroup" aria-label={etiqueta}>
      {['X', 'O'].map((simbolo) => (
        <label key={simbolo} className={'opcion-simbolo' + (valor === simbolo ? ' activa' : '')}>
          <input
            type="radio"
            name={nombreGrupo}
            value={simbolo}
            checked={valor === simbolo}
            onChange={() => onCambiar(simbolo)}
          />
          {simbolo}
        </label>
      ))}
    </div>
  )
}

function Configuracion({ modo, jugadoresIniciales, onComenzar, onCambiarModo }) {
  const esBot = modo === 'bot'
  const [nombre1, setNombre1] = useState(jugadoresIniciales[0].nombre)
  const [nombre2, setNombre2] = useState(esBot ? NOMBRE_BOT : jugadoresIniciales[1].nombre)
  const [simbolo1, setSimbolo1] = useState(jugadoresIniciales[0].simbolo)
  const [error, setError] = useState('')

  // Los dos simbolos siempre son distintos: al elegir uno, el otro jugador recibe el que queda
  const simbolo2 = otroSimbolo(simbolo1)

  const manejarEnvio = (evento) => {
    evento.preventDefault()
    const n1 = nombre1.trim()
    const n2 = esBot ? NOMBRE_BOT : nombre2.trim()

    if (!n1) return setError('Escribe el nombre del jugador 1.')
    if (!esBot && !n2) return setError('Escribe el nombre del jugador 2.')
    if (n1.toLowerCase() === n2.toLowerCase()) {
      return setError('Los nombres de los jugadores deben ser diferentes.')
    }

    onComenzar([
      { nombre: n1, simbolo: simbolo1 },
      { nombre: n2, simbolo: simbolo2 },
    ])
  }

  return (
    <form className="panel formulario" onSubmit={manejarEnvio} noValidate>
      <h2>{esBot ? 'Partida con bot' : 'Partida de 2 jugadores'}</h2>

      <div className="grupo-jugador grupo-azul">
        <h3>Jugador 1</h3>
        <label className="campo">
          Nombre
          <input
            type="text"
            value={nombre1}
            maxLength={MAX_NOMBRE}
            placeholder="Ejemplo: Taino"
            onChange={(e) => setNombre1(e.target.value)}
          />
        </label>
        <span className="etiqueta">Símbolo con el que quieres jugar</span>
        <SelectorSimbolo
          nombreGrupo="simbolo-j1"
          etiqueta="Símbolo del jugador 1"
          valor={simbolo1}
          onCambiar={setSimbolo1}
        />
      </div>

      <div className="grupo-jugador grupo-rojo">
        <h3>{esBot ? 'Bot' : 'Jugador 2'}</h3>
        {esBot ? (
          <p className="nota">
            {NOMBRE_BOT} jugará con {simbolo2}, el símbolo que queda.
          </p>
        ) : (
          <>
            <label className="campo">
              Nombre
              <input
                type="text"
                value={nombre2}
                maxLength={MAX_NOMBRE}
                placeholder="Ejemplo: Caribe"
                onChange={(e) => setNombre2(e.target.value)}
              />
            </label>
            <span className="etiqueta">Símbolo con el que quieres jugar</span>
            <SelectorSimbolo
              nombreGrupo="simbolo-j2"
              etiqueta="Símbolo del jugador 2"
              valor={simbolo2}
              onCambiar={(s) => setSimbolo1(otroSimbolo(s))}
            />
          </>
        )}
      </div>

      {error && <p className="error" role="alert">{error}</p>}

      <div className="acciones">
        <button type="submit" className="boton">Comenzar partida</button>
        <button type="button" className="boton boton-secundario" onClick={onCambiarModo}>
          Cambiar modo
        </button>
      </div>
    </form>
  )
}

export default function App() {
  const [estado, setEstado] = useState(cargarEstado)
  const { fase, modo, jugadores, tablero, turno } = estado

  // Guarda la partida en el navegador cada vez que cambia el estado
  useEffect(() => {
    try {
      localStorage.setItem(CLAVE_ALMACENAMIENTO, JSON.stringify(estado))
    } catch {
      // Si el navegador no permite guardar, el juego sigue funcionando
    }
  }, [estado])

  // Turno del bot: espera un momento y juega
  useEffect(() => {
    if (estado.fase !== 'juego' || estado.modo !== 'bot') return
    if (calcularResultado(estado.tablero)) return
    if (estado.turno !== estado.jugadores[1].simbolo) return

    const temporizador = setTimeout(() => {
      setEstado((prev) => {
        if (calcularResultado(prev.tablero) || prev.turno !== prev.jugadores[1].simbolo) return prev
        const posicion = elegirJugadaBot(prev.tablero, prev.jugadores[1].simbolo, prev.jugadores[0].simbolo)
        return aplicarJugada(prev, posicion)
      })
    }, 600)

    return () => clearTimeout(temporizador)
  }, [estado])

  const resultado = fase === 'juego' ? calcularResultado(tablero) : null
  const jugadorEnTurno = jugadores.find((j) => j.simbolo === turno)
  const turnoDelBot = modo === 'bot' && jugadorEnTurno === jugadores[1]

  const claseColor = (simbolo) => (jugadores[0].simbolo === simbolo ? 'color-j1' : 'color-j2')

  const elegirModo = (nuevoModo) => {
    setEstado((prev) => {
      const jugador2 = { ...prev.jugadores[1] }
      if (nuevoModo === 'bot') jugador2.nombre = NOMBRE_BOT
      else if (jugador2.nombre === NOMBRE_BOT) jugador2.nombre = ''
      return { ...prev, modo: nuevoModo, fase: 'configuracion', jugadores: [prev.jugadores[0], jugador2] }
    })
  }

  const comenzar = (nuevosJugadores) => {
    setEstado((prev) => ({
      ...prev,
      jugadores: nuevosJugadores,
      fase: 'juego',
      tablero: TABLERO_VACIO,
      turno: 'X',
    }))
  }

  const jugar = (posicion) => {
    if (resultado || tablero[posicion] || turnoDelBot) return
    setEstado((prev) => (prev.tablero[posicion] ? prev : aplicarJugada(prev, posicion)))
  }

  const jugarOtraVez = () => {
    setEstado((prev) => ({ ...prev, tablero: TABLERO_VACIO, turno: 'X' }))
  }

  // Reiniciar borra el tablero y vuelve a pedir nombres y simbolos
  const reiniciar = () => {
    setEstado((prev) => ({ ...prev, fase: 'configuracion', tablero: TABLERO_VACIO, turno: 'X' }))
  }

  const cambiarModo = () => {
    setEstado((prev) => ({ ...prev, fase: 'modo', modo: null }))
  }

  let mensajeFinal = null
  if (resultado) {
    if (resultado.tipo === 'empate') {
      mensajeFinal = {
        titulo: 'Empate',
        texto: 'Nadie ganó esta vez. Buen juego de ambos, pueden jugar otra partida.',
      }
    } else {
      const ganador = jugadores.find((j) => j.simbolo === resultado.simbolo)
      const ganoBot = modo === 'bot' && ganador === jugadores[1]
      mensajeFinal = ganoBot
        ? {
            titulo: `Ganó ${ganador.nombre}`,
            texto: 'Esta vez la victoria fue del bot. Puedes intentarlo de nuevo.',
          }
        : {
            titulo: `Felicidades, ${ganador.nombre}`,
            texto: `Ganaste la partida con ${ganador.simbolo}. Gracias por jugar Tres en raya RD.`,
          }
    }
  }

  return (
    <div className="app">
      <div className="barra-bandera" aria-hidden="true" />

      <header className="cabecera">
        <h1 className="titulo">Tres en raya RD</h1>
        <p className="subtitulo">Un juego, muchas experiencias</p>
      </header>

      <main className="contenido">
        {fase === 'modo' && <SeleccionModo onElegir={elegirModo} />}

        {fase === 'configuracion' && (
          <Configuracion
            modo={modo}
            jugadoresIniciales={jugadores}
            onComenzar={comenzar}
            onCambiarModo={cambiarModo}
          />
        )}

        {fase === 'juego' && (
          <>
            <section className="marcador" aria-label="Jugadores">
              <div className={'jugador jugador-j1' + (jugadorEnTurno === jugadores[0] && !resultado ? ' en-turno' : '')}>
                <span className="jugador-nombre">{jugadores[0].nombre}</span>
                <span className="jugador-simbolo">{jugadores[0].simbolo}</span>
              </div>

              <div className="turno" aria-live="polite">
                <span>Turno de:</span>
                <span className={'turno-simbolo ' + claseColor(turno)}>{turno}</span>
              </div>

              <div className={'jugador jugador-j2' + (jugadorEnTurno === jugadores[1] && !resultado ? ' en-turno' : '')}>
                <span className="jugador-nombre">{jugadores[1].nombre}</span>
                <span className="jugador-simbolo">{jugadores[1].simbolo}</span>
              </div>
            </section>

            <section className="tablero" aria-label="Tablero de tres en raya">
              {tablero.map((valor, i) => {
                const esGanadora = resultado && resultado.tipo === 'victoria' && resultado.linea.includes(i)
                return (
                  <button
                    key={i}
                    type="button"
                    className={'celda' + (valor ? ' ' + claseColor(valor) : '') + (esGanadora ? ' celda-ganadora' : '')}
                    onClick={() => jugar(i)}
                    disabled={Boolean(valor) || Boolean(resultado) || turnoDelBot}
                    aria-label={`Fila ${Math.floor(i / 3) + 1}, columna ${(i % 3) + 1}: ${valor || 'vacía'}`}
                  >
                    {valor}
                  </button>
                )
              })}
            </section>

            <div className="zona-reiniciar">
              <button type="button" className="boton" onClick={reiniciar}>
                Reiniciar
              </button>
            </div>
          </>
        )}
      </main>

      {mensajeFinal && (
        <div className="fondo-modal">
          <div className="modal" role="dialog" aria-modal="true" aria-labelledby="titulo-modal">
            <h2 id="titulo-modal">{mensajeFinal.titulo}</h2>
            <p>{mensajeFinal.texto}</p>
            <div className="acciones">
              <button type="button" className="boton" onClick={jugarOtraVez} autoFocus>
                Jugar otra vez
              </button>
              <button type="button" className="boton boton-secundario" onClick={reiniciar}>
                Cambiar jugadores
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="pie">
        <p>
          Gracias por jugar Tres en raya RD, un espacio para compartir con un amigo o disfrutar un rato solo.
        </p>
      </footer>
    </div>
  )
}
