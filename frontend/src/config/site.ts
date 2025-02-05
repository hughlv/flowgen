export const siteConfig = {
  name: 'Agentok Studio',
  description: 'Build Agentic Apps',
  url:
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:2855'
      : 'https://cloud.ticos.ai',
  ogImage: 'https://cloud.ticos.ai/og.jpg',
  links: {
    twitter: 'https://x.com/tiwater_com',
    github: 'https://github.com/tiwater',
  },
};
