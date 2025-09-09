import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  Calendar,
  Clock,
  User,
  Eye,
  Heart,
  Search,
  Filter,
  Tag,
  BookOpen
} from 'lucide-react';
import { getPublishedBlogPostsActionOptimized, getBlogCategoriesActionOptimized } from '@/actions/admin/blogActionsOptimized';
import Starfield from '@/components/layout/starfield';
import type { BlogPost, BlogCategory } from '@/lib/types';
import { generatePageMetadata } from '@/lib/seo';
import type { Metadata } from 'next';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Generate dynamic metadata
export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: 'Blog',
    description: 'Read my latest thoughts on web development, technology, and industry insights. Stay updated with tutorials, tips, and best practices.',
    keywords: ['blog', 'web development', 'tutorials', 'technology', 'programming', 'tips'],
    type: 'website',
  });
}

export default async function BlogPage() {
  const [blogPosts, blogCategories] = await Promise.all([
    getPublishedBlogPostsActionOptimized(),
    getBlogCategoriesActionOptimized()
  ]);

  const featuredPost = blogPosts[0];
  const recentPosts = blogPosts.slice(1, 4);
  const olderPosts = blogPosts.slice(4);

  const allTags = Array.from(new Set(blogPosts.flatMap(post => post.tags)));

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 sm:py-20 md:py-24 lg:py-32 xl:py-40 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        
        {/* Animated Starfield */}
        <Starfield density={0.6} speed={0.4} twinkleSpeed={0.02} />
        
        <div className="relative container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <div className="text-center max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium border border-primary/20 mb-6 sm:mb-8">
              <BookOpen className="h-3 w-3 sm:h-4 sm:w-4" />
              Blog & Insights
            </div>
            <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-tight mb-6 sm:mb-8">
              <span className="text-gradient">Blog</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-muted-foreground leading-relaxed mb-8 sm:mb-10 lg:mb-12 px-4 sm:px-6 md:px-0">
              Thoughts, insights, and tutorials on web development, technology, and the journey of building amazing digital experiences.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
              <Button asChild size="lg" className="btn-modern px-8 sm:px-10 py-3 sm:py-4 w-full sm:w-auto text-base sm:text-lg font-semibold">
                <Link href="/contact">
                  <span className="flex items-center gap-2 sm:gap-3">
                    <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6" />
                    Get in Touch
                  </span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Stats */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
            <div className="text-center p-4 sm:p-6 card-modern">
              <div className="text-2xl sm:text-3xl font-bold text-primary mb-1 sm:mb-2">{blogPosts.length}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Total Posts</div>
            </div>
            <div className="text-center p-4 sm:p-6 card-modern">
              <div className="text-2xl sm:text-3xl font-bold text-primary mb-1 sm:mb-2">{blogCategories.length}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Categories</div>
            </div>
            <div className="text-center p-4 sm:p-6 card-modern">
              <div className="text-2xl sm:text-3xl font-bold text-primary mb-1 sm:mb-2">{allTags.length}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Topics</div>
            </div>
            <div className="text-center p-4 sm:p-6 card-modern">
              <div className="text-2xl sm:text-3xl font-bold text-primary mb-1 sm:mb-2">{blogPosts.reduce((sum, post) => sum + post.views, 0)}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Total Views</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="py-16 sm:py-20 md:py-24 lg:py-32 xl:py-40">
          <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 sm:mb-6">
                Featured <span className="text-gradient">Article</span>
              </h2>
            </div>
            
            <Card className="card-modern overflow-hidden">
              <div className="grid lg:grid-cols-2 gap-0">
                <div className="relative aspect-video lg:aspect-square overflow-hidden">
                  <Image
                    src={featuredPost.featuredImage || 'https://placehold.co/800x600.png?text=Featured+Post'}
                    alt={featuredPost.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 sm:p-8 lg:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-4 mb-4">
                    <Badge variant="secondary" className="text-xs">
                      {featuredPost.category}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {new Date(featuredPost.publishedAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {featuredPost.readTime} min read
                    </div>
                  </div>
                  
                  <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                    {featuredPost.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {featuredPost.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      {featuredPost.author}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {featuredPost.views}
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        {featuredPost.likes}
                      </div>
                    </div>
                  </div>
                  
                  <Button asChild className="btn-modern mt-6 w-fit">
                    <Link href={`/blog/${featuredPost.slug}`}>
                      <span className="flex items-center gap-2">
                        Read More
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </section>
      )}

      {/* Recent Posts */}
      {recentPosts.length > 0 && (
        <section className="py-16 sm:py-20 md:py-32 bg-muted/30">
          <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 sm:mb-6">
                Recent <span className="text-gradient">Posts</span>
              </h2>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {recentPosts.map((post) => (
                <Card key={post.id} className="card-modern group overflow-hidden">
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={post.featuredImage || 'https://placehold.co/600x400.png?text=Blog+Post'}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  
                  <CardHeader className="p-4 sm:p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {post.category}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {post.readTime} min
                      </div>
                    </div>
                    
                    <CardTitle className="text-lg sm:text-xl font-semibold line-clamp-2">
                      {post.title}
                    </CardTitle>
                    
                    <CardDescription className="line-clamp-3">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="p-4 sm:p-6 pt-0">
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {post.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {post.views}
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          {post.likes}
                        </div>
                      </div>
                      
                      <Button asChild size="sm" variant="ghost" className="text-primary hover:text-primary/80">
                        <Link href={`/blog/${post.slug}`}>
                          Read More
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Posts */}
      {olderPosts.length > 0 && (
        <section className="py-16 sm:py-20 md:py-32">
          <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 sm:mb-6">
                All <span className="text-gradient">Articles</span>
              </h2>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {olderPosts.map((post) => (
                <Card key={post.id} className="card-modern group overflow-hidden">
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={post.featuredImage || 'https://placehold.co/600x400.png?text=Blog+Post'}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  
                  <CardHeader className="p-4 sm:p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {post.category}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {post.readTime} min
                      </div>
                    </div>
                    
                    <CardTitle className="text-lg sm:text-xl font-semibold line-clamp-2">
                      {post.title}
                    </CardTitle>
                    
                    <CardDescription className="line-clamp-3">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="p-4 sm:p-6 pt-0">
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {post.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {post.views}
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          {post.likes}
                        </div>
                      </div>
                      
                      <Button asChild size="sm" variant="ghost" className="text-primary hover:text-primary/80">
                        <Link href={`/blog/${post.slug}`}>
                          Read More
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Empty State */}
      {blogPosts.length === 0 && (
        <section className="py-16 sm:py-20 md:py-32">
          <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
            <div className="text-center py-16 sm:py-20">
              <div className="max-w-md mx-auto px-4">
                <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <BookOpen className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3 sm:mb-4">Blog Posts Coming Soon</h3>
                <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8">
                  I'm working on some exciting blog posts about web development, technology, and my journey as a developer. Check back soon!
                </p>
                <Button asChild size="lg" className="btn-modern px-6 sm:px-8 py-2.5 sm:py-3 w-full sm:w-auto">
                  <Link href="/contact">
                    <span className="flex items-center gap-2">
                      <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                      Get in Touch
                    </span>
                  </Link>
                </Button>
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
              Stay <span className="text-white/90">Updated</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-white/90 leading-relaxed mb-6 sm:mb-8 px-4 sm:px-0">
              Subscribe to my newsletter to get the latest blog posts, tutorials, and insights delivered straight to your inbox.
            </p>
            <div className="flex flex-col xs:flex-row justify-center items-center gap-3 sm:gap-4">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 px-6 sm:px-8 py-2.5 sm:py-3 w-full xs:w-auto">
                <Link href="/contact">
                  <span className="flex items-center gap-2">
                    Subscribe to Newsletter
                    <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                  </span>
                </Link>
              </Button>
              
              <Button asChild size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 px-6 sm:px-8 py-2.5 sm:py-3 w-full xs:w-auto">
                <Link href="/portfolio">
                  <span className="flex items-center gap-2">
                    View My Work
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
