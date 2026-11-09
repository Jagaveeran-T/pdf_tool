/**
 * Inline script that runs before any Google tag: defines gtag() and sets Consent Mode v2 defaults to "denied"
 * for every visitor (a superset of the EEA, UK and Switzerland). The consent provider later sends "update".
 */
export function ConsentDefaults() {
  const code = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});gtag('set','ads_data_redaction',true);gtag('set','url_passthrough',false);`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
