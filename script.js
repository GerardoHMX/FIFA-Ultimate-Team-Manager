// ====== DATA ======
let jugadores = [
    {
        id: "POR",
        nombre: "Dasi",
        posicion: "POR",
        pais: "🇪🇸",
        linea: "portero",
        titular: true,
        lesionado: false,
    },
    {
        id: "DEF",
        nombre: "Susete",
        posicion: "DEF",
        pais: "🇪🇸",
        linea: "defensas",
        titular: true,
        lesionado: false,
    },
    {
        id: "DEF",
        nombre: "Gonzalo",
        posicion: "DEF",
        pais: "🇪🇸",
        linea: "defensas",
        titular: true,
        lesionado: false,
    },
    {
        id: "DEF",
        nombre: "Darian",
        posicion: "DEF",
        pais: "🇪🇸",
        linea: "defensas",
        titular: true,
        lesionado: false,
    },
    {
        id: "MC",
        nombre: "Hugo",
        posicion: "MC",
        pais: "🇪🇸",
        linea: "mediocampistas",
        titular: true,
        lesionado: false,
    },
    {
        id: "MC",
        nombre: "Davidillo",
        posicion: "MC",
        pais: "🇪🇸",
        linea: "mediocampistas",
        titular: true,
        lesionado: false,
    },
    {
        id: "MC",
        nombre: "Alberto",
        posicion: "MC",
        pais: "🇪🇸",
        linea: "mediocampistas",
        titular: true,
        lesionado: false,
    },
    {
        id: "DEL",
        nombre: "Ricardo",
        posicion: "DEL",
        pais: "🇪🇸",
        linea: "delanteros",
        titular: true,
        lesionado: false,
    },
    {
        id: "DEL",
        nombre: "Juan",
        posicion: "DEL",
        pais: "🇪🇸",
        linea: "delanteros",
        titular: true,
        lesionado: false,
    },
    {
        id: "DEL",
        nombre: "Guille",
        posicion: "DEL",
        pais: "🇪🇸",
        linea: "delanteros",
        titular: false,
        lesionado: false,
    },
]

const managers = [
    { nombre: "Gerardo Huizar Castro", pais: " 🇲🇽 México", },
]

const formaciones = {
    "2-2-1": {
        nombre: "Ofensiva",
        descripcion: "Ataque constante con presión alta. 1 portero, 2 defensas, 2 mediocampistas dinámicos y 1 delantero.",
        portero: 1,
        defensas: 2,
        mediocampistas: 2,
        delanteros: 1,
    },
    "2-1-2": {
        nombre: "Equilibrada",
        descripcion: "Balance perfecto entre defensa y ataque. 1 portero, 2 defensas, 1 mediocentro eje y 2 delanteros.",
        portero: 1,
        defensas: 2,
        mediocampistas: 1,
        delanteros: 2,
    },
    "1-3-1": {
        nombre: "Presión Alta",
        descripcion: "Robar el balón en campo rival. 1 portero, 1 defensa rápido, 3 mediocampistas presionadores y 1 delantero.",
        portero: 1,
        defensas: 1,
        mediocampistas: 3,
        delanteros: 1,
    },
    "1-2-2": {
        nombre: "Balanceada",
        descripcion: "Formación versátil y adaptable. 1 portero, 1 defensa central, 2 mediocampistas y 2 delanteros.",
        portero: 1,
        defensas: 1,
        mediocampistas: 2,
        delanteros: 2,
    },
}

let formacionActual = "2-2-1"

const managerActual = 0
let jugadorSeleccionado = null
let filtroActivo = "TODOS"
let sidebarState = {
    left: false,
    right: false,
}

const avisos = [
    { tipo: "⚠️", texto: "Los partidos comienzan en Enero" },
    { tipo: "🏆", texto: "Sin miedo al éxito" },
    // { tipo: "📋", texto: "El equipo se mantiene en el top 3 de la liga" },
]

const proximosPartidos = [
    // { rival: "Undefined", fecha: "30/10/2025", hora: "21:00", lugar: "Local", competicion: "La Liga" },
]

const partidos = [
    // {
    //     rival: "Barcelona",
    //     resultado: "2-0",
    //     fecha: "24/10/2025",
    //     estado: "Victoria",
    //     detalles: "Goles: Vinicius (23'), Rodrygo (67')",
    // },
]

// ====== UI HELPERS ======
const byId = (id) => document.getElementById(id)

function getCardClass(r) {
    return "gold" // Todas las tarjetas son doradas
}

