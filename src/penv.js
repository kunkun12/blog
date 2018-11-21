import env from 'penv.macro'

const baseUrl = env({
  development: 'http://localhost:3000/api',
  staging: 'https://staging.cool-app.com/api',
  production: 'https://cool-app.com/api',
})