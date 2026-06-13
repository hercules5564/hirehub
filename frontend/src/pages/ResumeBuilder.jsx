import { HiOutlineDocumentText } from 'react-icons/hi';
import { Link } from 'react-router-dom';

const ResumeBuilder = () => (
  <div className="min-h-screen bg-dark-50 dark:bg-dark-900 pt-20">
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center animate-fade-in">
      <div className="w-20 h-20 mx-auto mb-6 rounded-2xl gradient-primary flex items-center justify-center animate-pulse-glow">
        <HiOutlineDocumentText className="w-10 h-10 text-white" />
      </div>
      <h1 className="text-3xl font-bold text-dark-900 dark:text-white mb-4">Resume Builder</h1>
      <p className="text-lg text-dark-500 mb-8 max-w-lg mx-auto">
        Create a professional, ATS-friendly resume in minutes. Choose from modern templates and get AI-powered suggestions.
      </p>
      <div className="bg-white dark:bg-dark-800 rounded-2xl p-8 border border-gray-100 dark:border-dark-700 mb-6">
        <div className="grid sm:grid-cols-3 gap-6 mb-8">
          {[
            { emoji: '📝', title: 'Choose Template', desc: 'Pick from 10+ professional templates' },
            { emoji: '✏️', title: 'Fill Details', desc: 'Add your experience, skills & education' },
            { emoji: '📄', title: 'Download PDF', desc: 'Get your resume in one click' },
          ].map((step, i) => (
            <div key={i} className="text-center">
              <span className="text-3xl mb-2 block">{step.emoji}</span>
              <h3 className="font-semibold text-dark-900 dark:text-white text-sm mb-1">{step.title}</h3>
              <p className="text-xs text-dark-500">{step.desc}</p>
            </div>
          ))}
        </div>
        <div className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 text-sm">
          🚀 Coming Soon — Interactive drag-and-drop resume builder with AI suggestions
        </div>
      </div>
      <Link to="/profile" className="btn-primary">Update Profile Instead</Link>
    </div>
  </div>
);

export default ResumeBuilder;
