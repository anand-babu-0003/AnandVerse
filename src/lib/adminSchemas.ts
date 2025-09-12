import { z } from 'zod';
import { SKILL_CATEGORIES } from './constants'; 
import { commonSkillNamesTuple } from './data'; 

const ZOD_SKILL_CATEGORIES = SKILL_CATEGORIES; 

export const experienceSchema = z.object({
  id: z.string().min(1, "Experience item ID is required"), 
  role: z.string().min(1, "Role is required"),
  company: z.string().min(1, "Company is required"),
  period: z.string().min(1, "Period is required"),
  description: z.string().min(1, "Description is required"),
});
export type Experience = z.infer<typeof experienceSchema>;

export const educationSchema = z.object({
  id: z.string().min(1, "Education item ID is required"), 
  degree: z.string().min(1, "Degree is required"),
  institution: z.string().min(1, "Institution is required"),
  period: z.string().min(1, "Period is required"),
});
export type Education = z.infer<typeof educationSchema>;


export const aboutMeSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
  bio: z.string().min(20, { message: "Bio must be at least 20 characters." }),
  profileImage: z.string().url({ message: "Please enter a valid URL for the profile image." }).or(z.literal("").transform(() => undefined)).optional(),
  dataAiHint: z.string().max(50, { message: "AI hint must be 50 characters or less." }).or(z.literal("").transform(() => undefined)).optional(),
  experience: z.array(experienceSchema),
  education: z.array(educationSchema),
  email: z.string().email({ message: "Please enter a valid email." }).or(z.literal("").transform(() => undefined)).optional(),
  linkedinUrl: z.string().url({ message: "Please enter a valid LinkedIn URL." }).or(z.literal("").transform(() => undefined)).optional(),
  githubUrl: z.string().url({ message: "Please enter a valid GitHub URL." }).or(z.literal("").transform(() => undefined)).optional(),
  twitterUrl: z.string().url({ message: "Please enter a valid Twitter URL." }).or(z.literal("").transform(() => undefined)).optional(),
});

export const profileBioSchema = aboutMeSchema.pick({
  name: true,
  title: true,
  bio: true,
  profileImage: true,
  dataAiHint: true,
});
export type ProfileBioData = z.infer<typeof profileBioSchema>;

export const experienceSectionSchema = z.object({
  experience: z.array(experienceSchema)
    .min(0) 
    .refine(items => { 
        return items.every(item => 
            item.role.trim() !== '' || 
            item.company.trim() !== '' || 
            item.period.trim() !== '' || 
            item.description.trim() !== '' ||
            !item.id.startsWith('new_exp_') 
        );
    }, { message: "New experience entries cannot be completely blank." })
    .optional(), 
});
export type ExperienceSectionData = z.infer<typeof experienceSectionSchema>;

export const educationSectionSchema = z.object({
  education: z.array(educationSchema)
    .min(0)
    .refine(items => {
        return items.every(item =>
            item.degree.trim() !== '' ||
            item.institution.trim() !== '' ||
            item.period.trim() !== '' ||
            !item.id.startsWith('new_edu_')
        );
    }, { message: "New education entries cannot be completely blank." })
    .optional(),
});
export type EducationSectionData = z.infer<typeof educationSectionSchema>;


export const portfolioItemAdminSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  longDescription: z.string().optional(),
  image1: z.string().url({ message: "Image 1: Please enter a valid URL or leave blank for default." }).or(z.literal("")).optional(),
  image2: z.string().url({ message: "Image 2: Please enter a valid URL or leave blank." }).or(z.literal("")).optional(),
  tagsString: z.string().optional(),
  liveUrl: z.string()
    .transform((val) => {
      if (!val || val.trim() === '') return '';
      // If it doesn't start with http:// or https://, add https://
      if (!val.match(/^https?:\/\//i)) {
        return `https://${val}`;
      }
      return val;
    })
    .refine((val) => {
      if (!val || val.trim() === '') return true;
      try {
        new URL(val);
        return true;
      } catch {
        return false;
      }
    }, { message: "Live Demo: Please enter a valid URL or leave blank." })
    .optional(),
  repoUrl: z.string()
    .transform((val) => {
      if (!val || val.trim() === '') return '';
      // If it doesn't start with http:// or https://, add https://
      if (!val.match(/^https?:\/\//i)) {
        return `https://${val}`;
      }
      return val;
    })
    .refine((val) => {
      if (!val || val.trim() === '') return true;
      try {
        new URL(val);
        return true;
      } catch {
        return false;
      }
    }, { message: "Code Repo: Please enter a valid URL or leave blank." })
    .optional(),
  slug: z.string().min(1, "Slug is required.").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: "Slug can only contain lowercase letters, numbers, and hyphens." }),
  dataAiHint: z.string().max(50, "AI hint too long").optional(),
  readmeContent: z.string().optional(),
});

export type PortfolioAdminFormData = z.infer<typeof portfolioItemAdminSchema>;

