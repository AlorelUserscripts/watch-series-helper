import {LazyGetter} from 'typescript-lazy-get-decorator';
import {Proto} from 'typescript-proto-decorator';

export const enum DirectLinkState {
  LOADING,
  READY,
  ERROR
}

const css = require('./link.scss');

export class DirectLink {
  @Proto(DirectLinkState.LOADING)
  private _state: DirectLinkState;

  private prevState: DirectLinkState;

  public constructor(private readonly attachTo?: HTMLElement) {
    this.stateChanged();
  }

  public get state(): DirectLinkState {
    return this._state;
  }

  public set state(value: DirectLinkState) {
    this.prevState = this._state;
    this._state = value;
  }

  @LazyGetter()
  private get loadingEl(): HTMLSpanElement {
    const span = document.createElement('span');
    span.innerText = 'Loading direct link...';
    span.setAttribute('class', 'link loading');

    return span;
  }

  @LazyGetter()
  private get errorEl(): HTMLSpanElement {
    const span = document.createElement('span');
    span.innerText = 'Error loading direct link';
    span.setAttribute('class', 'link errored');

    return span;
  }

  private stateChanged(): void {
    if (this.state !== this.prevState) {
      switch (this.state) {
        case DirectLinkState.LOADING:
          this.shadow.removeChild(this.errorEl);
          this.shadow.removeChild(this.a);
          this.shadow.appendChild(this.loadingEl);
          break;
        case DirectLinkState.ERROR:
          this.shadow.appendChild(this.errorEl);
          this.shadow.removeChild(this.a);
          this.shadow.removeChild(this.loadingEl);
          break;
        case DirectLinkState.READY:
          this.shadow.removeChild(this.errorEl);
          this.shadow.appendChild(this.a);
          this.shadow.removeChild(this.loadingEl);
          break;
        default:
          throw new Error(`Invalid direct link state: ${this.state}`);
      }
    }
  }

  public get href(): string {
    return this.a.getAttribute('href') || '';
  }

  public  set href(value: string) {
    this.a.setAttribute('href', value);
  }

  @LazyGetter()
  private get a(): HTMLAnchorElement {
    const el: HTMLAnchorElement = document.createElement('a');
    el.rel = 'noopener nofollow';
    el.target = '_blank';
    el.setAttribute('class', 'link loaded');

    return el;
  }

  @LazyGetter()
  private get style(): HTMLStyleElement {
    const el = document.createElement('style');
    el.innerHTML = css;

    return el;
  }

  @LazyGetter()
  private get shadow(): ShadowRoot {
    const s = this.element.attachShadow({mode: 'closed'});
    s.appendChild(this.style);

    return s;
  }

  @LazyGetter()
  public get element(): HTMLElement {
    if (this.attachTo) {
      return this.attachTo;
    }

    const el: HTMLDivElement = document.createElement('div');
    el.setAttribute('style', 'display:inline !important');

    return el;
  }
}
