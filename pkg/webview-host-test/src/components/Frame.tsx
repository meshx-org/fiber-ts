import React, { FC } from 'react'

// You can enable cross-origin isolation on a document embedded within an iframe by applying
// allow = "cross-origin-isolated" feature policy to the <iframe> tag and meeting the
// same conditions described in this document.Note that entire chain of the documents
// including parent frames and child frames must be cross - origin isolated as well.

const Frame: FC = () => (
  <div>
    <iframe
      name="webview"
      title="webview"
      scrolling="no"
      // allowFullScreen
      allow="cross-origin-isolated; camera 'none'; microphone 'none'; layout-animations 'none'; unoptimized-images 'none'; oversized-images 'none'; sync-script 'none'; sync-xhr 'none'; unsized-media 'none';"
      sandbox="allow-scripts"
      src="http://127.0.0.1:8081"
    />
    <iframe
      name="webview"
      title="webview"
      scrolling="no"
      // allowFullScreen
      allow="cross-origin-isolated; camera 'none'; microphone 'none'; layout-animations 'none'; unoptimized-images 'none'; oversized-images 'none'; sync-script 'none'; sync-xhr 'none'; unsized-media 'none';"
      sandbox="allow-scripts"
      src="http://127.0.0.1:8080"
    />
    <iframe
      name="webview"
      title="webview"
      scrolling="no"
      // allowFullScreen
      allow="cross-origin-isolated; camera 'none'; microphone 'none'; layout-animations 'none'; unoptimized-images 'none'; oversized-images 'none'; sync-script 'none'; sync-xhr 'none'; unsized-media 'none';"
      sandbox="allow-scripts"
      src=" data:text/html,%3Ch1%3EHello%2C%20World%21%3C%2Fh1%3E"
    />
  </div>
)

export default Frame
