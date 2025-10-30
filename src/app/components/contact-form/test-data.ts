import type { ContactFormData } from "./types";

export const testCases: Record<string, { name: string; data: ContactFormData }> = {
  construction_small: {
    name: "Small Construction Business",
    data: {
      fullName: "Mike Johnson",
      email: "dev@agentico.com.au",
      phone: "0412 776 610",
      company: "BuildRight Constructions",
      website: "https://www.buildrightconstructions.com.au",
      socialLinks: [
        { url: "https://www.facebook.com/buildrightconstructions" },
      ],
      industry: "construction_trades" as const,
      businessSize: "6-20" as const,
      currentSystems: "Excel for quotes, Gmail, paper-based job tracking. We're drowning in paperwork and our quote response time is too slow.",
      monthlyVolume: "100-500" as const,
      teamSize: "6-10" as const,
      automationGoals: ["reduce_manual_work", "improve_response_time", "automate_reporting", "workflow_automation"],
      specificProcesses: "Automate quote generation from customer emails, auto-organize job completion photos, create weekly progress reports for clients.",
      projectIdeas: [
        {
          title: "AI Quote Generator",
          description: "Extract details from email inquiries and generate quotes automatically using our pricing templates.",
          priority: "high" as const
        },
        {
          title: "Job Photo Management",
          description: "Field workers upload photos, system auto-organizes by job and generates completion reports.",
          priority: "medium" as const
        }
      ],
      existingTools: "Xero, Gmail, Google Drive, spreadsheet CRM",
      integrationNeeds: ["accounting", "communication", "document_storage"],
      dataVolume: "moderate" as const,
      projectDescription: "Growing construction business struggling with manual admin processes. Spending 10+ hours/week on paperwork. Want to automate quoting and job documentation.",
      successMetrics: "Reduce quote turnaround from 2-3 days to same-day, save 10+ hours/week on admin, improve customer satisfaction.",
      timeline: "1-3_months" as const,
      budget: "25k-50k" as const,
    }
  },
  healthcare_medium: {
    name: "Medical Practice",
    data: {
      fullName: "Dr. Sarah Chen",
      email: "dev@agentico.com.au",
      phone: "0412 776 610",
      company: "Sunshine Coast Medical Centre",
      website: "https://www.sunshinecoastmedical.com.au",
      socialLinks: [
        { url: "https://www.linkedin.com/company/sunshinecoastmedical" },
        { url: "https://www.facebook.com/sunshinecoastmedical" },
      ],
      industry: "healthcare_medical" as const,
      businessSize: "21-50" as const,
      currentSystems: "Practice management software (old system), manual appointment reminders, paper-based patient forms, email for communication.",
      monthlyVolume: "1000-5000" as const,
      teamSize: "11-20" as const,
      automationGoals: ["improve_response_time", "customer_service", "document_processing", "workflow_automation"],
      specificProcesses: "Automate appointment reminders and confirmations, process patient intake forms digitally, AI-powered triage for phone inquiries, auto-generate referral letters.",
      projectIdeas: [
        {
          title: "AI Patient Triage System",
          description: "AI handles initial phone calls, collects symptoms, schedules appropriate appointments, and flags urgent cases.",
          priority: "high" as const
        },
        {
          title: "Digital Intake Forms",
          description: "Patients complete forms online before visit, data auto-populates into practice software.",
          priority: "high" as const
        },
        {
          title: "Automated Referrals",
          description: "Generate referral letters automatically from patient records and doctor notes.",
          priority: "medium" as const
        }
      ],
      existingTools: "Best Practice software, Hotdoc for bookings, Gmail, Microsoft 365, Medicare claiming system",
      integrationNeeds: ["crm", "communication", "document_storage", "custom_software"],
      dataVolume: "large" as const,
      projectDescription: "Busy medical practice with 5 doctors handling 200+ patients daily. Reception team overwhelmed with calls and admin. Need to streamline patient intake and reduce wait times.",
      successMetrics: "Reduce phone wait time from 15min to under 2min, automate 80% of appointment confirmations, eliminate paper forms, save 20+ admin hours per week.",
      timeline: "immediate" as const,
      budget: "50k-100k" as const,
    }
  },
  legal_enterprise: {
    name: "Law Firm - Enterprise",
    data: {
      fullName: "Jennifer Martinez",
      email: "dev@agentico.com.au",
      phone: "0412 776 610",
      company: "Martinez & Associates Legal",
      website: "https://www.martinezlegal.com.au",
      socialLinks: [
        { url: "https://www.linkedin.com/company/martinezlegal" },
        { url: "https://twitter.com/martinezlegal" },
      ],
      industry: "legal_services" as const,
      businessSize: "51-200" as const,
      currentSystems: "LEAP legal software, DocuSign for signatures, Outlook, SharePoint for document management, manual client intake process.",
      monthlyVolume: "500-1000" as const,
      teamSize: "20+" as const,
      automationGoals: ["document_processing", "customer_service", "workflow_automation", "reduce_manual_work"],
      specificProcesses: "Automate client intake and conflict checks, AI-powered document review and summarization, auto-generate initial legal documents from templates, intelligent case assignment to appropriate lawyers.",
      projectIdeas: [
        {
          title: "AI Document Review Assistant",
          description: "Automatically review contracts and legal documents, highlight key clauses, risks, and unusual terms for lawyer review.",
          priority: "high" as const
        },
        {
          title: "Automated Client Intake",
          description: "AI chatbot collects initial client information, performs conflict checks, and routes to appropriate department.",
          priority: "high" as const
        },
        {
          title: "Legal Document Generator",
          description: "Generate standard legal documents from approved templates based on client information and case type.",
          priority: "medium" as const
        }
      ],
      existingTools: "LEAP, DocuSign, Microsoft 365, SharePoint, custom billing system, LawMaster",
      integrationNeeds: ["crm", "document_storage", "communication", "custom_software"],
      dataVolume: "very_large" as const,
      projectDescription: "Large legal practice with 15 lawyers across multiple practice areas. Handling high volume of documents and client inquiries. Need to improve efficiency while maintaining quality and compliance.",
      successMetrics: "Reduce document review time by 40%, improve client intake speed by 60%, automate 70% of routine document generation, save partners 15+ hours/week.",
      timeline: "3-6_months" as const,
      budget: "100k+" as const,
    }
  },
  retail_startup: {
    name: "E-commerce Startup",
    data: {
      fullName: "Alex Thompson",
      email: "dev@agentico.com.au",
      phone: "0412 776 610",
      company: "EcoStyle Australia",
      website: "https://www.ecostyle.com.au",
      socialLinks: [
        { url: "https://www.instagram.com/ecostyleaustralia" },
        { url: "https://www.facebook.com/ecostyleaustralia" },
        { url: "https://www.tiktok.com/@ecostyleaustralia" },
      ],
      industry: "ecommerce" as const,
      businessSize: "1-5" as const,
      currentSystems: "Shopify for store, basic email marketing, manual customer service via email and Instagram DMs, spreadsheets for inventory.",
      monthlyVolume: "500-1000" as const,
      teamSize: "1-2" as const,
      automationGoals: ["customer_service", "improve_response_time", "automate_reporting"],
      specificProcesses: "Automate customer service inquiries, personalized product recommendations, automated order status updates, social media response automation.",
      projectIdeas: [
        {
          title: "AI Customer Service Chatbot",
          description: "24/7 chatbot for order tracking, product questions, returns, and general inquiries with seamless handoff to human when needed.",
          priority: "high" as const
        },
        {
          title: "Personalized Recommendations",
          description: "AI analyzes customer browsing and purchase history to provide personalized product suggestions.",
          priority: "low" as const
        }
      ],
      existingTools: "Shopify, Mailchimp, Instagram, Facebook, Google Analytics",
      integrationNeeds: ["crm", "communication"],
      dataVolume: "moderate" as const,
      projectDescription: "Fast-growing e-commerce startup selling sustainable fashion. Overwhelmed with customer service inquiries. Need to scale support without hiring a big team.",
      successMetrics: "Automate 60% of customer inquiries, respond to all messages within 2 hours, increase repeat customer rate by 20%.",
      timeline: "immediate" as const,
      budget: "under_10k" as const,
    }
  },
  accounting_firm: {
    name: "Accounting Firm",
    data: {
      fullName: "Robert Williams",
      email: "dev@agentico.com.au",
      phone: "0412 776 610",
      company: "Williams & Co Chartered Accountants",
      website: "https://www.williamsaccounting.com.au",
      socialLinks: [
        { url: "https://www.linkedin.com/company/williamsaccounting" },
      ],
      industry: "accounting_bookkeeping" as const,
      businessSize: "6-20" as const,
      currentSystems: "Xero for client bookkeeping, MYOB for some clients, Practice Manager software, email for client communication, manual document collection.",
      monthlyVolume: "1000-5000" as const,
      teamSize: "11-20" as const,
      automationGoals: ["reduce_manual_work", "document_processing", "workflow_automation", "automate_reporting"],
      specificProcesses: "Automate collection of client documents (receipts, invoices, bank statements), intelligent data entry from documents into accounting software, automated BAS preparation, client reporting automation.",
      projectIdeas: [
        {
          title: "Document Processing AI",
          description: "Clients upload receipts/invoices via portal, AI extracts data, categorizes, and enters into Xero/MYOB automatically.",
          priority: "high" as const
        },
        {
          title: "Automated BAS Preparation",
          description: "AI prepares BAS statements from client data, highlights anomalies for accountant review before lodgement.",
          priority: "high" as const
        },
        {
          title: "Client Portal with AI Assistant",
          description: "Clients can ask questions about their financials, get instant answers from AI trained on their data.",
          priority: "medium" as const
        }
      ],
      existingTools: "Xero, MYOB, APS Practice Manager, Microsoft 365, Hubdoc, Receipt Bank",
      integrationNeeds: ["accounting", "document_storage", "communication"],
      dataVolume: "very_large" as const,
      projectDescription: "Established accounting firm with 50+ SMB clients. Spending too much time on manual data entry and document processing. Want to offer better service while reducing costs.",
      successMetrics: "Reduce data entry time by 75%, process documents within 24 hours (currently 3-5 days), handle 30% more clients with same team size.",
      timeline: "3-6_months" as const,
      budget: "50k-100k" as const,
    }
  },
  real_estate_agency: {
    name: "Real Estate Agency",
    data: {
      fullName: "Lisa Anderson",
      email: "dev@agentico.com.au",
      phone: "0412 776 610",
      company: "Coastal Properties Real Estate",
      website: "https://www.coastalproperties.com.au",
      socialLinks: [
        { url: "https://www.instagram.com/coastalproperties" },
        { url: "https://www.facebook.com/coastalproperties" },
      ],
      industry: "real_estate" as const,
      businessSize: "6-20" as const,
      currentSystems: "REA/Domain listings, manual CRM follow-ups, email for client communication, paper-based property inspections.",
      monthlyVolume: "500-1000" as const,
      teamSize: "6-10" as const,
      automationGoals: ["customer_service", "improve_response_time", "workflow_automation", "lead_qualification"],
      specificProcesses: "Automate lead qualification from property inquiries, schedule property inspections automatically, generate property reports with AI summaries, automated follow-up sequences for buyers and sellers.",
      projectIdeas: [
        {
          title: "AI Lead Qualification Bot",
          description: "Automatically engage with property inquiries, qualify leads based on budget and requirements, schedule inspections with agents.",
          priority: "high" as const
        },
        {
          title: "Property Report Generator",
          description: "AI creates detailed property reports with market analysis, comparable sales, and investment potential.",
          priority: "medium" as const
        },
        {
          title: "Smart Follow-up System",
          description: "Automated nurture campaigns for leads, personalized based on property preferences and engagement.",
          priority: "medium" as const
        }
      ],
      existingTools: "REA, Domain, VaultRE CRM, Gmail, Canva for marketing",
      integrationNeeds: ["crm", "communication", "marketing"],
      dataVolume: "moderate" as const,
      projectDescription: "Growing real estate agency with 8 agents managing multiple properties. Leads are falling through cracks due to slow response times. Need to automate initial contact and follow-ups.",
      successMetrics: "Respond to all leads within 5 minutes, increase conversion rate by 25%, automate 70% of initial inquiries, save agents 10+ hours/week.",
      timeline: "1-3_months" as const,
      budget: "25k-50k" as const,
    }
  },
  hospitality_restaurant: {
    name: "Restaurant Group",
    data: {
      fullName: "Marco Rossi",
      email: "dev@agentico.com.au",
      phone: "0412 776 610",
      company: "Rossi Restaurant Group",
      website: "https://www.rossirestaurants.com.au",
      socialLinks: [
        { url: "https://www.instagram.com/rossirestaurants" },
        { url: "https://www.facebook.com/rossirestaurants" },
      ],
      industry: "restaurants_cafes" as const,
      businessSize: "21-50" as const,
      currentSystems: "POS system (Square), manual reservation management via phone and email, spreadsheets for inventory, paper-based staff scheduling.",
      monthlyVolume: "1000-5000" as const,
      teamSize: "20+" as const,
      automationGoals: ["customer_service", "workflow_automation", "inventory_management", "improve_response_time"],
      specificProcesses: "Automate reservation management and confirmations, AI-powered phone answering for bookings, automated inventory ordering based on sales patterns, staff scheduling optimization.",
      projectIdeas: [
        {
          title: "AI Reservation Assistant",
          description: "Handle phone and online reservations 24/7, manage waitlists, send automated confirmations and reminders.",
          priority: "high" as const
        },
        {
          title: "Smart Inventory System",
          description: "Track inventory in real-time, predict demand, automatically generate orders to suppliers.",
          priority: "high" as const
        },
        {
          title: "Staff Scheduling AI",
          description: "Optimize staff rosters based on historical demand, employee preferences, and labor costs.",
          priority: "medium" as const
        }
      ],
      existingTools: "Square POS, OpenTable, Gmail, Deputy for rostering, QuickBooks",
      integrationNeeds: ["communication", "accounting", "custom_software"],
      dataVolume: "large" as const,
      projectDescription: "Restaurant group with 3 locations experiencing rapid growth. Phone constantly ringing with reservations, inventory management is chaotic, and staff scheduling takes hours each week.",
      successMetrics: "Capture 100% of phone reservations (currently missing 20%), reduce food waste by 30%, automate staff scheduling saving 5 hours/week, improve table turnover by 15%.",
      timeline: "3-6_months" as const,
      budget: "50k-100k" as const,
    }
  },
  education_training: {
    name: "Online Training Provider",
    data: {
      fullName: "Emma Foster",
      email: "dev@agentico.com.au",
      phone: "0412 776 610",
      company: "SkillUp Australia",
      website: "https://www.skillupaustralia.com.au",
      socialLinks: [
        { url: "https://www.linkedin.com/company/skillupaustralia" },
        { url: "https://www.youtube.com/@skillupaustralia" },
      ],
      industry: "education_training" as const,
      businessSize: "6-20" as const,
      currentSystems: "Teachable for course hosting, manual student support via email, Zoom for live sessions, spreadsheets for tracking enrollments.",
      monthlyVolume: "1000-5000" as const,
      teamSize: "6-10" as const,
      automationGoals: ["customer_service", "improve_response_time", "automate_reporting", "lead_qualification"],
      specificProcesses: "Automate student onboarding and course recommendations, AI tutor for common questions, automated assessment grading, personalized learning paths based on progress.",
      projectIdeas: [
        {
          title: "AI Student Support Assistant",
          description: "24/7 chatbot answering course questions, technical issues, providing study resources, escalating to human when needed.",
          priority: "high" as const
        },
        {
          title: "Personalized Learning Paths",
          description: "AI analyzes student progress and learning style to recommend courses and adjust difficulty.",
          priority: "medium" as const
        },
        {
          title: "Automated Assessment System",
          description: "AI grades assignments, provides detailed feedback, tracks student progress over time.",
          priority: "medium" as const
        }
      ],
      existingTools: "Teachable, Zoom, Mailchimp, Stripe for payments, Google Workspace",
      integrationNeeds: ["crm", "communication", "payment_processing"],
      dataVolume: "large" as const,
      projectDescription: "Online training provider with 2,000+ students across 15 courses. Struggling to provide timely support and personalized learning experiences. Want to scale without proportionally increasing support staff.",
      successMetrics: "Automate 75% of support inquiries, reduce response time from 24 hours to instant, increase course completion rate by 40%, improve student satisfaction scores.",
      timeline: "3-6_months" as const,
      budget: "50k-100k" as const,
    }
  },
  manufacturing_sme: {
    name: "Manufacturing SME",
    data: {
      fullName: "David Kumar",
      email: "dev@agentico.com.au",
      phone: "0412 776 610",
      company: "Precision Components Pty Ltd",
      website: "https://www.precisioncomponents.com.au",
      socialLinks: [
        { url: "https://www.linkedin.com/company/precisioncomponents" },
      ],
      industry: "manufacturing" as const,
      businessSize: "21-50" as const,
      currentSystems: "Outdated MRP system, manual quality control documentation, paper-based maintenance logs, email for customer orders.",
      monthlyVolume: "500-1000" as const,
      teamSize: "20+" as const,
      automationGoals: ["workflow_automation", "reduce_manual_work", "quality_control", "inventory_management"],
      specificProcesses: "Automate quality control documentation with vision AI, predictive maintenance scheduling, automated production reporting, intelligent inventory management and reordering.",
      projectIdeas: [
        {
          title: "AI Quality Control System",
          description: "Computer vision system inspects components, automatically documents defects, generates quality reports.",
          priority: "high" as const
        },
        {
          title: "Predictive Maintenance AI",
          description: "Monitor machine performance, predict failures before they happen, schedule preventive maintenance.",
          priority: "high" as const
        },
        {
          title: "Production Optimization",
          description: "AI analyzes production data, identifies bottlenecks, recommends efficiency improvements.",
          priority: "medium" as const
        }
      ],
      existingTools: "Legacy MRP system, Excel, email, basic accounting software",
      integrationNeeds: ["custom_software", "document_storage", "accounting"],
      dataVolume: "very_large" as const,
      projectDescription: "Medium-sized manufacturing business producing precision metal components. Quality control is manual and time-consuming, unexpected machine breakdowns cause costly delays. Need to modernize operations.",
      successMetrics: "Reduce quality control time by 60%, decrease unplanned downtime by 40%, improve on-time delivery from 85% to 98%, reduce waste by 25%.",
      timeline: "6+_months" as const,
      budget: "100k+" as const,
    }
  },
  fitness_wellness: {
    name: "Fitness Studio Chain",
    data: {
      fullName: "Sophie Mitchell",
      email: "dev@agentico.com.au",
      phone: "0412 776 610",
      company: "FlowFit Studios",
      website: "https://www.flowfitstudios.com.au",
      socialLinks: [
        { url: "https://www.instagram.com/flowfitstudios" },
        { url: "https://www.facebook.com/flowfitstudios" },
        { url: "https://www.tiktok.com/@flowfitstudios" },
      ],
      industry: "other" as const,
      businessSize: "21-50" as const,
      currentSystems: "Mindbody for bookings, manual member engagement via email and social, spreadsheets for tracking member progress.",
      monthlyVolume: "1000-5000" as const,
      teamSize: "11-20" as const,
      automationGoals: ["customer_service", "improve_response_time", "marketing_automation", "member_retention"],
      specificProcesses: "Automate class booking confirmations and waitlist management, personalized workout recommendations, automated member check-ins and progress tracking, AI-powered nutrition guidance.",
      projectIdeas: [
        {
          title: "AI Fitness Coach",
          description: "Personalized workout plans, progress tracking, form feedback from video analysis, motivation and tips.",
          priority: "high" as const
        },
        {
          title: "Smart Member Retention",
          description: "AI identifies at-risk members, triggers personalized retention campaigns, offers targeted promotions.",
          priority: "high" as const
        },
        {
          title: "Automated Community Engagement",
          description: "AI manages member community forum, answers questions, celebrates milestones, organizes challenges.",
          priority: "low" as const
        }
      ],
      existingTools: "Mindbody, Instagram, Mailchimp, Stripe, WhatsApp Business",
      integrationNeeds: ["crm", "communication", "payment_processing", "marketing"],
      dataVolume: "large" as const,
      projectDescription: "Growing fitness studio chain with 4 locations and 800+ active members. Want to provide personalized experiences and improve retention without dramatically increasing staff costs.",
      successMetrics: "Increase member retention by 30%, automate 80% of routine inquiries, boost class attendance by 20%, improve member satisfaction scores from 7.5 to 9.0.",
      timeline: "3-6_months" as const,
      budget: "50k-100k" as const,
    }
  },
  marketing_agency: {
    name: "Digital Marketing Agency",
    data: {
      fullName: "Chris Taylor",
      email: "dev@agentico.com.au",
      phone: "0412 776 610",
      company: "Amplify Digital",
      website: "https://www.amplifydigital.com.au",
      socialLinks: [
        { url: "https://www.linkedin.com/company/amplifydigital" },
        { url: "https://www.instagram.com/amplifydigital" },
      ],
      industry: "marketing_advertising" as const,
      businessSize: "6-20" as const,
      currentSystems: "Monday.com for project management, manual client reporting, multiple tools for social media management, spreadsheets for campaign tracking.",
      monthlyVolume: "500-1000" as const,
      teamSize: "11-20" as const,
      automationGoals: ["automate_reporting", "workflow_automation", "reduce_manual_work", "client_reporting"],
      specificProcesses: "Automate client reporting dashboards, AI-powered content creation and optimization, automated social media scheduling and engagement, intelligent campaign performance analysis.",
      projectIdeas: [
        {
          title: "Automated Client Reporting",
          description: "AI generates comprehensive client reports with insights, recommendations, and performance analysis from all platforms.",
          priority: "high" as const
        },
        {
          title: "AI Content Assistant",
          description: "Generate social media captions, blog posts, ad copy optimized for each platform and audience.",
          priority: "high" as const
        },
        {
          title: "Campaign Optimization AI",
          description: "Continuously analyze campaign performance, automatically adjust budgets and targeting for better ROI.",
          priority: "medium" as const
        }
      ],
      existingTools: "Monday.com, Meta Business Suite, Google Ads, Hootsuite, Canva, Google Analytics",
      integrationNeeds: ["marketing", "communication", "document_storage", "analytics"],
      dataVolume: "very_large" as const,
      projectDescription: "Digital marketing agency managing 30+ client accounts. Spending 15+ hours per week on manual reporting and data aggregation. Need to scale operations and improve insights.",
      successMetrics: "Reduce reporting time by 80%, handle 50% more clients with same team, improve campaign ROI by 25%, deliver reports daily instead of monthly.",
      timeline: "3-6_months" as const,
      budget: "50k-100k" as const,
    }
  },
  logistics_transport: {
    name: "Transport & Logistics",
    data: {
      fullName: "James Peterson",
      email: "dev@agentico.com.au",
      phone: "0412 776 610",
      company: "FastTrack Logistics",
      website: "https://www.fasttracklogistics.com.au",
      socialLinks: [
        { url: "https://www.linkedin.com/company/fasttracklogistics" },
      ],
      industry: "other" as const,
      businessSize: "51-200" as const,
      currentSystems: "Legacy TMS (Transport Management System), manual dispatch via phone and radio, paper-based delivery confirmation, Excel for route planning.",
      monthlyVolume: "5000+" as const,
      teamSize: "20+" as const,
      automationGoals: ["workflow_automation", "reduce_manual_work", "improve_efficiency", "customer_tracking"],
      specificProcesses: "Automate route optimization and dispatch, real-time delivery tracking and customer notifications, digital proof of delivery, automated invoicing based on deliveries.",
      projectIdeas: [
        {
          title: "AI Route Optimization",
          description: "Automatically optimize delivery routes considering traffic, time windows, vehicle capacity, and fuel efficiency.",
          priority: "high" as const
        },
        {
          title: "Smart Dispatch System",
          description: "AI-powered dispatch assigns jobs to drivers based on location, capacity, skills, and real-time conditions.",
          priority: "high" as const
        },
        {
          title: "Customer Tracking Portal",
          description: "Real-time delivery tracking, automated ETA updates, proof of delivery with photos and signatures.",
          priority: "medium" as const
        }
      ],
      existingTools: "Legacy TMS, MYOB for accounting, email, basic GPS tracking",
      integrationNeeds: ["custom_software", "accounting", "communication", "gps_tracking"],
      dataVolume: "very_large" as const,
      projectDescription: "Regional logistics company with 50+ vehicles making 500+ deliveries daily. Manual route planning is inefficient, customers demanding real-time tracking, dispatch process is chaotic during peak times.",
      successMetrics: "Reduce fuel costs by 20%, improve on-time delivery from 85% to 98%, reduce dispatch time by 60%, automate customer notifications.",
      timeline: "6+_months" as const,
      budget: "100k+" as const,
    }
  },
  financial_services: {
    name: "Financial Advisory",
    data: {
      fullName: "Rebecca Wong",
      email: "dev@agentico.com.au",
      phone: "0412 776 610",
      company: "Wong Financial Planning",
      website: "https://www.wongfinancial.com.au",
      socialLinks: [
        { url: "https://www.linkedin.com/company/wongfinancial" },
      ],
      industry: "financial_advisory" as const,
      businessSize: "6-20" as const,
      currentSystems: "Xplan for financial planning, manual client onboarding, email for document collection, paper-based review processes.",
      monthlyVolume: "100-500" as const,
      teamSize: "6-10" as const,
      automationGoals: ["document_processing", "workflow_automation", "client_onboarding", "compliance_automation"],
      specificProcesses: "Automate client onboarding and KYC verification, AI-powered financial document analysis, automated compliance reporting, intelligent client portfolio monitoring and alerts.",
      projectIdeas: [
        {
          title: "Automated Client Onboarding",
          description: "Digital onboarding with ID verification, risk profiling, document collection, and compliance checks.",
          priority: "high" as const
        },
        {
          title: "AI Financial Analysis",
          description: "Analyze client financial documents, identify opportunities, flag risks, generate preliminary recommendations.",
          priority: "high" as const
        },
        {
          title: "Compliance Automation",
          description: "Automatically track regulatory requirements, generate compliance reports, alert on potential issues.",
          priority: "medium" as const
        }
      ],
      existingTools: "Xplan, DocuSign, Microsoft 365, basic CRM",
      integrationNeeds: ["crm", "document_storage", "compliance", "communication"],
      dataVolume: "large" as const,
      projectDescription: "Financial planning practice with 200+ clients. Onboarding takes weeks, manual compliance work is consuming too much time, want to provide more proactive advice to clients.",
      successMetrics: "Reduce onboarding time from 3 weeks to 3 days, automate 70% of compliance reporting, increase client review frequency from annual to quarterly, save advisors 10+ hours/week.",
      timeline: "3-6_months" as const,
      budget: "50k-100k" as const,
    }
  },
  professional_services: {
    name: "Consulting Firm",
    data: {
      fullName: "Andrew Hughes",
      email: "dev@agentico.com.au",
      phone: "0412 776 610",
      company: "Strategic Solutions Consulting",
      website: "https://www.strategicsolutions.com.au",
      socialLinks: [
        { url: "https://www.linkedin.com/company/strategicsolutions" },
      ],
      industry: "consulting" as const,
      businessSize: "21-50" as const,
      currentSystems: "Salesforce for CRM, manual proposal generation, email for communication, SharePoint for knowledge management.",
      monthlyVolume: "100-500" as const,
      teamSize: "20+" as const,
      automationGoals: ["document_processing", "knowledge_management", "proposal_automation", "reduce_manual_work"],
      specificProcesses: "Automate proposal and RFP responses using knowledge base, AI-powered research and data analysis, automated project reporting, intelligent resource allocation.",
      projectIdeas: [
        {
          title: "AI Proposal Generator",
          description: "Automatically generate proposals and RFP responses using past projects, case studies, and company knowledge.",
          priority: "high" as const
        },
        {
          title: "Knowledge Management AI",
          description: "Intelligent search across all projects and documents, surface relevant insights, suggest experts.",
          priority: "high" as const
        },
        {
          title: "Client Insights Dashboard",
          description: "AI analyzes client data, identifies upsell opportunities, predicts churn risk, recommends actions.",
          priority: "medium" as const
        }
      ],
      existingTools: "Salesforce, Microsoft 365, SharePoint, Slack, Monday.com",
      integrationNeeds: ["crm", "document_storage", "communication", "project_management"],
      dataVolume: "very_large" as const,
      projectDescription: "Management consulting firm with 12 consultants across various industries. Proposal development takes 20+ hours, knowledge is siloed, spending too much time reinventing solutions.",
      successMetrics: "Reduce proposal time by 70%, increase win rate by 25%, improve consultant utilization by 15%, capture and reuse 90% of project learnings.",
      timeline: "3-6_months" as const,
      budget: "100k+" as const,
    }
  },
  home_services: {
    name: "Home Services Business",
    data: {
      fullName: "Tom Harrison",
      email: "dev@agentico.com.au",
      phone: "0412 776 610",
      company: "HomeHero Services",
      website: "https://www.homeheroservices.com.au",
      socialLinks: [
        { url: "https://www.facebook.com/homeheroservices" },
        { url: "https://www.instagram.com/homeheroservices" },
      ],
      industry: "construction_trades" as const,
      businessSize: "6-20" as const,
      currentSystems: "Manual booking via phone, WhatsApp for technician coordination, paper job sheets, QuickBooks for invoicing.",
      monthlyVolume: "1000-5000" as const,
      teamSize: "11-20" as const,
      automationGoals: ["improve_response_time", "workflow_automation", "scheduling_optimization", "customer_service"],
      specificProcesses: "Automate booking and scheduling with AI dispatcher, smart technician routing, automated customer notifications and follow-ups, digital job management and invoicing.",
      projectIdeas: [
        {
          title: "AI Booking & Dispatch",
          description: "Customers book online or via AI phone assistant, system automatically schedules technician based on location, availability, and skills.",
          priority: "high" as const
        },
        {
          title: "Smart Route Optimization",
          description: "Optimize technician routes daily, minimize travel time, maximize jobs per day, handle emergency calls efficiently.",
          priority: "high" as const
        },
        {
          title: "Digital Job Management",
          description: "Paperless job sheets on mobile, photo documentation, instant invoicing, automated customer feedback collection.",
          priority: "medium" as const
        }
      ],
      existingTools: "QuickBooks, WhatsApp, Google Calendar, basic website",
      integrationNeeds: ["accounting", "communication", "scheduling", "payment_processing"],
      dataVolume: "moderate" as const,
      projectDescription: "Plumbing and electrical services business with 10 technicians. Missing calls leads to lost business, scheduling is chaotic, technicians waste time on paperwork and travel.",
      successMetrics: "Capture 100% of calls (currently missing 30%), increase jobs per technician from 4 to 6 daily, reduce admin time by 10 hours/week, improve customer satisfaction from 4.2 to 4.8 stars.",
      timeline: "1-3_months" as const,
      budget: "25k-50k" as const,
    }
  }
};

export type TestCaseKey = keyof typeof testCases;

