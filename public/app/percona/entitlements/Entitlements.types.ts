export interface Entitlement {
    number: string;
    name: string;
    summary: string;
    tier: string;
    totalUnits: string;
    unlimitedUnits: true;
    supportLevel: string;
    softwareFamilies: string[];
    startDate: string;
    endDate: string;
    platform: Platform;
}

export interface Platform {
    securityAdvisor: string;
    configAdvisor: string;
}

interface RawEntitlement {       
    number: string;
    name: string;
    summary: string;
    tier: string;
    total_units: string;
    unlimited_units: true;
    support_level: string;
    software_families: string[];
    start_date: string;
    end_date: string;
    platform: RawPlatform;
  }

  interface RawPlatform {
    security_advisor: string;
    config_advisor: string;
  }

 export interface EntitlementsResponse {
      entitlements: RawEntitlement[];
  }