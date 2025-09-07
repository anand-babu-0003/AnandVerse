import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Scale, AlertTriangle, Shield, Users, Gavel } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20 mb-6">
              <FileText className="h-4 w-4" />
              Legal
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              <span className="text-gradient">Terms of Service</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
              Please read these terms carefully before using our website and services.
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
                  <Scale className="h-6 w-6 text-primary" />
                  Agreement to Terms
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  These Terms of Service ("Terms") govern your use of the AnandVerse website and services operated by us.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing or using our website, you agree to be bound by these Terms. If you disagree with any part of these terms, you may not access the service.
                </p>
              </CardContent>
            </Card>

            {/* Use License */}
            <Card className="card-modern">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-primary" />
                  Use License
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Permission is granted to temporarily download one copy of the materials on AnandVerse for personal, non-commercial transitory viewing only.
                </p>
                <div>
                  <h3 className="text-lg font-semibold mb-3">This is the grant of a license, not a transfer of title, and under this license you may not:</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Modify or copy the materials</li>
                    <li>• Use the materials for any commercial purpose or for any public display</li>
                    <li>• Attempt to reverse engineer any software contained on the website</li>
                    <li>• Remove any copyright or other proprietary notations from the materials</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Acceptable Use */}
            <Card className="card-modern">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Shield className="h-6 w-6 text-primary" />
                  Acceptable Use
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  You agree not to use our website or services for any unlawful purpose or any purpose prohibited under this clause.
                </p>
                <div>
                  <h3 className="text-lg font-semibold mb-3">You may not use our website:</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• In any way that causes, or may cause, damage to the website or impairment of the availability or accessibility of the website</li>
                    <li>• In any way which is unlawful, illegal, fraudulent, or harmful</li>
                    <li>• To conduct any systematic or automated data collection activities</li>
                    <li>• To transmit or send unsolicited commercial communications</li>
                    <li>• For any purposes related to marketing without our express written consent</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* User Content */}
            <Card className="card-modern">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-primary" />
                  User Content
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Our website may allow you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  You are responsible for the content that you post to the website, including its legality, reliability, and appropriateness.
                </p>
                <div>
                  <h3 className="text-lg font-semibold mb-3">By posting content, you grant us the right and license to:</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Use, reproduce, modify, publicly perform, publicly display, and distribute such content</li>
                    <li>• Make such content available to other users of the website</li>
                    <li>• Use such content for our business purposes</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Intellectual Property */}
            <Card className="card-modern">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Gavel className="h-6 w-6 text-primary" />
                  Intellectual Property Rights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Other than the content you own, under these Terms, AnandVerse and/or its licensors own all the intellectual property rights and materials contained in this website.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  You are granted limited license only for purposes of viewing the material contained on this website.
                </p>
              </CardContent>
            </Card>

            {/* Disclaimer */}
            <Card className="card-modern">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <AlertTriangle className="h-6 w-6 text-primary" />
                  Disclaimer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  The information on this website is provided on an "as is" basis. To the fullest extent permitted by law, this Company:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Excludes all representations and warranties relating to this website and its contents</li>
                  <li>• Excludes all liability for damages arising out of or in connection with your use of this website</li>
                  <li>• Does not warrant that the website will be constantly available or available at all</li>
                  <li>• Does not warrant that the information on this website is complete, true, accurate, or non-misleading</li>
                </ul>
              </CardContent>
            </Card>

            {/* Limitations */}
            <Card className="card-modern">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <AlertTriangle className="h-6 w-6 text-primary" />
                  Limitations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  In no event shall AnandVerse, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the website.
                </p>
              </CardContent>
            </Card>

            {/* Governing Law */}
            <Card className="card-modern">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Scale className="h-6 w-6 text-primary" />
                  Governing Law
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  These Terms shall be interpreted and governed by the laws of the jurisdiction in which AnandVerse operates, without regard to its conflict of law provisions.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
                </p>
              </CardContent>
            </Card>

            {/* Changes to Terms */}
            <Card className="card-modern">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-primary" />
                  Changes to Terms
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  By continuing to access or use our website after those revisions become effective, you agree to be bound by the revised terms.
                </p>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="card-modern">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-primary" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Email:</strong> legal@anandverse.com<br />
                    <strong>Website:</strong> <a href="/contact" className="text-primary hover:underline">Contact Form</a>
                  </p>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>
    </div>
  );
}
