import type { Payload } from "payload";

export type AssistantMode = "seoMeta" | "contentGenerate" | "translate" | "leadReply" | "summarize";

export type AssistantConfig = {
  provider: "openai" | "azure" | "other";
  model: string;
  apiKey: string;
  maxTokensPerRequest: number;
  dailyTokenLimit?: number;
  featuresEnabled: {
    seo?: boolean;
    translate?: boolean;
    summary?: boolean;
    assistantChat?: boolean;
  };
};

export type AssistantResolutionOptions = {
  payload: Payload;
  siteId?: string;
  tenantId?: string;
};

/**
 * Resolves assistant configuration in this order:
 * 1. Site-level AiSettings (if siteId provided)
 * 2. Tenant-level AiSettings (if tenantId provided)
 * 3. Platform env (OPENAI_API_KEY, ASSISTANT_MODEL)
 * 4. If none → returns null (assistant disabled)
 */
export async function resolveAssistantConfig(
  options: AssistantResolutionOptions,
): Promise<AssistantConfig | null> {
  const { payload, siteId, tenantId } = options;

  // 1. Try site-level AiSettings
  if (siteId) {
    const siteSettings = await payload.find({
      collection: "ai-settings",
      limit: 1,
      where: {
        site: {
          equals: siteId,
        },
      },
    });

    if (siteSettings.docs.length > 0) {
      const settings = siteSettings.docs[0] as any;
      if (settings.apiKeyMode === "perSite" && settings.siteApiKey) {
        return {
          provider: settings.provider || "openai",
          model: settings.model || "gpt-4o-mini",
          apiKey: settings.siteApiKey,
          maxTokensPerRequest: settings.maxTokensPerRequest || 2000,
          dailyTokenLimit: settings.dailyTokenLimit,
          featuresEnabled: settings.featuresEnabled || {},
        };
      }
    }
  }

  // 2. Try tenant-level AiSettings
  if (tenantId) {
    const tenantSettings = await payload.find({
      collection: "ai-settings",
      limit: 1,
      where: {
        tenant: {
          equals: tenantId,
        },
        site: {
          exists: false,
        },
      },
    });

    if (tenantSettings.docs.length > 0) {
      const settings = tenantSettings.docs[0] as any;
      if (settings.apiKeyMode === "perSite" && settings.siteApiKey) {
        return {
          provider: settings.provider || "openai",
          model: settings.model || "gpt-4o-mini",
          apiKey: settings.siteApiKey,
          maxTokensPerRequest: settings.maxTokensPerRequest || 2000,
          dailyTokenLimit: settings.dailyTokenLimit,
          featuresEnabled: settings.featuresEnabled || {},
        };
      }
    }
  }

  // 3. Try platform env
  const platformKey = process.env.OPENAI_API_KEY;
  const platformModel = process.env.ASSISTANT_MODEL || "gpt-4o-mini";

  if (platformKey) {
    return {
      provider: "openai",
      model: platformModel,
      apiKey: platformKey,
      maxTokensPerRequest: Number(process.env.ASSISTANT_MAX_TOKENS) || 2000,
      dailyTokenLimit: process.env.ASSISTANT_DAILY_TOKEN_LIMIT
        ? Number(process.env.ASSISTANT_DAILY_TOKEN_LIMIT)
        : undefined,
      featuresEnabled: {
        seo: true,
        translate: true,
        summary: true,
        assistantChat: false,
      },
    };
  }

  // 4. No config found
  return null;
}

