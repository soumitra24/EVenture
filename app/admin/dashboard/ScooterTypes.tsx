export type Scooter = {
    id: string;
    name: string;
    model: string;
    imageUrl: string;
    pricePerHour: number;
    maxSpeed: string;
    location: string;
    mileage: string;
    support: string;
    owner: string;
    available: number;
    rating: number;
    created_at: string;
  };
  
  export type ScooterFormData = Omit<Scooter, 'id' | 'created_at'>;
  
  export const emptyScooterForm: ScooterFormData = {
    name: "",
    model: "",
    imageUrl: "",
    pricePerHour: 0,
    maxSpeed: "",
    location: "",
    mileage: "",
    support: "",
    owner: "",
    available: 1,
    rating: 0
  };