import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, CheckCircle, Eye, Brain, Zap } from "lucide-react";
import { ReadAptAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface EnhancedAssessmentFormProps {
  onComplete: (results: AssessmentResults) => void;
  onBack: () => void;
}

interface AssessmentResults {
  dyslexia: { severity: string; confidence: number };
  adhd: { type: string; confidence: number };
  vision: { level: string; glasses_power?: number };
  recommendations: string[];
}

const EnhancedAssessmentForm = ({ onComplete, onBack }: EnhancedAssessmentFormProps) => {
  const [currentSection, setCurrentSection] = useState<'intro' | 'dyslexia' | 'adhd' | 'vision' | 'processing'>('intro');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Dyslexia Assessment State
  const [readingSpeed, setReadingSpeed] = useState([0.5]);
  const [dyslexiaAnswers, setDyslexiaAnswers] = useState<Record<string, number>>({});

  // ADHD Assessment State (18 questions, 0-3 scale)
  const [adhdAnswers, setAdhdAnswers] = useState<number[]>(new Array(18).fill(0));

  // Vision Assessment State
  const [hasGlasses, setHasGlasses] = useState<string>('');
  const [glassesPower, setGlassesPower] = useState([0]);
  const [visionDifficulties, setVisionDifficulties] = useState<string[]>([]);

  const dyslexiaQuestions = [
    { id: 'word_recognition', text: 'I have difficulty recognizing familiar words', scale: 'frequency' },
    { id: 'reading_fluency', text: 'I read more slowly than others my age', scale: 'frequency' },
    { id: 'letter_confusion', text: 'I confuse letters like b/d or p/q', scale: 'frequency' },
    { id: 'spelling_difficulty', text: 'I have trouble spelling words correctly', scale: 'frequency' },
    { id: 'comprehension', text: 'I need to read text multiple times to understand it', scale: 'frequency' },
  ];

  const adhdQuestions = [
    'I have difficulty paying attention to details',
    'I have trouble sustaining attention in tasks',
    'I don\'t seem to listen when spoken to directly',
    'I don\'t follow through on instructions',
    'I have difficulty organizing tasks and activities',
    'I avoid tasks requiring sustained mental effort',
    'I lose things necessary for tasks',
    'I am easily distracted by external stimuli',
    'I am forgetful in daily activities',
    'I fidget with hands or feet',
    'I leave my seat when expected to remain seated',
    'I feel restless or "on the go"',
    'I have difficulty engaging in leisure activities quietly',
    'I talk excessively',
    'I blurt out answers before questions are completed',
    'I have difficulty waiting my turn',
    'I interrupt or intrude on others',
    'I act as if "driven by a motor"'
  ];

  const visionDifficultyOptions = [
    'Reading text appears blurry',
    'Words seem to move or jump on the page',
    'I experience eye strain while reading',
    'I need to hold text very close or far away',
    'Bright lights cause discomfort',
    'I have difficulty with contrast'
  ];

  const scaleLabels = {
    frequency: ['Never', 'Rarely', 'Sometimes', 'Often'],
    severity: ['Not at all', 'Mild', 'Moderate', 'Severe']
  };

  const calculateDyslexiaSurveyScore = () => {
    const total = Object.values(dyslexiaAnswers).reduce((sum, val) => sum + val, 0);
    return total / (dyslexiaQuestions.length * 3); // Normalize to 0-1
  };

  const handleDyslexiaAnswer = (questionId: string, value: number) => {
    setDyslexiaAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleADHDAnswer = (index: number, value: number) => {
    setAdhdAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[index] = value;
      return newAnswers;
    });
  };

  const handleVisionDifficultyToggle = (difficulty: string) => {
    setVisionDifficulties(prev => 
      prev.includes(difficulty) 
        ? prev.filter(d => d !== difficulty)
        : [...prev, difficulty]
    );
  };

  const processAssessment = async () => {
    setIsLoading(true);
    try {
      // Run all assessments in parallel
      const [dyslexiaResult, adhdResult, visionResult] = await Promise.all([
        ReadAptAPI.predictDyslexia({
          reading_speed: readingSpeed[0],
          survey_score: calculateDyslexiaSurveyScore()
        }),
        ReadAptAPI.predictADHD({
          questions: adhdAnswers
        }),
        ReadAptAPI.classifyVision({
          glasses_power: hasGlasses === 'yes' ? glassesPower[0] : 0
        })
      ]);

      const results: AssessmentResults = {
        dyslexia: {
          severity: dyslexiaResult.severity || 'mild',
          confidence: dyslexiaResult.confidence || 0.8
        },
        adhd: {
          type: adhdResult.type || 'normal',
          confidence: adhdResult.confidence || 0.75
        },
        vision: {
          level: visionResult.level || 'normal',
          glasses_power: hasGlasses === 'yes' ? glassesPower[0] : undefined
        },
        recommendations: []
      };

      // Generate recommendations based on results
      results.recommendations = generateRecommendations(results);

      onComplete(results);
    } catch (error) {
      console.error('Assessment failed:', error);
      toast({
        title: "Assessment Error",
        description: "Unable to process assessment. Using offline analysis.",
        variant: "destructive"
      });
      
      // Fallback to local assessment
      const fallbackResults = generateFallbackResults();
      onComplete(fallbackResults);
    } finally {
      setIsLoading(false);
    }
  };

  const generateRecommendations = (results: AssessmentResults): string[] => {
    const recommendations: string[] = [];
    
    if (results.dyslexia.severity === 'severe') {
      recommendations.push('Use heavy letter and word spacing');
      recommendations.push('Enable syllable breakdown for complex words');
      recommendations.push('Use slower text-to-speech (0.8x speed)');
    }
    
    if (results.adhd.type !== 'normal') {
      recommendations.push('Break text into smaller chunks');
      recommendations.push('Use focus mode with reduced distractions');
      recommendations.push('Enable TL;DR summaries for long content');
    }
    
    if (results.vision.level === 'low_vision') {
      recommendations.push('Use 150% font size scaling');
      recommendations.push('Apply high contrast color scheme');
      recommendations.push('Enable magnification tools');
    }
    
    return recommendations;
  };

  const generateFallbackResults = (): AssessmentResults => {
    // Simple local scoring as fallback
    const dyslexiaScore = calculateDyslexiaSurveyScore();
    const adhdScore = adhdAnswers.reduce((sum, val) => sum + val, 0) / (18 * 3);
    
    return {
      dyslexia: {
        severity: dyslexiaScore > 0.7 ? 'severe' : dyslexiaScore > 0.4 ? 'moderate' : 'mild',
        confidence: 0.75
      },
      adhd: {
        type: adhdScore > 0.6 ? 'severe' : adhdScore > 0.4 ? 'moderate' : 'normal',
        confidence: 0.7
      },
      vision: {
        level: visionDifficulties.length > 3 ? 'low_vision' : visionDifficulties.length > 1 ? 'mild' : 'normal'
      },
      recommendations: ['Use comfortable reading settings', 'Consider text-to-speech', 'Adjust display preferences']
    };
  };

  const canProceed = () => {
    switch (currentSection) {
      case 'dyslexia':
        return Object.keys(dyslexiaAnswers).length === dyslexiaQuestions.length;
      case 'adhd':
        return adhdAnswers.every(answer => answer >= 0);
      case 'vision':
        return hasGlasses !== '';
      default:
        return true;
    }
  };

  const getProgress = () => {
    const sections = ['intro', 'dyslexia', 'adhd', 'vision'];
    const currentIndex = sections.indexOf(currentSection);
    return ((currentIndex + 1) / sections.length) * 100;
  };

  if (currentSection === 'processing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center p-6">
        <Card className="p-8 max-w-md w-full text-center gradient-secondary">
          <div className="space-y-6">
            <div className="w-16 h-16 mx-auto gradient-primary rounded-full flex items-center justify-center">
              <Brain className="w-8 h-8 text-white animate-pulse" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Processing Assessment</h3>
              <p className="text-muted-foreground">
                Our AI agents are analyzing your responses...
              </p>
            </div>
            <Progress value={85} className="h-3" />
            <div className="text-sm text-muted-foreground">
              Running ML models and generating personalized recommendations
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="mb-4 hover:bg-secondary/50"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="space-y-4">
            <Progress value={getProgress()} className="h-2" />
            <div className="text-center">
              <h1 className="text-3xl font-bold text-foreground">Comprehensive Assessment</h1>
              <p className="text-muted-foreground reading-text">
                Help us understand your reading preferences and challenges
              </p>
            </div>
          </div>
        </div>

        {/* Intro Section */}
        {currentSection === 'intro' && (
          <div className="space-y-6">
            <Card className="p-8 gradient-secondary text-center">
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Welcome to ReadApt Assessment</h2>
                <p className="text-muted-foreground reading-text max-w-2xl mx-auto">
                  This comprehensive assessment uses machine learning models trained on real data to 
                  understand your reading profile. We'll evaluate three key areas that affect reading comfort and comprehension.
                </p>
              </div>
            </Card>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6 gradient-accent">
                <div className="space-y-3 text-center">
                  <Brain className="w-12 h-12 text-primary mx-auto" />
                  <h3 className="font-semibold">Dyslexia Assessment</h3>
                  <p className="text-sm text-muted-foreground">
                    ML model with 100% accuracy on training data
                  </p>
                </div>
              </Card>

              <Card className="p-6 bg-card">
                <div className="space-y-3 text-center">
                  <Zap className="w-12 h-12 text-warning mx-auto" />
                  <h3 className="font-semibold">ADHD Assessment</h3>
                  <p className="text-sm text-muted-foreground">
                    18-question evaluation with 90% accuracy
                  </p>
                </div>
              </Card>

              <Card className="p-6 gradient-secondary">
                <div className="space-y-3 text-center">
                  <Eye className="w-12 h-12 text-success mx-auto" />
                  <h3 className="font-semibold">Vision Assessment</h3>
                  <p className="text-sm text-muted-foreground">
                    Adaptive visual processing evaluation
                  </p>
                </div>
              </Card>
            </div>

            <div className="text-center">
              <Button 
                size="lg" 
                onClick={() => setCurrentSection('dyslexia')}
                className="gradient-primary text-white hover:scale-105 transition-bounce"
              >
                Start Assessment
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Dyslexia Section */}
        {currentSection === 'dyslexia' && (
          <div className="space-y-6">
            <Card className="p-8 gradient-secondary">
              <div className="space-y-6">
                <div className="text-center">
                  <Brain className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h2 className="text-2xl font-semibold">Dyslexia Assessment</h2>
                  <p className="text-muted-foreground">Based on validated reading assessment criteria</p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-base font-medium">
                      Reading Speed Compared to Peers: {(readingSpeed[0] * 100).toFixed(0)}%
                    </Label>
                    <Slider
                      value={readingSpeed}
                      onValueChange={setReadingSpeed}
                      max={1}
                      min={0.1}
                      step={0.1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Much slower</span>
                      <span>Average</span>
                      <span>Much faster</span>
                    </div>
                  </div>

                  {dyslexiaQuestions.map((question) => (
                    <div key={question.id} className="space-y-3">
                      <Label className="text-base">{question.text}</Label>
                      <RadioGroup
                        value={dyslexiaAnswers[question.id]?.toString() || ""}
                        onValueChange={(value) => handleDyslexiaAnswer(question.id, parseInt(value))}
                        className="flex gap-4"
                      >
                        {scaleLabels.frequency.map((label, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <RadioGroupItem value={index.toString()} id={`${question.id}-${index}`} />
                            <Label htmlFor={`${question.id}-${index}`} className="text-sm cursor-pointer">
                              {label}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* ADHD Section */}
        {currentSection === 'adhd' && (
          <div className="space-y-6">
            <Card className="p-8 gradient-secondary">
              <div className="space-y-6">
                <div className="text-center">
                  <Zap className="w-12 h-12 text-warning mx-auto mb-4" />
                  <h2 className="text-2xl font-semibold">ADHD Assessment</h2>
                  <p className="text-muted-foreground">18-question behavioral assessment scale</p>
                </div>

                <div className="grid gap-6">
                  {adhdQuestions.map((question, index) => (
                    <div key={index} className="space-y-3">
                      <Label className="text-base">{question}</Label>
                      <RadioGroup
                        value={adhdAnswers[index]?.toString() || "0"}
                        onValueChange={(value) => handleADHDAnswer(index, parseInt(value))}
                        className="flex gap-4"
                      >
                        {scaleLabels.frequency.map((label, idx) => (
                          <div key={idx} className="flex items-center space-x-2">
                            <RadioGroupItem value={idx.toString()} id={`adhd-${index}-${idx}`} />
                            <Label htmlFor={`adhd-${index}-${idx}`} className="text-sm cursor-pointer">
                              {label}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Vision Section */}
        {currentSection === 'vision' && (
          <div className="space-y-6">
            <Card className="p-8 gradient-secondary">
              <div className="space-y-6">
                <div className="text-center">
                  <Eye className="w-12 h-12 text-success mx-auto mb-4" />
                  <h2 className="text-2xl font-semibold">Vision Assessment</h2>
                  <p className="text-muted-foreground">Visual processing and adaptation needs</p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-base font-medium">Do you wear glasses or contact lenses?</Label>
                    <RadioGroup value={hasGlasses} onValueChange={setHasGlasses} className="flex gap-6">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="glasses-yes" />
                        <Label htmlFor="glasses-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="glasses-no" />
                        <Label htmlFor="glasses-no">No</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {hasGlasses === 'yes' && (
                    <div className="space-y-3">
                      <Label className="text-base">
                        Prescription Strength: {glassesPower[0].toFixed(1)} diopters
                      </Label>
                      <Slider
                        value={glassesPower}
                        onValueChange={setGlassesPower}
                        max={10}
                        min={-10}
                        step={0.5}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>-10 (Nearsighted)</span>
                        <span>0 (No correction)</span>
                        <span>+10 (Farsighted)</span>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <Label className="text-base font-medium">
                      Select any reading difficulties you experience:
                    </Label>
                    <div className="grid grid-cols-1 gap-3">
                      {visionDifficultyOptions.map((difficulty) => (
                        <div 
                          key={difficulty}
                          className={`p-3 rounded-lg border cursor-pointer transition-smooth ${
                            visionDifficulties.includes(difficulty)
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-border hover:border-primary/50'
                          }`}
                          onClick={() => handleVisionDifficultyToggle(difficulty)}
                        >
                          <Label className="cursor-pointer">{difficulty}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={() => {
              const sections: (typeof currentSection)[] = ['intro', 'dyslexia', 'adhd', 'vision'];
              const currentIndex = sections.indexOf(currentSection);
              if (currentIndex > 0) {
                setCurrentSection(sections[currentIndex - 1]);
              }
            }}
            disabled={currentSection === 'intro'}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <Button
            onClick={() => {
              const sections: (typeof currentSection)[] = ['intro', 'dyslexia', 'adhd', 'vision'];
              const currentIndex = sections.indexOf(currentSection);
              
              if (currentIndex < sections.length - 1) {
                setCurrentSection(sections[currentIndex + 1]);
              } else {
                setCurrentSection('processing');
                processAssessment();
              }
            }}
            disabled={!canProceed() || isLoading}
            className="gradient-primary text-white hover:scale-105 transition-bounce"
          >
            {currentSection === 'vision' ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Complete Assessment
              </>
            ) : (
              <>
                Next Section
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EnhancedAssessmentForm;