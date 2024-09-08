import { ssr, ModifyHtmlFunction } from '../utils/render';

export default async function page(c: Context) {
    console.log('FUNCTION PAGE TO RENDER');
    console.log('PROBANDO GITHUB ACTIONS');
    // C es el contexto de Hono
    console.log('------------------------------------------------------------------');
    const slug1 = c.req.param('slug1');
    const slug2 = c.req.param('slug2');
    const slug3 = c.req.param('slug3');
    const slug4 = c.req.param('slug4');
    console.log('------------------------------------------------------------------');

    const urlFromWebflow = c.env.WEBFLOW_DOMAIN as string;
    console.log('urlFromWebflow-----: ', urlFromWebflow);
    const slugs = [slug1, slug2, slug3, slug4].filter(Boolean);
    console.log('slugs-----: ', slugs);
    const formatUrl = slugs.length > 0 
    ? `${urlFromWebflow}${slugs.join('/')}`
    : urlFromWebflow;
    console.log('formatUrl-----: ', formatUrl);

    console.log('C.ENV: ', c.env.proxy_reverse_webflow);
    let html = await c.env.proxy_reverse_webflow.get(formatUrl);
    console.log('html-----: ', html);
    if (!html) {
        console.log('------------------------------------------------------------------');
        console.log('----------------------FETCHING FRESH SSR PAGE---------------------');
        console.log('------------------------------------------------------------------');
        html = await ssr(c, formatUrl, modifications);
        await c.env.proxy_reverse_webflow.put(formatUrl, html, { expirationTtl: 60 });
      } else {
        console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
        console.log('++++++++++++++++++++++FETCHING SSR PAGE FROM CACHE++++++++++++++++');
        console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
      }

    return new Response(await html, {
        headers: {
            'content-type': 'text/html;charset=UTF8',
        },
    });
}

/**
 * Modifies the HTML content of the index page based on the request information.
 * @param $ - The Cheerio instance representing the HTML content.
 * @param c - The request context object.
 */
const modifications: ModifyHtmlFunction = async ($, c) => {
    const key = 'test';
    let forecat = await c.env.proxy_reverse_webflow.get(key);
    console.log('FORECAT FIRST AWAIT: ', forecat);
    forecat = forecat ? JSON.parse(forecat) : null;
    console.log('FORECAT JSON PARSE: ', forecat);
    if (!forecat) {
      await c.env.proxy_reverse_webflow.put(key, JSON.stringify(forecat), {expirationTtl: 60});
    }
  
    const response = forecat;
    
    console.log('RESPONSEEEEEEEEEEE');
    console.log(response);
};