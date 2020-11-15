// Created 1/2019 by Zack Sheppard (zacksheppard.com)

import React from "react";
import ExperienceSection from "../src/contents/Resume/Experience";
import FreelanceSection from "../src/contents/Resume/Freelance";
import PastSection from "../src/contents/Resume/Past";
import ZackHeadTags from "../src/layout/ZackHeadTags";

const Resume = () => (
  <>
    <ZackHeadTags
      pageTitle="My Work Experience"
      canonicalURL="https://zack.computer/resume"
    />
    <div>
      <ExperienceSection />
      <FreelanceSection />
      <PastSection />
    </div>
  </>
);

export default Resume;
