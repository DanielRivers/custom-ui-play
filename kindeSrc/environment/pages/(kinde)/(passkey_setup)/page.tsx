"use server";

import React from "react";
import { renderToString } from "react-dom/server.browser";
import {
  getKindeNonce,
  getKindeWidget,
  getKindeRequiredCSS,
  getKindeRequiredJS,
  getKindeCSRF,
  getSVGFaviconUrl,
  type KindePageEvent,
} from "@kinde/infrastructure";

// Use full URLs if these images live in your repo/CDN
const IMAGES = {
  elephant: "https://your-cdn.com/images/cartoon-elephant.png",
  monkey: "https://your-cdn.com/images/cartoon-monkey.png",
  giraffe: "https://your-cdn.com/images/cartoon-giraffe.png",
  rabbit: "https://your-cdn.com/images/cartoon-rabbit.png",
  lion: "https://your-cdn.com/images/cartoon-lion.png",
  panda: "https://your-cdn.com/images/cartoon-panda.png",
};

const PasskeySetupPage = ({ request, context }: KindePageEvent) => {
  const { heading, description } = context.widget.content;

  return (
    <html lang={request.locale.lang} dir={request.locale.isRtl ? "rtl" : "ltr"}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex" />
        <meta name="csrf-token" content={getKindeCSRF()} />
        <title>{context.widget.content.pageTitle ?? heading}</title>
        <link rel="icon" href={getSVGFaviconUrl()} type="image/svg+xml" />
        {getKindeRequiredCSS()}
        {getKindeRequiredJS()}
        <style nonce={getKindeNonce()}>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
          }
          @keyframes bounce {
            0%, 100% { transform: translateY(0px) scale(1); }
            50% { transform: translateY(-15px) scale(1.05); }
          }
          @keyframes swing {
            0%, 100% { transform: rotate(-10deg); }
            50% { transform: rotate(10deg); }
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
          }
          @keyframes slideIn {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          body {
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          }
          .container {
            min-height: 100vh;
            background: linear-gradient(135deg, #dc2626 0%, #16a34a 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            position: relative;
            overflow: hidden;
          }
          .background-animals {
            position: absolute;
            inset: 0;
            pointer-events: none;
            z-index: 1;
          }
          .animal {
            position: absolute;
            opacity: 0.7;
            filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
            object-fit: contain;
          }
          .elephant { top: 10%; left: 5%; width: 140px; animation: float 3s ease-in-out infinite; }
          .monkey { top: 20%; right: 10%; width: 100px; animation: swing 2s ease-in-out infinite 0.5s; }
          .giraffe { bottom: 30%; left: 8%; width: 110px; animation: bounce 2.5s ease-in-out infinite 1s; }
          .rabbit { top: 60%; right: 15%; width: 90px; animation: bounce 2.5s ease-in-out infinite 1.5s; }
          .lion { bottom: 10%; right: 5%; width: 130px; animation: pulse 2.8s ease-in-out infinite 2s; }
          .panda { top: 45%; left: 3%; width: 95px; animation: float 3s ease-in-out infinite 2.5s; }
          .content-container {
            position: relative;
            z-index: 10;
            width: 100%;
            max-width: 400px;
          }
          .auth-card {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            border: 2px solid rgba(255, 255, 255, 0.2);
            animation: slideIn 0.8s ease-out;
          }
          .title {
            font-size: 28px;
            font-weight: bold;
            color: #dc2626;
            margin: 0 0 8px 0;
            text-align: center;
          }
          .description {
            font-size: 16px;
            color: #16a34a;
            margin: 0 0 24px 0;
            text-align: center;
          }
        `}</style>
      </head>
      <body>
        <div className="container">
          <div className="background-animals" aria-hidden="true">
            <img src={IMAGES.elephant} alt="" className="animal elephant" />
            <img src={IMAGES.monkey} alt="" className="animal monkey" />
            <img src={IMAGES.giraffe} alt="" className="animal giraffe" />
            <img src={IMAGES.rabbit} alt="" className="animal rabbit" />
            <img src={IMAGES.lion} alt="" className="animal lion" />
            <img src={IMAGES.panda} alt="" className="animal panda" />
          </div>

          <div className="content-container">
            <div className="auth-card">
              <h1 className="title">{heading}</h1>
              {description ? <p className="description">{description}</p> : null}
              <div>{getKindeWidget()}</div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
};

export default async function Page(event: KindePageEvent): Promise<string> {
  return renderToString(<PasskeySetupPage {...event} />);
}

export const pageSettings = {};