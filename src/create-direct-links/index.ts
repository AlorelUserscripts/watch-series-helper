import {DirectLink, DirectLinkState} from './DirectLink';

const enum Conf {
  ROW_SELECTOR = '#myTable>tbody>tr',
  WATCH_EPISODE_SELECTOR = '.watchlink',
  GATEWAY_LINK_IGNORE = '//watch.',
  TARGET_TD_SELECTOR = 'td:nth-child(2)'
}

if (/\/episode\/.*\.html$/i.test(location.href)) {
  const rows: HTMLTableRowElement[] = Array.from(document.querySelectorAll(Conf.ROW_SELECTOR));

  if (rows.length) {
    for (const row of rows) {
      setTimeout(
        () => {
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

          const directLink = new DirectLink();
          td.appendChild(directLink.element);
          try {
            const params = gatewayLink.split('?')[1];
            //tslint:disable-next-line:no-magic-numbers
            directLink.href = atob(params.substr(2));
            directLink.state = DirectLinkState.READY;
          } catch (e) {
            console.error(e);
            directLink.state = DirectLinkState.ERROR;
          }
        },
        0
      );
    }
  } else {
    console.warn('No rows found');
  }
}
