import IProfileLocationRow from './IProfileLocationRow';
import IProfileSensorRow from './IProfileSensorRow';

export default interface IProfile {
  location: Array<IProfileLocationRow>
  sensor: Array<IProfileSensorRow>
}
