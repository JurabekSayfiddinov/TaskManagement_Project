export interface Cycle {
  id: string;
  name: string;
  description: string | null;
  start_date: string;
  end_date: string;
}

export interface CreateCycleDto {
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
}