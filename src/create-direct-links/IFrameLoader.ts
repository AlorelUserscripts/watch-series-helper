import {LazyGetter} from 'typescript-lazy-get-decorator';
import {DirectLink, DirectLinkState} from './DirectLink';

const enum Conf {
  PUSH_BUTTON_SELECTOR = '.push_button.blue'
}

export class DirectLinkIframeLoader {
  public constructor(private readonly dl: DirectLink, private readonly url: string) {
  }

  @LazyGetter()
  private get iframe(): HTMLIFrameElement {
    const ifr: HTMLIFrameElement = document.createElement('iframe');
    ifr.src = this.url;
    ifr.style.display = 'none';

    return ifr;
  }

  public load(): Promise<void> {
    const p = new Promise<void>((resolve, reject) => {
      this.iframe.onload = () => {
        const doc = this.iframe.contentDocument;

        if (!doc) {
          this.dl.state = DirectLinkState.ERROR;

          return reject(new Error(`Unable to resolve document for ${this.url}`));
        }

        const a: HTMLAnchorElement = doc.querySelector(Conf.PUSH_BUTTON_SELECTOR);

        if (!a) {
          this.dl.state = DirectLinkState.ERROR;

          return reject(new Error(`Unable to resolve anchor for ${this.url}`));
        }

        const href: string = a.getAttribute('href');

        if (!href) {
          this.dl.state = DirectLinkState.ERROR;

          return reject(new Error(`Unable to resolve anchor href for ${this.url}`));
        }

        this.dl.href = href;
        this.dl.state = DirectLinkState.READY;
        document.body.removeChild(this.iframe);
        resolve();
      };

      this.iframe.onerror = reject;
    });
    this.load = () => p;

    return p;
  }
}
