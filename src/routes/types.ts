import { LazyExoticComponent, ComponentType } from 'react';

export interface IRoute {
  path: string;
  pathLabel: string | ((state?: unknown) => string);
  key?: string;
  component: LazyExoticComponent<ComponentType<unknown>>;
}