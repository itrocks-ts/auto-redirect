import build from '../build/build.js'

build<HTMLAnchorElement>('a.auto-redirect', async anchor => (await import('./auto-redirect.js')).default(anchor))
