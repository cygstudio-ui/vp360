export const PLAYERS = [
    { id: 1, name: "Ale Galán", rank: 1, country: "ESP", img: "AG", stats: { power: 98, speed: 95, defense: 90 } },
    { id: 2, name: "Juan Lebrón", rank: 1, country: "ESP", img: "JL", stats: { power: 99, speed: 92, defense: 88 } },
    { id: 3, name: "Agustín Tapia", rank: 2, country: "ARG", img: "AT", stats: { power: 96, speed: 99, defense: 94 } },
    { id: 4, name: "Arturo Coello", rank: 2, country: "ESP", img: "AC", stats: { power: 97, speed: 94, defense: 92 } },
];

export const FOOD_MENU = [
    { id: 1, name: "Power Bowl VP", desc: "Quinoa, aguacate, pollo grillé", price: "$12", cat: "Saludable" },
    { id: 2, name: "Smash Burger", desc: "Doble carne, queso cheddar, salsa secreta", price: "$15", cat: "Grill" },
    { id: 3, name: "Isotónica Casera", desc: "Limón, miel, sal del himalaya", price: "$5", cat: "Bebidas" },
];

export const SCHEDULE = [
    {
        id: 101, time: "09:00 AM", p1: "Navarro/Chingotto", p2: "Bela/Yanguas", court: "Cancha Central", status: "Finalizado",
        score: "6-4, 6-3"
    },
    {
        id: 102, time: "11:30 AM", p1: "Galán/Lebrón", p2: "Tapia/Coello", court: "Cancha Central", status: "LIVE", score: "In Progress"
    },
    {
        id: 103, time: "02:00 PM", p1: "Stupa/Di Nenno", p2: "Momo/Garrido", court: "Cancha 2", status: "Pendiente", score: "-"
    },
];
