/**
 * Generated by orval v6.11.1 🍺
 * Do not edit manually.
 * WebApp
 * OpenAPI spec version: v1
 */
import type { ViewContestResponseTeam } from './viewContestResponseTeam';

export interface ViewContestResponse {
  id?: number;
  topic?: string | null;
  description?: string | null;
  maxPoints?: number;
  startDate?: string;
  endDate?: string;
  thumbnailUrl?: string | null;
  teams?: ViewContestResponseTeam[] | null;
}
