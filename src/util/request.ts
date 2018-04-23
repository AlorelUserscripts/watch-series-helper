declare const GM_xmlhttpRequest: any;

export interface RequestOpts {
  anonymous?: boolean;
  binary?: boolean;
  context?: any;
  data?: any;
  fetch?: boolean;
  headers?: any;
  onabort?: Function;
  onloadstart?: Function;
  onprogress?: Function;
  onreadystatechange?: Function;
  overrideMimeType?: string;
  password?: string;
  responseType?: 'arraybuffer' | 'blob' | 'json';
  timeout?: number;
  username?: string;
}

type Method = 'GET' | 'HEAD' | 'POST';

interface XmlHttpResponse {
  readonly readyState: number;
  readonly responseText: string;
  readonly status: number;
  readonly statusText: string;
}

export function request(url: string, method: Method = 'GET', opts: RequestOpts = {}): Promise<XmlHttpResponse> {
  return new Promise<XmlHttpResponse>((resolve, reject) => {
    GM_xmlhttpRequest(
      Object.assign(
        {url, method},
        opts,
        {
          onerror: reject,
          onload: resolve,
          ontimeout: reject
        }
      )
    );
  });
}
