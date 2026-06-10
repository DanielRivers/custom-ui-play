import React from "react";
import { SwitchConnectionAction, getSwitchConnectionClientScript } from "./switchConnection";
import { getKindeNonce } from "@kinde/infrastructure";

type SwitchConnectionButtonProps = {
  action: SwitchConnectionAction;
  psid: string;
  connectionId: string;
  authIntent: "sign_in" | "sign_up";
  loginHint?: string | null;
};

export default function SwitchConnectionButton({
  action,
  psid,
  connectionId,
  authIntent,
  loginHint,
}: SwitchConnectionButtonProps) {
  return (
    <>
      <button
        id="kinde-switch-connection"
        type="button"
        className="kinde-button"
        aria-label="Switch to email password"
      >
        switch
      </button>
      <script
        nonce={getKindeNonce()}
        dangerouslySetInnerHTML={{
          __html: getSwitchConnectionClientScript(action, psid, {
            connectionId,
            authIntent,
            loginHint: loginHint ?? null,
          }),
        }}
      />
    </>
  );
}
