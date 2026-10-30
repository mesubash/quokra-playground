/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_QUOKRA_URL?: string
  readonly VITE_QUOKRA_TENANT?: string
  readonly VITE_QUOKRA_PK?: string
  readonly VITE_OIDC_AUTHORITY?: string
  readonly VITE_OIDC_CLIENT_ID?: string
}
