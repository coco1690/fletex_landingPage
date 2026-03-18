import Map, { Marker, Popup } from 'react-map-gl/mapbox'
import { useState } from 'react'
import 'mapbox-gl/dist/mapbox-gl.css'

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN

const AGENCIAS = [
  {
    nombre: 'Agencia Puerto Gaitán',
    direccion: 'Calle principal, Puerto Gaitán, Meta',
    horario: 'Lun–Sab 5:00 AM – 8:00 PM',
    telefono: '3148632751',
    lat: 4.3137,
    lng: -72.0797,
  },
  {
    nombre: 'Agencia Campo Rubiales',
    direccion: 'Entrada principal CR, Meta',
    horario: 'Lun–Sab 5:00 AM – 6:00 PM',
    telefono: '3148632751',
    lat: 4.1350,
    lng: -72.6430,
  },
]

export function Location() {
  const [popupIndex, setPopupIndex] = useState<number | null>(null)

  return (
    <section id="ubicacion" className="px-4 md:px-8 py-16 border-t border-border bg-card/30">
      <div className="max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-primary/12 border border-primary/25 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
          <span className="w-1.5 h-1.5 bg-primary rounded-full" />
          Dónde nos encontramos
        </div>
        <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-2">Puntos de atención</h2>
        <p className="text-muted-foreground text-sm mb-8">Visítanos en cualquiera de nuestras agencias</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {AGENCIAS.map((a, i) => (
            <div
              key={a.nombre}
              onClick={() => setPopupIndex(i)}
              className="bg-card border border-border hover:border-primary/40 rounded-2xl p-5 transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 text-lg">📍</div>
                <div className="flex-1">
                  <div className="font-bold text-sm mb-0.5">{a.nombre}</div>
                  <div className="text-xs text-muted-foreground mb-2">{a.direccion}</div>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-[10px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full">
                      {a.horario}
                    </span>
                    <a
                      href={`tel:${a.telefono}`}
                      onClick={(e: React.MouseEvent) => e.stopPropagation()}
                      className="text-[10px] bg-secondary text-muted-foreground border border-border px-2 py-0.5 rounded-full hover:border-primary/40 transition-colors"
                    >
                      📞 {a.telefono}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-card border border-border rounded-2xl overflow-hidden h-64 md:h-80">
          <Map
            initialViewState={{
              longitude: -72.3,
              latitude: 4.22,
              zoom: 9,
            }}
            style={{ width: '100%', height: '100%' }}
            mapStyle="mapbox://styles/mapbox/streets-v12"
            mapboxAccessToken={MAPBOX_TOKEN}
          >
            {AGENCIAS.map((a, i) => (
              <Marker
                key={a.nombre}
                longitude={a.lng}
                latitude={a.lat}
                anchor="bottom"
                onClick={(e: any) => {
                  e.originalEvent.stopPropagation()
                  setPopupIndex(i)
                }}
              >
                <div className="flex flex-col items-center cursor-pointer group">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform border-2 border-white">
                    <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                  </div>
                </div>
              </Marker>
            ))}

            {popupIndex !== null && (
              <Popup
                longitude={AGENCIAS[popupIndex].lng}
                latitude={AGENCIAS[popupIndex].lat}
                anchor="top"
                onClose={() => setPopupIndex(null)}
                closeOnClick={false}
              >
                <div className="p-1 min-w-40">
                  <p className="font-bold text-xs text-gray-900">{AGENCIAS[popupIndex].nombre}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">{AGENCIAS[popupIndex].direccion}</p>
                  <p className="text-[10px] text-gray-500">{AGENCIAS[popupIndex].horario}</p>
                  <a
                    href={`https://maps.google.com/?q=${AGENCIAS[popupIndex].lat},${AGENCIAS[popupIndex].lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-[10px] font-semibold text-blue-600 hover:underline"
                  >
                    Ver en Google Maps →
                  </a>
                </div>
              </Popup>
            )}
          </Map>
        </div>
      </div>
    </section>
  )
}