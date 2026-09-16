import {
  INDUSTRY_NETWORK_DATA,
  type NetworkMetric,
  type NetworkCategory,
  type RecruiterCategory,
  type CollaborationType,
  type GlobalRegionCollaboration,
  type OfficialSource
} from '../data/industryNetwork';

export class IndustryNetworkService {
  /**
   * Returns all verified metrics for the industry ecosystem
   */
  static getMetrics(): NetworkMetric[] {
    return INDUSTRY_NETWORK_DATA.metrics;
  }

  /**
   * Returns all interactive category cards
   */
  static getCategories(): NetworkCategory[] {
    return INDUSTRY_NETWORK_DATA.categories;
  }

  /**
   * Returns categories filtered by tag
   */
  static getCategoriesByTag(tag: string): NetworkCategory[] {
    if (tag === 'ALL') return INDUSTRY_NETWORK_DATA.categories;
    return INDUSTRY_NETWORK_DATA.categories.filter(c => c.categoryTag === tag);
  }

  /**
   * Returns documented recruiter categories
   */
  static getRecruiterCategories(): RecruiterCategory[] {
    return INDUSTRY_NETWORK_DATA.recruiterCategories;
  }

  /**
   * Returns verified collaboration types
   */
  static getCollaborationTypes(): CollaborationType[] {
    return INDUSTRY_NETWORK_DATA.collaborationTypes;
  }

  /**
   * Returns all global regions with verified collaborations
   */
  static getGlobalRegions(): GlobalRegionCollaboration[] {
    return INDUSTRY_NETWORK_DATA.regions;
  }

  /**
   * Finds a global region by ID
   */
  static getGlobalRegionById(id: string): GlobalRegionCollaboration | undefined {
    return INDUSTRY_NETWORK_DATA.regions.find(r => r.id === id);
  }

  /**
   * Returns official data sources with provenance
   */
  static getOfficialSources(): OfficialSource[] {
    return INDUSTRY_NETWORK_DATA.officialSources;
  }

  /**
   * Returns full network data bundle
   */
  static getNetworkData() {
    return INDUSTRY_NETWORK_DATA;
  }
}
