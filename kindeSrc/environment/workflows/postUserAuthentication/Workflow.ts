import {
  onUserTokenGeneratedEvent,
  WorkflowSettings,
  WorkflowTrigger,
  accessTokenCustomClaims,
  getEnvironmentVariable,
  denyAccess,
} from "@kinde/infrastructure";

export const workflowSettings: WorkflowSettings = {
  id: "nonPersistentSessionWorkflow",
  name: "Non Persistent Session Workflow",
  trigger: WorkflowTrigger.UserTokenGeneration,
  bindings: {
    "kinde.accessToken": {},
    "kinde.ssoSession": {},
    "kinde.env": {},
    "kinde.auth": {}
  },
  failurePolicy: {
    action: "stop",
  },
};

export default async function NonPersistentSessionWorkflow(
  event: onUserTokenGeneratedEvent
) {
  denyAccess("Everyone is denied!")

  // const nonPersistentConnectionIDs = getEnvironmentVariable(
  //   "NON_PERSISTENT_SESSION_CONNECTION_IDS"
  // ).value?.split(",") || [];

  // console.log("nonPersistentConnectionIDs:", nonPersistentConnectionIDs);
  // if (nonPersistentConnectionIDs.includes(event.context.auth.connectionId)) {
  //   console.log("Matched connection, setting sso session policy to non_persistent");
  //   kinde.ssoSession.setPolicy("non_persistent");
  // }
}