function crearTarjeta(j, esSuplente = false) {
    const card = document.createElement("div")
    card.className = `player-card ${esSuplente ? "suplente-card" : ""}`
    card.dataset.id = j.id
    card.dataset.jugador = JSON.stringify(j)
    card.draggable = true
    card.innerHTML = `
    <div class="card-shape gold">
        <div class="card-content">
        <div class="card-name">${j.posicion}</div>
        <div class="card-flag">${j.pais}</div>
        <div class="card-name">${j.nombre}</div>
        </div>
    </div>`
    
    // Sistema híbrido de interacción (mouse y touch)
    let touchTimeout
    let hasMoved = false
    
    card.addEventListener("mousedown", () => manejarClick(j, card))
    
    // Eventos touch
    card.addEventListener("touchstart", (e) => {
        hasMoved = false
        touchTimeout = setTimeout(() => {
            manejarClick(j, card)
        }, 200)
    })
    
    // Eventos táctiles para iPad
    card.addEventListener("touchstart", (e) => {
        e.preventDefault();
        jugadorSeleccionado = j;
        card.classList.add("dragging");
    });
    
    card.addEventListener("touchend", (e) => {
        e.preventDefault();
        card.classList.remove("dragging");
        const touch = e.changedTouches[0];
        const elementoObjetivo = document.elementFromPoint(touch.clientX, touch.clientY);
        const tarjetaObjetivo = elementoObjetivo.closest(".player-card");
        
        if (tarjetaObjetivo) {
            const jugadorObjetivo = jugadores.find(
                jugador => jugador.nombre === tarjetaObjetivo.querySelector(".card-name:last-child").textContent
            );
            if (jugadorObjetivo) {
                manejarIntercambio(jugadorSeleccionado, jugadorObjetivo);
            }
        }
        jugadorSeleccionado = null;
    });
    
    card.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text", j.id)
        card.classList.add("dragging")
    })
    card.addEventListener("dragend", () => card.classList.remove("dragging"))
    return card
}

function manejarClick(j, card) {
    if (!jugadorSeleccionado) {
        jugadorSeleccionado = j
        card.classList.add("selected")
    } else {
        if (jugadorSeleccionado.id === j.id) {
            jugadorSeleccionado = null
            card.classList.remove("selected")
        } else {
            manejarIntercambio(jugadorSeleccionado, j)
            jugadorSeleccionado = null
        }
    }
}

function manejarIntercambio(jugadorSeleccionado, jugadorObjetivo) {
    // Verificar que ambos jugadores existen y son diferentes
    if (jugadorSeleccionado && jugadorObjetivo && jugadorSeleccionado !== jugadorObjetivo) {
        // Si son de la misma posición, intercambiar todo (titular y línea)
        if (jugadorSeleccionado.posicion === jugadorObjetivo.posicion) {
            const titularTemp = jugadorSeleccionado.titular;
            const lineaTemp = jugadorSeleccionado.linea;
            
            jugadorSeleccionado.titular = jugadorObjetivo.titular;
            jugadorSeleccionado.linea = jugadorObjetivo.linea;
            
            jugadorObjetivo.titular = titularTemp;
            jugadorObjetivo.linea = lineaTemp;
        } else {
            // Si son de diferente posición, solo intercambiar estado de titular
            const titularTemp = jugadorSeleccionado.titular;
            jugadorSeleccionado.titular = jugadorObjetivo.titular;
            jugadorObjetivo.titular = titularTemp;
        }
        
        // Asegurar mínimo 6 jugadores titulares
        const titulares = jugadores.filter(j => j.titular).length;
        if (titulares < 6) {
            const noTitulares = jugadores.filter(j => !j.titular && !j.lesionado);
            for (let i = 0; i < 6 - titulares && i < noTitulares.length; i++) {
                noTitulares[i].titular = true;
            }
        }

        // Actualizar la vista
        render()
        
        // Limpiar la selección visual
        document.querySelectorAll('.player-card').forEach(card => card.classList.remove('selected'))
    }
}

// ====== CAMPO RENDER ======
function render() {
    ;["delanteros", "mediocampistas", "defensas", "portero"].forEach((id) => (byId(id).innerHTML = ""))
    byId("suplentes").innerHTML = ""

    const titulares = jugadores.filter((j) => j.titular)
    const suplentes = jugadores.filter((j) => !j.titular)

    titulares.forEach((j) => byId(j.linea).appendChild(crearTarjeta(j)))
    suplentes.forEach((j) => byId("suplentes").appendChild(crearTarjeta(j, true)))

    actualizarManager()
    renderChips()
    renderListaJugadores()
    renderEstadisticas()
    renderPartidos()
    renderLesiones()
}

