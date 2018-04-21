import {DirectLink} from './DirectLink';
import {DirectLinkIframeLoader} from './IFrameLoader';

const enum Conf {
  ROW_SELECTOR = '#myTable>tbody>tr',
  WATCH_EPISODE_SELECTOR = '.watchlink',
  GATEWAY_LINK_IGNORE = '//watch.',
  TARGET_TD_SELECTOR = 'td:nth-child(3)'
}

if (/\/episode\/.*\.html$/i.test(location.href)) {
  const rows: HTMLTableRowElement[] = Array.from(document.querySelectorAll(Conf.ROW_SELECTOR));

  if (rows.length) {
    for (const row of rows) {
      setImmediate(() => {
        const watchLinkElement: HTMLAnchorElement = row.querySelector(Conf.WATCH_EPISODE_SELECTOR);

        if (!watchLinkElement) {
          console.error('Cannot find watch link. Row included below:');
          console.error(row);

          return;
        }

        const gatewayLink: string = watchLinkElement.getAttribute('href');

        if (!gatewayLink) {
          console.error('Watch link element does not contain a href');
          console.error(watchLinkElement);

          return;
        }

        if (gatewayLink.includes(Conf.GATEWAY_LINK_IGNORE)) {
          return;
        }

        const td: HTMLTableRowElement = row.querySelector(Conf.TARGET_TD_SELECTOR);

        td.innerHTML = '';

        const directLink = new DirectLink(td);
        new DirectLinkIframeLoader(directLink, gatewayLink)
          .load()
          //tslint:disable-next-line:no-unbound-method
          .catch(console.error);
      });
    }
  } else {
    console.warn('No rows found');
  }
}
