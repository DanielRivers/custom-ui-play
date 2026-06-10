"use server";

import React from "react";
import { renderToString } from "react-dom/server.browser";
import {
  getKindeRequiredCSS,
  getKindeRequiredJS,
  getKindeNonce,
  getKindeCSRF,
  getSVGFaviconUrl,
  setKindeDesignerCustomProperties
} from "@kinde/infrastructure";
import Component from "./background.tsx";
import { findConnection } from "./switchConnection.ts";

const Layout = async ({ request, context }) => {
  if (context.auth?.providedEmail) {
    console.log(context.auth.providedEmail.replace("@", "_"));
  }

  console.log(context)
  
  // Resolve the email/password connection up front, if one exists.
  const emailPasswordConnection = findConnection(
    context,
    (c) => c.credentialMethod === "email:password"
  );

  console.log('emailpassword', emailPasswordConnection);

  return (
    <html lang={request.locale.lang} dir={request.locale.isRtl ? "rtl" : "ltr"}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex" />
        <meta name="csrf-token" content={getKindeCSRF()} />
        <title>{context.widget.content.page_title}</title>

        <link rel="icon" href={getSVGFaviconUrl()} type="image/svg+xml" />
        {getKindeRequiredCSS()}
        {getKindeRequiredJS()}

        <style nonce={getKindeNonce()}>
          {`:root {
          --kinde-button-primary-background-color-hover: #fcdced;
          --kinde-button-secondary-background-color-hover: #fcdced;
          ${setKindeDesignerCustomProperties({
            baseBackgroundColor: "#fff",
            baseLinkColor: "#230078",
            buttonBorderRadius: "0.5rem",
            primaryButtonBackgroundColor: "#e9edfd",
            primaryButtonColor: "#1f2439",
            inputBorderRadius: "0.5rem",
          })}}
          `}
        </style>
        <style nonce={getKindeNonce()}>
          {`
            :root {
                --kinde-base-color: rgb(12, 0, 32);
                --kinde-base-font-family: -apple-system, system-ui, BlinkMacSystemFont, Helvetica, Arial, Segoe UI, Roboto, sans-serif;
            }

            [data-kinde-control-select-text]{
                background-color: rgb(250, 250, 251);
            }
            .c-container {
              padding: 1.5rem;
              display: grid;
              gap: 230px;
            }
            .c-widget {
                max-width: 400px;
                width: 100%;
                margin: 0px auto;
            }
            .c-footer {
              border-top: 1px solid rgba(12, 0, 32, 0.08);
              padding-block: 1.5rem;
              display: flex;
              justify-content: space-between;
            }
            .c-footer-links {
                display: flex;
                gap: 1.5rem;
            }
          `}
        </style>
      </head>
      <body>
        <Component />
        {emailPasswordConnection && context.actions?.switchConnection && context.session?.pipelineStepId ? (
          <form action="/authentication/switch_connection" className="kinde-form" data-kinde-form="true" method="post" name="switch">
            <input type="hidden" name={context.actions.switchConnection.fields.psid} value={context.session.pipelineStepId} />
            <input type="hidden" name={context.actions.switchConnection.fields.connectionId} value={emailPasswordConnection.id} />
            <input type="hidden" name={context.actions.switchConnection.fields.authIntent} value="sign_in" />
            {context.auth?.providedEmail ? (
              <input type="hidden" name={context.actions.switchConnection.fields.loginHint} value={context.auth.providedEmail} />
            ) : null}
            <button type="submit">switch</button>
          </form>
        ) : null}
      </body>
    </html>
  );
};

export default async function Page(event) {
  const page = await Layout({ ...event });
  return renderToString(page);
}
