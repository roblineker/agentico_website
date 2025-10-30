"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Plus, X, Facebook, Twitter, Linkedin, Instagram, Youtube, Globe } from "lucide-react";
import { useRouter } from "next/navigation";
import { contactFormSchema, type ContactFormData, automationGoalOptions, integrationOptions } from "./types";
import { testCases, type TestCaseKey } from "./test-data";

// Helper function to detect social network from URL
function detectSocialNetwork(url: string): { name: string; icon: React.ComponentType<{ className?: string }> } {
  const lowerUrl = url.toLowerCase();
  
  if (lowerUrl.includes('facebook.com') || lowerUrl.includes('fb.com')) {
    return { name: 'Facebook', icon: Facebook };
  }
  if (lowerUrl.includes('twitter.com') || lowerUrl.includes('x.com')) {
    return { name: 'Twitter/X', icon: Twitter };
  }
  if (lowerUrl.includes('linkedin.com')) {
    return { name: 'LinkedIn', icon: Linkedin };
  }
  if (lowerUrl.includes('instagram.com')) {
    return { name: 'Instagram', icon: Instagram };
  }
  if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) {
    return { name: 'YouTube', icon: Youtube };
  }
  if (lowerUrl.includes('tiktok.com')) {
    return { name: 'TikTok', icon: Globe };
  }
  if (lowerUrl.includes('pinterest.com')) {
    return { name: 'Pinterest', icon: Globe };
  }
  
  return { name: 'Social Link', icon: Globe };
}

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();
  const isDev = process.env.NODE_ENV === 'development';

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    mode: "onTouched",
    defaultValues: {
      automationGoals: [],
      integrationNeeds: [],
      projectIdeas: [],
      socialLinks: [],
      website: "",
      industry: "" as ContactFormData["industry"],
      businessSize: "" as ContactFormData["businessSize"],
      monthlyVolume: "" as ContactFormData["monthlyVolume"],
      teamSize: "" as ContactFormData["teamSize"],
      dataVolume: "" as ContactFormData["dataVolume"],
      timeline: "" as ContactFormData["timeline"],
      budget: "" as ContactFormData["budget"],
    },
  });

  // Fill test data based on selected case
  const fillTestData = (testCase: TestCaseKey) => {
    const caseData = testCases[testCase].data;
    
    // Contact Information
    setValue("fullName", caseData.fullName);
    setValue("email", caseData.email);
    setValue("phone", caseData.phone);
    setValue("company", caseData.company);
    setValue("website", caseData.website);
    setValue("socialLinks", caseData.socialLinks);
    
    // Business Information
    setValue("industry", caseData.industry, { shouldValidate: true });
    setValue("businessSize", caseData.businessSize, { shouldValidate: true });
    
    // Current State Assessment
    setValue("currentSystems", caseData.currentSystems);
    setValue("monthlyVolume", caseData.monthlyVolume, { shouldValidate: true });
    setValue("teamSize", caseData.teamSize, { shouldValidate: true });
    
    // Automation Goals
    setValue("automationGoals", caseData.automationGoals);
    setValue("specificProcesses", caseData.specificProcesses);
    
    // Project Ideas
    setValue("projectIdeas", caseData.projectIdeas);
    
    // Integration Requirements
    setValue("existingTools", caseData.existingTools);
    setValue("integrationNeeds", caseData.integrationNeeds);
    setValue("dataVolume", caseData.dataVolume, { shouldValidate: true });
    
    // Project Scope
    setValue("projectDescription", caseData.projectDescription);
    setValue("successMetrics", caseData.successMetrics);
    setValue("timeline", caseData.timeline, { shouldValidate: true });
    setValue("budget", caseData.budget, { shouldValidate: true });
    
    toast.success(`${testCases[testCase].name} test data loaded!`);
  };

  const { fields, append, remove } = useFieldArray({
    control,
    name: "projectIdeas",
  });

  const { fields: socialFields, append: appendSocial, remove: removeSocial } = useFieldArray({
    control,
    name: "socialLinks",
  });

  const selectedAutomationGoals = watch("automationGoals") || [];
  const selectedIntegrations = watch("integrationNeeds") || [];
  
  // Watch all select fields to make them controlled
  const selectedIndustry = watch("industry");
  const selectedBusinessSize = watch("businessSize");
  const selectedMonthlyVolume = watch("monthlyVolume");
  const selectedTeamSize = watch("teamSize");
  const selectedDataVolume = watch("dataVolume");
  const selectedTimeline = watch("timeline");
  const selectedBudget = watch("budget");

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit form');
      }
      
      // Store contact info for pre-filling booking form
      const bookingInfo = {
        name: data.fullName,
        email: data.email,
        phone: data.phone
      };
      
      sessionStorage.setItem('bookingContactInfo', JSON.stringify(bookingInfo));
      
      toast.success("Thank you! Redirecting to booking page...");
      
      // Redirect to booking page after a short delay
      setTimeout(() => {
        router.push('/booking');
      }, 1500);
      
    } catch (error) {
      toast.error("Something went wrong. Please try again or email us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card className="max-w-3xl mx-auto">
        <CardContent className="pt-6">
          <div className="text-center space-y-4 py-8">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <svg
                className="h-8 w-8 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold">Thank You!</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              We&apos;ve received your detailed information and will review it carefully. Our team will reach out within 1-2 business days with a preliminary assessment and next steps.
            </p>
            <Button
              variant="outline"
              onClick={() => setIsSubmitted(false)}
              className="mt-4"
            >
              Submit Another Inquiry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Get Started with Agentico</CardTitle>
            <CardDescription>
              Help us understand your needs so we can provide an accurate assessment and cost estimate.
            </CardDescription>
          </div>
          {isDev && (
            <Select onValueChange={(value) => fillTestData(value as TestCaseKey)}>
              <SelectTrigger className="w-[220px] ml-4 shrink-0">
                <SelectValue placeholder="🧪 Load Test Data" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(testCases).map(([key, { name }]) => (
                  <SelectItem key={key} value={key}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Contact Information */}
          <FieldSet>
            <FieldLegend>Contact Information</FieldLegend>
            <FieldGroup>
              <div className="grid md:grid-cols-2 gap-4">
                <Field data-invalid={!!errors.fullName}>
                  <FieldLabel htmlFor="fullName">Full Name *</FieldLabel>
                  <Input
                    id="fullName"
                    placeholder="John Smith"
                    aria-invalid={!!errors.fullName}
                    {...register("fullName")}
                  />
                  <FieldError>{errors.fullName?.message}</FieldError>
                </Field>

                <Field data-invalid={!!errors.email}>
                  <FieldLabel htmlFor="email">Email *</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@company.com"
                    aria-invalid={!!errors.email}
                    {...register("email")}
                  />
                  <FieldError>{errors.email?.message}</FieldError>
                </Field>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Field data-invalid={!!errors.phone}>
                  <FieldLabel htmlFor="phone">Phone Number *</FieldLabel>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+61 4XX XXX XXX"
                    aria-invalid={!!errors.phone}
                    {...register("phone")}
                  />
                  <FieldError>{errors.phone?.message}</FieldError>
                </Field>

                <Field data-invalid={!!errors.company}>
                  <FieldLabel htmlFor="company">Company Name *</FieldLabel>
                  <Input
                    id="company"
                    placeholder="Your Company Pty Ltd"
                    aria-invalid={!!errors.company}
                    {...register("company")}
                  />
                  <FieldError>{errors.company?.message}</FieldError>
                </Field>
              </div>

              <Field data-invalid={!!errors.website}>
                <FieldLabel htmlFor="website">Website URL (Optional)</FieldLabel>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://www.yourcompany.com"
                  aria-invalid={!!errors.website}
                  {...register("website")}
                />
                <FieldError>{errors.website?.message}</FieldError>
              </Field>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <FieldLabel>Social Media Links (Optional)</FieldLabel>
                    <FieldDescription className="mt-1">
                      Add your social media profiles to help us understand your online presence
                    </FieldDescription>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => appendSocial({ url: "" })}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Social Link
                  </Button>
                </div>

                {socialFields.map((field, index) => {
                  const currentUrl = watch(`socialLinks.${index}.url`);
                  const socialInfo = currentUrl ? detectSocialNetwork(currentUrl) : null;
                  const SocialIcon = socialInfo?.icon;

                  return (
                    <div key={field.id} className="flex gap-2 items-start">
                      <div className="flex-1">
                        <Field data-invalid={!!errors.socialLinks?.[index]?.url}>
                          <div className="flex gap-2">
                            <Input
                              id={`socialLinks.${index}.url`}
                              type="url"
                              placeholder="https://facebook.com/yourcompany"
                              aria-invalid={!!errors.socialLinks?.[index]?.url}
                              {...register(`socialLinks.${index}.url` as const)}
                            />
                            {socialInfo && SocialIcon && (
                              <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-md border min-w-[140px]">
                                <SocialIcon className="h-4 w-4 text-primary" />
                                <span className="text-sm text-muted-foreground">{socialInfo.name}</span>
                              </div>
                            )}
                          </div>
                          <FieldError>{errors.socialLinks?.[index]?.url?.message}</FieldError>
                        </Field>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSocial(index)}
                        className="mt-1"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </FieldGroup>
          </FieldSet>

          {/* Business Information */}
          <FieldSet>
            <FieldLegend>Business Information</FieldLegend>
            <FieldGroup>
              <div className="grid md:grid-cols-2 gap-4">
                <Field data-invalid={!!errors.industry}>
                  <FieldLabel htmlFor="industry">Industry *</FieldLabel>
                  <Select value={selectedIndustry} onValueChange={(value) => setValue("industry", value as ContactFormData["industry"])}>
                    <SelectTrigger id="industry" aria-invalid={!!errors.industry}>
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Trades & Construction</SelectLabel>
                        <SelectItem value="construction_trades">Construction & Building Trades</SelectItem>
                        <SelectItem value="electrical_plumbing">Electrical & Plumbing</SelectItem>
                        <SelectItem value="hvac">HVAC & Climate Control</SelectItem>
                        <SelectItem value="landscaping_gardening">Landscaping & Gardening</SelectItem>
                        <SelectItem value="painting_decorating">Painting & Decorating</SelectItem>
                        <SelectItem value="carpentry_joinery">Carpentry & Joinery</SelectItem>
                        <SelectItem value="roofing">Roofing & Guttering</SelectItem>
                        <SelectItem value="other_trades_construction">Other - Trades & Construction</SelectItem>
                      </SelectGroup>
                      
                      <SelectGroup>
                        <SelectLabel>Professional Services</SelectLabel>
                        <SelectItem value="legal_services">Legal Services</SelectItem>
                        <SelectItem value="accounting_bookkeeping">Accounting & Bookkeeping</SelectItem>
                        <SelectItem value="financial_advisory">Financial Advisory & Planning</SelectItem>
                        <SelectItem value="consulting">Business Consulting</SelectItem>
                        <SelectItem value="human_resources">Human Resources</SelectItem>
                        <SelectItem value="real_estate">Real Estate & Property Sales</SelectItem>
                        <SelectItem value="property_management">Property Management</SelectItem>
                        <SelectItem value="insurance">Insurance Services</SelectItem>
                        <SelectItem value="other_professional_services">Other - Professional Services</SelectItem>
                      </SelectGroup>
                      
                      <SelectGroup>
                        <SelectLabel>Healthcare & Wellness</SelectLabel>
                        <SelectItem value="healthcare_medical">Healthcare & Medical Services</SelectItem>
                        <SelectItem value="dental">Dental Services</SelectItem>
                        <SelectItem value="veterinary">Veterinary Services</SelectItem>
                        <SelectItem value="fitness_wellness">Fitness & Wellness</SelectItem>
                        <SelectItem value="beauty_salon">Beauty, Hair & Nail Salon</SelectItem>
                        <SelectItem value="other_healthcare_wellness">Other - Healthcare & Wellness</SelectItem>
                      </SelectGroup>
                      
                      <SelectGroup>
                        <SelectLabel>Retail & Hospitality</SelectLabel>
                        <SelectItem value="retail">Retail & Brick-and-Mortar</SelectItem>
                        <SelectItem value="ecommerce">E-commerce & Online Retail</SelectItem>
                        <SelectItem value="hospitality_hotels">Hospitality & Hotels</SelectItem>
                        <SelectItem value="restaurants_cafes">Restaurants & Cafes</SelectItem>
                        <SelectItem value="catering">Catering Services</SelectItem>
                        <SelectItem value="other_retail_hospitality">Other - Retail & Hospitality</SelectItem>
                      </SelectGroup>
                      
                      <SelectGroup>
                        <SelectLabel>Creative & Tech Services</SelectLabel>
                        <SelectItem value="event_planning">Event Planning & Management</SelectItem>
                        <SelectItem value="marketing_advertising">Marketing & Advertising</SelectItem>
                        <SelectItem value="it_services">IT Services & Support</SelectItem>
                        <SelectItem value="software_development">Software Development</SelectItem>
                        <SelectItem value="design_creative">Design & Creative Services</SelectItem>
                        <SelectItem value="photography_videography">Photography & Videography</SelectItem>
                        <SelectItem value="other_creative_tech">Other - Creative & Tech Services</SelectItem>
                      </SelectGroup>
                      
                      <SelectGroup>
                        <SelectLabel>Other Services</SelectLabel>
                        <SelectItem value="education_training">Education & Training</SelectItem>
                        <SelectItem value="childcare">Childcare & Early Learning</SelectItem>
                        <SelectItem value="cleaning_services">Cleaning Services</SelectItem>
                        <SelectItem value="logistics_transport">Logistics & Transport</SelectItem>
                        <SelectItem value="warehousing">Warehousing & Storage</SelectItem>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="wholesale_distribution">Wholesale & Distribution</SelectItem>
                        <SelectItem value="automotive_repair">Automotive Repair & Services</SelectItem>
                        <SelectItem value="security_services">Security Services</SelectItem>
                        <SelectItem value="recruitment_staffing">Recruitment & Staffing</SelectItem>
                        <SelectItem value="other_services">Other - Services</SelectItem>
                      </SelectGroup>
                      
                      <SelectGroup>
                        <SelectLabel>General</SelectLabel>
                        <SelectItem value="other">Other Industry (Not Listed)</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FieldError>{errors.industry?.message}</FieldError>
                </Field>

                <Field data-invalid={!!errors.businessSize}>
                  <FieldLabel htmlFor="businessSize">Total Employees *</FieldLabel>
                  <Select value={selectedBusinessSize} onValueChange={(value) => setValue("businessSize", value as ContactFormData["businessSize"])}>
                    <SelectTrigger id="businessSize" aria-invalid={!!errors.businessSize}>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-5">1-5 employees</SelectItem>
                      <SelectItem value="6-20">6-20 employees</SelectItem>
                      <SelectItem value="21-50">21-50 employees</SelectItem>
                      <SelectItem value="51-200">51-200 employees</SelectItem>
                      <SelectItem value="200+">200+ employees</SelectItem>
                    </SelectContent>
                  </Select>
                  <FieldError>{errors.businessSize?.message}</FieldError>
                </Field>
              </div>
            </FieldGroup>
          </FieldSet>

          {/* Current State Assessment */}
          <FieldSet>
            <FieldLegend>Current State Assessment</FieldLegend>
            <FieldGroup>
              <Field data-invalid={!!errors.currentSystems}>
                <FieldLabel htmlFor="currentSystems">
                  What systems/tools do you currently use? *
                </FieldLabel>
                <Textarea
                  id="currentSystems"
                  placeholder="e.g., Excel for quotes, Gmail for communication, paper-based job tracking..."
                  rows={3}
                  aria-invalid={!!errors.currentSystems}
                  {...register("currentSystems")}
                />
                <FieldDescription>
                  List software, apps, or manual processes you currently rely on
                </FieldDescription>
                <FieldError>{errors.currentSystems?.message}</FieldError>
              </Field>

              <div className="grid md:grid-cols-2 gap-4">
                <Field data-invalid={!!errors.monthlyVolume}>
                  <FieldLabel htmlFor="monthlyVolume">Monthly Transaction/Job Volume *</FieldLabel>
                  <Select value={selectedMonthlyVolume} onValueChange={(value) => setValue("monthlyVolume", value as ContactFormData["monthlyVolume"])}>
                    <SelectTrigger id="monthlyVolume" aria-invalid={!!errors.monthlyVolume}>
                      <SelectValue placeholder="Select volume" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-100">0-100 per month</SelectItem>
                      <SelectItem value="100-500">100-500 per month</SelectItem>
                      <SelectItem value="500-1000">500-1,000 per month</SelectItem>
                      <SelectItem value="1000-5000">1,000-5,000 per month</SelectItem>
                      <SelectItem value="5000+">5,000+ per month</SelectItem>
                    </SelectContent>
                  </Select>
                  <FieldDescription>
                    Jobs, quotes, invoices, or customer interactions
                  </FieldDescription>
                  <FieldError>{errors.monthlyVolume?.message}</FieldError>
                </Field>

                <Field data-invalid={!!errors.teamSize}>
                  <FieldLabel htmlFor="teamSize">Team Members Affected *</FieldLabel>
                  <Select value={selectedTeamSize} onValueChange={(value) => setValue("teamSize", value as ContactFormData["teamSize"])}>
                    <SelectTrigger id="teamSize" aria-invalid={!!errors.teamSize}>
                      <SelectValue placeholder="Select team size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-2">1-2 people</SelectItem>
                      <SelectItem value="3-5">3-5 people</SelectItem>
                      <SelectItem value="6-10">6-10 people</SelectItem>
                      <SelectItem value="11-20">11-20 people</SelectItem>
                      <SelectItem value="20+">20+ people</SelectItem>
                    </SelectContent>
                  </Select>
                  <FieldDescription>
                    How many people will use the solution?
                  </FieldDescription>
                  <FieldError>{errors.teamSize?.message}</FieldError>
                </Field>
              </div>
            </FieldGroup>
          </FieldSet>

          {/* Automation Needs */}
          <FieldSet>
            <FieldLegend>Automation Goals</FieldLegend>
            <FieldGroup>
              <Field data-invalid={!!errors.automationGoals}>
                <FieldLabel>What are your primary automation goals? * (Select all that apply)</FieldLabel>
                <div className="grid md:grid-cols-2 gap-3">
                  {automationGoalOptions.map((goal) => (
                    <Field key={goal.id} orientation="horizontal">
                      <Checkbox
                        id={goal.id}
                        checked={selectedAutomationGoals.includes(goal.id)}
                        onCheckedChange={(checked) => {
                          const current = selectedAutomationGoals;
                          if (checked) {
                            setValue("automationGoals", [...current, goal.id]);
                          } else {
                            setValue(
                              "automationGoals",
                              current.filter((id) => id !== goal.id)
                            );
                          }
                        }}
                      />
                      <FieldLabel
                        htmlFor={goal.id}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {goal.label}
                      </FieldLabel>
                    </Field>
                  ))}
                </div>
                <FieldError>{errors.automationGoals?.message}</FieldError>
              </Field>

              <Field data-invalid={!!errors.specificProcesses}>
                <FieldLabel htmlFor="specificProcesses">
                  Describe specific processes you want to automate *
                </FieldLabel>
                <Textarea
                  id="specificProcesses"
                  placeholder="e.g., When a customer emails a quote request, automatically extract details, generate a quote in our template, and send it back. Or: Automatically log job completion photos from field workers into our project folders..."
                  rows={4}
                  aria-invalid={!!errors.specificProcesses}
                  {...register("specificProcesses")}
                />
                <FieldDescription>
                  Be as specific as possible - this helps us estimate scope and cost accurately
                </FieldDescription>
                <FieldError>{errors.specificProcesses?.message}</FieldError>
              </Field>
            </FieldGroup>
          </FieldSet>

          {/* Integration Requirements */}
          <FieldSet>
            <FieldLegend>Integration Requirements</FieldLegend>
            <FieldGroup>
              <Field data-invalid={!!errors.existingTools}>
                <FieldLabel htmlFor="existingTools">
                  List your existing tools/software *
                </FieldLabel>
                <Textarea
                  id="existingTools"
                  placeholder="e.g., Xero for accounting, Tradify for job management, Gmail, Google Drive, QuickBooks..."
                  rows={3}
                  aria-invalid={!!errors.existingTools}
                  {...register("existingTools")}
                />
                <FieldDescription>
                  Include accounting, CRM, project management, communication tools, etc.
                </FieldDescription>
                <FieldError>{errors.existingTools?.message}</FieldError>
              </Field>

              <Field>
                <FieldLabel>Which systems need to integrate with the AI solution? (Select all that apply)</FieldLabel>
                <div className="grid md:grid-cols-2 gap-3">
                  {integrationOptions.map((integration) => (
                    <Field key={integration.id} orientation="horizontal">
                      <Checkbox
                        id={integration.id}
                        checked={selectedIntegrations.includes(integration.id)}
                        onCheckedChange={(checked) => {
                          const current = selectedIntegrations;
                          if (checked) {
                            setValue("integrationNeeds", [...current, integration.id]);
                          } else {
                            setValue(
                              "integrationNeeds",
                              current.filter((id) => id !== integration.id)
                            );
                          }
                        }}
                      />
                      <FieldLabel
                        htmlFor={integration.id}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {integration.label}
                      </FieldLabel>
                    </Field>
                  ))}
                </div>
              </Field>

              <Field data-invalid={!!errors.dataVolume}>
                <FieldLabel htmlFor="dataVolume">Data Volume to Process *</FieldLabel>
                <Select value={selectedDataVolume} onValueChange={(value) => setValue("dataVolume", value as ContactFormData["dataVolume"])}>
                  <SelectTrigger id="dataVolume" aria-invalid={!!errors.dataVolume}>
                    <SelectValue placeholder="Select data volume" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minimal">Minimal (Few documents/records per day)</SelectItem>
                    <SelectItem value="moderate">Moderate (10-50 documents/records per day)</SelectItem>
                    <SelectItem value="large">Large (50-200 documents/records per day)</SelectItem>
                    <SelectItem value="very_large">Very Large (200+ documents/records per day)</SelectItem>
                  </SelectContent>
                </Select>
                <FieldDescription>
                  Estimate how much data the AI will need to process
                </FieldDescription>
                <FieldError>{errors.dataVolume?.message}</FieldError>
              </Field>
            </FieldGroup>
          </FieldSet>

          {/* Project Scope */}
          <FieldSet>
            <FieldLegend>Project Scope & Success</FieldLegend>
            <FieldGroup>
              <Field data-invalid={!!errors.projectDescription}>
                <FieldLabel htmlFor="projectDescription">
                  Overall project description *
                </FieldLabel>
                <Textarea
                  id="projectDescription"
                  placeholder="Summarize the complete vision for this project and how it fits into your business..."
                  rows={4}
                  aria-invalid={!!errors.projectDescription}
                  {...register("projectDescription")}
                />
                <FieldError>{errors.projectDescription?.message}</FieldError>
              </Field>

              <Field data-invalid={!!errors.successMetrics}>
                <FieldLabel htmlFor="successMetrics">
                  How will you measure success? *
                </FieldLabel>
                <Textarea
                  id="successMetrics"
                  placeholder="e.g., Reduce quote turnaround from 2 days to 2 hours, save 10 hours/week of admin time, increase customer satisfaction..."
                  rows={3}
                  aria-invalid={!!errors.successMetrics}
                  {...register("successMetrics")}
                />
                <FieldDescription>
                  What specific outcomes or metrics matter most to you?
                </FieldDescription>
                <FieldError>{errors.successMetrics?.message}</FieldError>
              </Field>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <FieldLabel>Project Ideas (Optional)</FieldLabel>
                    <FieldDescription className="mt-1">
                      Add specific AI tools or automation ideas you&apos;ve considered
                    </FieldDescription>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ title: "", description: "", priority: "medium" })}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Idea
                  </Button>
                </div>

                {fields.length === 0 && (
                  <div className="text-center py-8 border-2 border-dashed rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Click &quot;Add Idea&quot; to include specific automation concepts.
                    </p>
                  </div>
                )}

                {fields.map((field, index) => (
                  <Card key={field.id} className="relative">
                    <CardContent className="pt-6">
                      <FieldGroup>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => remove(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>

                        <Field data-invalid={!!errors.projectIdeas?.[index]?.title}>
                          <FieldLabel htmlFor={`projectIdeas.${index}.title`}>
                            Idea Title
                          </FieldLabel>
                          <Input
                            id={`projectIdeas.${index}.title`}
                            placeholder="e.g., AI-powered quote generator"
                            aria-invalid={!!errors.projectIdeas?.[index]?.title}
                            {...register(`projectIdeas.${index}.title` as const)}
                          />
                          <FieldError>{errors.projectIdeas?.[index]?.title?.message}</FieldError>
                        </Field>

                        <Field data-invalid={!!errors.projectIdeas?.[index]?.description}>
                          <FieldLabel htmlFor={`projectIdeas.${index}.description`}>
                            Description
                          </FieldLabel>
                          <Textarea
                            id={`projectIdeas.${index}.description`}
                            placeholder="Describe what this idea would do and how it would help..."
                            rows={3}
                            aria-invalid={!!errors.projectIdeas?.[index]?.description}
                            {...register(`projectIdeas.${index}.description` as const)}
                          />
                          <FieldError>{errors.projectIdeas?.[index]?.description?.message}</FieldError>
                        </Field>

                        <Field data-invalid={!!errors.projectIdeas?.[index]?.priority}>
                          <FieldLabel htmlFor={`projectIdeas.${index}.priority`}>
                            Priority Level
                          </FieldLabel>
                          <Select
                            value={watch(`projectIdeas.${index}.priority`)}
                            onValueChange={(value) => setValue(`projectIdeas.${index}.priority` as const, value as "high" | "medium" | "low")}
                          >
                            <SelectTrigger id={`projectIdeas.${index}.priority`} aria-invalid={!!errors.projectIdeas?.[index]?.priority}>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="high">High - Critical to implement</SelectItem>
                              <SelectItem value="medium">Medium - Important but flexible</SelectItem>
                              <SelectItem value="low">Low - Nice to have</SelectItem>
                            </SelectContent>
                          </Select>
                          <FieldError>{errors.projectIdeas?.[index]?.priority?.message}</FieldError>
                        </Field>
                      </FieldGroup>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Field data-invalid={!!errors.timeline}>
                  <FieldLabel htmlFor="timeline">Timeline *</FieldLabel>
                  <Select value={selectedTimeline} onValueChange={(value) => setValue("timeline", value as ContactFormData["timeline"])}>
                    <SelectTrigger id="timeline" aria-invalid={!!errors.timeline}>
                      <SelectValue placeholder="When do you need this?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immediate (ASAP)</SelectItem>
                      <SelectItem value="1-3_months">1-3 months</SelectItem>
                      <SelectItem value="3-6_months">3-6 months</SelectItem>
                      <SelectItem value="6+_months">6+ months</SelectItem>
                    </SelectContent>
                  </Select>
                  <FieldError>{errors.timeline?.message}</FieldError>
                </Field>

                <Field data-invalid={!!errors.budget}>
                  <FieldLabel htmlFor="budget">Budget Range *</FieldLabel>
                  <Select value={selectedBudget} onValueChange={(value) => setValue("budget", value as ContactFormData["budget"])}>
                    <SelectTrigger id="budget" aria-invalid={!!errors.budget}>
                      <SelectValue placeholder="Select budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under_10k">Under $10,000</SelectItem>
                      <SelectItem value="10k-25k">$10,000 - $25,000</SelectItem>
                      <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                      <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                      <SelectItem value="100k+">$100,000+</SelectItem>
                      <SelectItem value="not_sure">Not sure yet</SelectItem>
                    </SelectContent>
                  </Select>
                  <FieldError>{errors.budget?.message}</FieldError>
                </Field>
              </div>
            </FieldGroup>
          </FieldSet>

          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit"
            )}
          </Button>
          
          <p className="text-xs text-center text-muted-foreground">
            We&apos;ll review your submission and provide a preliminary assessment within 1-2 business days
          </p>
        </form>
      </CardContent>
    </Card>
  );
}

