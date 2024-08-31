import { createClient } from "@sanity/client";

export const ECHO_SANITY_PROJECT_ID = "pgq2pd26";
export const ECHO_SANITY_DATASET = "production";

export const echoSanity = createClient({
  projectId: ECHO_SANITY_PROJECT_ID,
  dataset: ECHO_SANITY_DATASET,
  apiVersion: "2021-08-31",
  useCdn: true,
});
