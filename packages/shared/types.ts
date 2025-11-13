/**
 * Shared types for @bsweb/shared package.
 */

export type {
  // Re-export common types that might be used across packages
} from './cache/cacheTags';
export type { SiteResolution } from './routing/resolveSite';
export type {
  AssistantMode,
  AssistantConfig,
  AssistantResolutionOptions,
} from './assistant/config';
export type {
  AssistantRequest,
  AssistantResponse,
} from './assistant/assistantClient';

