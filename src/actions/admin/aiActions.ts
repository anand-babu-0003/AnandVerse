"use server";

import { firestore } from '@/lib/firebaseConfig';
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  setDoc, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp, 
  Timestamp 
} from 'firebase/firestore';
import type { AIGeneratedContent } from '@/lib/types';
import { aiContentGenerationSchema, type AIContentGenerationData } from '@/lib/adminSchemas';
import { revalidatePath } from 'next/cache';

// Collection reference
const aiContentCollectionRef = () => {
  if (!firestore) throw new Error("Firestore not initialized");
  return collection(firestore, 'aiGeneratedContent');
};

const aiContentDocRef = (id: string) => {
  if (!firestore) throw new Error("Firestore not initialized");
  return doc(firestore, 'aiGeneratedContent', id);
};

// AI Content Generation Types
export type AIContentFormState = {
  message: string;
  status: 'success' | 'error' | 'idle';
  errors?: Partial<Record<keyof AIContentGenerationData, string[]>>;
  formDataOnError?: AIContentGenerationData;
  generatedContent?: AIGeneratedContent;
};

// Generate blog post content
export async function generateBlogPostAction(
  topic: string,
  tone: 'professional' | 'casual' | 'technical' | 'creative' = 'professional',
  length: 'short' | 'medium' | 'long' = 'medium'
): Promise<{ success: boolean; content?: string; error?: string }> {
  try {
    // This is a mock implementation - in a real app, you'd call your AI service
    const wordCounts = {
      short: 300,
      medium: 800,
      long: 1500
    };

    const tones = {
      professional: "professional and authoritative",
      casual: "conversational and friendly",
      technical: "technical and detailed",
      creative: "creative and engaging"
    };

    const mockContent = `
# ${topic}

## Introduction

This is a ${tones[tone]} blog post about ${topic}. The content is generated using AI to help you get started with your writing.

## Key Points

1. **Understanding the Topic**: ${topic} is an important subject that requires careful consideration.

2. **Best Practices**: When working with ${topic}, it's essential to follow industry best practices.

3. **Implementation**: Here's how you can implement solutions related to ${topic}:

\`\`\`javascript
// Example code snippet
function handle${topic.replace(/\s+/g, '')}() {
  console.log('Working with ${topic}');
  return true;
}
\`\`\`

## Conclusion

In conclusion, ${topic} is a valuable topic that can help improve your understanding and implementation skills. This AI-generated content provides a starting point for your blog post.

---

*This content was generated using AI. Please review and customize it according to your needs.*
    `.trim();

    // Save to database
    const aiContent: Omit<AIGeneratedContent, 'id' | 'createdAt'> = {
      type: 'blog_post',
      prompt: `Generate a ${tone} blog post about ${topic} (${length} length)`,
      generatedContent: mockContent,
      model: 'mock-ai-model',
      status: 'generated',
    };

    await addDoc(aiContentCollectionRef(), {
      ...aiContent,
      createdAt: serverTimestamp(),
    });

    return { success: true, content: mockContent };
  } catch (error) {
    console.error('Error generating blog post:', error);
    return { success: false, error: 'Failed to generate blog post content' };
  }
}

// Generate project description
export async function generateProjectDescriptionAction(
  projectName: string,
  technologies: string[],
  features: string[]
): Promise<{ success: boolean; content?: string; error?: string }> {
  try {
    const mockContent = `
## ${projectName}

### Overview
${projectName} is a modern web application built with cutting-edge technologies to deliver an exceptional user experience.

### Technologies Used
${technologies.map(tech => `- ${tech}`).join('\n')}

### Key Features
${features.map(feature => `- ${feature}`).join('\n')}

### Project Highlights
- **Modern Architecture**: Built with the latest web technologies for optimal performance
- **Responsive Design**: Fully responsive across all devices and screen sizes
- **User Experience**: Intuitive interface designed with user experience in mind
- **Performance**: Optimized for speed and efficiency

### Technical Implementation
The project leverages modern development practices including:
- Component-based architecture
- State management best practices
- API integration
- Database optimization
- Security considerations

### Results
This project demonstrates proficiency in modern web development and showcases the ability to create scalable, maintainable applications.

---

*This description was generated using AI. Please customize it according to your specific project details.*
    `.trim();

    // Save to database
    const aiContent: Omit<AIGeneratedContent, 'id' | 'createdAt'> = {
      type: 'project_description',
      prompt: `Generate project description for ${projectName} using ${technologies.join(', ')} with features: ${features.join(', ')}`,
      generatedContent: mockContent,
      model: 'mock-ai-model',
      status: 'generated',
    };

    await addDoc(aiContentCollectionRef(), {
      ...aiContent,
      createdAt: serverTimestamp(),
    });

    return { success: true, content: mockContent };
  } catch (error) {
    console.error('Error generating project description:', error);
    return { success: false, error: 'Failed to generate project description' };
  }
}

