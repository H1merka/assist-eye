import {Result} from '@core/errors/result';

export interface RouteLocation {
  latitude: number;
  longitude: number;
}

export interface NavigationStep {
  instruction: string;
  distanceMetres: number;
  type: 'turn_left' | 'turn_right' | 'straight' | 'arrive';
}

export interface Route {
  steps: NavigationStep[];
  totalDistance: number;
  estimatedTimeSec: number;
}

export interface SpatialNavigationService {
  /**
   * Получить текущее местоположение
   */
  getCurrentLocation(): Promise<Result<RouteLocation>>;

  /**
   * Построить маршрут до точки интереса. 
   * В будущем: запрос к Mapbox/OSM
   */
  buildRoute(destination: string): Promise<Result<Route>>;

  /**
   * Запустить процесс отслеживания маршрута
   * @param onStepCallback Callback для озвучивания следующего шага
   */
  startNavigation(route: Route, onStepCallback: (stepInstruction: string) => void): void;

  /**
   * Остановить навигацию
   */
  stopNavigation(): void;
}
