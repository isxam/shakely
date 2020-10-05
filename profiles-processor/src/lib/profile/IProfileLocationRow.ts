export default interface IProfileLocationRow {
  time: number
  accuracy: number
  point: {
    lat: number
    lon: number
  }
}
