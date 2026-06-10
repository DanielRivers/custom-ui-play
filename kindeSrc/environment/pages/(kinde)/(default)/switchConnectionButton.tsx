"use client";

import { switchConnectionClient, SwitchConnectionAction } from "./switchConnection";

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
  const handleClick = async () => {
    try {
      await switchConnectionClient(action, psid, {
        connectionId,
        authIntent,
        loginHint: loginHint ?? undefined,
      });
    } catch (error) {
      console.error("switch connection failed", error);
    }
  };

  return (
    <button
      id="kinde-switch-connection"
      type="button"
      className="kinde-button"
      aria-label="Switch to email password"
      onClick={handleClick}
    >
      switch
    </button>
  );
}
