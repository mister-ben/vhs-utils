import GlobalThis from '@ungap/global-this';
const DEFAULT_LOCATION = 'https://example.com';

const resolveUrl = (baseUrl, relativeUrl) => {
  // return early if we don't need to resolve
  if ((/^[a-z]+:/i).test(relativeUrl)) {
    return relativeUrl;
  }

  // if baseUrl is a data URI, ignore it and resolve everything relative to window.location
  if ((/^data:/).test(baseUrl)) {
    baseUrl = GlobalThis.location && GlobalThis.location.href || '';
  }

  const protocolLess = (/^\/\//.test(baseUrl));
  // remove location if window.location isn't available (i.e. we're in node)
  // and if baseUrl isn't an absolute url
  const removeLocation = !GlobalThis.location && !(/\/\//i).test(baseUrl);

  // if the base URL is relative then combine with the current location
  baseUrl = new GlobalThis.URL(baseUrl, GlobalThis.location || DEFAULT_LOCATION);

  const newUrl = new URL(relativeUrl, baseUrl);

  // if we're a protocol-less url, remove the protocol
  // and if we're location-less, remove the location
  // otherwise, return the url unmodified
  if (removeLocation) {
    return newUrl.href.slice(DEFAULT_LOCATION.length);
  } else if (protocolLess) {
    return newUrl.href.slice(newUrl.protocol.length);
  }

  return newUrl.href;

};

export default resolveUrl;
