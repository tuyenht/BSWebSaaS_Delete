import type { CollectionConfig } from 'payload';

import { Users } from './Users';
import { Tenants } from './Tenants';
import { Sites } from './Sites';
import { Themes } from './Themes';
import { ThemeSettings } from './ThemeSettings';
import { ThemeOverrides } from './ThemeOverrides';
import { Settings } from './Settings';
import { AiSettings } from './AiSettings';
import { Taxonomies } from './Taxonomies';
import { Posts } from './Posts';
import { Products } from './Products';
import { Pages } from './Pages';
import { Media } from './Media';
import { ContentAttributes } from './ContentAttributes';
import { Forms } from './Forms';
import { Leads } from './Leads';
import { SearchIndex } from './SearchIndex';
import { AnalyticsDailyStats } from './AnalyticsDailyStats';
import { AuditEvents } from './AuditEvents';
import { AutomationRules } from './AutomationRules';
import { AutomationRuns } from './AutomationRuns';
import { AssistantRuns } from './AssistantRuns';
import { Extensions } from './Extensions';
import { SiteExtensions } from './SiteExtensions';
import { DemoContentSets } from './DemoContentSets';
import { Industries } from './Industries';

export const collections: CollectionConfig[] = [
  Users,
  Tenants,
  Sites,
  Themes,
  ThemeSettings,
  ThemeOverrides,
  Settings,
  AiSettings,
  Taxonomies,
  Posts,
  Products,
  Pages,
  Media,
  ContentAttributes,
  Forms,
  Leads,
  SearchIndex,
  AnalyticsDailyStats,
  AuditEvents,
  AutomationRules,
  AutomationRuns,
  AssistantRuns,
  Extensions,
  SiteExtensions,
  DemoContentSets,
  Industries,
];