function actualizarManager() {
    const m = managers[managerActual]
    byId("managerName").textContent = m.nombre
    byId("managerCountry").textContent = m.pais
    byId("managerFormation").textContent = `Formación: fe-${formacionActual}`
    byId("mgrNameList").textContent = m.nombre
    byId("mgrCountryList").textContent = m.pais
}

function habilitarMovimiento() {
    document.querySelectorAll(".linea, .campo-jugadores").forEach((cont) => {
        cont.addEventListener("dragover", (e) => {
            e.preventDefault()
            const draggable = document.querySelector(".dragging")
            if (draggable) cont.appendChild(draggable)
        })

        // Agregar soporte para eventos táctiles
        cont.addEventListener("touchmove", (e) => {
            e.preventDefault()
            const touch = e.touches[0]
            const draggable = document.querySelector(".dragging")
            if (!draggable) return

            const elementoDebajo = document.elementFromPoint(touch.clientX, touch.clientY)
            const contenedorObjetivo = elementoDebajo.closest(".linea, .campo-jugadores")
            
            if (contenedorObjetivo) {
                contenedorObjetivo.appendChild(draggable)
            }
        })
    })
    }

function cambiarFormacion6() {
    // Resetear todos a suplentes
    jugadores.forEach((j) => (j.titular = false))

    // Seleccionar 1 portero
    const porteros = jugadores.filter((j) => j.linea === "portero")
    if (porteros[0]) porteros[0].titular = true

    // Seleccionar 2 defensas
    const defensas = jugadores.filter((j) => j.linea === "defensas").sort((a, b) => b.rating - a.rating)
    defensas.slice(0, 2).forEach((j) => (j.titular = true))

    // Seleccionar 2 mediocampistas
    const medios = jugadores.filter((j) => j.linea === "mediocampistas").sort((a, b) => b.rating - a.rating)
    medios.slice(0, 2).forEach((j) => (j.titular = true))

    // Seleccionar 1 delantero
    const delanteros = jugadores.filter((j) => j.linea === "delanteros").sort((a, b) => b.rating - a.rating)
    if (delanteros[0]) delanteros[0].titular = true
}

function cambiarFormacion(formacionKey) {
    const formacion = formaciones[formacionKey]
    if (!formacion) return

    formacionActual = formacionKey

    // Obtener jugadores actuales titulares para preservarlos
    const titularesActuales = {
        portero: jugadores.filter((j) => j.titular && j.linea === "portero"),
        defensas: jugadores.filter((j) => j.titular && j.linea === "defensas"),
        mediocampistas: jugadores.filter((j) => j.titular && j.linea === "mediocampistas"),
        delanteros: jugadores.filter((j) => j.titular && j.linea === "delanteros"),
    }

    // Resetear todos a suplentes
    jugadores.forEach((j) => (j.titular = false))

    // Función auxiliar para seleccionar jugadores por línea
    function seleccionarJugadores(linea, cantidad) {
        const actuales = titularesActuales[linea]
        const disponibles = jugadores.filter((j) => j.linea === linea && !j.lesionado).sort((a, b) => b.rating - a.rating)

        // Primero intentar mantener a los titulares actuales
        const seleccionados = []
        for (let i = 0; i < Math.min(cantidad, actuales.length); i++) {
            if (!actuales[i].lesionado) {
                seleccionados.push(actuales[i])
            }
        }

        // Si faltan jugadores, completar con los mejores disponibles
        if (seleccionados.length < cantidad) {
            for (const jugador of disponibles) {
                if (!seleccionados.includes(jugador) && seleccionados.length < cantidad) {
                    seleccionados.push(jugador)
                }
            }
        }

        // Marcar como titulares
        seleccionados.forEach((j) => (j.titular = true))
    }

    // Aplicar la nueva formación
    seleccionarJugadores("portero", formacion.portero)
    seleccionarJugadores("defensas", formacion.defensas)
    seleccionarJugadores("mediocampistas", formacion.mediocampistas)
    seleccionarJugadores("delanteros", formacion.delanteros)

    // Actualizar descripción
    const desc = byId("formacionDesc")
    if (desc) {
        desc.textContent = formacion.descripcion
    }

    // Actualizar selector
    const select = byId("formacionSelect")
    if (select) {
        select.value = formacionKey
    }

    // Guardar formación en localStorage
    localStorage.setItem("formacionActual", formacionKey)

    render()
}

