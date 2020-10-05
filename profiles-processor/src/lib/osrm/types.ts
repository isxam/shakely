export type ILocation = [number, number];

export interface IWaypoint {
  name: string,
  location: ILocation
}

export interface IMatchingResult {
  code: string,
  tracepoints: Array<IWaypoint | null>
}

export interface ITracepointPosition {
  tracepoint: ILocation,
  position: number,
}
