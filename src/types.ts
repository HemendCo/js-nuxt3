import { RequestClass } from '../src/runtime/helpers/request'

export interface MiddlewareOptions {
  [key: string]: {
    route: string
  };
}

export interface ComponentOptions {
  prefix: string;
}

export interface StorageOptions {
  prefix: string;
  driver: string;
  ttl: number;
}
export interface Storage {
  getAll: () => any;
  getFromLocalStorage: (key: string) => string | null;
  get: (key: string, defaultValue?: any) => any;
  set: (key: string, value: any) => any;
  remove: (key: string) => any;
  clear: () => any;
}

export interface StorageBridge {
  isAvailable: boolean;
  send: Function;
  subscribe: Function;
  unsubscribe: Function;
  getBuffer: Function;
}

export interface FlashMessage {
  show: (params: FlashMessageParams) => void,
  error: (params: FlashMessageParams) => void,
  warning: (params: FlashMessageParams) => void,
  info: (params: FlashMessageParams) => void,
  success: (params: FlashMessageParams) => void,
}

export interface ApiRoutesOptions {
  name: string;
  url: string;
}

export interface ApiOptions {
  url: string;
  routes?: Array<ApiRoutesOptions>;
}

export interface DirectiveOptions {
  [key: string]: {[key: string]: any};
}

export interface FlashMessageOptions {
  rtl: boolean;
}

export interface ModuleOptions {
  namespace?: string,
  component?: ComponentOptions,
  middleware?: MiddlewareOptions,
  storage?: StorageOptions,
  api?: ApiOptions,
  directive?: DirectiveOptions
  flashMessage?: FlashMessageOptions
}

export interface TokenParams {
  token_type: string;
  expires_in: string;
  access_token: string;
  refresh_token: string;
}

export interface UserParams {
  [key: string]: any;
}

export type RequestOptions = {
	method?: 'GET' | 'POST'
	body?: RequestInit['body'] | Record<string, any> | FormData | undefined
	pick?: string[]
	params?: Record<string, unknown>,
  headers?: HeadersInit
  route?: ApiRoutesOptions
}

export type FlashMessageParams = {
  type?: 'error' | 'warning' | 'info' | 'success',
  rtl?: boolean,
  title?: string;
  text?: string;
  time?: number,
  icon?: string,
  clickable?: boolean,
  blockClass?: string,
  wrapperClass?: string,
  iconClass?: string,
  contentClass?: string,
  position?: 'right bottom' | 'right top' | 'left bottom' | 'left top',
  x?: string,
  y?: string,
  html?: string,
}

export type InputInfo = {
  start: number,
  end: number,
  length: number,
  text: string
}

declare module '#app' {
  interface NuxtApp {
    $hemend: {
      storage (): Storage,
      storageBridge (): StorageBridge,
      request (): RequestClass,
      flashMessage () : FlashMessage
    }
  }
}
  
declare module 'vue' {
  interface ComponentCustomProperties {
    $hemend: {
      storage (): Storage,
      storageBridge (): StorageBridge,
      request (): RequestClass,
      flashMessage () : FlashMessage
    }
  }
}