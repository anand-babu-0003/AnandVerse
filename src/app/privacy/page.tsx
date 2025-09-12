import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Eye, Lock, Database, UserCheck, AlertTriangle } from 'lucide-react';
import Starfield from '@/components/layout/starfield';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        
        {/* Animated Starfield */}
        <Starfield density={0.4} speed={0.3} twinkleSpeed={0.01} />
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20 mb-6">
              <Shield className="h-4 w-4" />
              Legal
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              <span className="text-gradient">Privacy Policy</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
              Your privacy is important to us. This policy explains how we collect, use, and protect your information.
            </p>
            <div className="mt-6">
              <Badge variant="secondary" className="text-sm">
                Last updated: {new Date().toLocaleDateString()}
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Introduction */}
            <Card className="card-modern">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Eye className="h-6 w-6 text-primary" />
                  Introduction
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  This Privacy Policy describes how AnandVerse ("we," "our," or "us") collects, uses, and shares information about you when you use our website and services.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  By using our website, you agree to the collection and use of information in accordance with this policy.
                </p>
              </CardContent>
            </Card>

            {/* Information We Collect */}
            <Card className="card-modern">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Database className="h-6 w-6 text-primary" />
                  Information We Collect
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Personal Information</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Name and email address (when you contact us)</li>
                    <li>• Any information you voluntarily provide in contact forms</li>
                    <li>• Communication preferences</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">Automatically Collected Information</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• IP address and browser information</li>
                    <li>• Pages visited and time spent on our site</li>
                    <li>• Device information and operating system</li>
                    <li>• Cookies and similar tracking technologies</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* How We Use Information */}
            <Card className="card-modern">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <UserCheck className="h-6 w-6 text-primary" />
                  How We Use Your Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  We use the information we collect to:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Respond to your inquiries and provide customer support</li>
                  <li>• Improve our website and services</li>
                  <li>• Analyze website usage and performance</li>
                  <li>• Ensure website security and prevent fraud</li>
                  <li>• Comply with legal obligations</li>
                </ul>
              </CardContent>
            </Card>

            {/* Data Protection */}
            <Card className="card-modern">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Lock className="h-6 w-6 text-primary" />
                  Data Protection & Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• SSL encryption for data transmission</li>
                  <li>• Secure hosting and data storage</li>
                  <li>• Regular security updates and monitoring</li>
                  <li>• Limited access to personal information</li>
                </ul>
              </CardContent>
            </Card>

            {/* Third-Party Services */}
            <Card className="card-modern">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <AlertTriangle className="h-6 w-6 text-primary" />
                  Third-Party Services
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  We may use third-party services that collect information about you:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• <strong>Google Analytics:</strong> Website analytics and performance monitoring</li>
                  <li>• <strong>Firebase:</strong> Data storage and authentication services</li>
                  <li>• <strong>Vercel:</strong> Website hosting and performance optimization</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed">
                  These services have their own privacy policies, and we encourage you to review them.
                </p>
              </CardContent>
            </Card>

            {/* Your Rights */}
            <Card className="card-modern">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <UserCheck className="h-6 w-6 text-primary" />
                  Your Rights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  You have the right to:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Access your personal information</li>
                  <li>• Correct inaccurate information</li>
                  <li>• Request deletion of your information</li>
                  <li>• Object to processing of your information</li>
                  <li>• Data portability</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed">
                  To exercise these rights, please contact us using the information provided below.
                </p>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="card-modern">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Shield className="h-6 w-6 text-primary" />
                  Contact Us
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Email:</strong> privacy@anandverse.com<br />
                    <strong>Website:</strong> <a href="/contact" className="text-primary hover:underline">Contact Form</a>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Policy Updates */}
            <Card className="card-modern">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <AlertTriangle className="h-6 w-6 text-primary" />
                  Policy Updates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
                </p>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>
    </div>
  );
}
