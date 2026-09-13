/// <reference types="vite/client" />

import { PrismAPI } from '../shared/types'

declare global {
  interface Window {
    prismAPI: PrismAPI
  }
}
