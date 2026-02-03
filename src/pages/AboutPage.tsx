import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Heart, Target, Shield, Users, ArrowRight, CheckCircle2, HelpCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const values = [
  {
    icon: Target,
    title: "Transparency",
    description: "We believe everyone deserves access to fair pricing information.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Users,
    title: "Community",
    description: "Built by Nigerians, for Nigerians. Every contribution matters.",
    color: "text-info",
    bg: "bg-info/10",
  },
  {
    icon: Shield,
    title: "Accuracy",
    description: "We use smart algorithms to detect and filter out fake prices.",
    color: "text-success",
    bg: "bg-success/10",
  },
  {
    icon: Heart,
    title: "Empowerment",
    description: "Knowledge is power. Know the price, pay the right price.",
    color: "text-highlight",
    bg: "bg-highlight/10",
  },
];

const steps = [
  {
    step: "01",
    title: "Submit",
    description: "Share prices you've seen or paid for goods and services",
    icon: "📝",
  },
  {
    step: "02",
    title: "Aggregate",
    description: "We calculate averages and detect outliers automatically",
    icon: "🧮",
  },
  {
    step: "03",
    title: "Verify",
    description: "Check prices before you buy and pay the right amount",
    icon: "✅",
  },
];

const faqs = [
  {
    question: "How does Local Price Checker work?",
    answer: "Users submit prices they've seen or paid for various goods and services. We aggregate this data to show you the average, minimum, and maximum prices for items in your area.",
  },
  {
    question: "Are the prices accurate?",
    answer: "We use statistical methods like median calculations and outlier detection to ensure the prices shown are representative of real market conditions. The more submissions we receive, the more accurate our data becomes.",
  },
  {
    question: "How can I contribute?",
    answer: "Simply visit the Submit page and share a price you've recently seen or paid. It's completely anonymous and takes less than 30 seconds.",
  },
  {
    question: "Is my data private?",
    answer: "Yes! All submissions are anonymous. We don't collect any personal information. We only store a hash of your IP address to prevent spam.",
  },
  {
    question: "Which locations are supported?",
    answer: "We currently focus on major Nigerian cities and markets. We're continuously expanding our coverage based on user contributions.",
  },
];

export default function AboutPage() {
  return (
    <div className="space-y-12 max-w-4xl mx-auto">
      {/* Hero */}
      <section className="text-center py-8">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
          <span>🇳🇬</span>
          <span>Built for Nigeria</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-bold font-display tracking-tight mb-6">
          About Local Price Checker
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Empowering Nigerians with real-time price information to make informed decisions 
          and avoid being overcharged.
        </p>
      </section>
      
      {/* Mission */}
      <section className="relative">
        <Card className="overflow-hidden border-0 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-accent-foreground" />
          <div className="absolute inset-0 dot-pattern opacity-10" />
          <CardContent className="relative py-12 px-8 text-center text-primary-foreground">
            <h2 className="text-xl md:text-2xl font-bold font-display mb-4">Our Mission</h2>
            <p className="text-primary-foreground/90 max-w-2xl mx-auto leading-relaxed">
              To create Nigeria's most comprehensive and reliable crowd-sourced price database, 
              helping consumers make informed purchasing decisions and promoting market transparency.
            </p>
          </CardContent>
        </Card>
      </section>
      
      {/* Values */}
      <section className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold font-display">Our Values</h2>
          <p className="text-muted-foreground mt-2">What drives us every day</p>
        </div>
        
        <div className="grid sm:grid-cols-2 gap-4">
          {values.map((value, i) => (
            <Card key={value.title} className="group hover:shadow-md transition-all hover-lift">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`h-12 w-12 rounded-2xl ${value.bg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <value.icon className={`h-6 w-6 ${value.color}`} />
                  </div>
                  <div>
                    <h3 className="font-bold font-display mb-1">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      
      {/* How It Works */}
      <section className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold font-display">How It Works</h2>
          <p className="text-muted-foreground mt-2">Three simple steps to price transparency</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4">
          {steps.map((step, i) => (
            <Card key={step.step} className="relative group hover:shadow-md transition-all">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-2 w-4 h-0.5 bg-border z-10" />
              )}
              <CardContent className="pt-8 pb-6 text-center relative">
                <div className="absolute top-4 left-4 text-xs font-mono text-muted-foreground/50 font-bold">
                  {step.step}
                </div>
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{step.icon}</div>
                <h3 className="font-bold font-display mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      
      {/* FAQs */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-info/10 flex items-center justify-center">
            <HelpCircle className="h-5 w-5 text-info" />
          </div>
          <div>
            <h2 className="text-2xl font-bold font-display">Frequently Asked Questions</h2>
            <p className="text-muted-foreground text-sm">Got questions? We've got answers</p>
          </div>
        </div>
        
        <Card className="overflow-hidden">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b last:border-b-0">
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50 text-left">
                  <span className="font-medium">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>
      </section>
      
      {/* CTA */}
      <section className="text-center py-8">
        <h2 className="text-2xl font-bold font-display mb-3">Ready to Get Started?</h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Join thousands of Nigerians building price transparency together.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="rounded-xl h-14 px-8 shadow-glow hover:shadow-glow-lg">
            <Link to="/browse">
              Browse Prices
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-xl h-14 px-8 border-2">
            <Link to="/submit">Submit a Price</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
