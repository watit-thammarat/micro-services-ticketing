import { Subjects } from './subject';

export interface Event {
  subject: Subjects;
  data: any;
}
