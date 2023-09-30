import useAuth from '../composables/useAuth'
import useApi from '../composables/useApi'
import type { RequestOptions, ApiOptions } from '../../types';

export class RequestClass {
  opts: ApiOptions;
  error: any;
  initBody: Function | undefined;

  /**
   * @param {[key: string]: any} options
   */
  constructor(options: ApiOptions, initBody: Function|undefined = undefined) {
    this.opts = options;
    this.error = console.error;
    this.initBody = initBody;
  }

  /**
   * @param {FormData} formData
   * @param {Record<string, any>} data
   * @param {string} root
   */
  appendToFormData(
    formData: FormData,
    data: Record<string, any> | Array<any>,
    root: string = ""
  ) {
    root = root || "";
    if (data instanceof File || data instanceof Blob) {
      formData.append(root, data);
    } else if (Array.isArray(data)) {
      for (let i = 0; i < data.length; i++) {
        this.appendToFormData(formData, data[i], root + "[" + i + "]");
      }
    } else if (typeof data === "object") {
      for (let key in data) {
        if (data.hasOwnProperty(key)) {
          if (root === "") {
            this.appendToFormData(formData, data[key], key);
          } else {
            this.appendToFormData(formData, data[key], root + "[" + key + "]");
          }
        }
      }
    } else if (data !== null && typeof data !== "undefined") {
      formData.append(root, data);
    }
  }

  /**
   * @param {string | Function} endpoint
   * @param {RequestOptions} opts
   * @returns Promise
   */
  get(endpoint: string | Function, opts?: RequestOptions) {
    opts = opts ?? {};
    opts.method = "GET";
    return this.send(endpoint, opts);
  }

  /**
   * @param {string | Function} endpoint
   * @param {RequestOptions} opts
   * @returns Promise
   */
  post(endpoint: string | Function, opts?: RequestOptions) {
    opts = opts ?? {};
    opts.method = "POST";
    return this.send(endpoint, opts);
  }

  /**
   * @param {string | Function} endpoint
   * @param {RequestOptions} opts
   * @returns Promise
   */
  async send(endpoint: string | Function, opts?: RequestOptions) {
    const { getToken } = useAuth();
    const token: string|undefined = getToken()?.access_token;
    opts = opts ?? {};
    opts.headers = (opts.headers ?? {}) as Record<string, string>;

    if (opts?.body && !(opts.body instanceof FormData)) {
      opts.body = JSON.parse(JSON.stringify(opts.body))
    }

    if (!!token) {
      opts.headers['Authorization'] = `Bearer ${token}`;
    }

    let pickStatusDisable = {
      status_code: false,
      status_message: false,
    };
    if (opts.pick!?.length > 0) {
      if (!opts.pick!.includes("status_code")) {
        opts.pick!.push("status_code");
        pickStatusDisable.status_code = true;
      }
      if (!opts.pick!.includes("status_message")) {
        opts.pick!.push("status_message");
        pickStatusDisable.status_message = true;
      }
    }

    let url: string | Function | null = null;
    if (typeof endpoint === "string") {
      url = this.generateUrl(
        !!opts.route ? opts.route.url : this.opts.url,
        endpoint
      );
    } else {
      url = () =>
        this.generateUrl(
          !!opts!.route ? opts!.route.url : this.opts.url,
          endpoint()
        );
    }

    if (typeof this.initBody === "function") {
      this.initBody(opts?.body);
    }

    const { pending, error, data, refresh } = await useApi(url, opts);
    let err = null;

    // if (
    //   process.client &&
    //   error.value
    // ) {
    //   await refresh();
    // }

    const dv = data.value as { status_code: string, status_message?: null };

    if (
      !error.value &&
      typeof data.value === "object" &&
      dv.status_code === "OK"
    ) {
      if (pickStatusDisable.status_code && dv.status_code) {
        // @ts-ignore
        delete data.value.status_code;
      }
      if (pickStatusDisable.status_message && dv.status_message) {
        // @ts-ignore
        delete data.value.status_message;
      }
    } else if (error.value) {
      err =
        // @ts-ignore
        error.value?.data ??
        // @ts-ignore
        error.value?.response?._data ??
        // @ts-ignore
        error.value?.response ??
        // @ts-ignore
        error.value?.message ??
        error.value.toString();
    } else {
      if(!!opts.route) {
        return { pending, error: error.value, data: data.value, refresh }; 
      }

      err = data.value;
    }

    return {
      // @ts-ignore
      data: data?.value?.data,
      // @ts-ignore
      status_code: data?.value?.status_code ?? err?.status_code,
      // @ts-ignore
      status_message: data?.value?.status_message ?? err?.status_message,
      pending,
      refresh,
      error: err,
      reference_error: error.value,
    };
  }

  generateUrl(path: string, endpoint: string) {
    return (!!path ? path.replace(/\/*$/gm, '') + '/' : '') + endpoint;
  }

  async upload(endpoint: string, opts: Record<string, any> = {}) {
    const { getToken } = useAuth();
    const token: string|undefined = getToken()?.access_token;
    opts = opts ?? {};
    opts.headers = (opts.headers ?? {}) as Record<string, string>;

    opts.headers['Accept'] = 'application/json'

    if (opts?.body && !(opts.body instanceof FormData)) {
      opts.body = JSON.parse(JSON.stringify(opts.body))
    }

    if (!!token) {
      opts.headers['Authorization'] = `Bearer ${token}`;
    }

    if (typeof this.initBody === "function") {
      this.initBody(opts?.body);
    }

    let url = this.generateUrl(
      !!opts.route ? opts.route.url : this.opts.url,
      endpoint
    );

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.open( 'POST', url, true );
      xhr.responseType = 'json';
      for(let i in opts.headers) {
        const head = opts.headers[i]
        xhr.setRequestHeader(i, head);
      }

      xhr.addEventListener( 'error', (e) => reject( e ) );
      xhr.addEventListener( 'abort', () => reject() );
      xhr.addEventListener( 'load', () => {
          const response = xhr.response;

          if ( !response || response.error ) {
              return reject( response && response.error );
          }

          resolve(response?.data);
      } );

      if ( xhr.upload ) {
        xhr.upload.addEventListener('progress', evt => {
          if ( evt.lengthComputable ) {
              // status.innerText = 'Uploading (' + (evt.loaded / evt.total * 100).toFixed(2) + ')...';
              opts?.progress?.(evt.loaded, evt.total)
            }
        });
      }

      xhr.send( opts?.body );
    })
  }
}

const request = (options: ApiOptions, initBody: Function|undefined = undefined) => {
  const req = new RequestClass(options, initBody);
  const routes = options?.routes;

  if (routes && routes.length > 0) {
    for (const route of routes) {
      if (!route.name.length) {
        continue;
      }

      for (const method of ["get", "post"]) {
        Object.defineProperty(req, method + route.name.ucfirst(), {
          get: () => (endpoint: string, opts?: RequestOptions) => {
            opts = opts ?? {};
            opts.route = route;
            
            // @ts-ignore
            // return req[method](endpoint, opts);

            let res: any = null;
            switch(method) {
              case 'get':
                res = req.get(endpoint, opts);
                break;

              case 'post':
                res = req.post(endpoint, opts)
                break;
            }
            
            return res;
          },
        });
      }
    }
  }

  return req;
}

export default request;