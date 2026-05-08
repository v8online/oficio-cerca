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
  "Calamuchita": ["Santa Rosa de Calamuchita", "Villa General Belgrano", "Embalse", "Villa del Dique", "La Cumbrecita", "Villa Rumipal"],
  "Colón": ["Jesús María", "La Calera", "Río Ceballos", "Unquillo", "Salsipuedes", "Colonia Caroya", "Mendiolaza", "Villa Allende"],
  "Cruz del Eje": ["Cruz del Eje", "San Marcos Sierras", "Villa de Soto", "Serrezuela"],
  "General Roca": ["Huinca Renancó", "Villa Huidobro", "Jovita", "Italó"],
  "General San Martín": ["Villa María", "Villa Nueva", "Arroyo Cabral", "Etruria", "La Laguna"],
  "Ischilín": ["Deán Funes", "Quilino"],
  "Juarez Celman": ["La Carlota", "General Cabrera", "General Deheza", "Alejandro Roca"],
  "Marcos Juárez": ["Marcos Juárez", "Leones", "Corral de Bustos", "Monte Buey", "Camilo Aldao"],
  "Minas": ["San Carlos Minas", "Ciénaga del Coro"],
  "Pocho": ["Salsacate", "San Jerónimo"],
  "Presidente Roque Sáenz Peña": ["Laboulaye", "General Levalle", "Melo"],
  "Punilla": ["Villa Carlos Paz", "Cosquín", "La Falda", "Capilla del Monte", "La Cumbre", "Villa Giardino", "Bialet Massé", "Huerta Grande"],
  "Río Cuarto": ["Río Cuarto", "Vicuña Mackenna", "Berrotarán", "Sampacho", "Adelia María", "Las Higueras"],
  "Río Primero": ["Río Primero", "Monte Cristo", "Piquillín"],
  "Río Seco": ["Villa de María", "Sebastian Elcano"],
  "Río Segundo": ["Villa del Rosario", "Río Segundo", "Pilar", "Oncativo", "Laguna Larga", "Pozo del Molle"],
  "San Alberto": ["Villa Cura Brochero", "Mina Clavero", "Nono", "Las Rabonas"],
  "San Javier": ["Villa Dolores", "Las Tapias", "Luyaba", "San Javier"],
  "San Justo": ["San Francisco", "Arroyito", "Las Varillas", "Morteros", "Brinkmann", "Devoto"],
  "Santa María": ["Alta Gracia", "Malagueño", "Despeñaderos", "Anisacate", "Villa Parque Santa Ana"],
  "Sobremonte": ["San Francisco del Chañar"],
  "Tercero Arriba": ["Río Tercero", "Oliva", "Hernando", "James Craik", "Almafuerte"],
  "Totoral": ["Villa del Totoral", "Las Peñas"],
  "Tulumba": ["Villa Tulumba", "San José de la Dormida"],
  "Unión": ["Bell Ville", "Justiniano Posse", "Canals", "Monte Maíz", "Ordóñez"]
};

export const OCCUPATIONS = [
  "Albañil", "Ayudante de albañil", "Peón de construcción", "Maestro mayor de obra", 
  "Electricista", "Plomero", "Gasista matriculado", "Carpintero", "Pintor", 
  "Azulejero", "Yesero", "Soldador", "Herrero", "Cerrajero", "Mecánico", 
  "Refrigeracionista", "Instalador de aire acondicionado", "Jardinero", 
  "Paisajista", "Fumigador", "Techista", "Colocador de pisos", "Vidriero", 
  "Cortinero", "Tapicero", "Mueblero", "Tornero", "Herrero artístico", 
  "Frentista", "Peluquero", "Esteticista", "Masajista", "Profesor particular", 
  "Niñera", "Cuidador de ancianos", "Delivery", "Chofer", "Remisero", 
  "Veterinario", "Fotógrafo", "Diseñador gráfico", "Programador", "Contador", 
  "Abogado", "Martillero", "Agrónomo", "Veterinario a domicilio", 
  "Colocador de cerámicos", "Parquetero", "Instalador de alarmas", 
  "Instalador de cámaras de seguridad", "Limpiador de tanques", "Desratizador", 
  "Pintor de automóviles", "Chapista", "Chef", "Cocinero", "Pastelero", 
  "Bartender", "Organizador de eventos", "DJ", "Animador infantil", 
  "Costurera", "Sastre", "Modista", "Zapatero", "Relojero", "Joyero", 
  "Traductor", "Editor de video"
];

export const PRICE_RANGES = ["Economic", "Standard", "Premium"];
