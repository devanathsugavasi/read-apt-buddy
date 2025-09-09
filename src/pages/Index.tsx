import { useState } from "react";
import LandingPage from "@/components/LandingPage";
import AssessmentForm from "@/components/AssessmentForm";
import AssessmentResults from "@/components/AssessmentResults";
import TextAdaptation from "@/components/TextAdaptation";

type AppSection = 'landing' | 'assessment' | 'results' | 'textInput' | 'demo';

interface AssessmentData {
  difficulty: string;
  preferences: Record<string, string>;
  confidence: number;
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
        <AssessmentForm
          onComplete={handleAssessmentComplete}
          onBack={() => setCurrentSection('landing')}
        />
      );
    
    case 'results':
      return assessmentResults ? (
        <AssessmentResults
          results={assessmentResults}
          onContinue={handleContinueFromResults}
          onRetake={handleRetakeAssessment}
        />
      ) : null;
    
    case 'textInput':
    case 'demo':
      return (
        <TextAdaptation
          onBack={() => setCurrentSection('landing')}
          initialPreferences={assessmentResults?.preferences}
        />
      );
    
    default:
      return <LandingPage onNavigate={handleNavigation} />;
  }
};

export default Index;