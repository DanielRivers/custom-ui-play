import {
  onUserTokenGeneratedEvent,
  WorkflowSettings,
  WorkflowTrigger,
  accessTokenCustomClaims,
  getEnvironmentVariable,
} from "@kinde/infrastructure";

// TODO: change sso session config to non-persistent

export const workflowSettings: WorkflowSettings = {
  id: "nonPersistentSessionWorkflow",
  name: "Non Persistent Session Workflow",
  trigger: WorkflowTrigger.UserTokenGeneration,
  bindings: {
    "kinde.accessToken": {},
    "kinde.ssoSession": {},
    "kinde.env": {},
  },
  failurePolicy: {
    action: "stop",
  },
};

export default async function NonPersistentSessionWorkflow(
  event: onUserTokenGeneratedEvent
) {
  let policy = "persistent";

  const nonPersistentConnectionIDs = getEnvironmentVariable(
    "NON_PERSISTENT_SESSION_CONNECTION_IDS"
  ).value.split(",");

  console.log("nonPersistentConnectionIDs:", nonPersistentConnectionIDs);
  if (nonPersistentConnectionIDs.includes(event.context.auth.connectionId)) {
    policy = "non_persistent";
    console.log("setting sso session policy to non_persistent");
    kinde.ssoSession.setPolicy(policy);
    console.log("sso session policy set to non_persistent");
  }

  console.log("event: ", event);

  const accessToken = accessTokenCustomClaims<{
    isDeployed: boolean;
    // ksp: string;
  }>();
  accessToken.isDeployed = true;
  // accessToken.ksp = policy;
}