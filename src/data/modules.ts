import type { ModuleData, ModuleSection, ModuleActivity } from '@/lib/types/database';
import modulesJson from '@/data/modules.json';

export type { ModuleData, ModuleSection, ModuleActivity };

export const MODULES_DATA: ModuleData[] = modulesJson as ModuleData[];
