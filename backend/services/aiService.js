// AI Service - Mock implementations (wire to OpenAI/Gemini API for production)

class AIService {
  // Analyze resume and return ATS score
  static async analyzeResume(resumeText, jobDescription = '') {
    // Mock ATS analysis
    const score = Math.floor(Math.random() * 30) + 65; // 65-95
    return {
      atsScore: score,
      feedback: [
        { category: 'Format', score: Math.min(score + 5, 100), suggestion: 'Consider using a cleaner format with clear section headers.' },
        { category: 'Keywords', score: score - 5, suggestion: 'Add more industry-specific keywords relevant to target roles.' },
        { category: 'Experience', score: score + 3, suggestion: 'Quantify your achievements with numbers and metrics.' },
        { category: 'Skills', score: score - 2, suggestion: 'List technical skills in a dedicated skills section.' },
        { category: 'Education', score: Math.min(score + 8, 100), suggestion: 'Education section is well-structured.' },
      ],
      improvements: [
        'Add measurable achievements (e.g., "Increased sales by 25%")',
        'Include relevant certifications',
        'Use action verbs to start bullet points',
        'Tailor resume keywords to job description',
      ],
    };
  }

  // Get job recommendations for a candidate
  static async getJobRecommendations(userSkills, userExperience) {
    return {
      message: 'Recommendations based on your skills and experience',
      matchScore: Math.floor(Math.random() * 20) + 75,
    };
  }

  // Analyze skill gaps
  static async analyzeSkillGap(userSkills, jobSkills) {
    const matchingSkills = userSkills.filter((s) =>
      jobSkills.some((js) => js.toLowerCase() === s.toLowerCase())
    );
    const missingSkills = jobSkills.filter((js) =>
      !userSkills.some((s) => s.toLowerCase() === js.toLowerCase())
    );

    return {
      matchPercentage: jobSkills.length > 0
        ? Math.round((matchingSkills.length / jobSkills.length) * 100)
        : 0,
      matchingSkills,
      missingSkills,
      recommendations: missingSkills.map((skill) => ({
        skill,
        suggestion: `Consider learning ${skill} through online courses or projects.`,
      })),
    };
  }
}

module.exports = AIService;
