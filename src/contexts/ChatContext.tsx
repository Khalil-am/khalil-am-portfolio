import { createContext, ReactNode, useContext, useState } from "react";

// Define the ChatContext with initial values
const ChatContext = createContext({
  isVisible: true,
  toggleChatbot: () => {},
  userContext: {}, // Add a property for user context
});

// Hook to use the ChatContext
export const useChatbot = () => useContext(ChatContext);

interface Props {
  children: ReactNode;
}

// ChatProvider component
export function ChatProvider({ children }: Props) {
  const [isVisible, setIsVisible] = useState(true);

  // User context including education, experience, and social media
  const userContext = {
    name: "Khalil Abu Mushref",
    occupation: "Data Scientist and Software Developer",
    background: {
      education: [
        {
          name: "Monash University",
          href: "https://www.monash.edu",
          title: "Masters of Business Administration (MBA)",
          logo: "/monash.png",
          start: "2024",
          description: ["Specialized in IT to enhance leadership and strategic skills."],
        },
        {
          name: "UCSI University",
          href: "https://www.ucsiuniversity.edu.my",
          title: "Masters of Science in Computer Science",
          logo: "/ucsi.jpg",
          start: "2023",
          description: [
            "Thesis in Data Science.",
            "Financial Data Analysis Algorithmic Trading: Developing Predictive Models Using Financial Time Series Data.",
          ],
        },
        {
          name: "University of Jordan",
          href: "https://www.ju.edu.jo",
          title: "Bachelor of Computer Engineering",
          logo: "/university-of-jordan.png",
          start: "2017",
          end: "2020",
          description: ["Graduation project: Virtue Mental Health Application with research publication and deployment."],
        },
      ],
      experience: [
        {
          role: "Founder",
          company: "Wajibaty AI",
          description: "AI-powered platform for task management.",
        },
        {
          role: "Founder",
          company: "SautNote AI",
          description: "AI-driven transcription service.",
        },
        {
          role: "Founder",
          company: "PRF Production",
          description: "Creative services including video production and photography.",
        },
        {
          role: "Founder",
          company: "KPI on the Fly AI",
          description: "Business intelligence platform integrating Apache Superset for KPI generation.",
        },
        {
          role: "Founder",
          company: "BIAC",
          description: "Comprehensive business intelligence solution focusing on real-time data visualization and machine learning.",
        },
        {
          role: "Founder",
          company: "SCIC Project",
          description: "AI platform for supply chain optimization.",
        },
        {
          role: "Founder",
          company: "Fashion on the Fly",
          description: "AI-driven fashion discovery platform.",
        },
      ],
    },
    socialMedia: {
      linkedIn: "https://linkedin.com/in/khalil-am",
      gitHub: "https://github.com/Khalil-am",
      email: "Khalil@khalil-am.com",
    },
    interests: ["data science", "technology", "machine learning", "AI"],
    description: "Personal site to showcase my work, projects, and insights on data science and technology.",
  };

  // Function to toggle the chatbot's visibility
  const toggleChatbot = () => {
    setIsVisible(!isVisible);
  };

  return (
    <ChatContext.Provider value={{ isVisible, toggleChatbot, userContext }}>
      {children}
    </ChatContext.Provider>
  );
}
