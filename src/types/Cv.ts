export type Cv = {
  id: string;
  name: string;
  age: number;
  job: string;
  owner: string;
};

export type CvWithSkills = Cv & {
  skills: string[];
};
