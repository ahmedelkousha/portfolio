import { motion } from "framer-motion";
import { ExternalLink, Github, Star, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { projects as staticProjects } from "@/data/portfolio";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useIsMobile } from "@/hooks/use-mobile";
import { ProjectPreview } from "@/components/ProjectPreview";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { localizeField } from "@/services/portfolioService";
import * as React from "react";
import { useTranslation } from "react-i18next";

const ProjectCard = ({ project, index }: { project: any; index: number }) => {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.04 }}
      className="group glass-card rounded-2xl overflow-hidden flex flex-col"
    >
      {/* Project Image */}
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        <ProjectPreview url={project.liveDemo} title={project.title} image={project.image} />
        <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
          <Button size="sm" variant="outline" className="border-primary" asChild>
            <a href={project.github} target="_blank" rel="noopener noreferrer">
              <Github className="h-4 w-4 mr-2" />
              {t("projects.code")}
            </a>
          </Button>
          <Button size="sm" className="bg-gradient-cyan-blue" asChild>
            <a href={project.liveDemo} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              {t("projects.demo")}
            </a>
          </Button>
        </div>
        {project.featured && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-gradient-cyan-blue text-primary-foreground">
              <Star className="h-3 w-3 mr-1" />
              {t("projects.featured")}
            </Badge>
          </div>
        )}
      </div>

      {/* Project Info */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
          {project.title}
        </h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {project.technologies?.map((tech: string) => (
            <Badge key={tech} variant="secondary" className="text-xs font-mono">
              {tech}
            </Badge>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export const Projects = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === "ar" ? "ar" : "en";
  const { data: dbProjects, loading } = usePortfolioData("projects");
  const isMobile = useIsMobile();

  const rawList = dbProjects.length > 0 ? dbProjects : staticProjects;

  const allProjects = rawList.map((p: any) => ({
    ...p,
    title: localizeField(p, "title", lang),
    description: localizeField(p, "description", lang),
  }));

  const featuredProjects = allProjects.filter((p: any) => p.featured);
  const otherProjects = allProjects.filter((p: any) => !p.featured);

  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => { setCurrent(api.selectedScrollSnap()); });
  }, [api]);


  return (
    <section id="projects" className="py-20 bg-muted/30">
      <div className="section-container">
        <SectionHeading
          title={t("projects.title")}
          subtitle={t("projects.subtitle")}
        />

        {loading && dbProjects.length === 0 && (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {isMobile ? (
          <div className="mb-12">
            <div dir="ltr">
              <Carousel
                setApi={setApi}
                opts={{ align: "start", loop: true }}
                className="w-full"
              >
                <CarouselContent className="-ml-2 md:-ml-4">
                  {featuredProjects.map((project: any, index: number) => (
                    <CarouselItem key={project.id} className="pl-2 md:pl-4 basis-[85%]">
                      <div dir={lang === "ar" ? "rtl" : "ltr"}>
                        <ProjectCard project={project} index={index} />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="flex flex-col items-center gap-6 mt-6">
                  <div className="flex gap-2">
                    {Array.from({ length: count }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => api?.scrollTo(i)}
                        className={`h-1.5 transition-all duration-300 rounded-full ${current === i ? "w-8 bg-primary" : "w-1.5 bg-primary/20"
                          }`}
                      />
                    ))}
                  </div>
                  <div className="flex justify-center gap-4">
                    <CarouselPrevious className="relative left-0 translate-y-0" />
                    <CarouselNext className="relative right-0 translate-y-0" />
                  </div>
                </div>
              </Carousel>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6 mb-12">
            {featuredProjects.map((project: any, index: number) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        )}

        {otherProjects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-20"
          >
            <h3 className="text-2xl font-bold text-center mb-10 text-foreground">
              {t("projects.otherTitle")}
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherProjects.map((project: any, index: number) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="glass-card rounded-2xl overflow-hidden group border border-border/50"
                >
                  <div className="aspect-video w-full relative overflow-hidden bg-muted">
                    <ProjectPreview url={project.liveDemo} title={project.title} image={project.image} />
                    <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                      <Button size="sm" variant="outline" className="border-primary" asChild>
                        <a href={project.github} target="_blank" rel="noopener noreferrer">
                          <Github className="h-4 w-4 mr-2" />
                          {t("projects.code")}
                        </a>
                      </Button>
                      <Button size="sm" className="bg-gradient-cyan-blue" asChild>
                        <a href={project.liveDemo} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          {t("projects.demo")}
                        </a>
                      </Button>
                    </div>
                  </div>
                  <div className="p-5">
                    <h4 className="font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {project.title}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {project.technologies?.slice(0, 3).map((tech: string) => (
                        <Badge key={tech} variant="secondary" className="text-[10px] py-0 px-2 font-mono opacity-70">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};
