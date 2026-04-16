/**
 * Career Score Calculation
 * Skills      → 5 pts each  (max 25)
 * Projects    → 10 pts each (max 30)
 * Internships → 15 pts each (max 30)
 * Certificates→ 5 pts each  (max 15)
 * Total Max   → 100
 */

export const calculateCareerScore = (profile) => {
  const { skills = [], projects = [], internships = [], certificates = [] } = profile;

  const skillScore    = Math.min(skills.length * 5, 25);
  const projectScore  = Math.min(projects.length * 10, 30);
  const internScore   = Math.min(internships.length * 15, 30);
  const certScore     = Math.min(certificates.length * 5, 15);

  const total = skillScore + projectScore + internScore + certScore;

  return {
    total,
    breakdown: {
      skills: skillScore,
      projects: projectScore,
      internships: internScore,
      certificates: certScore,
    },
  };
};
