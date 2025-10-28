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
        foto: "", // Agregado campo foto
    },
    {
        id: "DEF",
        nombre: "Susete",
        posicion: "DEF",
        pais: "🇪🇸",
        linea: "defensas",
        titular: true,
        lesionado: false,
        foto: "",
    },
    {
        id: "DEF",
        nombre: "Gonzalo",
        posicion: "DEF",
        pais: "🇪🇸",
        linea: "defensas",
        titular: true,
        lesionado: false,
        foto: "",
    },
    {
        id: "DEF",
        nombre: "Darian",
        posicion: "DEF",
        pais: "🇪🇸",
        linea: "defensas",
        titular: true,
        lesionado: false,
        foto: "",
    },
    {
        id: "MC",
        nombre: "Hugo",
        posicion: "MC",
        pais: "🇪🇸",
        linea: "mediocampistas",
        titular: true,
        lesionado: false,
        foto: "",
    },
    {
        id: "MC",
        nombre: "Davidillo",
        posicion: "MC",
        pais: "🇪🇸",
        linea: "mediocampistas",
        titular: true,
        lesionado: false,
        foto: "",
    },
    {
        id: "MC",
        nombre: "Alberto",
        posicion: "MC",
        pais: "🇪🇸",
        linea: "mediocampistas",
        titular: true,
        lesionado: false,
        foto: "",
    },
    {
        id: "DEL",
        nombre: "Ricardo",
        posicion: "DEL",
        pais: "🇪🇸",
        linea: "delanteros",
        titular: true,
        lesionado: false,
        foto: "",
    },
    {
        id: "DEL",
        nombre: "Juan",
        posicion: "DEL",
        pais: "🇪🇸",
        linea: "delanteros",
        titular: true,
        lesionado: false,
        foto: "",
    },
    {
        id: "DEL",
        nombre: "Guille",
        posicion: "DEL",
        pais: "🇪🇸",
        linea: "delanteros",
        titular: false,
        lesionado: false,
        foto: "",
    },
]

const managers = [{ nombre: "Gerardo Huizar Castro", pais: " 🇲🇽 México" }]

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
        descripcion:
            "Robar el balón en campo rival. 1 portero, 1 defensa rápido, 3 mediocampistas presionadores y 1 delantero.",
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
]

const proximosPartidos = []

const partidos = []

// ====== UI HELPERS ======
const byId = (id) => document.getElementById(id)

function getCardClass(r) {
    return "gold"
}

