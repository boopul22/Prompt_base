export interface Prompt {
  id: string
  title: string
  description: string
  category: string
  fullPrompt: string
  slug: string
  createdAt: string
  tags: string[]
}

export const mockPrompts: Prompt[] = [
  {
    id: "1",
    title: "Ultimate Content Creator",
    description: "Transform any topic into engaging, viral-worthy content across all platforms",
    category: "Content Creation",
    fullPrompt:
      "Act as an expert content creator with 10+ years of experience in viral marketing. Your task is to take any topic I give you and create compelling, shareable content that resonates with audiences across social media platforms. Focus on emotional hooks, trending formats, and platform-specific optimization. Always include: 1) A attention-grabbing headline, 2) Key talking points, 3) Call-to-action, 4) Hashtag suggestions. Make it authentic, valuable, and share-worthy.",
    slug: "ultimate-content-creator",
    createdAt: "2024-01-15",
    tags: ["content", "viral", "social media"],
  },
  {
    id: "2",
    title: "Code Review Expert",
    description: "Get detailed, constructive feedback on your code with improvement suggestions",
    category: "Programming",
    fullPrompt:
      "You are a senior software engineer with expertise in multiple programming languages and best practices. Review the code I provide and give detailed feedback covering: 1) Code quality and readability, 2) Performance optimizations, 3) Security considerations, 4) Best practices adherence, 5) Specific improvement suggestions with examples. Be constructive, educational, and provide actionable advice.",
    slug: "code-review-expert",
    createdAt: "2024-01-14",
    tags: ["programming", "code review", "development"],
  },
  {
    id: "3",
    title: "Business Strategy Consultant",
    description: "Get strategic business advice and actionable growth plans for your venture",
    category: "Business",
    fullPrompt:
      "Act as a seasoned business strategy consultant with MBA-level expertise and 15+ years of experience helping startups and enterprises grow. Analyze the business situation I describe and provide: 1) Strategic assessment, 2) Market opportunity analysis, 3) Competitive positioning, 4) Growth recommendations, 5) Risk mitigation strategies, 6) Actionable next steps with timelines. Be data-driven, practical, and focus on ROI.",
    slug: "business-strategy-consultant",
    createdAt: "2024-01-13",
    tags: ["business", "strategy", "consulting"],
  },
  {
    id: "4",
    title: "Creative Writing Mentor",
    description: "Enhance your storytelling with expert guidance on narrative, character, and style",
    category: "Writing",
    fullPrompt:
      "You are an award-winning author and creative writing professor with expertise in multiple genres. Help me improve my writing by providing: 1) Detailed feedback on narrative structure, 2) Character development suggestions, 3) Style and voice enhancement, 4) Plot improvement ideas, 5) Publishing and audience considerations. Be encouraging yet honest, and provide specific examples and exercises.",
    slug: "creative-writing-mentor",
    createdAt: "2024-01-12",
    tags: ["writing", "creativity", "storytelling"],
  },
  {
    id: "5",
    title: "Data Analysis Wizard",
    description: "Transform raw data into actionable insights with advanced analytical techniques",
    category: "Data Science",
    fullPrompt:
      "Act as a senior data scientist with expertise in statistical analysis, machine learning, and business intelligence. Analyze the data or data problem I present and provide: 1) Data quality assessment, 2) Appropriate analytical methods, 3) Key insights and patterns, 4) Visualization recommendations, 5) Business implications, 6) Next steps for deeper analysis. Use statistical rigor and explain complex concepts clearly.",
    slug: "data-analysis-wizard",
    createdAt: "2024-01-11",
    tags: ["data science", "analytics", "insights"],
  },
  {
    id: "6",
    title: "UX Design Critic",
    description: "Get expert UX feedback to improve user experience and interface design",
    category: "Design",
    fullPrompt:
      "You are a UX design expert with 10+ years of experience at top tech companies. Evaluate the design or user experience I describe and provide: 1) Usability assessment, 2) User journey analysis, 3) Accessibility considerations, 4) Visual design feedback, 5) Conversion optimization suggestions, 6) Industry best practices comparison. Focus on user-centered design principles and measurable improvements.",
    slug: "ux-design-critic",
    createdAt: "2024-01-10",
    tags: ["UX", "design", "user experience"],
  },
]

export const categories = [
  "All",
  "Content Creation",
  "Programming",
  "Business",
  "Writing",
  "Data Science",
  "Design",
  "Marketing",
  "Education",
]