function renderChips() {
    const container = byId("chipsPosiciones")
    if (!container) return

    const posiciones = ["TODOS", "TITULARES", "SUPLENTES", "POR", "DEF", "MC", "DEL"]
    container.innerHTML = ""

    posiciones.forEach((pos) => {
        const chip = document.createElement("div")
        chip.className = `chip ${filtroActivo === pos ? "active" : ""}`
        chip.textContent = pos
        chip.onclick = () => {
            filtroActivo = pos
            renderChips()
            renderListaJugadores()
        }
        container.appendChild(chip)
    })
}

function renderListaJugadores() {
    const tbody = byId("listaJugadores")
    if (!tbody) return

    tbody.innerHTML = ""

    let jugadoresFiltrados = jugadores

    // Filtrar por estado (Titular/Suplente)
    if (filtroActivo === "TITULARES") {
        jugadoresFiltrados = jugadores.filter((j) => j.titular)
    } else if (filtroActivo === "SUPLENTES") {
        jugadoresFiltrados = jugadores.filter((j) => !j.titular)
    } else if (filtroActivo !== "TODOS") {
        // Filtrar por posición
        jugadoresFiltrados = jugadores.filter((j) => j.posicion === filtroActivo)
    }

    jugadoresFiltrados.forEach((j) => {
        const tr = document.createElement("tr")
        tr.innerHTML = `
            <td>${j.nombre}</td>
            <td>${j.posicion}</td>
            <td>${j.pais}</td>
            <td class="${j.titular ? "estado-titular" : "estado-suplente"}">
                ${j.titular ? "✅ Titular" : "🔄 Suplente"}
            </td>
        `
        tbody.appendChild(tr)
    })
}

function renderEstadisticas() {
    const a = byId("avisosCards")
    if (!a) return

    a.innerHTML = ""
    avisos.forEach((aviso) => {
        const c = document.createElement("div")
        c.className = "card"
        c.innerHTML = `
            <div style="display:flex;align-items:center;gap:10px">
                <span style="font-size:1.5rem">${aviso.tipo}</span>
                <h4 style="margin:0">${aviso.texto}</h4>
            </div>`
        a.appendChild(c)
    })
}

function renderPartidos() {
    const prox = byId("proximosPartidosCards")
    const hist = byId("partidosCards")

    if (prox) {
        prox.innerHTML = ""
        proximosPartidos.forEach((p) => {
            const c = document.createElement("div")
            c.className = "card"
            c.innerHTML = `
                <div style="border-left:4px solid #00ff88;padding-left:12px">
                    <h4 style="font-size:1.1rem;margin-bottom:8px">${p.fecha} - ${p.rival}</h4>
                    <p style="margin:4px 0"><strong>${p.competicion}</strong></p>
                    <p style="color:#aaa;font-size:0.9rem">${p.hora} - ${p.lugar}</p>
                </div>`
            prox.appendChild(c)
        })
    }

    if (hist) {
        hist.innerHTML = ""
        partidos.forEach((m) => {
            const c = document.createElement("div")
            c.className = "card"
            const estadoColor = m.estado === "Victoria" ? "#00ff88" : m.estado === "Empate" ? "#ffd700" : "#ff4444"
            c.innerHTML = `
                <div style="border-left:4px solid ${estadoColor};padding-left:12px">
                    <h4 style="font-size:1.1rem;margin-bottom:8px">${m.fecha} - ${m.rival}</h4>
                    <p style="font-size:1.2rem;margin:8px 0"><strong>${m.resultado}</strong></p>
                    <p style="color:#aaa;font-size:0.9rem">${m.detalles}</p>
                </div>`
            hist.appendChild(c)
        })
    }
}

function renderLesiones() {
    const lesionesContainer = byId("lesionesCards")
    const disponiblesContainer = byId("disponiblesGrid")

    if (lesionesContainer) {
        lesionesContainer.innerHTML = ""
        const lesionados = jugadores.filter((j) => j.lesionado)

        if (lesionados.length === 0) {
            lesionesContainer.innerHTML =
                '<div class="card"><p style="text-align:center;color:#aaa">✅ No hay jugadores lesionados</p></div>'
        } else {
            lesionados.forEach((j) => {
                const c = document.createElement("div")
                c.className = "card"
                c.innerHTML = `
                    <div style="border-left:4px solid #ff4444;padding-left:12px">
                        <h4 style="font-size:1.1rem;margin-bottom:8px">${j.pais} ${j.nombre}</h4>
                        <p style="margin:4px 0"><strong>${j.posicion}</strong></p>
                        <p style="color:#ff4444;font-size:0.9rem">🚑 Lesionado - Recuperación estimada: 2 semanas</p>
                    </div>`
                lesionesContainer.appendChild(c)
            })
        }
    }

    if (disponiblesContainer) {
        disponiblesContainer.innerHTML = ""
        const disponibles = jugadores.filter((j) => !j.lesionado)

        disponibles.forEach((j) => {
            const c = document.createElement("div")
            c.className = "disponible-card"
            c.innerHTML = `
                <div style="font-size:1.5rem;margin-bottom:8px">${j.pais}</div>
                <div class="player-name">${j.nombre}</div>
                <div class="player-name">${j.posicion}</div>
            `
            disponiblesContainer.appendChild(c)
        })
    }
}

