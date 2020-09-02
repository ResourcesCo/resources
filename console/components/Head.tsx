import React from 'react'
import NextHead from 'next/head'
import PropTypes from 'prop-types'

const defaultDescription = ''
const defaultOGURL = ''
const defaultOGImage = ''

const Head = ({ theme, ...props }) => (
  <NextHead>
    <meta charSet="UTF-8" />
    <title>{props.title || ''}</title>
    <meta
      name="description"
      content={props.description || defaultDescription}
    />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
    />
    <link rel="icon" sizes="192x192" href="/images/touch-icon.png" />
    <link rel="apple-touch-icon" href="/images/touch-icon.png" />
    <link rel="icon" href="/images/favicon.ico" />
    <meta property="og:url" content={props.url || defaultOGURL} />
    <meta property="og:title" content={props.title || ''} />
    <meta
      property="og:description"
      content={props.description || defaultDescription}
    />
    <meta name="twitter:site" content={props.url || defaultOGURL} />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:image" content={props.ogImage || defaultOGImage} />
    <meta property="og:image" content={props.ogImage || defaultOGImage} />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <style type="text/css">{`
      div::-webkit-scrollbar {
        width: 11px;
        height: 11px;
      }
      div {
        scrollbar-width: thin;
        scrollbar-color: #000 #444;
      }
      div::-webkit-scrollbar-track, div::-webkit-scrollbar-corner {
        background: #000;
      }
      div::-webkit-scrollbar-thumb {
        background-color: #444;
        border-radius: 6px;
        border: 3px solid #000;
      }
    `}</style>
    {process.env.NEXT_PUBLIC_ELECTRON && (
      <meta
        http-equiv="Content-Security-Policy"
        content="default-src *.local 'unsafe-eval'; connect-src *; object-src *; media-src *; font-src *; style-src *"
      />
    )}
  </NextHead>
)

Head.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  url: PropTypes.string,
  ogImage: PropTypes.string,
}

export default Head
