import { Hono } from 'hono'
import { cache } from 'hono/cache'
//pages 
import homepage from './pages/index'

import assetlinks from '../public/.well-known/assetlinks.json';
import appleSiteAssociation from '../public/.well-known/apple-app-site-association.json';


// Create a new Hono instance
const app = new Hono < {
	Bindings: Bindings
} > ();

// Define the routes
app.get(
  '*',
  cache({
    cacheName: 'appcacheq',
    cacheControl: 'max-age=0',
  })
)

// Route for the homepage that renders the index page
app.get('/', async (c) => {
  return await homepage(c)
})

app.get('/.well-know/assetlinks.json', (c) => {
  return c.json(assetlinks)
})

app.get('/.well-know/apple-app-site-association.json', (c) => {
  return c.json(appleSiteAssociation)
})

// Route for paths
app.get('/:slug1?/:slug2?/:slug3?/:slug4?', async (c) => {
  return await homepage(c)
})




export default app
