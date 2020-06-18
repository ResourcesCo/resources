module.exports = {
  env: {
    EMBED_BASE_URL_DEFAULT: (process.env.VERCEL_URL || '').replace(
      'vercel.app',
      'now.sh'
    ),
  },
}
