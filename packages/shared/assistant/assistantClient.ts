import type { Payload } from "payload";
import type { AssistantConfig, AssistantMode } from "./config";
import { resolveAssistantConfig } from "./config";

export type AssistantRequest = {
  mode: AssistantMode;
  siteId?: string;
  tenantId?: string;
  payload: Record<string, unknown>;
};

export type AssistantResponse = {
  success: boolean;
  data?: unknown;
  error?: string;
  tokensUsed?: {
    prompt: number;
    completion: number;
    total: number;
  };
};

/**
 * Assistant client for making AI requests.
 * Resolves configuration and makes API calls to OpenAI (or other providers).
 */
export class AssistantClient {
  private config: AssistantConfig | null = null;
  private payload: Payload;

  constructor(payload: Payload) {
    this.payload = payload;
  }

  /**
   * Initialize client with configuration.
   * Must be called before making requests.
   */
  async initialize(options: { siteId?: string; tenantId?: string }): Promise<boolean> {
    this.config = await resolveAssistantConfig({
      payload: this.payload,
      siteId: options.siteId,
      tenantId: options.tenantId,
    });

    return this.config !== null;
  }

  /**
   * Make an assistant request.
   */
  async request(request: AssistantRequest): Promise<AssistantResponse> {
    if (!this.config) {
      // Try to initialize if not already done
      const initialized = await this.initialize({
        siteId: request.siteId,
        tenantId: request.tenantId,
      });

      if (!initialized) {
        return {
          success: false,
          error: "Assistant is not configured. Please set up AiSettings or OPENAI_API_KEY.",
        };
      }
    }

    // Check if feature is enabled
    if (!this.isFeatureEnabled(request.mode)) {
      return {
        success: false,
        error: `Feature "${request.mode}" is not enabled in assistant configuration.`,
      };
    }

    try {
      // Make API call to OpenAI (or other provider)
      const response = await this.makeApiCall(request);

      // Log assistant run
      await this.logAssistantRun(request, response);

      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  private isFeatureEnabled(mode: AssistantMode): boolean {
    if (!this.config) return false;

    const features = this.config.featuresEnabled;

    switch (mode) {
      case "seoMeta":
        return features.seo ?? false;
      case "translate":
        return features.translate ?? false;
      case "summarize":
        return features.summary ?? false;
      case "contentGenerate":
        return features.assistantChat ?? false;
      case "leadReply":
        return features.assistantChat ?? false;
      default:
        return false;
    }
  }

  private async makeApiCall(request: AssistantRequest): Promise<AssistantResponse> {
    if (!this.config) {
      throw new Error("Assistant client not initialized");
    }

    // For now, return a placeholder response
    // In production, this would make actual API calls to OpenAI
    // TODO: Implement actual OpenAI API integration

    return {
      success: true,
      data: {
        message: "Assistant response (placeholder)",
        mode: request.mode,
      },
      tokensUsed: {
        prompt: 0,
        completion: 0,
        total: 0,
      },
    };
  }

  private async logAssistantRun(
    request: AssistantRequest,
    response: AssistantResponse,
  ): Promise<void> {
    try {
      await this.payload.create({
        collection: "assistant-runs",
        data: {
          tenant: request.tenantId || null,
          site: request.siteId || null,
          user: null, // TODO: Get from context
          type: request.mode,
          model: this.config?.model || "unknown",
          tokensPrompt: response.tokensUsed?.prompt || 0,
          tokensCompletion: response.tokensUsed?.completion || 0,
          tokensTotal: response.tokensUsed?.total || 0,
          request: request.payload,
          response: response.data || { error: response.error },
        },
      });
    } catch (error) {
      // Log error but don't fail the request
      console.error("[assistant] Failed to log assistant run:", error);
    }
  }
}

/**
 * Create a new assistant client instance.
 */
export function createAssistantClient(payload: Payload): AssistantClient {
  return new AssistantClient(payload);
}

