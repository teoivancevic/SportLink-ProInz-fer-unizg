export interface WorkTime {
    id?: number; // teo: optional temporarily
    dayOfWeek: number;
    isWorking?: boolean; // teo: optional temporarily
    openFrom: string;
    openTo: string;
  }
  
  export interface SportCourt {
    id: number;
    name?: string;
    availableCourts: number;
    maxHourlyPrice: number;
    
    sportName?: string;
    sportId?: number;
  }
  
  export interface SportObject {
    id: number;
    name: string;
    description: string;
    location: string;
    organizationId?: number;
    workTimes: WorkTime[];
    sportCourts: SportCourt[];
  }
  
  //mock
  // export const sportObjectsMOCK: SportObject[] = [
  //   {
  //     id: 1,
  //     name: "Sportski Centar Olimp",
  //     description: "Moderni sportski centar s raznovrsnim terenima i dvoranama.",
  //     location: "Ulica sportova 123, Zagreb",
  //     workTimes: [
  //       { dayOfWeek: 1, openFrom: "07:00", openTo: "22:00" },
  //       { dayOfWeek: 6, openFrom: "08:00", openTo: "20:00"},
  //     ],
  //     sportCourts: [
  //       { id: 1, name: "Teniski teren", maxHourlyPrice: 80, availableCourts: 4, sportName: "Tenis" },
  //       { id: 2, name: "Košarkaško igralište", maxHourlyPrice: 60, availableCourts: 2, sportName: "Košarka" },
  //       { id: 3, name: "Nogometni teren", maxHourlyPrice: 150, availableCourts: 1, sportName: "Nogomet" },
  //     ],
  //   },
  //   {
  //     id: 2,
  //     name: "Fitness Zona",
  //     description: "Suvremeni fitness centar s raznovrsnom opremom i grupnim treninzima.",
  //     location: "Trg zdravlja 45, Split",
  //     workTimes: [
  //       { dayOfWeek: 1, openFrom: "06:00", openTo: "23:00" },
  //       { dayOfWeek: 6, openFrom: "08:00", openTo: "22:00"},
  //       { dayOfWeek: 7, openFrom: "09:00", openTo: "20:00" },
  //     ],
  //     sportCourts: [
  //       { id: 4, name: "Teretana", maxHourlyPrice: 50, availableCourts: 1, sportName: "Fitness" },
  //       { id: 5, name: "Dvorana za grupne treninge", maxHourlyPrice: 100, availableCourts: 2, sportName: "Grupni treninzi" },
  //     ],
  //   },
  //   {
  //     id: 3,
  //     name: "Aqua Centar",
  //     description: "Vodeni sportski kompleks s olimpijskim bazenom i wellness sadržajima.",
  //     location: "Obala mora 78, Rijeka",
  //     workTimes: [
  //       { dayOfWeek: 1, openFrom: "07:00", openTo: "21:00" },
  //     ],
  //     sportCourts: [
  //       { id: 6, name: "Olimpijski bazen", maxHourlyPrice: 120, availableCourts: 1, sportName: "Plivanje" },
  //       { id: 7, name: "Mali bazen", maxHourlyPrice: 60, availableCourts: 1, sportName: "Plivanje" },
  //       { id: 8, name: "Sauna", maxHourlyPrice: 50, availableCourts: 3, sportName: "Wellness" },
  //     ],
  //   },
  // ];
  
  