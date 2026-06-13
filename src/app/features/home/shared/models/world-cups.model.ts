export interface WorldCupViewModel {
  year: number;
  hosts: string[];
  hostNames: string[];
  champion: string | null;
  participants: string[];
  historicalNames: Record<string, string>;
}

export type WorldCupRole = 'host' | 'champion' | 'host-champion';
