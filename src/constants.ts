/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const DEPARTMENTS = [
  "Calamuchita", "Capital", "Colón", "Cruz del Eje", "General Roca", 
  "General San Martín", "Ischilín", "Juarez Celman", "Marcos Juárez", 
  "Minas", "Pocho", "Presidente Roque Sáenz Peña", "Punilla", 
  "Río Cuarto", "Río Primero", "Río Seco", "Río Segundo", 
  "San Alberto", "San Javier", "San Justo", "Santa María", 
  "Sobremonte", "Tercero Arriba", "Totoral", "Tulumba", "Unión"
];

export const CITIES_BY_DEPARTMENT: Record<string, string[]> = {
  "Capital": ["Córdoba Capital"],
  "Calamuchita": ["Embalse", "La Cumbrecita", "Los Cóndores", "Santa Rosa de Calamuchita", "Villa General Belgrano", "Villa Rumipal", "Villa Yacanto", "Villa del Dique"],
  "Colón": ["Agua de Oro", "Colonia Caroya", "Estación Juárez Celman", "Jesús María", "La Calera", "Malvinas Argentinas", "Mendiolaza", "Mi Granja", "Río Ceballos", "Saldán", "Salsipuedes", "Unquillo", "Villa Allende"],
  "Cruz del Eje": ["Cruz del Eje", "El Brete", "San Marcos Sierra", "Serrezuela", "Villa de Soto"],
  "General Roca": ["Del Campillo", "Huinca Renancó", "Italó", "Jovita", "Nicolás Bruzzone", "Villa Huidobro", "Villa Valeria"],
  "General San Martín": ["Arroyo Cabral", "Etruria", "La Laguna", "Ticino", "Villa María", "Villa Nueva"],
  "Ischilín": ["Deán Funes", "Quilino"],
  "Juarez Celman": ["Alejandro Roca", "Carnerillo", "General Cabrera", "General Deheza", "La Carlota", "Santa Eufemia", "Ucacha"],
  "Marcos Juárez": ["Arias", "Camilo Aldao", "Corral de Bustos", "Cruz Alta", "General Baldissera", "General Roca", "Guatimozín", "Leones", "Los Surgentes", "Marcos Juárez", "Monte Buey"],
  "Minas": ["Ciénaga del Coro", "San Carlos Minas"],
  "Pocho": ["Salsacate", "San Jerónimo"],
  "Presidente Roque Sáenz Peña": ["General Levalle", "Laboulaye", "Melo"],
  "Punilla": ["Bialet Massé", "Capilla del Monte", "Cosquín", "Huerta Grande", "La Cumbre", "La Falda", "Mayu Sumaj", "San Roque", "Santa María de Punilla", "Tanti", "Valle Hermoso", "Villa Carlos Paz", "Villa Giardino", "Villa Parque Síquiman", "Villa Río Icho Cruz", "Villa Santa Cruz del Lago"],
  "Río Cuarto": ["Achiras", "Adelia María", "Berrotarán", "Las Higueras", "Las Acequias", "Río Cuarto", "Sampacho", "Santa Catalina Holmberg", "Vicuña Mackenna"],
  "Río Primero": ["Monte Cristo", "Obispo Trejo", "Piquillín", "Río Primero"],
  "Río Seco": ["Sebastian Elcano", "Villa Candelaria Norte", "Villa de María"],
  "Río Segundo": ["Calchín", "Laguna Larga", "Oncativo", "Pilar", "Pozo del Molle", "Río Segundo", "Villa del Rosario"],
  "San Alberto": ["Los Cerrillos", "Mina Clavero", "Nono", "San Lorenzo", "San Pedro", "Villa Cura Brochero", "Villa Sarmiento", "Las Rabonas"],
  "San Javier": ["La Paz", "Las Tapias", "Luyaba", "San Javier", "San José", "Villa Dolores", "Villa de las Rosas"],
  "San Justo": ["Altos de Chipión", "Arroyito", "Brinkmann", "Devoto", "El Tío", "Las Varillas", "Morteros", "Porteña", "Sacanta", "San Francisco", "Saturnino María Laspiur", "Tránsito"],
  "Santa María": ["Alta Gracia", "Anisacate", "Despeñaderos", "Falda del Carmen", "Malagueño", "Potrero de Garay", "Toledo", "Valle de Anisacate", "Villa Parque Santa Ana", "Villa del Prado"],
  "Sobremonte": ["San Francisco del Chañar"],
  "Tercero Arriba": ["Almafuerte", "Hernando", "James Craik", "Oliva", "Río Tercero", "Tancacha", "Villa Ascasubi"],
  "Totoral": ["Las Peñas", "Sinsacate", "Villa del Totoral"],
  "Tulumba": ["San José de la Dormida", "Villa Tulumba"],
  "Unión": ["Bell Ville", "Canals", "Justiniano Posse", "Monte Maíz", "Noetinger", "Ordóñez", "Pascanas", "San Marcos Sud", "Viamonte"]
};

