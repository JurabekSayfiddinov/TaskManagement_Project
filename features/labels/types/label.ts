export interface Label {
  id: string;
  name: string;
  color: string;
}

export interface CreateLabelDto {
  name: string;
  color: string;
}