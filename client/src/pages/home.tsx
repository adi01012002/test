import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import emailjs from "emailjs-com";
import {
  Star,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  User,
  Building2,
  Globe,
  HelpCircle,
  Calculator,
  Crown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { MobileMenu } from "@/components/ui/mobile-menu";
// import { contactFormSchema, type ContactFormData } from "@shared/schema";

const contactFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters."),
  lastName: z.string().min(2, "Last name must be at least 2 characters."),
  email: z.string().email("Enter a valid email address."),
  phone: z.string().optional(),
  serviceType: z.string().min(1, "Please select a service."),
  message: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactFormSchema>;
// EmailJS Configuration (replace with your actual values)
const SERVICE_ID = "service_qp66gnb"; // EmailJS Service ID
const TEMPLATE_OWNER = "template_zx6k3vy"; // Owner ke liye template ID
const TEMPLATE_USER = "template_xn0a7zi"; // User auto-reply template ID
const PUBLIC_KEY = "qd6oN02NEwKgD56Iz"; // EmailJS Public Key

const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#services", label: "Services" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#contact", label: "Contact" },
];

const services = [
  {
    id: "individual-itr",
    icon: User,
    title: "Individual ITR Filing",
    description:
      "Hassle-free income tax return filing for salaried individuals, freelancers, and self-employed professionals.",
    features: [
      "All ITR Forms (ITR-1 to ITR-7)",
      "Tax Planning & Optimization",
      "Expert Review & Validation",
    ],
    price: "₹999",
    priceNote: "onwards",
    bgColor: "bg-primary/10",
  },
  {
    id: "company-itr",
    icon: Building2,
    title: "Company ITR Filing",
    description:
      "Complete corporate tax filing services for private limited companies, partnerships, and LLPs.",
    features: [
      "Corporate ITR Filing",
      "TDS/TCS Return Filing",
      "Compliance Management",
    ],
    price: "₹4,999",
    priceNote: "onwards",
    bgColor: "bg-secondary/10",
  },
  {
    id: "nri-services",
    icon: Globe,
    title: "Foreign Client Services",
    description:
      "Specialized tax services for NRIs, PIOs, and foreign companies with Indian income sources.",
    features: ["NRI ITR Filing", "DTAA Benefits", "Tax Residency Certificate"],
    price: "₹2,499",
    priceNote: "onwards",
    bgColor: "bg-accent/10 border-2 border-primary/20",
  },
  {
    id: "tax-consultation",
    icon: HelpCircle,
    title: "Tax Consultation",
    description:
      "Expert guidance on tax planning, investment strategies, and compliance requirements.",
    features: [
      "Tax Saving Strategies",
      "Investment Planning",
      "Notice Handling",
    ],
    price: "₹1,499",
    priceNote: "per session",
    bgColor: "bg-success/10",
  },
  {
    id: "accounting-support",
    icon: Calculator,
    title: "Accounting Support",
    description:
      "Complete bookkeeping and accounting services for small businesses and startups.",
    features: [
      "Books of Accounts",
      "Financial Statements",
      "GST Registration & Filing",
    ],
    price: "₹3,999",
    priceNote: "per month",
    bgColor: "bg-primary/10",
  },
  {
    id: "premium-package",
    icon: Crown,
    title: "Premium Package",
    description:
      "Complete end-to-end tax and accounting solution with priority support and expert consultation.",
    features: [
      "All Services Included",
      "Priority Support",
      "Unlimited Consultations",
    ],
    price: "₹9,999",
    priceNote: "per year",
    bgColor: "bg-gradient-to-br from-primary to-secondary text-white",
    isPremium: true,
  },
];

const testimonials = [
  {
    name: "Rajesh Kumar",
    role: "Software Engineer, Bangalore",
    rating: 5,
    comment:
      "Excellent service! They handled my complex ITR filing with multiple income sources perfectly. The team is knowledgeable and very responsive to queries.",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&w=100&h=100&fit=crop&crop=face",
  },
  {
    name: "Priya Sharma",
    role: "NRI, USA",
    rating: 5,
    comment:
      "As an NRI, filing ITR was always confusing for me. TaxPro Services made it incredibly simple and saved me significant tax through proper planning.",
    avatar:
      "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&w=100&h=100&fit=crop&crop=face",
  },
  {
    name: "Anita Desai",
    role: "Business Owner, Mumbai",
    rating: 5,
    comment:
      "Professional and efficient service for our company's ITR filing. They handle all compliance requirements and keep us updated throughout the process.",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&w=100&h=100&fit=crop&crop=face",
  },
];

