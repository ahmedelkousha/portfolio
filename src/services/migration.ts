import { portfolioService } from "./portfolioService";
import { 
  personalInfo, 
  skills, 
  projects, 
  experience, 
  education, 
  testimonials,
  seoExpertise
} from "@/data/portfolio";

export const migrateDataToFirebase = async () => {
  try {
    console.log("🚀 Starting migration...");

    // 1. Personal Info
    console.log("Migrating personalInfo...");
    await portfolioService.save("metadata", "personalInfo", personalInfo);
    console.log("✅ Migrated personalInfo");

    // 2. Skills
    console.log("Migrating skills...");
    const skillsArray = Object.entries(skills).map(([key, value]) => ({
      title: key.charAt(0).toUpperCase() + key.slice(1),
      skills: value
    }));
    await portfolioService.save("metadata", "skills", { categories: skillsArray });
    console.log("✅ Migrated skills");

    // 3. Projects
    console.log(`Migrating ${projects.length} projects...`);
    for (const project of projects) {
      await portfolioService.save("projects", project.id.toString(), project);
    }
    console.log("✅ Migrated projects");

    // 4. Experience
    console.log(`Migrating ${experience.length} experience items...`);
    for (const exp of experience) {
      await portfolioService.save("experience", exp.id.toString(), exp);
    }
    console.log("✅ Migrated experience");

    // 5. Education
    console.log(`Migrating ${education.length} education items...`);
    for (const edu of education) {
      await portfolioService.save("education", edu.id.toString(), edu);
    }
    console.log("✅ Migrated education");

    // 6. Testimonials
    console.log(`Migrating ${testimonials.length} testimonials...`);
    for (const test of testimonials) {
      await portfolioService.save("testimonials", test.id.toString(), test);
    }
    console.log("✅ Migrated testimonials");

    // 7. SEO Expertise
    console.log(`Migrating ${seoExpertise.length} SEO items...`);
    for (const item of seoExpertise) {
      await portfolioService.save("seoExpertise", item.id.toString(), item);
    }
    console.log("✅ Migrated SEO Expertise");

    console.log("✨ Migration complete!");
    return true;
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error; // Throwing so the UI catch block can see it
  }
};
