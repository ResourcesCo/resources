module.exports = {
  env: {
    NEXT_PUBLIC_EMBED_BASE_URL_DEFAULT: (process.env.VERCEL_URL || '').replace(
      'vercel.app',
      'now.sh'
    ),
  },
}
