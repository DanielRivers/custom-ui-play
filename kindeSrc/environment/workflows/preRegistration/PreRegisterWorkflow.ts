import {
  onPostAuthenticationEvent,
  WorkflowSettings,
  WorkflowTrigger,
  denyAccess
} from "@kinde/infrastructure";

// The setting for this workflow
export const workflowSettings: WorkflowSettings = {
  id: "UserPreRegistration",
  trigger: WorkflowTrigger.UserPreRegistration,
};

// The workflow code to be executed when the event is triggered
export default async function Workflow(event: onPostAuthenticationEvent) {
  denyAccess("Everyone is denied!")
}
