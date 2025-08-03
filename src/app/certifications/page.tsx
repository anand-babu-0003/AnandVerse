
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Award, ExternalLink, ShieldCheck } from 'lucide-react';
import { ScrollAnimationWrapper } from '@/components/shared/scroll-animation-wrapper';
import type { Certification } from '@/lib/types';
import { getCertificationsAction } from '@/actions/admin/certificationsActions';

export default async function CertificationsPage() {
  const certifications = await getCertificationsAction();
  const placeholderImage = 'https://placehold.co/600x400.png?text=Certificate';

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <ScrollAnimationWrapper>
        <PageHeader
          title="Certifications & Awards"
          subtitle="A recognition of my dedication to continuous learning and professional development."
        />
      </ScrollAnimationWrapper>

      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {(certifications || []).length > 0 ? (
            certifications.map((cert: Certification, index: number) => (
              <ScrollAnimationWrapper key={cert.id || `cert-${index}`} delay={index * 100}>
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
                  <div className="relative aspect-video bg-muted">
                    <Image
                      src={cert.imageUrl || placeholderImage}
                      alt={`Image for ${cert.name}`}
                      fill
                      className="object-cover rounded-t-lg"
                      data-ai-hint="certificate document"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="font-headline text-xl text-primary flex items-start gap-3">
                      <Award className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                      <span>{cert.name}</span>
                    </CardTitle>
                    <CardDescription>
                      Issued by: <strong>{cert.issuingBody}</strong> on {cert.date}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    {cert.credentialId && (
                      <p className="text-sm text-muted-foreground">
                        Credential ID: {cert.credentialId}
                      </p>
                    )}
                  </CardContent>
                  <CardFooter>
                    {cert.credentialUrl && (
                      <Button asChild className="w-full">
                        <Link href={cert.credentialUrl} target="_blank" rel="noopener noreferrer">
                          <ShieldCheck className="mr-2 h-4 w-4" />
                          Verify Credential
                        </Link>
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </ScrollAnimationWrapper>
            ))
          ) : (
            <ScrollAnimationWrapper className="md:col-span-2">
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
