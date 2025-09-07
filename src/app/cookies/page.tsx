import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Cookie, Settings, Eye, Shield, AlertTriangle, Database } from 'lucide-react';

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20 mb-6">
              <Cookie className="h-4 w-4" />
              Legal
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              <span className="text-gradient">Cookie Policy</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
              Learn about how we use cookies and similar technologies on our website.
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
            
            {/* What Are Cookies */}
            <Card className="card-modern">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Cookie className="h-6 w-6 text-primary" />
                  What Are Cookies?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and to provide information to website owners.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Cookies allow a website to recognize a user's device and remember information about their visit, such as their preferred language and other settings.
                </p>
              </CardContent>
            </Card>

            {/* How We Use Cookies */}
            <Card className="card-modern">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Settings className="h-6 w-6 text-primary" />
                  How We Use Cookies
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  We use cookies for several purposes to improve your experience on our website:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• <strong>Essential Cookies:</strong> Required for the website to function properly</li>
                  <li>• <strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website</li>
                  <li>• <strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                  <li>• <strong>Performance Cookies:</strong> Collect information about how you use our website</li>
                </ul>
              </CardContent>
            </Card>

            {/* Types of Cookies */}
            <Card className="card-modern">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Database className="h-6 w-6 text-primary" />
                  Types of Cookies We Use
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Essential Cookies
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-2">
                    These cookies are necessary for the website to function and cannot be switched off in our systems.
                  </p>
                  <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                    <li>• Session management and security</li>
                    <li>• Load balancing and performance</li>
                    <li>• User authentication</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Eye className="h-5 w-5 text-primary" />
                    Analytics Cookies
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-2">
                    These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site.
                  </p>
                  <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                    <li>• Google Analytics (anonymized data)</li>
                    <li>• Page views and user interactions</li>
                    <li>• Performance monitoring</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Settings className="h-5 w-5 text-primary" />
                    Preference Cookies
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-2">
                    These cookies enable the website to provide enhanced functionality and personalization.
                  </p>
                  <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                    <li>• Theme preferences (dark/light mode)</li>
                    <li>• Language settings</li>
                    <li>• User interface preferences</li>
                  </ul>
                </div>

              </CardContent>
            </Card>

            {/* Third-Party Cookies */}
            <Card className="card-modern">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <AlertTriangle className="h-6 w-6 text-primary" />
                  Third-Party Cookies
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Some cookies on our website are set by third-party services that appear on our pages:
                </p>
                
                <div className="space-y-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Google Analytics</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      We use Google Analytics to analyze the use of our website. Google Analytics gathers information about website use by means of cookies.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Privacy Policy:</strong> <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Privacy Policy</a>
                    </p>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Firebase</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      We use Firebase for data storage and authentication services.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Privacy Policy:</strong> <a href="https://firebase.google.com/support/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Firebase Privacy Policy</a>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Managing Cookies */}
            <Card className="card-modern">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Settings className="h-6 w-6 text-primary" />
                  Managing Your Cookie Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  You have several options for managing cookies:
                </p>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">Browser Settings</h3>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    Most web browsers allow you to control cookies through their settings preferences. You can:
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Block all cookies</li>
                    <li>• Block third-party cookies only</li>
                    <li>• Delete existing cookies</li>
                    <li>• Set preferences for specific websites</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Opt-Out Links</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• <strong>Google Analytics:</strong> <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Analytics Opt-out</a></li>
                    <li>• <strong>Google Ads:</strong> <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Ads Settings</a></li>
                  </ul>
                </div>

                <div className="bg-primary/10 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Note:</strong> Disabling cookies may affect the functionality of our website and your user experience.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Cookie Duration */}
            <Card className="card-modern">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Cookie className="h-6 w-6 text-primary" />
                  Cookie Duration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Cookies may be either "session" cookies or "persistent" cookies:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• <strong>Session Cookies:</strong> Temporary cookies that expire when you close your browser</li>
                  <li>• <strong>Persistent Cookies:</strong> Remain on your device for a set period or until you delete them</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed">
                  Most cookies we use are session cookies that are automatically deleted when you close your browser.
                </p>
              </CardContent>
            </Card>

            {/* Updates to Policy */}
            <Card className="card-modern">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <AlertTriangle className="h-6 w-6 text-primary" />
                  Updates to This Policy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  We will notify you of any material changes by posting the updated policy on this page and updating the "Last updated" date.
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
                  If you have any questions about our use of cookies or this Cookie Policy, please contact us:
                </p>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Email:</strong> privacy@anandverse.com<br />
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
