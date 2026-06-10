export type AuthIntent = "sign_in" | "sign_up";
export type SwitchConnectionAction = {
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
export type AvailableConnection = {
  id: string;
  friendlyId?: string;
  name: string;
  connectionType: "social" | "enterprise" | "credential" | "other";
  credentialMethod?: string;
  identityType?: "email" | "username" | "phone";
  provider?: string;
  logoName?: string;
};
export type PageContext = {
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
export type SwitchConnectionOptions = {
  /** `authentication_connections.id` or `friendlyId` from `connections.available` */
  connectionId: string;
  authIntent: AuthIntent;
  /** Prefill email/username when switching to credential auth */
  loginHint?: string;
  isClickWrapAccepted?: boolean;
  isMarketingOptIn?: boolean;
};
export type PostRoast = (
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

/**
 * Client-side helper to perform the same switch connection POST from the browser
 * without requiring a form element. Uses `fetch` and includes credentials.
 */
export async function switchConnectionClient(
  action: SwitchConnectionAction,
  psid: string,
  options: SwitchConnectionOptions
): Promise<void> {
  if (!action) {
    throw new Error("switchConnection action is required");
  }
  if (!psid) {
    throw new Error("psid is required");
  }
  if (!options.connectionId) {
    throw new Error("connectionId is required");
  }
  if (options.authIntent !== "sign_in" && options.authIntent !== "sign_up") {
    throw new Error('authIntent must be "sign_in" or "sign_up"');
  }

  const getCsrfToken = () => {
    const meta = document.querySelector('meta[name="csrf-token"]');
    return meta?.getAttribute('content') ?? '';
  };

  const csrfToken = getCsrfToken();
  if (!csrfToken) {
    console.error('switch connection failed: missing csrf-token meta tag');
    return;
  }

  const form = document.createElement("form");
  form.method = "POST";
  form.action = action.path;
  form.style.display = "none";

  const appendField = (name: string, value: string) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    form.appendChild(input);
  };

  appendField("x_csrf_token", csrfToken);
  appendField(action.fields.psid, psid);
  appendField(action.fields.connectionId, options.connectionId);
  appendField(action.fields.authIntent, options.authIntent);

  if (options.loginHint) {
    appendField(action.fields.loginHint, options.loginHint);
  }

  document.body.appendChild(form);
  form.submit();
}

export type SwitchConnectionClientDefaults = {
  connectionId: string;
  authIntent: AuthIntent;
  loginHint?: string | null;
};

export function getSwitchConnectionClientScript(
  action: SwitchConnectionAction,
  psid: string,
  defaults: SwitchConnectionClientDefaults
): string {
  return `(() => {
    const action = ${JSON.stringify(action)};
    const psid = ${JSON.stringify(psid)};
    const defaultConnectionId = ${JSON.stringify(defaults.connectionId)};
    const defaultAuthIntent = ${JSON.stringify(defaults.authIntent)};
    const defaultLoginHint = ${JSON.stringify(defaults.loginHint ?? null)};

    const getCsrfToken = () => {
      const meta = document.querySelector('meta[name="csrf-token"]');
      return meta?.getAttribute('content') ?? '';
    };

    window.kindeSwitchConnection = function(options = {}) {
      const opts = Object.assign(
        { connectionId: defaultConnectionId, authIntent: defaultAuthIntent, loginHint: defaultLoginHint },
        options || {}
      );

      const csrfToken = getCsrfToken();
      if (!csrfToken) {
        console.error('switch connection failed: missing csrf-token meta tag');
        return;
      }

      const form = document.createElement('form');
      form.method = 'POST';
      form.action = action.path;
      form.style.display = 'none';

      const appendField = (name, value) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = value;
        form.appendChild(input);
      };

      appendField('x_csrf_token', csrfToken);
      appendField(action.fields.psid, psid);
      appendField(action.fields.connectionId, opts.connectionId);
      appendField(action.fields.authIntent, opts.authIntent);
      if (opts.loginHint) appendField(action.fields.loginHint, opts.loginHint);

      document.body.appendChild(form);
      form.submit();
    };

    const btn = document.getElementById('kinde-switch-connection');
    if (btn) btn.addEventListener('click', () => window.kindeSwitchConnection());
  })();`;
}

/** Find a connection from `context.connections.available` */
export function findConnection(
  context: PageContext,
  predicate: (connection: AvailableConnection) => boolean
): AvailableConnection | undefined {
  return context.connections?.available?.find(predicate);
}
