import { useState } from "react";
import LandingPage from "@/components/LandingPage";
import EnhancedAssessmentForm from "@/components/EnhancedAssessmentForm";
import EnhancedAssessmentResults from "@/components/EnhancedAssessmentResults";
import AdvancedTextAdaptation from "@/components/AdvancedTextAdaptation";

type AppSection = 'landing' | 'assessment' | 'results' | 'textInput' | 'demo';

interface AssessmentData {
  dyslexia: { severity: string; confidence: number };
  adhd: { type: string; confidence: number };
  vision: { level: string; glasses_power?: number };
  recommendations: string[];
}

const Index = () => {
  const [currentSection, setCurrentSection] = useState<AppSection>('landing');
  const [assessmentResults, setAssessmentResults] = useState<AssessmentData | null>(null);

  const handleNavigation = (section: AppSection) => {
    setCurrentSection(section);
  };

  const handleAssessmentComplete = (results: AssessmentData) => {
    setAssessmentResults(results);
    setCurrentSection('results');
  };

  const handleRetakeAssessment = () => {
    setAssessmentResults(null);
    setCurrentSection('assessment');
  };

  const handleContinueFromResults = () => {
    setCurrentSection('textInput');
  };

  switch (currentSection) {
    case 'assessment':
      return (
        <EnhancedAssessmentForm
          onComplete={handleAssessmentComplete}
          onBack={() => setCurrentSection('landing')}
        />
      );
    
    case 'results':
      return assessmentResults ? (
        <EnhancedAssessmentResults
          results={assessmentResults}
          onContinue={handleContinueFromResults}
          onRetake={handleRetakeAssessment}
        />
      ) : null;
    
    case 'textInput':
    case 'demo':
      return (
        <AdvancedTextAdaptation
          onBack={() => setCurrentSection('landing')}
          userProfile={assessmentResults}
        />
      );
    
    default:
      return <LandingPage onNavigate={handleNavigation} />;
  }
};

export default Index;