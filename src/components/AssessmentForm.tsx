import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";

interface AssessmentFormProps {
  onComplete: (results: AssessmentResults) => void;
  onBack: () => void;
}

interface AssessmentResults {
  difficulty: string;
  preferences: Record<string, string>;
  confidence: number;
}

const AssessmentForm = ({ onComplete, onBack }: AssessmentFormProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const questions = [
    {
      id: "reading_speed",
      title: "Reading Speed",
      question: "How would you describe your reading speed?",
      options: [
        { value: "very_slow", label: "Much slower than others" },
        { value: "slow", label: "Somewhat slower than others" },
        { value: "average", label: "About average" },
        { value: "fast", label: "Faster than average" }
      ]
    },
    {
      id: "word_recognition",
      title: "Word Recognition",
      question: "Do you have difficulty recognizing familiar words?",
      options: [
        { value: "often", label: "Often" },
        { value: "sometimes", label: "Sometimes" },
        { value: "rarely", label: "Rarely" },
        { value: "never", label: "Never" }
      ]
    },
    {
      id: "letter_confusion",
      title: "Letter Confusion",
      question: "Do you mix up letters like 'b' and 'd' or 'p' and 'q'?",
      options: [
        { value: "frequently", label: "Frequently" },
        { value: "occasionally", label: "Occasionally" },
        { value: "rarely", label: "Rarely" },
        { value: "never", label: "Never" }
      ]
    },
    {
      id: "attention_span",
      title: "Attention & Focus",
      question: "How long can you typically focus while reading?",
      options: [
        { value: "few_minutes", label: "A few minutes" },
        { value: "10_15_minutes", label: "10-15 minutes" },
        { value: "30_minutes", label: "30 minutes or more" },
        { value: "unlimited", label: "As long as needed" }
      ]
    },
    {
      id: "visual_stress",
      title: "Visual Comfort",
      question: "Do words appear to move, blur, or cause eye strain when reading?",
      options: [
        { value: "very_often", label: "Very often" },
        { value: "sometimes", label: "Sometimes" },
        { value: "rarely", label: "Rarely" },
        { value: "never", label: "Never" }
      ]
    }
  ];

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  const handleAnswer = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Calculate results
      const results = calculateResults(answers);
      onComplete(results);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else {
      onBack();
    }
  };

  const calculateResults = (answers: Record<string, string>): AssessmentResults => {
    // Simple scoring logic - in real app, this would be more sophisticated
    let difficultyScore = 0;
    
    Object.entries(answers).forEach(([key, value]) => {
      if (key === 'reading_speed' && ['very_slow', 'slow'].includes(value)) difficultyScore += 2;
      if (key === 'word_recognition' && ['often', 'sometimes'].includes(value)) difficultyScore += 2;
      if (key === 'letter_confusion' && ['frequently', 'occasionally'].includes(value)) difficultyScore += 2;
      if (key === 'attention_span' && ['few_minutes', '10_15_minutes'].includes(value)) difficultyScore += 2;
      if (key === 'visual_stress' && ['very_often', 'sometimes'].includes(value)) difficultyScore += 2;
    });

    let difficulty = 'none';
    let confidence = 0.6;

    if (difficultyScore >= 6) {
      difficulty = 'high';
      confidence = 0.85;
    } else if (difficultyScore >= 4) {
      difficulty = 'moderate';
      confidence = 0.75;
    } else if (difficultyScore >= 2) {
      difficulty = 'mild';
      confidence = 0.65;
    }

    return {
      difficulty,
      preferences: answers,
      confidence
    };
  };

  const isCurrentAnswered = answers[currentQuestion.id] !== undefined;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={handlePrevious}
            className="mb-4 hover:bg-secondary/50"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="text-sm text-muted-foreground">
                Question {currentStep + 1} of {questions.length}
              </div>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* Question Card */}
        <Card className="p-8 gradient-secondary border-border/50 shadow-lg">
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-sm font-medium text-primary">{currentQuestion.title}</h2>
              <h3 className="text-2xl font-semibold text-card-foreground reading-text">
                {currentQuestion.question}
              </h3>
            </div>

            <RadioGroup 
              value={answers[currentQuestion.id] || ""} 
              onValueChange={handleAnswer}
              className="space-y-4"
            >
              {currentQuestion.options.map((option) => (
                <div key={option.value} className="flex items-center space-x-3">
                  <RadioGroupItem 
                    value={option.value} 
                    id={option.value}
                    className="text-primary border-border"
                  />
                  <Label 
                    htmlFor={option.value} 
                    className="text-base reading-text cursor-pointer hover:text-primary transition-smooth"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <div></div>
          <Button
            onClick={handleNext}
            disabled={!isCurrentAnswered}
            className="gradient-primary text-white hover:scale-105 transition-bounce shadow-lg disabled:opacity-50 disabled:hover:scale-100"
          >
            {currentStep === questions.length - 1 ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Complete Assessment
              </>
            ) : (
              <>
                Next Question
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AssessmentForm;