// Generate SEO meta content
export async function generateSEOMetaAction(
  pageTitle: string,
  pageContent: string,
  keywords: string[]
): Promise<{ success: boolean; meta?: { title: string; description: string; keywords: string[] }; error?: string }> {
  try {
    const mockMeta = {
      title: `${pageTitle} | Professional Web Development Services`,
      description: `Discover ${pageTitle.toLowerCase()} - professional web development services. ${pageContent.substring(0, 120)}...`,
      keywords: [...keywords, 'web development', 'professional services', 'portfolio']
    };

    // Save to database
    const aiContent: Omit<AIGeneratedContent, 'id' | 'createdAt'> = {
      type: 'seo_meta',
      prompt: `Generate SEO meta for ${pageTitle} with keywords: ${keywords.join(', ')}`,
      generatedContent: JSON.stringify(mockMeta),
      model: 'mock-ai-model',
      status: 'generated',
    };

    await addDoc(aiContentCollectionRef(), {
      ...aiContent,
      createdAt: serverTimestamp(),
    });

    return { success: true, meta: mockMeta };
  } catch (error) {
    console.error('Error generating SEO meta:', error);
    return { success: false, error: 'Failed to generate SEO meta content' };
  }
}

// Generate email response
export async function generateEmailResponseAction(
  inquiryType: string,
  clientName: string,
  projectDetails: string
): Promise<{ success: boolean; content?: string; error?: string }> {
  try {
    const mockContent = `
Subject: Thank you for your ${inquiryType} inquiry

Dear ${clientName},

Thank you for reaching out regarding your ${inquiryType} project. I'm excited to learn more about your vision and how I can help bring it to life.

Based on your inquiry about ${projectDetails}, I believe we can create something truly exceptional together. Here's what I can offer:

**What I Bring to Your Project:**
- Modern web development expertise
- Attention to detail and user experience
- Timely communication and project updates
- Post-launch support and maintenance

**Next Steps:**
1. Schedule a consultation call to discuss your project in detail
2. Provide a detailed project proposal with timeline and pricing
3. Begin development once we align on the scope and requirements

I'm confident that my skills and experience can help you achieve your goals. Let's schedule a call to discuss your project further.

Best regards,
Anand Verma
Web Developer & Designer

---
*This email was generated using AI. Please review and customize it according to your needs.*
    `.trim();

    // Save to database
    const aiContent: Omit<AIGeneratedContent, 'id' | 'createdAt'> = {
      type: 'email_response',
      prompt: `Generate email response for ${inquiryType} inquiry from ${clientName} about ${projectDetails}`,
      generatedContent: mockContent,
      model: 'mock-ai-model',
      status: 'generated',
    };

    await addDoc(aiContentCollectionRef(), {
      ...aiContent,
      createdAt: serverTimestamp(),
    });

    return { success: true, content: mockContent };
  } catch (error) {
    console.error('Error generating email response:', error);
    return { success: false, error: 'Failed to generate email response' };
  }
}

// Get AI generated content history
export async function getAIContentHistoryAction(): Promise<AIGeneratedContent[]> {
  if (!firestore) {
    console.warn("Firestore not initialized in getAIContentHistoryAction. Returning empty array.");
    return [];
  }

  try {
    const q = query(aiContentCollectionRef(), orderBy('createdAt', 'desc'), limit(50));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return [];
    }

    return snapshot.docs.map(docSnap => {
      const data = docSnap.data();
      const createdAt = data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt || new Date().toISOString());
      
      return {
        id: docSnap.id,
        type: data.type || 'blog_post',
        prompt: data.prompt || '',
        generatedContent: data.generatedContent || '',
        model: data.model || 'unknown',
        createdAt: createdAt,
        status: data.status || 'generated',
      } as AIGeneratedContent;
    });
  } catch (error) {
    console.error("Error fetching AI content history from Firestore:", error);
    return [];
  }
}

// Update AI content status
export async function updateAIContentStatusAction(
  contentId: string,
  status: 'generated' | 'reviewed' | 'used' | 'rejected'
): Promise<{ success: boolean; message: string }> {
  if (!contentId) {
    return { success: false, message: "No content ID provided." };
  }
  if (!firestore) {
    return { success: false, message: "Firestore not initialized." };
  }

  try {
    await setDoc(aiContentDocRef(contentId), {
      status,
      updatedAt: serverTimestamp(),
    }, { merge: true });

    revalidatePath('/admin/ai-tools');

    return { 
      success: true, 
      message: `AI content status updated to ${status} successfully!` 
    };
  } catch (error) {
    console.error("Error updating AI content status:", error);
    return { 
      success: false, 
      message: "Failed to update AI content status due to a server error." 
    };
  }
}
