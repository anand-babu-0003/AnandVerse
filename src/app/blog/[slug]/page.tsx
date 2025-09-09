import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Eye,
  Heart,
  Share2,
  Tag,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { getBlogPostBySlugActionOptimized, getPublishedBlogPostsActionOptimized } from '@/actions/admin/blogActionsOptimized';
import Starfield from '@/components/layout/starfield';
import type { BlogPost } from '@/lib/types';
import { generateBlogPostMetadata, generateBlogPostStructuredData } from '@/lib/seo';
import type { Metadata } from 'next';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Generate dynamic metadata for blog posts
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await getBlogPostBySlugActionOptimized(params.slug);
  
  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.',
    };
  }
  
  return generateBlogPostMetadata(post);
}


export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getBlogPostBySlugActionOptimized(params.slug);
  
  if (!post) {
    notFound();
  }

  // Generate structured data
  const structuredData = await generateBlogPostStructuredData(post);

  // Get related posts (same category, excluding current post)
  const allPosts = await getPublishedBlogPostsActionOptimized();
  const relatedPosts = allPosts
    .filter(p => p.id !== post.id && p.category === post.category)
    .slice(0, 3);

  // Increment view count (you might want to implement this as a separate action)
  // await incrementBlogPostViewsAction(post.id);

  return (
    <div className="min-h-screen">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      {/* Hero Section */}
      <section className="relative py-16 sm:py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        
        {/* Animated Starfield */}
        <Starfield density={0.6} speed={0.4} twinkleSpeed={0.02} />
        
        <div className="relative container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <Button asChild variant="ghost" className="mb-8">
              <Link href="/blog">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blog
              </Link>
            </Button>

            {/* Post Meta */}
            <div className="flex items-center gap-4 mb-6">
              <Badge variant="secondary" className="text-sm">
                {post.category}
              </Badge>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {post.readTime} min read
              </div>
            </div>

            {/* Post Title */}
            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6">
              {post.title}
            </h1>

            {/* Post Excerpt */}
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-8">
              {post.excerpt}
            </p>

            {/* Author and Stats */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="h-5 w-5" />
                  <span className="font-medium">{post.author}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{post.views} views</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  <span>{post.likes} likes</span>
                </div>
                <Button variant="ghost" size="sm">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      {post.featuredImage && (
        <section className="py-8">
          <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="relative aspect-video overflow-hidden rounded-2xl">
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Post Content */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <div 
                className="blog-content"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Tags */}
      {post.tags.length > 0 && (
        <section className="py-8 bg-muted/30">
          <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-2 mb-4">
                <Tag className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Tags</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-sm">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Author Info */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Card className="card-modern">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg flex-shrink-0">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      About {post.author}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      Passionate developer and writer sharing insights about web development, 
                      technology, and the journey of building amazing digital experiences.
                    </p>
                    <Button asChild variant="outline" size="sm">
                      <Link href="/about">
                        <span className="flex items-center gap-2">
                          Learn More
                          <ArrowRight className="h-3 w-3" />
                        </span>
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 sm:py-20 bg-muted/30">
          <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8">
                Related Articles
              </h2>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Card key={relatedPost.id} className="card-modern group overflow-hidden">
                    <div className="relative aspect-video overflow-hidden">
                      <Image
                        src={relatedPost.featuredImage || 'https://placehold.co/600x400.png?text=Blog+Post'}
                        alt={relatedPost.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    
                    <CardHeader className="p-4 sm:p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {relatedPost.category}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {relatedPost.readTime} min
                        </div>
                      </div>
                      
                      <CardTitle className="text-lg font-semibold line-clamp-2">
                        {relatedPost.title}
                      </CardTitle>
                      
                      <CardDescription className="line-clamp-3">
                        {relatedPost.excerpt}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="p-4 sm:p-6 pt-0">
                      <Button asChild size="sm" variant="ghost" className="text-primary hover:text-primary/80 w-full">
                        <Link href={`/blog/${relatedPost.slug}`}>
                          Read More
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 sm:py-20 md:py-32 bg-gradient-royal">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
              Enjoyed This <span className="text-white/90">Article?</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-white/90 leading-relaxed mb-6 sm:mb-8 px-4 sm:px-0">
              Check out more of my work and get in touch if you'd like to collaborate on your next project.
            </p>
            <div className="flex flex-col xs:flex-row justify-center items-center gap-3 sm:gap-4">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 px-6 sm:px-8 py-2.5 sm:py-3 w-full xs:w-auto">
                <Link href="/portfolio">
                  <span className="flex items-center gap-2">
                    View My Work
                    <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                  </span>
                </Link>
              </Button>
              
              <Button asChild size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 px-6 sm:px-8 py-2.5 sm:py-3 w-full xs:w-auto">
                <Link href="/contact">
                  <span className="flex items-center gap-2">
                    Get in Touch
                  </span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