export default function Home() {
  const { toast } = useToast();
  const [isNavScrolled, setIsNavScrolled] = useState(false);

  // Handle scroll effects
  useState(() => {
    const handleScroll = () => {
      setIsNavScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  });

  const scrollToSection = (href: string) => {
    const targetId = href.replace("#", "");
    const element = document.getElementById(targetId);
    if (element) {
      const offset = 80;
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      });
    }
  };

  // Contact form
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      serviceType: "",
      message: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);

    try {
      // Map service types for display
      const serviceTypeMap: Record<string, string> = {
        "individual-itr": "Individual ITR Filing",
        "company-itr": "Company ITR Filing",
        "nri-services": "NRI/Foreign Client Services",
        "tax-consultation": "Tax Consultation",
        "accounting-support": "Accounting Support",
        "premium-package": "Premium Package",
      };

      const serviceTypeName =
        serviceTypeMap[data.serviceType] || data.serviceType;

      // Prepare data for EmailJS template
      const Ownertemplate = {
        user_name: `${data.firstName} ${data.lastName}`,
        user_email: data.email,
        phone: data.phone || "Not provided",
        service: serviceTypeName,
        message: data.message || "No additional message provided",
      };
      const Usertemplate = {
        user_name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        service: serviceTypeName,
      };
      // Send email to owner
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_OWNER,
        Ownertemplate,
        PUBLIC_KEY,
      );

      // Send auto-reply to user
      await emailjs.send(SERVICE_ID, TEMPLATE_USER, Usertemplate, PUBLIC_KEY);

      toast({
        title: "Message Sent!",
        description:
          "Thank you for your inquiry! We will get back to you within 24 hours.",
      });
      form.reset();
    } catch (error) {
      console.error("Email sending failed:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Fixed Navigation */}
      <nav
        className={`fixed top-0 w-full z-50 glass-effect border-b border-border transition-all duration-200 ${isNavScrolled ? "shadow-lg" : ""}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">
                    T
                  </span>
                </div>
                <span className="font-heading font-bold text-xl text-primary">
                  TaxPro Services
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                {navLinks.map((link) => (
                  <button
                    key={link.href}
                    onClick={() => scrollToSection(link.href)}
                    className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
                    data-testid={`link-${link.label.toLowerCase()}`}
                  >
                    {link.label}
                  </button>
                ))}
                <button
                  onClick={() => scrollToSection("#contact")}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors duration-200"
                  data-testid="button-get-started"
                >
                  Get Started
                </button>
              </div>
            </div>

            {/* Mobile menu */}
            <MobileMenu
              links={navLinks}
              ctaHref="#contact"
              ctaLabel="Get Started"
            />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="pt-16 min-h-screen bg-gradient-to-br from-background via-muted to-background"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold leading-tight mb-6">
                <span className="gradient-text">Professional ITR Filing</span>
                <br />
                Made Simple & Secure
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Expert tax consultation and ITR filing services for individuals
                and companies. Trusted by 10,000+ clients across India and
                abroad.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  size="lg"
                  onClick={() => scrollToSection("#contact")}
                  className="text-lg font-semibold transform hover:scale-105 shadow-lg"
                  data-testid="button-start-itr-filing"
                >
                  Start Your ITR Filing
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => scrollToSection("#services")}
                  className="text-lg font-semibold hover:border-primary hover:text-primary"
                  data-testid="button-view-services"
                >
                  View Services
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="mt-12 pt-8 border-t border-border">
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div>
                    <div
                      className="text-2xl font-bold text-primary"
                      data-testid="stat-clients"
                    >
                      10,000+
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Happy Clients
                    </div>
                  </div>
                  <div>
                    <div
                      className="text-2xl font-bold text-primary"
                      data-testid="stat-experience"
                    >
                      5+ Years
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Experience
                    </div>
                  </div>
                  <div>
                    <div
                      className="text-2xl font-bold text-primary"
                      data-testid="stat-accuracy"
                    >
                      100%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Accuracy
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
                alt="Professional tax consultant working with documents"
                className="rounded-2xl shadow-2xl w-full h-auto"
                data-testid="img-hero"
              />

              {/* Floating elements */}
              <div className="absolute -top-4 -left-4 bg-secondary text-secondary-foreground px-6 py-3 rounded-lg shadow-lg font-semibold">
                ✓ Verified CA Experts
              </div>
              <div className="absolute -bottom-4 -right-4 bg-success text-success-foreground px-6 py-3 rounded-lg shadow-lg font-semibold">
                ✓ 24/7 Support
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-foreground mb-4">
              Our Professional Services
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive tax solutions tailored for individuals, businesses,
              and international clients
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => {
              const IconComponent = service.icon;
              return (
                <Card
                  key={service.id}
                  className={`service-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${service.isPremium ? "transform hover:scale-105" : ""}`}
                  data-testid={`card-service-${service.id}`}
                >
                  <CardContent
                    className={`p-8 ${service.isPremium ? "bg-gradient-to-br from-primary to-secondary text-white" : ""}`}
                  >
                    <div
                      className={`w-16 h-16 ${service.isPremium ? "bg-white/20" : service.bgColor} rounded-lg flex items-center justify-center mb-6`}
                    >
                      <IconComponent
                        className={`w-8 h-8 ${service.isPremium ? "text-white" : service.id === "company-itr" ? "text-secondary" : service.id === "tax-consultation" ? "text-success" : "text-primary"}`}
                      />
                    </div>
                    <h3
                      className={`text-xl font-heading font-semibold mb-4 ${service.isPremium ? "text-white" : "text-card-foreground"}`}
                    >
                      {service.title}
                    </h3>
                    <p
                      className={`mb-6 leading-relaxed ${service.isPremium ? "text-white/90" : "text-muted-foreground"}`}
                    >
                      {service.description}
                    </p>
                    <ul className="space-y-2 mb-6">
                      {service.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <CheckCircle
                            className={`w-4 h-4 mr-2 ${service.isPremium ? "text-white" : "text-success"}`}
                          />
                          <span
                            className={
                              service.isPremium
                                ? "text-white"
                                : "text-card-foreground"
                            }
                          >
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <div
                      className={`text-2xl font-bold mb-4 ${service.isPremium ? "text-white" : "text-primary"}`}
                    >
                      {service.price}{" "}
                      <span
                        className={`text-sm font-normal ${service.isPremium ? "text-white/70" : "text-muted-foreground"}`}
                      >
                        {service.priceNote}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-foreground mb-4">
              What Our Clients Say
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Trusted by thousands of satisfied clients for reliable tax
              services
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="shadow-lg border border-border"
                data-testid={`card-testimonial-${index + 1}`}
              >
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="flex text-yellow-400">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p
                    className="text-card-foreground mb-6 leading-relaxed italic"
                    data-testid={`text-testimonial-comment-${index + 1}`}
                  >
                    "{testimonial.comment}"
                  </p>
                  <div className="flex items-center">
                    <img
                      src={testimonial.avatar}
                      alt={`${testimonial.name} testimonial`}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                      data-testid={`img-testimonial-${index + 1}`}
                    />
                    <div>
                      <div
                        className="font-semibold text-card-foreground"
                        data-testid={`text-testimonial-name-${index + 1}`}
                      >
                        {testimonial.name}
                      </div>
                      <div
                        className="text-sm text-muted-foreground"
                        data-testid={`text-testimonial-role-${index + 1}`}
                      >
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="py-24 bg-gradient-to-br from-muted/30 to-background"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-foreground mb-4">
              Get Started Today
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Ready to simplify your tax filing? Contact our experts for a free
              consultation
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Contact Information */}
            <div className="space-y-8">
              <Card className="shadow-lg border border-border">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-heading font-semibold text-card-foreground mb-6">
                    Contact Information
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                        <Phone className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold text-card-foreground">
                          Phone
                        </div>
                        <div
                          className="text-muted-foreground"
                          data-testid="text-contact-phone"
                        >
                          +91 99999 99999
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mr-4">
                        <Mail className="w-6 h-6 text-secondary" />
                      </div>
                      <div>
                        <div className="font-semibold text-card-foreground">
                          Email
                        </div>
                        <div
                          className="text-muted-foreground"
                          data-testid="text-contact-email"
                        >
                          info@taxpro.com
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-accent/10 border-2 border-primary/20 rounded-lg flex items-center justify-center mr-4">
                        <MapPin className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold text-card-foreground">
                          Office
                        </div>
                        <div
                          className="text-muted-foreground"
                          data-testid="text-contact-office"
                        >
                          Mumbai, Maharashtra, India
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mr-4">
                        <Clock className="w-6 h-6 text-success" />
                      </div>
                      <div>
                        <div className="font-semibold text-card-foreground">
                          Hours
                        </div>
                        <div className="text-muted-foreground">
                          Mon-Fri: 9AM-6PM IST
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Why Choose Us */}
              <Card className="shadow-lg border border-border">
                <CardContent className="p-8">
                  <h3 className="text-xl font-heading font-semibold text-card-foreground mb-6">
                    Why Choose TaxPro Services?
                  </h3>
                  <ul className="space-y-3">
                    {[
                      "Certified CA & Tax Experts",
                      "100% Data Security & Privacy",
                      "Timely Filing & Support",
                      "Affordable & Transparent Pricing",
                    ].map((benefit, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-success mr-3" />
                        <span className="text-card-foreground">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <Card className="shadow-lg border border-border">
              <CardContent className="p-8">
                <h3 className="text-2xl font-heading font-semibold text-card-foreground mb-6">
                  Send Us a Message
                </h3>

                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        {...form.register("firstName")}
                        data-testid="input-first-name"
                        className="mt-2"
                      />
                      {form.formState.errors.firstName && (
                        <p className="text-red-500 text-sm mt-1">
                          {form.formState.errors.firstName.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        {...form.register("lastName")}
                        data-testid="input-last-name"
                        className="mt-2"
                      />
                      {form.formState.errors.lastName && (
                        <p className="text-red-500 text-sm mt-1">
                          {form.formState.errors.lastName.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      {...form.register("email")}
                      data-testid="input-email"
                      className="mt-2"
                    />
                    {form.formState.errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {form.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      {...form.register("phone")}
                      data-testid="input-phone"
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="serviceType">Service Required *</Label>
                    <Select
                      onValueChange={(value) =>
                        form.setValue("serviceType", value)
                      }
                      value={form.watch("serviceType")}
                    >
                      <SelectTrigger
                        className="mt-2"
                        data-testid="select-service-type"
                      >
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="individual-itr">
                          Individual ITR Filing
                        </SelectItem>
                        <SelectItem value="company-itr">
                          Company ITR Filing
                        </SelectItem>
                        <SelectItem value="nri-services">
                          NRI/Foreign Client Services
                        </SelectItem>
                        <SelectItem value="tax-consultation">
                          Tax Consultation
                        </SelectItem>
                        <SelectItem value="accounting-support">
                          Accounting Support
                        </SelectItem>
                        <SelectItem value="premium-package">
                          Premium Package
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.serviceType && (
                      <p className="text-red-500 text-sm mt-1">
                        {form.formState.errors.serviceType.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      {...form.register("message")}
                      placeholder="Tell us about your specific requirements..."
                      rows={4}
                      data-testid="textarea-message"
                      className="mt-2 resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full font-semibold transform hover:scale-105 shadow-lg"
                    disabled={isSubmitting}
                    data-testid="button-send-message"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>

                  <p className="text-sm text-muted-foreground text-center">
                    By submitting this form, you agree to our privacy policy and
                    terms of service.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-background rounded-lg flex items-center justify-center">
                  <span className="text-foreground font-bold text-lg">T</span>
                </div>
                <span className="font-heading font-bold text-xl">
                  TaxPro Services
                </span>
              </div>
              <p className="text-background/80 mb-6 leading-relaxed">
                Professional ITR filing and tax consultation services for
                individuals and businesses across India and abroad.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-heading font-semibold text-lg mb-6">
                Quick Links
              </h4>
              <ul className="space-y-3">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <button
                      onClick={() => scrollToSection(link.href)}
                      className="text-background/80 hover:text-background transition-colors text-left"
                      data-testid={`link-footer-${link.label.toLowerCase()}`}
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-heading font-semibold text-lg mb-6">
                Our Services
              </h4>
              <ul className="space-y-3">
                <li>
                  <span className="text-background/80">
                    Individual ITR Filing
                  </span>
                </li>
                <li>
                  <span className="text-background/80">Company ITR Filing</span>
                </li>
                <li>
                  <span className="text-background/80">NRI Services</span>
                </li>
                <li>
                  <span className="text-background/80">Tax Consultation</span>
                </li>
                <li>
                  <span className="text-background/80">Accounting Support</span>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-heading font-semibold text-lg mb-6">
                Get in Touch
              </h4>
              <div className="space-y-3">
                <p className="text-background/80 flex items-center">
                  <Phone className="w-5 h-5 mr-2" />
                  <span data-testid="text-footer-phone">+91 99999 99999</span>
                </p>
                <p className="text-background/80 flex items-center">
                  <Mail className="w-5 h-5 mr-2" />
                  <span data-testid="text-footer-email">info@taxpro.com</span>
                </p>
                <p className="text-background/80 flex items-start">
                  <MapPin className="w-5 h-5 mr-2 mt-1" />
                  <span data-testid="text-footer-address">
                    Mumbai, Maharashtra, India
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-background/20 mt-12 pt-8 text-center">
            <p className="text-background/60">
              &copy; 2024 TaxPro Services. All rights reserved. | Privacy Policy
              | Terms of Service
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
