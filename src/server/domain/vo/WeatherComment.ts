import { Weather } from "./Weather";

export interface WeatherComment {
  weather: keyof typeof Weather;
  comment: string;
}
