
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award } from 'lucide-react';
import { ScrollAnimationWrapper } from '@/components/shared/scroll-animation-wrapper';
import type { Certification } from '@/lib/types';
import { getCertificationsAction } from '@/actions/admin/certificationsActions';

export default async function CertificationsPage() {
  const certifications = await getCertificationsAction();

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <ScrollAnimationWrapper>
        <PageHeader
          title="Certifications & Awards"
          subtitle="A recognition of my dedication to continuous learning and professional development."
        />
      </ScrollAnimationWrapper>

      <div className="max-w-4xl mx-auto">
        <div className="space-y-8">
          {(certifications || []).length > 0 ? (
            certifications.map((cert: Certification, index: number) => (
              <ScrollAnimationWrapper key={cert.id || `cert-${index}`} delay={index * 100}>
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-grow">
                      <CardTitle className="font-headline text-xl text-primary">{cert.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Issued by: <strong>{cert.issuingBody}</strong> | Date: {cert.date}
                      </p>
                    </div>
                  </CardHeader>
                </Card>
              </ScrollAnimationWrapper>
            ))
          ) : (
            <ScrollAnimationWrapper>
              <Card className="text-center p-8">
                <p className="text-muted-foreground">No certifications listed yet. Details coming soon!</p>
              </Card>
            </ScrollAnimationWrapper>
          )}
        </div>
      </div>
    </div>
  );
}
