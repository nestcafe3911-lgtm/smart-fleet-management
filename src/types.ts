export interface CarBrand {
  id: string;
  name: string;
  accentClass: string;
  glowClass: string;
  brandColor: string;
  modelName: string;
  specs: {
    battery: string;
    range: string;
    hp: string;
    tankVolume: number;
  };
}

export interface RefuelingRecord {
  id: string;
  plateNo: string;
  brand: string;
  date: string;
  totalPaid: number;
  liters: number;
  pricePerLiter: number;
  fuelType: string;
  driverName: string;
  station: string;
  time: string;
  simulated?: boolean;
}

export interface FleetVehicle {
  id: string;
  brand: string;
  model: string;
  plate: string;
  type: string;
  status: "available" | "in_use" | "maintenance";
  mileage: number;
  condition: string;
  imageUrl?: string;
}

export interface MaintenanceIssue {
  id: string;
  partName: string;
  status: "GOOD" | "WARNING" | "CRITICAL";
  wearPercent: number;
  estimatedDaysLeft: number;
  estimatedKmLeft: number;
  icon: string;
}

export interface PricingTrend {
  day: string;
  benzene: number;
  diesel: number;
}

export interface PricePrediction {
  trendDirection: "UP" | "DOWN" | "STABLE";
  percentChange: number;
  analysisSummary: string;
  recommendedAction: string;
  dailyPredictionArray: PricingTrend[];
}

export interface FleetAnomaly {
  transactionId: string;
  riskLevel: "HIGH" | "MEDIUM" | "LOW";
  issueType: string;
  explanation: string;
}

export interface DrivingTelemetry {
  currentSpeed: number;
  ecoScore: number;
  avgConsumption: string;
  suddenBraking: number;
  rapidAcceleration: number;
  idleTimeMinutes: number;
}
