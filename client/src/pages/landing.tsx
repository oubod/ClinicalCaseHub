import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Stethoscope, Users, Shield, MessageSquare } from "lucide-react";
import { Link } from "wouter";

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-3 mb-8">
            <div className="w-16 h-16 bg-medical-blue rounded-lg flex items-center justify-center">
              <Stethoscope className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-foreground">MedCase</h1>
              <p className="text-xl text-slate-600 dark:text-muted-foreground">Clinical Connect</p>
            </div>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-foreground mb-6">
            Share Clinical Cases with Confidence
          </h2>
          <p className="text-xl text-slate-600 dark:text-muted-foreground mb-8 max-w-3xl mx-auto">
            A secure platform for hospital doctors to share complex medical cases, 
            collaborate with colleagues, and advance medical knowledge through discussion.
          </p>
          <Link href="/login">
            <Button 
              asChild
              className="bg-medical-blue hover:bg-medical-blue-dark text-white px-8 py-4 text-lg rounded-lg"
            >
              <a>Sign In to Continue</a>
            </Button>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="bg-white dark:bg-card border border-slate-200 dark:border-border">
            <CardHeader>
              <Shield className="w-12 h-12 text-medical-blue mb-4" />
              <CardTitle className="text-xl font-semibold text-slate-900 dark:text-foreground">
                Secure & HIPAA Compliant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-muted-foreground">
                Enterprise-grade security ensures patient data protection and 
                compliance with healthcare regulations.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-card border border-slate-200 dark:border-border">
            <CardHeader>
              <Users className="w-12 h-12 text-medical-blue mb-4" />
              <CardTitle className="text-xl font-semibold text-slate-900 dark:text-foreground">
                Expert Collaboration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-muted-foreground">
                Connect with specialists across departments to get expert opinions 
                on complex cases and improve patient outcomes.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-card border border-slate-200 dark:border-border">
            <CardHeader>
              <MessageSquare className="w-12 h-12 text-medical-blue mb-4" />
              <CardTitle className="text-xl font-semibold text-slate-900 dark:text-foreground">
                Real-time Discussion
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-muted-foreground">
                Engage in meaningful discussions with threaded comments, 
                file sharing, and real-time notifications.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="bg-medical-blue text-white max-w-2xl mx-auto">
            <CardContent className="pt-8 pb-8">
              <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
              <p className="text-blue-100 mb-6">
                Join thousands of healthcare professionals already using MedCase 
                to improve patient care through collaborative medicine.
              </p>
              <Link href="/login">
                <Button 
                  asChild
                  variant="secondary"
                  className="bg-white text-medical-blue hover:bg-slate-100 px-6 py-2"
                >
                  <a>Access Platform</a>
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