export const OCCUPATIONS = [
  "Albañil", "Ayudante de albañil", "Peón de construcción", "Maestro mayor de obra", 
  "Electricista", "Plomero", "Gasista", "Gasista matriculado", "Carpintero", "Pintor", 
  "Azulejero", "Yesero", "Soldador", "Herrero", "Cerrajero", "Mecánico", 
  "Mecánico de autos", "Mecánico de motos", "Mecánico (general)", "Gomero (especialista en neumáticos)",
  "Refrigeracionista", "Instalador de aire acondicionado", "Técnico en refrigeración",
  "Jardinero", "Auxiliar de jardinería", "Paisajista", "Fumigador", "Techista", 
  "Colocador de pisos", "Vidriero", "Montador de cristales y vidrios",
  "Cortinero", "Tapicero", "Mueblero", "Tornero", "Herrero artístico", 
  "Frentista", "Peluquero", "Barbero", "Esteticista", "Masajista", "Manicura", 
  "Depiladora", "Maquillador", "Profesor particular", "Maestra particular de primaria",
  "Niñera", "Cuidador de ancianos", "Delivery", "Cadete", "Chofer", "Remisero", 
  "Chofer de Taxi/DiDi/Uber", "Camionero", "Veterinario", "Fotógrafo", 
  "Diseñador gráfico", "Programador", "Técnico de celulares", "Técnico electrónico",
  "Contador", "Auxiliar contable", "Abogado", "Arquitecto", "Martillero", "Agrónomo", 
  "Nutricionista", "Médico", "Auxiliar de enfermería", "Veterinario a domicilio", 
  "Colocador de cerámicos", "Parquetero", "Instalador de alarmas", 
  "Instalador de cámaras de seguridad", "Montador de paneles solares",
  "Limpiador de tanques", "Desratizador", "Pintor de automóviles", "Chapista", 
  "Maquinista", "Operador de fábrica", "Operario logístico", "Chef", "Cocinero", 
  "Ayudante de cocina", "Auxiliar de cocina", "Pastelero", "Repostero", "Repostera", 
  "Panadero", "Carnicero", "Pescador", "Quesero", "Bartender", "Mozo", "Parrillero", 
  "Organizador de eventos", "DJ", "Animador infantil", "Guía turístico", 
  "Guía de cabalgatas", "Hotelería", "Ganadero", "Costurera", "Sastre", "Modista", 
  "Zapatero", "Relojero", "Joyero", "Traductor", "Editor de video", 
  "Auxiliar de limpieza", "Sereno/Personal de seguridad", "Limpieza de piletas", 
  "Lavadero de autos/motos", "Cajero", "Cajera", "Recepcionista", "Secretaria", 
  "Auxiliar administrativo", "Repositor", "Paseador de perros"
];

export const PRICE_RANGES = ["Economic", "Standard", "Premium"];
