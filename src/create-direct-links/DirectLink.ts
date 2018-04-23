import {LazyGetter} from 'typescript-lazy-get-decorator';
import {Proto} from 'typescript-proto-decorator';

const STATE = Symbol('State');

export const enum DirectLinkState {
  LOADING,
  READY,
  ERROR
}

const css = require('./link.scss');

export class DirectLink {

  private prevState: DirectLinkState;
  @Proto(DirectLinkState.LOADING)
  private [STATE]: DirectLinkState;

  public constructor(private readonly attachTo?: HTMLElement) {
    this.stateChanged();
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

  public get href(): string {
    return this.a.getAttribute('href') || '';
  }

  public set href(value: string) {
    this.a.setAttribute('href', value);
  }

  public get state(): DirectLinkState {
    return this[STATE];
  }

  public set state(value: DirectLinkState) {
    this.prevState = this[STATE];
    this[STATE] = value;
    this.stateChanged();
  }

  @LazyGetter()
  private get a(): HTMLAnchorElement {
    const el: HTMLAnchorElement = document.createElement('a');
    el.rel = 'noopener nofollow';
    el.target = '_blank';
    el.innerText = 'Direct Link';
    el.setAttribute('class', 'link loaded');

    return el;
  }

  @LazyGetter()
  private get errorEl(): HTMLSpanElement {
    const span = document.createElement('span');
    span.innerText = 'Error loading direct link';
    span.setAttribute('class', 'link errored');

    return span;
  }

  @LazyGetter()
  private get loadingEl(): HTMLSpanElement {
    const span = document.createElement('span');
    span.innerText = 'Loading direct link...';
    span.setAttribute('class', 'link loading');

    return span;
  }

  @LazyGetter()
  private get shadow(): ShadowRoot {
    return this.element.attachShadow({mode: 'closed'});
  }

  @LazyGetter()
  private get style(): HTMLStyleElement {
    const el = document.createElement('style');
    el.innerHTML = css;

    return el;
  }

  private stateChanged(): void {
    if (this.state !== this.prevState) {
      this.shadow.innerHTML = '';
      this.shadow.appendChild(this.style);

      switch (this.state) {
        case DirectLinkState.LOADING:
          this.shadow.appendChild(this.loadingEl);
          break;
        case DirectLinkState.ERROR:
          this.shadow.appendChild(this.errorEl);
          break;
        case DirectLinkState.READY:
          this.shadow.appendChild(this.a);
          break;
        default:
          throw new Error(`Invalid direct link state: ${this.state}`);
      }
    }
  }
}
