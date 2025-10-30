// Contact form data type definition
// This type is inferred from the Zod schema in the API route

export type ContactFormData = {
  // Contact Information
  fullName: string;
  email: string;
  phone: string;
  company: string;
  website?: string;
  socialLinks?: Array<{
    url: string;
  }>;
  
  // Business Information
  industry: 
    | "construction_trades"
    | "electrical_plumbing"
    | "hvac"
    | "landscaping_gardening"
    | "painting_decorating"
    | "carpentry_joinery"
    | "roofing"
    | "other_trades_construction"
    | "legal_services"
    | "accounting_bookkeeping"
    | "financial_advisory"
    | "consulting"
    | "human_resources"
    | "real_estate"
    | "property_management"
    | "insurance"
    | "other_professional_services"
    | "healthcare_medical"
    | "dental"
    | "veterinary"
    | "fitness_wellness"
    | "beauty_salon"
    | "other_healthcare_wellness"
    | "retail"
    | "ecommerce"
    | "hospitality_hotels"
    | "restaurants_cafes"
    | "catering"
    | "other_retail_hospitality"
    | "event_planning"
    | "marketing_advertising"
    | "it_services"
    | "software_development"
    | "design_creative"
    | "photography_videography"
    | "other_creative_tech"
    | "education_training"
    | "childcare"
    | "cleaning_services"
    | "logistics_transport"
    | "warehousing"
    | "manufacturing"
    | "wholesale_distribution"
    | "automotive_repair"
    | "security_services"
    | "recruitment_staffing"
    | "other_services"
    | "other";
  businessSize: "1-5" | "6-20" | "21-50" | "51-200" | "200+";
  
  // Current State Assessment
  currentSystems: string;
  monthlyVolume: "0-100" | "100-500" | "500-1000" | "1000-5000" | "5000+";
  teamSize: "1-2" | "3-5" | "6-10" | "11-20" | "20+";
  
  // Automation Needs
  automationGoals: string[];
  specificProcesses: string;
  projectIdeas?: Array<{
    title: string;
    description: string;
    priority: "high" | "medium" | "low";
  }>;
  
  // Integration Requirements
  existingTools: string;
  integrationNeeds: string[];
  dataVolume: "minimal" | "moderate" | "large" | "very_large";
  
  // Project Scope
  projectDescription: string;
  successMetrics: string;
  timeline: "immediate" | "1-3_months" | "3-6_months" | "6+_months";
  budget: "under_10k" | "10k-25k" | "25k-50k" | "50k-100k" | "100k+" | "not_sure";
};

