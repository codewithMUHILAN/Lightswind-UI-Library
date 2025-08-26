import { ScrollTimeline } from "../lightswind/scroll-timeline";
import { Briefcase, Award, Layers, Users, Globe } from "lucide-react";

export const CareerTimeline = () => {
  const careerEvents = [
    {
      year: "2024 – Present",
      title: "Director of Product Engineering",
      subtitle: "TechNova Global Solutions",
      description:
        "Leading a 200+ engineering team across 5 continents, overseeing full product lifecycle from ideation to global deployment. Introduced AI-driven development pipelines, reducing time-to-market by 38%. Established enterprise-wide accessibility and sustainability design standards.",
      icon: <Globe className="h-4 w-4 mr-2 text-primary" />,
    },
    {
      year: "2020 – 2024",
      title: "Senior Principal Engineer & Design Strategist",
      subtitle: "Innova Digital Labs",
      description:
        "Architected scalable microservices for financial and healthcare industries, serving 20M+ active users. Directed the adoption of a unified design system across 12 product lines, increasing brand consistency and dev speed by 50%. Mentored 40+ senior engineers into leadership positions.",
      icon: <Layers className="h-4 w-4 mr-2 text-primary" />,
    },
    {
      year: "2016 – 2020",
      title: "Lead Full-Stack Developer",
      subtitle: "Skyline Interactive",
      description:
        "Spearheaded the creation of immersive web applications using React, GraphQL, and Node.js for high-profile clients. Reduced application load times by 70% through advanced performance optimization. Introduced component-driven workflows that became the company's standard practice.",
      icon: <Briefcase className="h-4 w-4 mr-2 text-primary" />,
    },
    {
      year: "2012 – 2016",
      title: "Senior UI/UX Designer",
      subtitle: "PixelForge Studios",
      description:
        "Designed award-winning digital experiences for global brands, winning multiple Awwwards and Webby Awards. Championed user-centered design by integrating continuous feedback loops into every sprint. Collaborated with cross-functional teams to unify visual and interaction design.",
      icon: <Award className="h-4 w-4 mr-2 text-primary" />,
    },
    {
      year: "2008 – 2012",
      title: "Frontend Developer & Interaction Designer",
      subtitle: "CreativeSpark Agency",
      description:
        "Built responsive and interactive marketing websites during the rise of mobile-first design. Created high-conversion landing pages for major e-commerce campaigns. Developed custom animations that improved user engagement metrics by over 45%.",
      icon: <Users className="h-4 w-4 mr-2 text-primary" />,
    },
  ];

  return (
    <div id="career">
      <ScrollTimeline
        events={careerEvents}
        title="Career Journey"
        subtitle="An evolving path of leadership, innovation, and impact"
        animationOrder="staggered"
        cardAlignment="alternating"
        cardVariant="elevated"
        parallaxIntensity={0.15}
        revealAnimation="fade"
        progressIndicator={true}
        lineColor="bg-primary/20"
        activeColor="bg-primary"
        progressLineWidth={3}
        progressLineCap="round"
      />
    </div>
  );
};
