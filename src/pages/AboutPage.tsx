import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Heart, Target, Shield, Users } from "lucide-react";

const values = [
  {
    icon: Target,
    title: "Transparency",
    description: "We believe everyone deserves access to fair pricing information.",
  },
  {
    icon: Users,
    title: "Community",
    description: "Built by Nigerians, for Nigerians. Every contribution matters.",
  },
  {
    icon: Shield,
    title: "Accuracy",
    description: "We use smart algorithms to detect and filter out fake prices.",
  },
  {
    icon: Heart,
    title: "Empowerment",
    description: "Knowledge is power. Know the price, pay the right price.",
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
    <div className="animate-fade-in space-y-8 max-w-4xl mx-auto">
      {/* Hero */}
      <section className="text-center py-8">
        <h1 className="text-3xl font-bold mb-4">About Local Price Checker</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Empowering Nigerians with real-time price information to make informed decisions 
          and avoid being overcharged.
        </p>
      </section>
      
      {/* Mission */}
      <Card className="bg-accent border-accent">
        <CardContent className="py-8 text-center">
          <h2 className="text-xl font-bold mb-3">Our Mission</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            To create Nigeria's most comprehensive and reliable crowd-sourced price database, 
            helping consumers make informed purchasing decisions and promoting market transparency.
          </p>
        </CardContent>
      </Card>
      
      {/* Values */}
      <section>
        <h2 className="text-xl font-bold mb-4 text-center">Our Values</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {values.map((value) => (
            <Card key={value.title}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
                    <value.icon className="h-5 w-5 text-accent-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      
      {/* How It Works */}
      <section>
        <h2 className="text-xl font-bold mb-4 text-center">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl mb-3">📝</div>
              <h3 className="font-semibold mb-2">1. Submit</h3>
              <p className="text-sm text-muted-foreground">
                Share prices you've seen or paid for goods and services
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl mb-3">🧮</div>
              <h3 className="font-semibold mb-2">2. Aggregate</h3>
              <p className="text-sm text-muted-foreground">
                We calculate averages and detect outliers automatically
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl mb-3">✅</div>
              <h3 className="font-semibold mb-2">3. Verify</h3>
              <p className="text-sm text-muted-foreground">
                Check prices before you buy and pay the right amount
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
      
      {/* FAQs */}
      <section>
        <h2 className="text-xl font-bold mb-4 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">{faq.question}</h3>
                <p className="text-sm text-muted-foreground">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      
      {/* CTA */}
      <section className="text-center py-8">
        <h2 className="text-xl font-bold mb-3">Ready to Get Started?</h2>
        <p className="text-muted-foreground mb-6">
          Join thousands of Nigerians building price transparency together.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg">
            <Link to="/browse">Browse Prices</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/submit">Submit a Price</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
