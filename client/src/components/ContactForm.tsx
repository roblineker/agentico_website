import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Plus, X } from "lucide-react";

const contactFormSchema = z.object({
  // Contact Information
  fullName: z.string().min(2, "Please enter your full name (at least 2 characters)"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  company: z.string().min(2, "Please enter your company name"),
  
  // Business Information
  industry: z.enum(["trades", "professional_services", "other"], {
    message: "Please select your industry",
  }),
  businessSize: z.enum(["1-5", "6-20", "21-50", "51-200", "200+"], {
    message: "Please select your business size",
  }),
  
  // Current State Assessment
  currentSystems: z.string().min(10, "Please describe your current systems (at least 10 characters)"),
  monthlyVolume: z.enum(["0-100", "100-500", "500-1000", "1000-5000", "5000+"], {
    message: "Please select your monthly volume",
  }),
  teamSize: z.enum(["1-2", "3-5", "6-10", "11-20", "20+"], {
    message: "Please select team size",
  }),
  
  // Automation Needs
  automationGoals: z.array(z.string()).min(1, "Please select at least one automation goal"),
  specificProcesses: z.string().min(20, "Please describe specific processes to automate (at least 20 characters)"),
  projectIdeas: z.array(z.object({
    title: z.string().min(3, "Please enter an idea title (at least 3 characters)"),
    description: z.string().min(10, "Please enter a description (at least 10 characters)"),
    priority: z.enum(["high", "medium", "low"], {
      message: "Please select a priority level",
    }),
  })).optional(),
  
  // Integration Requirements
  existingTools: z.string().min(5, "Please list your existing tools/software (at least 5 characters)"),
  integrationNeeds: z.array(z.string()),
  dataVolume: z.enum(["minimal", "moderate", "large", "very_large"], {
    message: "Please select data volume",
  }),
  
  // Project Scope
  projectDescription: z.string().min(30, "Please describe your project (at least 30 characters)"),
  successMetrics: z.string().min(10, "Please describe how you'll measure success (at least 10 characters)"),
  timeline: z.enum(["immediate", "1-3_months", "3-6_months", "6+_months"], {
    message: "Please select a timeline",
  }),
  budget: z.enum(["under_10k", "10k-25k", "25k-50k", "50k-100k", "100k+", "not_sure"], {
    message: "Please select a budget range",
  }),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

const automationGoalOptions = [
  { id: "reduce_manual_work", label: "Reduce manual data entry and paperwork" },
  { id: "improve_response_time", label: "Improve customer response times" },
  { id: "automate_reporting", label: "Automate reporting and analytics" },
  { id: "document_processing", label: "Automate document processing" },
  { id: "workflow_automation", label: "Streamline internal workflows" },
  { id: "customer_service", label: "Enhance customer service with AI" },
];

const integrationOptions = [
  { id: "crm", label: "CRM System" },
  { id: "accounting", label: "Accounting Software" },
  { id: "project_management", label: "Project Management Tools" },
  { id: "communication", label: "Email/Communication Platforms" },
  { id: "document_storage", label: "Document Storage (Google Drive, Dropbox, etc.)" },
  { id: "custom_software", label: "Custom/Legacy Software" },
];

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors, touchedFields },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    mode: "onTouched",
    defaultValues: {
      automationGoals: [],
      integrationNeeds: [],
      projectIdeas: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "projectIdeas",
  });

  const selectedAutomationGoals = watch("automationGoals") || [];
  const selectedIntegrations = watch("integrationNeeds") || [];

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      // Simulate API call - replace with actual endpoint
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      console.log("Detailed form submission:", data);
      
      // In production, send to your backend or email service
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // });
      
      setIsSubmitted(true);
      toast.success("Thank you! We'll review your information and be in touch soon.");
    } catch (error) {
      toast.error("Something went wrong. Please try again or email us directly.");
      console.error("Form submission error:", error);
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
              We've received your detailed information and will review it carefully. Our team will reach out within 1-2 business days with a preliminary assessment and next steps.
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
        <CardTitle>Get Started with Agentico</CardTitle>
        <CardDescription>
          Help us understand your needs so we can provide an accurate assessment and cost estimate.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Contact Information</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  placeholder="John Smith"
                  {...register("fullName")}
                />
                {errors.fullName && (
                  <p className="text-sm text-destructive">{errors.fullName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@company.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+61 4XX XXX XXX"
                  {...register("phone")}
                />
                {errors.phone && (
                  <p className="text-sm text-destructive">{errors.phone.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company Name *</Label>
                <Input
                  id="company"
                  placeholder="Your Company Pty Ltd"
                  {...register("company")}
                />
                {errors.company && (
                  <p className="text-sm text-destructive">{errors.company.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Business Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Business Information</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="industry">Industry *</Label>
                <Select onValueChange={(value) => setValue("industry", value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trades">Trades (Builder, Plumber, Electrician)</SelectItem>
                    <SelectItem value="professional_services">Professional Services (Law, HR, Accounting)</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.industry && (
                  <p className="text-sm text-destructive">{errors.industry.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessSize">Total Employees *</Label>
                <Select onValueChange={(value) => setValue("businessSize", value as any)}>
                  <SelectTrigger>
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
                {errors.businessSize && (
                  <p className="text-sm text-destructive">{errors.businessSize.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Current State Assessment */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Current State Assessment</h3>
            
            <div className="space-y-2">
              <Label htmlFor="currentSystems">
                What systems/tools do you currently use? *
              </Label>
              <Textarea
                id="currentSystems"
                placeholder="e.g., Excel for quotes, Gmail for communication, paper-based job tracking..."
                rows={3}
                {...register("currentSystems")}
              />
              <p className="text-xs text-muted-foreground">
                List software, apps, or manual processes you currently rely on
              </p>
              {errors.currentSystems && (
                <p className="text-sm text-destructive">{errors.currentSystems.message}</p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="monthlyVolume">Monthly Transaction/Job Volume *</Label>
                <Select onValueChange={(value) => setValue("monthlyVolume", value as any)}>
                  <SelectTrigger>
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
                <p className="text-xs text-muted-foreground">
                  Jobs, quotes, invoices, or customer interactions
                </p>
                {errors.monthlyVolume && (
                  <p className="text-sm text-destructive">{errors.monthlyVolume.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="teamSize">Team Members Affected *</Label>
                <Select onValueChange={(value) => setValue("teamSize", value as any)}>
                  <SelectTrigger>
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
                <p className="text-xs text-muted-foreground">
                  How many people will use the solution?
                </p>
                {errors.teamSize && (
                  <p className="text-sm text-destructive">{errors.teamSize.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Automation Needs */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Automation Goals</h3>
            
            <div className="space-y-2">
              <Label>What are your primary automation goals? * (Select all that apply)</Label>
              <div className="grid md:grid-cols-2 gap-3">
                {automationGoalOptions.map((goal) => (
                  <div key={goal.id} className="flex items-center space-x-2">
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
                    <Label
                      htmlFor={goal.id}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {goal.label}
                    </Label>
                  </div>
                ))}
              </div>
              {errors.automationGoals && (
                <p className="text-sm text-destructive">{errors.automationGoals.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="specificProcesses">
                Describe specific processes you want to automate *
              </Label>
              <Textarea
                id="specificProcesses"
                placeholder="e.g., When a customer emails a quote request, automatically extract details, generate a quote in our template, and send it back. Or: Automatically log job completion photos from field workers into our project folders..."
                rows={4}
                {...register("specificProcesses")}
              />
              <p className="text-xs text-muted-foreground">
                Be as specific as possible - this helps us estimate scope and cost accurately
              </p>
              {errors.specificProcesses && (
                <p className="text-sm text-destructive">{errors.specificProcesses.message}</p>
              )}
            </div>

          </div>

          {/* Integration Requirements */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Integration Requirements</h3>
            
            <div className="space-y-2">
              <Label htmlFor="existingTools">
                List your existing tools/software *
              </Label>
              <Textarea
                id="existingTools"
                placeholder="e.g., Xero for accounting, Tradify for job management, Gmail, Google Drive, QuickBooks..."
                rows={3}
                {...register("existingTools")}
              />
              <p className="text-xs text-muted-foreground">
                Include accounting, CRM, project management, communication tools, etc.
              </p>
              {errors.existingTools && (
                <p className="text-sm text-destructive">{errors.existingTools.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Which systems need to integrate with the AI solution? (Select all that apply)</Label>
              <div className="grid md:grid-cols-2 gap-3">
                {integrationOptions.map((integration) => (
                  <div key={integration.id} className="flex items-center space-x-2">
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
                    <Label
                      htmlFor={integration.id}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {integration.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataVolume">Data Volume to Process *</Label>
              <Select onValueChange={(value) => setValue("dataVolume", value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select data volume" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minimal">Minimal (Few documents/records per day)</SelectItem>
                  <SelectItem value="moderate">Moderate (10-50 documents/records per day)</SelectItem>
                  <SelectItem value="large">Large (50-200 documents/records per day)</SelectItem>
                  <SelectItem value="very_large">Very Large (200+ documents/records per day)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Estimate how much data the AI will need to process
              </p>
              {errors.dataVolume && (
                <p className="text-sm text-destructive">{errors.dataVolume.message}</p>
              )}
            </div>
          </div>

          {/* Project Scope */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Project Scope & Success</h3>
            
            <div className="space-y-2">
              <Label htmlFor="projectDescription">
                Overall project description *
              </Label>
              <Textarea
                id="projectDescription"
                placeholder="Summarize the complete vision for this project and how it fits into your business..."
                rows={4}
                {...register("projectDescription")}
              />
              {errors.projectDescription && (
                <p className="text-sm text-destructive">{errors.projectDescription.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="successMetrics">
                How will you measure success? *
              </Label>
              <Textarea
                id="successMetrics"
                placeholder="e.g., Reduce quote turnaround from 2 days to 2 hours, save 10 hours/week of admin time, increase customer satisfaction..."
                rows={3}
                {...register("successMetrics")}
              />
              <p className="text-xs text-muted-foreground">
                What specific outcomes or metrics matter most to you?
              </p>
              {errors.successMetrics && (
                <p className="text-sm text-destructive">{errors.successMetrics.message}</p>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Project Ideas (Optional)</Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Add specific AI tools or automation ideas you've considered
                  </p>
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
                    No project ideas added yet. Click "Add Idea" to include specific automation concepts.
                  </p>
                </div>
              )}

              {fields.map((field, index) => (
                <Card key={field.id} className="relative">
                  <CardContent className="pt-6 space-y-4">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => remove(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>

                    <div className="space-y-2">
                      <Label htmlFor={`projectIdeas.${index}.title`}>
                        Idea Title
                      </Label>
                      <Input
                        id={`projectIdeas.${index}.title`}
                        placeholder="e.g., AI-powered quote generator"
                        {...register(`projectIdeas.${index}.title` as const)}
                      />
                      {errors.projectIdeas?.[index]?.title && (
                        <p className="text-sm text-destructive">
                          {errors.projectIdeas[index]?.title?.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`projectIdeas.${index}.description`}>
                        Description
                      </Label>
                      <Textarea
                        id={`projectIdeas.${index}.description`}
                        placeholder="Describe what this idea would do and how it would help..."
                        rows={3}
                        {...register(`projectIdeas.${index}.description` as const)}
                      />
                      {errors.projectIdeas?.[index]?.description && (
                        <p className="text-sm text-destructive">
                          {errors.projectIdeas[index]?.description?.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`projectIdeas.${index}.priority`}>
                        Priority Level
                      </Label>
                      <Select
                        value={watch(`projectIdeas.${index}.priority`)}
                        onValueChange={(value) => setValue(`projectIdeas.${index}.priority` as const, value as any)}
                      >
                        <SelectTrigger id={`projectIdeas.${index}.priority`}>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">High - Critical to implement</SelectItem>
                          <SelectItem value="medium">Medium - Important but flexible</SelectItem>
                          <SelectItem value="low">Low - Nice to have</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.projectIdeas?.[index]?.priority && (
                        <p className="text-sm text-destructive">
                          {errors.projectIdeas[index]?.priority?.message}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="timeline">Timeline *</Label>
                <Select onValueChange={(value) => setValue("timeline", value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="When do you need this?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immediate (ASAP)</SelectItem>
                    <SelectItem value="1-3_months">1-3 months</SelectItem>
                    <SelectItem value="3-6_months">3-6 months</SelectItem>
                    <SelectItem value="6+_months">6+ months</SelectItem>
                  </SelectContent>
                </Select>
                {errors.timeline && (
                  <p className="text-sm text-destructive">{errors.timeline.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">Budget Range *</Label>
                <Select onValueChange={(value) => setValue("budget", value as any)}>
                  <SelectTrigger>
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
                {errors.budget && (
                  <p className="text-sm text-destructive">{errors.budget.message}</p>
                )}
              </div>
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Detailed Inquiry"
            )}
          </Button>
          
          <p className="text-xs text-center text-muted-foreground">
            We'll review your submission and provide a preliminary assessment within 1-2 business days
          </p>
        </form>
      </CardContent>
    </Card>
  );
}

