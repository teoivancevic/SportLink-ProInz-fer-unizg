export interface WorkTime {
    day: string;
    from: string;
    to: string;
  }
  
  export interface SportCourt {
    id: number;
    name: string;
    maxHourlyPrice: number;
    quantity: number;
    sport: string;
  }
  
  export interface SportObject {
    id: number;
    name: string;
    description: string;
    location: string;
    workTimes: WorkTime[];
    sportCourts: SportCourt[];
  }
  
  export const sportObjects: SportObject[] = [
    {
      id: 1,
      name: "Sportski Centar Olimp",
      description: "Moderni sportski centar s raznovrsnim terenima i dvoranama.",
      location: "Ulica sportova 123, Zagreb",
      workTimes: [
        { day: "Ponedjeljak-Petak", from: "07:00", to: "22:00" },
        { day: "Subota-Nedjelja", from: "08:00", to: "20:00" },
      ],
      sportCourts: [
        { id: 1, name: "Teniski teren", maxHourlyPrice: 80, quantity: 4, sport: "Tenis" },
        { id: 2, name: "Košarkaško igralište", maxHourlyPrice: 60, quantity: 2, sport: "Košarka" },
        { id: 3, name: "Nogometni teren", maxHourlyPrice: 150, quantity: 1, sport: "Nogomet" },
      ],
    },
    {
      id: 2,
      name: "Fitness Zona",
      description: "Suvremeni fitness centar s raznovrsnom opremom i grupnim treninzima.",
      location: "Trg zdravlja 45, Split",
      workTimes: [
        { day: "Ponedjeljak-Petak", from: "06:00", to: "23:00" },
        { day: "Subota", from: "08:00", to: "22:00" },
        { day: "Nedjelja", from: "09:00", to: "20:00" },
      ],
      sportCourts: [
        { id: 4, name: "Teretana", maxHourlyPrice: 50, quantity: 1, sport: "Fitness" },
        { id: 5, name: "Dvorana za grupne treninge", maxHourlyPrice: 100, quantity: 2, sport: "Grupni treninzi" },
      ],
    },
    {
      id: 3,
      name: "Aqua Centar",
      description: "Vodeni sportski kompleks s olimpijskim bazenom i wellness sadržajima.",
      location: "Obala mora 78, Rijeka",
      workTimes: [
        { day: "Ponedjeljak-Nedjelja", from: "07:00", to: "21:00" },
      ],
      sportCourts: [
        { id: 6, name: "Olimpijski bazen", maxHourlyPrice: 120, quantity: 1, sport: "Plivanje" },
        { id: 7, name: "Mali bazen", maxHourlyPrice: 60, quantity: 1, sport: "Plivanje" },
        { id: 8, name: "Sauna", maxHourlyPrice: 50, quantity: 3, sport: "Wellness" },
      ],
    },
  ];
  
  