export const skillAdminSchema = z.object({
  id: z.string().min(1, "ID must be a non-empty string if provided.").optional(), // Ensures if ID is there, it's valid
  name: z.enum(commonSkillNamesTuple, { 
    errorMap: (issue, ctx) => ({ message: "Please select a valid skill from the list." })
  }),
  category: z.enum(ZOD_SKILL_CATEGORIES, { errorMap: () => ({ message: "Please select a valid category." })}),
  proficiency: z.preprocess(
    (val) => {
      if (val === null || val === undefined || String(val).trim() === '') { 
        return undefined; 
      }
      const num = Number(val);
      return isNaN(num) ? undefined : num; 
    },
    z.number().min(0).max(100).optional().nullable() 
  ),
});

export type SkillAdminFormData = z.infer<typeof skillAdminSchema>;


export const siteSettingsAdminSchema = z.object({
  siteName: z.string().min(3, { message: "Site Name must be at least 3 characters." }),
  defaultMetaDescription: z.string().min(10, { message: "Meta Description must be at least 10 characters." }).max(160, {message: "Meta Description should not exceed 160 characters."}),
  defaultMetaKeywords: z.string().optional(),
  siteOgImageUrl: z.string().url({ message: "Please enter a valid URL for the Open Graph image or leave blank." }).or(z.literal("")).optional(),
  maintenanceMode: z.boolean().optional(),
  skillsPageMetaTitle: z.string().min(5, "Skills page meta title is too short.").max(70, "Skills page meta title is too long.").optional(),
  skillsPageMetaDescription: z.string().min(10, "Skills page meta description is too short.").max(160, "Skills page meta description is too long.").optional(),
});
export type SiteSettingsAdminFormData = z.infer<typeof siteSettingsAdminSchema>;

export const notFoundPageAdminSchema = z.object({
  imageSrc: z.string().url({ message: "Please enter a valid URL for the image." }).or(z.literal("")).optional(),
  dataAiHint: z.string().max(50, { message: "AI hint must be 50 characters or less." }).or(z.literal("")).optional(),
  heading: z.string().min(5, "Heading is too short.").max(100, "Heading is too long."),
  message: z.string().min(10, "Message is too short.").max(200, "Message is too long."),
  buttonText: z.string().min(3, "Button text is too short.").max(30, "Button text is too long."),
});
export type NotFoundPageAdminFormData = z.infer<typeof notFoundPageAdminSchema>;

// NEW BLOG SCHEMAS
export const blogPostAdminSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
  slug: z.string().min(1, "Slug is required.").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: "Slug can only contain lowercase letters, numbers, and hyphens." }),
  excerpt: z.string().min(20, { message: "Excerpt must be at least 20 characters." }),
  content: z.string().min(100, { message: "Content must be at least 100 characters." }),
  featuredImage: z.string().url({ message: "Please enter a valid URL for the featured image." }).or(z.literal("")).optional(),
  author: z.string().min(2, { message: "Author name is required." }),
  status: z.enum(['draft', 'published', 'archived']),
  tagsString: z.string().optional(),
  category: z.string().min(1, { message: "Category is required." }),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywordsString: z.string().optional(),
});

export type BlogPostAdminFormData = z.infer<typeof blogPostAdminSchema>;

export const blogCategoryAdminSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, { message: "Category name must be at least 2 characters." }),
  slug: z.string().min(1, "Slug is required.").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: "Slug can only contain lowercase letters, numbers, and hyphens." }),
  description: z.string().optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, { message: "Color must be a valid hex color code." }).optional(),
});

export type BlogCategoryAdminFormData = z.infer<typeof blogCategoryAdminSchema>;

// NEW TESTIMONIAL SCHEMAS
export const testimonialAdminSchema = z.object({
  id: z.string().optional(),
  clientName: z.string().min(2, { message: "Client name must be at least 2 characters." }),
  clientTitle: z.string().min(2, { message: "Client title is required." }),
  clientCompany: z.string().min(2, { message: "Client company is required." }),
  clientImage: z.string().url({ message: "Please enter a valid URL for the client image." }).or(z.literal("")).optional(),
  content: z.string().min(20, { message: "Testimonial content must be at least 20 characters." }),
  rating: z.number().min(1).max(5),
  projectId: z.string().optional(),
  status: z.enum(['pending', 'approved', 'featured']),
});

export type TestimonialAdminFormData = z.infer<typeof testimonialAdminSchema>;

// NEW ANALYTICS SCHEMAS
export const analyticsFilterSchema = z.object({
  dateRange: z.enum(['7d', '30d', '90d', '1y', 'custom']),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  page: z.string().optional(),
  device: z.enum(['all', 'desktop', 'mobile', 'tablet']).optional(),
  country: z.string().optional(),
});

export type AnalyticsFilterData = z.infer<typeof analyticsFilterSchema>;

// NEW AI FEATURES SCHEMAS
export const aiContentGenerationSchema = z.object({
  type: z.enum(['blog_post', 'project_description', 'seo_meta', 'email_response']),
  prompt: z.string().min(10, { message: "Prompt must be at least 10 characters." }),
  context: z.string().optional(),
  tone: z.enum(['professional', 'casual', 'technical', 'creative']).optional(),
  length: z.enum(['short', 'medium', 'long']).optional(),
});

export type AIContentGenerationData = z.infer<typeof aiContentGenerationSchema>;