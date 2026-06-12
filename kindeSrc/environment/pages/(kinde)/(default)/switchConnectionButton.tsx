import { SwitchConnectionAction } from "./switchConnection";

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
    <button
      id="kinde-switch-connection"
      type="button"
      className="kinde-button"
      aria-label="Switch to email password"
      data-connection-id={connectionId}
      data-auth-intent={authIntent}
      data-login-hint={loginHint ?? ""}
      data-psid={psid}
      data-action-path={action.path}
      data-psid-field={action.fields.psid}
      data-connection-id-field={action.fields.connectionId}
      data-auth-intent-field={action.fields.authIntent}
      data-login-hint-field={action.fields.loginHint}
    >
      switch
    </button>
  );
}
