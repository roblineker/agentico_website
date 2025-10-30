import { z } from "zod";

export const contactFormSchema = z.object({
  // Contact Information
  fullName: z.string().min(2, "Please enter your full name (at least 2 characters)"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  company: z.string().min(2, "Please enter your company name"),
  website: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  socialLinks: z.array(z.object({
    url: z.string().url("Please enter a valid URL"),
  })).optional(),
  
  // Business Information
  industry: z.enum([
    "construction_trades",
    "electrical_plumbing",
    "hvac",
    "landscaping_gardening",
    "painting_decorating",
    "carpentry_joinery",
    "roofing",
    "other_trades_construction",
    "legal_services",
    "accounting_bookkeeping",
    "financial_advisory",
    "consulting",
    "human_resources",
    "real_estate",
    "property_management",
    "insurance",
    "other_professional_services",
    "healthcare_medical",
    "dental",
    "veterinary",
    "fitness_wellness",
    "beauty_salon",
    "other_healthcare_wellness",
    "retail",
    "ecommerce",
    "hospitality_hotels",
    "restaurants_cafes",
    "catering",
    "other_retail_hospitality",
    "event_planning",
    "marketing_advertising",
    "it_services",
    "software_development",
    "design_creative",
    "photography_videography",
    "other_creative_tech",
    "education_training",
    "childcare",
    "cleaning_services",
    "logistics_transport",
    "warehousing",
    "manufacturing",
    "wholesale_distribution",
    "automotive_repair",
    "security_services",
    "recruitment_staffing",
    "other_services",
    "other"
  ], {
    message: "Please select your industry",
  }),
  businessSize: z.enum(["1-5", "6-20", "21-50", "51-200", "200+"], {
    message: "Please select your business size",
  }),
  
  // Current State Assessment
  currentSystems: z.string().min(1, "Please describe your current systems"),
  monthlyVolume: z.enum(["0-100", "100-500", "500-1000", "1000-5000", "5000+"], {
    message: "Please select your monthly volume",
  }),
  teamSize: z.enum(["1-2", "3-5", "6-10", "11-20", "20+"], {
    message: "Please select team size",
  }),
  
  // Automation Needs
  automationGoals: z.array(z.string()).min(1, "Please select at least one automation goal"),
  specificProcesses: z.string().min(1, "Please describe specific processes to automate"),
  projectIdeas: z.array(z.object({
    title: z.string().min(3, "Please enter an idea title (at least 3 characters)"),
    description: z.string().min(1, "Please enter a description"),
    priority: z.enum(["high", "medium", "low"], {
      message: "Please select a priority level",
    }),
  })).optional(),
  
  // Integration Requirements
  existingTools: z.string().min(1, "Please list your existing tools/software"),
  integrationNeeds: z.array(z.string()),
  dataVolume: z.enum(["minimal", "moderate", "large", "very_large"], {
    message: "Please select data volume",
  }),
  
  // Project Scope
  projectDescription: z.string().min(1, "Please describe your project"),
  successMetrics: z.string().min(1, "Please describe how you'll measure success"),
  timeline: z.enum(["immediate", "1-3_months", "3-6_months", "6+_months"], {
    message: "Please select a timeline",
  }),
  budget: z.enum(["under_10k", "10k-25k", "25k-50k", "50k-100k", "100k+", "not_sure"], {
    message: "Please select a budget range",
  }),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export const automationGoalOptions = [
  { id: "reduce_manual_work", label: "Reduce manual data entry and paperwork" },
  { id: "improve_response_time", label: "Improve customer response times" },
  { id: "automate_reporting", label: "Automate reporting and analytics" },
  { id: "document_processing", label: "Automate document processing" },
  { id: "workflow_automation", label: "Streamline internal workflows" },
  { id: "customer_service", label: "Enhance customer service with AI" },
];

export const integrationOptions = [
  { id: "crm", label: "CRM System" },
  { id: "accounting", label: "Accounting Software" },
  { id: "project_management", label: "Project Management Tools" },
  { id: "communication", label: "Email/Communication Platforms" },
  { id: "document_storage", label: "Document Storage (Google Drive, Dropbox, etc.)" },
  { id: "custom_software", label: "Custom/Legacy Software" },
];

