/// <reference path="../.astro/types.d.ts" />
/// <reference types="@sanity/astro/module" />

type Runtime = import("@astrojs/cloudflare").Runtime<Env>;
declare namespace App {
  interface Locals extends Runtime {}
}
