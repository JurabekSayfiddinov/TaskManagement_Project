export interface Module {
  id: string;
  name: string;
  description: string | null;
}

export interface CreateModuleDto {
  name: string;
  description?: string;
}