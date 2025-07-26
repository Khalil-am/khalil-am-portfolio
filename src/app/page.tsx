import Experience from "@/components/Experience";
import LinkWithIcon from "@/components/LinkWithIcon";
import Projects from "@/components/Projects";
import Socials from "@/components/Socials";
import { Button } from "@/components/ui/Button";
import { getPosts } from "@/lib/posts";
import { ArrowDownRight, ArrowRightIcon, FileDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import path from "path";
import Posts from "@/components/Posts";
import MLModels from "@/components/MLModels";
import BI from "@/components/BI";

const blogDirectory = path.join(process.cwd(), "content");
const KHALIL_BIRTH_YEAR = 1998;
const LIMIT = 2;

export default async function Home() {
  const posts = await getPosts(blogDirectory, LIMIT);

  return (
    <article className="mt-8 flex flex-col gap-16 pb-16">
      <section className="flex flex-col items-start gap-8 md:flex-row-reverse md:items-center md:justify-between">
        <Image
          className="rounded-lg"
          src="/khalil.jpg"
          alt="Photo of Khalil Abu Mushref"
          width={300}
          height={300}
          priority
        />
        <div className="flex flex-col">
          <h1 className="title text-5xl">Khalil Abu Mushref</h1>
          <p className="mt-4 font-light">
            {new Date().getFullYear() - KHALIL_BIRTH_YEAR}-year-old Sr. IT Business Consultant and Data Scientist based in Riyadh, Saudi Arabia.
          </p>
          <p className="mt-2 font-light">
            I Lead digital transformation through business consulting and analysis, helping organizations define requirements and implement effective solutions. With a background in data science, I support data-driven decisions across fintech, healthcare, AI, and enterprise systems.
          </p>
          <div className="mt-4 flex items-end gap-1">
            <p className="font-semibold">Reach out to learn more about my expertise</p>
            <ArrowDownRight className="size-5 animate-bounce" />
          </div>
          <section className="mt-8 flex items-center gap-8">
            <Link href="/Khalil_Abu_Mushref_CV.pdf" target="_blank">
              <Button variant="outline">
                <span className="font-semibold">Download CV</span>
                <FileDown className="ml-2 size-5" />
              </Button>
            </Link>
            <Socials />
          </section>
        </div>
      </section>

      <Experience />

      <section className="flex flex-col gap-8">
        <div className="flex justify-between">
          <h2 className="title text-2xl sm:text-3xl">Highlighted Projects</h2>
          <LinkWithIcon
            href="/projects"
            position="right"
            icon={<ArrowRightIcon className="size-5" />}
            text="view all"
          />
        </div>
        <Projects limit={LIMIT} />
      </section>

      {/* New BI Section */}
      <section className="flex flex-col gap-8">
        <div className="flex justify-between">
          <h2 className="title text-2xl sm:text-3xl">Business Intelligence</h2>
          <LinkWithIcon
            href="/bi" // The dedicated BI page
            position="right"
            icon={<ArrowRightIcon className="size-5" />}
            text="view all"
          />
        </div>
        <BI limit={LIMIT} />
      </section>
      {/* New ML Models Section */}
      <section className="flex flex-col gap-8">
        <div className="flex justify-between">
          <h2 className="title text-2xl sm:text-3xl">Machine Learning</h2>
          <LinkWithIcon
            href="/ml-models"  // Link to the full ML Models page
            position="right"
            icon={<ArrowRightIcon className="size-5" />}
            text="view all"
          />
        </div>
        <MLModels limit={LIMIT} /> {/* Display limited ML models */}
      </section>

      <section className="flex flex-col gap-8">
        <div className="flex justify-between">
          <h2 className="title text-3xl">Recent Insights</h2>
          <LinkWithIcon
            href="/blog"
            position="right"
            icon={<ArrowRightIcon className="size-5" />}
            text="view more"
          />
        </div>
        <Posts posts={posts} />
      </section>
    </article>
  );
}