function crearTarjeta(j, esSuplente = false) {
    const card = document.createElement("div")
    card.className = `player-card ${esSuplente ? "suplente-card" : ""}`
    card.dataset.id = j.id
    card.dataset.jugador = JSON.stringify(j)
    card.draggable = true

    // Determinar si mostrar foto o icono
    const fotoHTML = j.foto
        ? `<img src="${j.foto}" alt="${j.nombre}" class="player-photo" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';" /><div class="player-icon" style="display:none;">👤</div>`
        : `<div class="player-icon">👤</div>`

    card.innerHTML = `
    <div class="card-shape gold">
        <div class="card-content">
            ${fotoHTML}
            <div class="card-name">${j.posicion}</div>
            <div class="card-flag">${j.pais}</div>
            <div class="card-name">${j.nombre}</div>
        </div>
    </div>`

    // Sistema híbrido de interacción (mouse y touch)
    let touchStartX = 0
    let touchStartY = 0
    let isDragging = false

    // Eventos mouse
    card.addEventListener("click", (e) => {
        if (!isDragging) {
            manejarClick(j, card)
        }
    })

    // Eventos táctiles mejorados para iPad
    card.addEventListener("touchstart", (e) => {
        touchStartX = e.touches[0].clientX
        touchStartY = e.touches[0].clientY
        isDragging = false

        setTimeout(() => {
            if (!isDragging) {
                card.classList.add("selected")
                jugadorSeleccionado = j
            }
        }, 100)
    })

    card.addEventListener("touchmove", (e) => {
        const touchX = e.touches[0].clientX
        const touchY = e.touches[0].clientY
        const deltaX = Math.abs(touchX - touchStartX)
        const deltaY = Math.abs(touchY - touchStartY)

        if (deltaX > 10 || deltaY > 10) {
            isDragging = true
            card.classList.add("dragging")

            // Crear elemento fantasma que sigue el dedo
            const ghost = document.querySelector(".drag-ghost") || createDragGhost()
            ghost.style.left = touchX + "px"
            ghost.style.top = touchY + "px"
            ghost.style.display = "block"
        }
    })

    card.addEventListener("touchend", (e) => {
        card.classList.remove("dragging")
        const ghost = document.querySelector(".drag-ghost")
        if (ghost) ghost.style.display = "none"

        if (isDragging) {
            const touch = e.changedTouches[0]
            const elementoObjetivo = document.elementFromPoint(touch.clientX, touch.clientY)
            const tarjetaObjetivo = elementoObjetivo ? elementoObjetivo.closest(".player-card") : null

            if (tarjetaObjetivo && tarjetaObjetivo !== card) {
                const datosObjetivo = tarjetaObjetivo.dataset.jugador
                if (datosObjetivo) {
                    const jugadorObjetivo = JSON.parse(datosObjetivo)
                    manejarIntercambio(jugadorSeleccionado, jugadorObjetivo)
                }
            }

            card.classList.remove("selected")
            jugadorSeleccionado = null
        }

        isDragging = false
    })

    // Eventos drag estándar para desktop
    card.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text", JSON.stringify(j))
        card.classList.add("dragging")
        isDragging = true
    })

    card.addEventListener("dragend", () => {
        card.classList.remove("dragging")
        isDragging = false
    })

    // Agregar evento drop
    card.addEventListener("dragover", (e) => {
        e.preventDefault()
    })

    card.addEventListener("drop", (e) => {
        e.preventDefault()
        const data = e.dataTransfer.getData("text")
        if (data) {
            const jugadorArrastrado = JSON.parse(data)
            manejarIntercambio(jugadorArrastrado, j)
        }
    })

    return card
}

function createDragGhost() {
    const ghost = document.createElement("div")
    ghost.className = "drag-ghost"
    ghost.textContent = "👤"
    document.body.appendChild(ghost)
    return ghost
}

function manejarClick(j, card) {
    if (!jugadorSeleccionado) {
        jugadorSeleccionado = j
        document.querySelectorAll(".player-card").forEach((c) => c.classList.remove("selected"))
        card.classList.add("selected")
    } else {
        if (jugadorSeleccionado.id === j.id && jugadorSeleccionado.nombre === j.nombre) {
            jugadorSeleccionado = null
            card.classList.remove("selected")
        } else {
            manejarIntercambio(jugadorSeleccionado, j)
            jugadorSeleccionado = null
            document.querySelectorAll(".player-card").forEach((card) => card.classList.remove("selected"))
        }
    }
}

function manejarIntercambio(jugadorSeleccionado, jugadorObjetivo) {
    if (jugadorSeleccionado && jugadorObjetivo && jugadorSeleccionado !== jugadorObjetivo) {
        if (jugadorSeleccionado.posicion === jugadorObjetivo.posicion) {
            const titularTemp = jugadorSeleccionado.titular
            const lineaTemp = jugadorSeleccionado.linea

            jugadorSeleccionado.titular = jugadorObjetivo.titular
            jugadorSeleccionado.linea = jugadorObjetivo.linea

            jugadorObjetivo.titular = titularTemp
            jugadorObjetivo.linea = lineaTemp
        } else {
            const titularTemp = jugadorSeleccionado.titular
            jugadorSeleccionado.titular = jugadorObjetivo.titular
            jugadorObjetivo.titular = titularTemp
        }

        const titulares = jugadores.filter((j) => j.titular).length
        if (titulares < 6) {
            const noTitulares = jugadores.filter((j) => !j.titular && !j.lesionado)
            for (let i = 0; i < 6 - titulares && i < noTitulares.length; i++) {
                noTitulares[i].titular = true
            }
        }

        render()
        document.querySelectorAll(".player-card").forEach((card) => card.classList.remove("selected"))
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
        })

        cont.addEventListener("drop", (e) => {
            e.preventDefault()
            const data = e.dataTransfer.getData("text")
            if (data) {
                const jugador = JSON.parse(data)
                // Actualizar línea del jugador
                const lineaId = cont.id || cont.closest(".linea").id
                if (lineaId && jugador) {
                    jugador.linea = lineaId
                    render()
                }
            }
        })
    })
}

