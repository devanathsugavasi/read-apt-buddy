import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle, 
  AlertCircle, 
  Info, 
  BookOpen, 
  Settings, 
  ArrowRight,
  Lightbulb 
} from "lucide-react";

interface AssessmentResults {
  difficulty: string;
  preferences: Record<string, string>;
  confidence: number;
}

interface AssessmentResultsProps {
  results: AssessmentResults;
  onContinue: () => void;
  onRetake: () => void;
}

const AssessmentResults = ({ results, onContinue, onRetake }: AssessmentResultsProps) => {
  const getDifficultyConfig = (difficulty: string) => {
    switch (difficulty) {
      case 'high':
        return {
          icon: AlertCircle,
          color: 'text-warning',
          bgColor: 'bg-warning/10',
          title: 'Significant Reading Challenges Detected',
          description: 'Our assessment suggests you may benefit significantly from reading adaptations.',
          recommendations: [
            'Larger font sizes and increased spacing',
            'High contrast color schemes',
            'Frequent use of text-to-speech',
            'Syllable breakdown for complex words',
            'Regular breaks during reading sessions'
          ]
        };
      case 'moderate':
        return {
          icon: Info,
          color: 'text-primary',
          bgColor: 'bg-primary/10',
          title: 'Moderate Reading Challenges Detected',
          description: 'You show some signs of reading difficulties that could be helped with adaptations.',
          recommendations: [
            'Adjusted font size and spacing',
            'Keyword highlighting',
            'Optional text-to-speech for longer texts',
            'Comfortable color schemes',
            'Customizable reading environment'
          ]
        };
      case 'mild':
        return {
          icon: CheckCircle,
          color: 'text-success',
          bgColor: 'bg-success/10',
          title: 'Mild Reading Preferences Detected',
          description: 'You have good reading skills but may benefit from minor adaptations.',
          recommendations: [
            'Optional formatting adjustments',
            'Customizable reading preferences',
            'Text-to-speech for convenience',
            'Personal reading environment',
            'Performance optimization tools'
          ]
        };
      default:
        return {
          icon: CheckCircle,
          color: 'text-success',
          bgColor: 'bg-success/10',
          title: 'Strong Reading Skills Detected',
          description: 'You demonstrate strong reading abilities with minimal challenges.',
          recommendations: [
            'Standard formatting works well for you',
            'Optional enhancements available',
            'Text-to-speech for multitasking',
            'Speed reading optimizations',
            'Advanced reading tools'
          ]
        };
    }
  };

  const config = getDifficultyConfig(results.difficulty);
  const IconComponent = config.icon;
  const confidencePercentage = Math.round(results.confidence * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${config.bgColor} mb-4`}>
            <IconComponent className={`w-8 h-8 ${config.color}`} />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Assessment Complete</h1>
          <p className="text-muted-foreground reading-text">
            Here are your personalized reading recommendations
          </p>
        </div>

        {/* Results Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Main Result */}
          <Card className="p-6 gradient-secondary border-border/50 shadow-lg">
            <div className="space-y-4">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${config.bgColor}`}>
                <IconComponent className={`w-6 h-6 ${config.color}`} />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-card-foreground">
                  {config.title}
                </h3>
                <p className="text-muted-foreground reading-text">
                  {config.description}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Confidence Level</span>
                  <span className="font-medium">{confidencePercentage}%</span>
                </div>
                <Progress value={confidencePercentage} className="h-2" />
              </div>
            </div>
          </Card>

          {/* Recommendations */}
          <Card className="p-6 bg-card border-border/50 shadow-lg">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Lightbulb className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground">
                  Recommendations
                </h3>
              </div>
              
              <ul className="space-y-3">
                {config.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-muted-foreground reading-text">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </div>

        {/* Assessment Details */}
        <Card className="p-6 mb-8 gradient-accent border-border/50">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">Assessment Summary</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Reading Speed:</span>
                <span className="text-sm font-medium">{results.preferences.reading_speed?.replace('_', ' ') || 'Not assessed'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Word Recognition:</span>
                <span className="text-sm font-medium">{results.preferences.word_recognition || 'Not assessed'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Letter Confusion:</span>
                <span className="text-sm font-medium">{results.preferences.letter_confusion || 'Not assessed'}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Attention Span:</span>
                <span className="text-sm font-medium">{results.preferences.attention_span?.replace('_', ' ') || 'Not assessed'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Visual Stress:</span>
                <span className="text-sm font-medium">{results.preferences.visual_stress?.replace('_', ' ') || 'Not assessed'}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            onClick={onContinue}
            className="gradient-primary text-white hover:scale-105 transition-bounce shadow-lg"
          >
            <BookOpen className="w-5 h-5 mr-2" />
            Start Reading with Adaptations
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            onClick={onRetake}
            className="border-primary text-primary hover:bg-primary/5 transition-smooth"
          >
            <Settings className="w-5 h-5 mr-2" />
            Retake Assessment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AssessmentResults;