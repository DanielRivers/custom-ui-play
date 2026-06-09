type AuthIntent = "sign_in" | "sign_up";
type SwitchConnectionAction = {
  path: string;
  method: "POST";
  fields: {
    psid: string;
    connectionId: string;
    authIntent: string;
    loginHint: string;
    isClickWrapAccepted?: string;
    isMarketingOptIn?: string;
  };
};
type AvailableConnection = {
  id: string;
  friendlyId?: string;
  name: string;
  connectionType: "social" | "enterprise" | "credential" | "other";
  credentialMethod?: string;
  identityType?: "email" | "username" | "phone";
  provider?: string;
  logoName?: string;
};
type PageContext = {
  auth?: {
    providedEmail?: string;
    loginHint?: string;
    suppliedUsername?: string;
    identityType?: string;
    reason?: string;
    connectionId?: string;
    activeConnectionId?: string;
    sessionConnectionId?: string;
  };
  session?: {
    pipelineStepId?: string;
    state?: string;
  };
  connections?: {
    available?: AvailableConnection[];
  };
  actions?: {
    switchConnection?: SwitchConnectionAction;
  };
};
type SwitchConnectionOptions = {
  /** `authentication_connections.id` or `friendlyId` from `connections.available` */
  connectionId: string;
  authIntent: AuthIntent;
  /** Prefill email/username when switching to credential auth */
  loginHint?: string;
  isClickWrapAccepted?: boolean;
  isMarketingOptIn?: boolean;
};
type PostRoast = (
  path: string,
  body: FormData | URLSearchParams
) => Promise<Response>;
/**
 * Switch the in-flight auth pipeline to a different connection.
 *
 * - social / enterprise → server ticks pipeline toward the IdP
 * - credential (email:password, etc.) → server redirects to login/register form
 */
export async function switchConnection(
  context: PageContext,
  options: SwitchConnectionOptions,
  postRoast: PostRoast
): Promise<Response> {
  const action = context.actions?.switchConnection;
  const psid = context.session?.pipelineStepId;
  if (!action) {
    throw new Error("switchConnection action is not available in page context");
  }
  if (!psid) {
    throw new Error("session.pipelineStepId is missing from page context");
  }
  if (!options.connectionId) {
    throw new Error("connectionId is required");
  }
  if (options.authIntent !== "sign_in" && options.authIntent !== "sign_up") {
    throw new Error('authIntent must be "sign_in" or "sign_up"');
  }
  const body = new FormData();
  body.set(action.fields.psid, psid);
  body.set(action.fields.connectionId, options.connectionId);
  body.set(action.fields.authIntent, options.authIntent);
  const loginHint =
    options.loginHint ??
    (context.auth?.identityType === "username"
      ? context.auth?.suppliedUsername
      : undefined) ??
    context.auth?.providedEmail ??
    context.auth?.loginHint;
  if (loginHint) {
    body.set(action.fields.loginHint, loginHint);
  }
  if (
    action.fields.isClickWrapAccepted &&
    options.isClickWrapAccepted !== undefined
  ) {
    body.set(
      action.fields.isClickWrapAccepted,
      String(options.isClickWrapAccepted)
    );
  }
  if (
    action.fields.isMarketingOptIn &&
    options.isMarketingOptIn !== undefined
  ) {
    body.set(
      action.fields.isMarketingOptIn,
      String(options.isMarketingOptIn)
    );
  }
  return postRoast(action.path, body);
}
/** Find a connection from `context.connections.available` */
export function findConnection(
  context: PageContext,
  predicate: (connection: AvailableConnection) => boolean
): AvailableConnection | undefined {
  return context.connections?.available?.find(predicate);
}
