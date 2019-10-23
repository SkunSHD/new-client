// _document is only rendered on the server side and not on the client side
// Event handlers like onClick can't be added to this file

import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
	static async getInitialProps(ctx) {
		const initialProps = await Document.getInitialProps(ctx)
		return { ...initialProps }
	}

	render() {
		return (
			<Html>
				<Head>
					<meta charSet="UTF-8" />
					<title>FEX-CLIENT</title>
					<meta
						name="description"
						content="DESCRIPTION"
					/>
					<meta name="viewport" content="width=device-width, initial-scale=1" />
					<link rel="shortcut icon" href="/static/favicon.ico" />
					{/* Dont use them so far
					
					<link rel="icon" sizes="192x192" href="/static/touch-icon.png" />
					<link rel="apple-touch-icon" href="/static/touch-icon.png" />
					<link rel="mask-icon" href="/static/favicon-mask.svg" color="#49B882" />
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
					*/}
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		)
	}
}

export default MyDocument