// ====== Tabs ======
function initTabs() {
    const tabs = document.querySelectorAll(".tab")
    tabs.forEach((t) =>
        t.addEventListener("click", () => {
            tabs.forEach((x) => x.classList.remove("active"))
            t.classList.add("active")

            const campo = byId("campo")
            const jugadores = byId("jugadores")
            const estadisticas = byId("estadisticas")

            if (campo) campo.style.display = t.dataset.section === "campo" ? "flex" : "none"
            if (jugadores) jugadores.style.display = t.dataset.section === "jugadores" ? "block" : "none"
            if (estadisticas) estadisticas.style.display = t.dataset.section === "estadisticas" ? "block" : "none"
        }),
    )
}

// ====== Misc ======
function guardarAlineacion() {
    localStorage.setItem("alineacion", JSON.stringify(jugadores))
    localStorage.setItem("formacionActual", formacionActual)
    alert("✅ Alineación guardada correctamente.")
}

function cargarAlineacion() {
    const s = localStorage.getItem("alineacion")
    if (s) {
        try {
            jugadores = JSON.parse(s)
        } catch (e) {
            console.error("Error al cargar alineación:", e)
        }
    }

    const formacionGuardada = localStorage.getItem("formacionActual")
    if (formacionGuardada && formaciones[formacionGuardada]) {
        formacionActual = formacionGuardada
    }
}

function resetearAlineacion() {
    if (confirm("¿Estás seguro de que quieres resetear la alineación?")) {
        localStorage.removeItem("alineacion")
        location.reload()
    }
}

function abrirModalEquipo() {
    byId("modalEquipo").classList.add("active")
}

function cerrarModalEquipo() {
    byId("modalEquipo").classList.remove("active")
}

function guardarEquipo() {
    const n = byId("inputTeamName").value.trim()
    const em = byId("inputTeamLogo").value.trim()
    if (n) byId("teamName").textContent = n
    if (em) byId("teamLogo").textContent = em
    cerrarModalEquipo()
}

function toggleSidebar(side) {
    const sidebar = byId(side === "left" ? "leftSidebar" : "rightSidebar")
    const toggle = byId(side === "left" ? "toggleLeftSidebar" : "toggleRightSidebar")

    sidebarState[side] = !sidebarState[side]

    if (sidebarState[side]) {
        sidebar.classList.add("active")
        toggle.classList.add("active")
    } else {
        sidebar.classList.remove("active")
        toggle.classList.remove("active")
    }

    // Guardar estado en localStorage
    localStorage.setItem("sidebarState", JSON.stringify(sidebarState))
}

function cargarEstadoSidebars() {
    const saved = localStorage.getItem("sidebarState")
    if (saved) {
        try {
            sidebarState = JSON.parse(saved)

            if (sidebarState.left) {
                byId("leftSidebar").classList.add("active")
                byId("toggleLeftSidebar").classList.add("active")
            }

            if (sidebarState.right) {
                byId("rightSidebar").classList.add("active")
                byId("toggleRightSidebar").classList.add("active")
            }
        } catch (e) {
            console.error("Error al cargar estado de sidebars:", e)
        }
    }
}

// Detectar tipo de dispositivo
const isTouchDevice = () => {
    return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);
}

// ====== START ======
document.addEventListener("DOMContentLoaded", () => {
    // Agregar clase al body según el tipo de dispositivo
    if (isTouchDevice()) {
        document.body.classList.add('touch-device');
    }
    
    cargarAlineacion()
    cargarEstadoSidebars()
    cambiarFormacion6()
    const select = byId("formacionSelect")
    if (select) {
        select.value = formacionActual
        const desc = byId("formacionDesc")
        if (desc && formaciones[formacionActual]) {
            desc.textContent = formaciones[formacionActual].descripcion
        }
    }
    render()
    initTabs()
    habilitarMovimiento()
})