function cambiarFormacion6() {
    jugadores.forEach((j) => (j.titular = false))

    const porteros = jugadores.filter((j) => j.linea === "portero")
    if (porteros[0]) porteros[0].titular = true

    const defensas = jugadores.filter((j) => j.linea === "defensas")
    defensas.slice(0, 2).forEach((j) => (j.titular = true))

    const medios = jugadores.filter((j) => j.linea === "mediocampistas")
    medios.slice(0, 2).forEach((j) => (j.titular = true))

    const delanteros = jugadores.filter((j) => j.linea === "delanteros")
    if (delanteros[0]) delanteros[0].titular = true
}

function cambiarFormacion(formacionKey) {
    const formacion = formaciones[formacionKey]
    if (!formacion) return

    formacionActual = formacionKey

    const titularesActuales = {
        portero: jugadores.filter((j) => j.titular && j.linea === "portero"),
        defensas: jugadores.filter((j) => j.titular && j.linea === "defensas"),
        mediocampistas: jugadores.filter((j) => j.titular && j.linea === "mediocampistas"),
        delanteros: jugadores.filter((j) => j.titular && j.linea === "delanteros"),
    }

    jugadores.forEach((j) => (j.titular = false))

    function seleccionarJugadores(linea, cantidad) {
        const actuales = titularesActuales[linea]
        const disponibles = jugadores.filter((j) => j.linea === linea && !j.lesionado)

        const seleccionados = []
        for (let i = 0; i < Math.min(cantidad, actuales.length); i++) {
            if (!actuales[i].lesionado) {
                seleccionados.push(actuales[i])
            }
        }

        if (seleccionados.length < cantidad) {
            for (const jugador of disponibles) {
                if (!seleccionados.includes(jugador) && seleccionados.length < cantidad) {
                    seleccionados.push(jugador)
                }
            }
        }

        seleccionados.forEach((j) => (j.titular = true))
    }

    seleccionarJugadores("portero", formacion.portero)
    seleccionarJugadores("defensas", formacion.defensas)
    seleccionarJugadores("mediocampistas", formacion.mediocampistas)
    seleccionarJugadores("delanteros", formacion.delanteros)

    const desc = byId("formacionDesc")
    if (desc) {
        desc.textContent = formacion.descripcion
    }

    const select = byId("formacionSelect")
    if (select) {
        select.value = formacionKey
    }

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

    if (filtroActivo === "TITULARES") {
        jugadoresFiltrados = jugadores.filter((j) => j.titular)
    } else if (filtroActivo === "SUPLENTES") {
        jugadoresFiltrados = jugadores.filter((j) => !j.titular)
    } else if (filtroActivo !== "TODOS") {
        jugadoresFiltrados = jugadores.filter((j) => j.posicion === filtroActivo)
    }

    jugadoresFiltrados.forEach((j) => {
        const tr = document.createElement("tr")

        const fotoHTML = j.foto
            ? `<img src="${j.foto}" alt="${j.nombre}" class="table-player-photo" onerror="this.style.display='none'; this.nextElementSibling.style.display='inline-block';" /><span class="table-player-icon" style="display:none;">👤</span>`
            : `<span class="table-player-icon">👤</span>`

        tr.innerHTML = `
            <td>${fotoHTML}</td>
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
        if (proximosPartidos.length === 0) {
            prox.innerHTML =
                '<div class="card"><p style="text-align:center;color:#aaa">📅 No hay próximos partidos programados</p></div>'
        } else {
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
    }

    if (hist) {
        hist.innerHTML = ""
        if (partidos.length === 0) {
            hist.innerHTML =
                '<div class="card"><p style="text-align:center;color:#aaa">🏆 No hay partidos en el historial</p></div>'
        } else {
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

            const fotoHTML = j.foto
                ? `<img src="${j.foto}" alt="${j.nombre}" class="disponible-photo" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';" /><div class="disponible-icon" style="display:none;">👤</div>`
                : `<div class="disponible-icon">👤</div>`

            c.innerHTML = `
                ${fotoHTML}
                <div style="font-size:1.5rem;margin:8px 0">${j.pais}</div>
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

// ====== Google Sheets Integration ======
const GOOGLE_SHEET_ID = "1234567890abcdefghijklmnopqrstuvwxyz" // Reemplaza con tu ID real

async function cargarDesdeGoogleSheets() {
    // Si no hay ID configurado, usar datos locales
    if (!GOOGLE_SHEET_ID || GOOGLE_SHEET_ID === "1234567890abcdefghijklmnopqrstuvwxyz") {
        console.log("[v0] Usando datos locales - configura GOOGLE_SHEET_ID para cargar desde Google Sheets")
        return
    }

    try {
        const url = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/export?format=csv`
        const response = await fetch(url)

        if (!response.ok) {
            throw new Error("No se pudo cargar la hoja de cálculo")
        }

        const csvText = await response.text()
        const lineas = csvText.split("\n")

        const headers = lineas[0].split(",").map((h) => h.trim().toLowerCase())
        const nuevosJugadores = []

        for (let i = 1; i < lineas.length; i++) {
            if (!lineas[i].trim()) continue

            const valores = lineas[i].split(",").map((v) => v.trim())
            const jugador = {}

            headers.forEach((header, index) => {
                jugador[header] = valores[index] || ""
            })

            let linea = ""
            if (jugador.posicion === "POR") linea = "portero"
            else if (jugador.posicion === "DEF") linea = "defensas"
            else if (jugador.posicion === "MC") linea = "mediocampistas"
            else if (jugador.posicion === "DEL") linea = "delanteros"

            if (jugador.nombre && jugador.posicion && linea) {
                nuevosJugadores.push({
                    id: jugador.posicion,
                    nombre: jugador.nombre,
                    posicion: jugador.posicion,
                    pais: jugador.pais || "🌍",
                    linea: linea,
                    titular: jugador.titular?.toUpperCase() === "TRUE",
                    lesionado: jugador.lesionado?.toUpperCase() === "TRUE",
                    foto: jugador.foto || "",
                })
            }
        }

        if (nuevosJugadores.length > 0) {
            jugadores = nuevosJugadores

            const titulares = jugadores.filter((j) => j.titular).length
            if (titulares < 6) {
                const noTitulares = jugadores.filter((j) => !j.titular && !j.lesionado)
                for (let i = 0; i < 6 - titulares && i < noTitulares.length; i++) {
                    noTitulares[i].titular = true
                }
            }

            render()
            guardarAlineacion()
            console.log(`[v0] Cargados ${nuevosJugadores.length} jugadores desde Google Sheets`)
        }
    } catch (error) {
        console.error("[v0] Error al cargar Google Sheets:", error)
    }
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

function abrirModalAyuda() {
    byId("modalAyuda").classList.add("active")
}

function cerrarModalAyuda() {
    byId("modalAyuda").classList.remove("active")
}

const isTouchDevice = () => {
    return "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0
}

// ====== START ======
document.addEventListener("DOMContentLoaded", () => {
    if (isTouchDevice()) {
        document.body.classList.add("touch-device")
    }

    cargarAlineacion()
    cargarEstadoSidebars()

    // Forzar reflow para que el CSS se aplique correctamente
    document.body.offsetHeight

    // Intentar cargar desde Google Sheets al iniciar
    cargarDesdeGoogleSheets()

    cambiarFormacion6()
    const select = byId("formacionSelect")
    if (select) {
        select.value = formacionActual
        const desc = byId("formacionDesc")
        if (desc && formaciones[formacionActual]) {
            desc.textContent = formaciones[formacionActual].descripcion
        }
    }

    setTimeout(() => {
        render()
        initTabs()
        habilitarMovimiento()

        setTimeout(() => {
            render()
        }, 100)
    }, 50)
})
