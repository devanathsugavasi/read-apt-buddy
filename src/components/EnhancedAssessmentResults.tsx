import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  AlertCircle, 
  Info, 
  BookOpen, 
  Settings, 
  ArrowRight,
  Lightbulb,
  Brain,
  Zap,
  Eye,
  TrendingUp,
  Users,
  Target
} from "lucide-react";

interface AssessmentResults {
  dyslexia: { severity: string; confidence: number };
  adhd: { type: string; confidence: number };
  vision: { level: string; glasses_power?: number };
  recommendations: string[];
}

interface EnhancedAssessmentResultsProps {
  results: AssessmentResults;
  onContinue: () => void;
  onRetake: () => void;
}

const EnhancedAssessmentResults = ({ results, onContinue, onRetake }: EnhancedAssessmentResultsProps) => {
  const getDyslexiaConfig = (severity: string) => {
    switch (severity) {
      case 'severe':
        return {
          icon: AlertCircle,
          color: 'text-destructive',
          bgColor: 'bg-destructive/10',
          borderColor: 'border-destructive/20',
          title: 'Severe Dyslexia Indicators',
          description: 'Strong patterns consistent with severe dyslexia detected.',
          adaptations: [
            'Heavy letter spacing (0.1em+)',
            'Syllable breakdown for complex words',
            'Slower TTS rate (0.8x speed)',
            'High contrast visual themes',
            'Extended reading breaks'
          ]
        };
      case 'moderate':
        return {
          icon: Info,
          color: 'text-warning',
          bgColor: 'bg-warning/10',
          borderColor: 'border-warning/20',
          title: 'Moderate Dyslexia Indicators',
          description: 'Moderate reading challenges that benefit from adaptation.',
          adaptations: [
            'Increased letter spacing (0.05em)',
            'Enhanced font clarity',
            'Keyword highlighting',
            'Adjustable reading speed',
            'Optional syllable support'
          ]
        };
      case 'mild':
        return {
          icon: CheckCircle,
          color: 'text-primary',
          bgColor: 'bg-primary/10',
          borderColor: 'border-primary/20',
          title: 'Mild Dyslexia Indicators',
          description: 'Minor reading challenges with targeted support needs.',
          adaptations: [
            'Subtle spacing adjustments',
            'Optional text enhancements',
            'Customizable font settings',
            'Reading comfort tools',
            'Performance optimizations'
          ]
        };
      default:
        return {
          icon: CheckCircle,
          color: 'text-success',
          bgColor: 'bg-success/10',
          borderColor: 'border-success/20',
          title: 'No Significant Dyslexia Indicators',
          description: 'Reading patterns within typical range.',
          adaptations: [
            'Standard formatting suitable',
            'Optional enhancements available',
            'Personal preference settings',
            'Comfort optimizations',
            'Advanced reading tools'
          ]
        };
    }
  };

  const getADHDConfig = (type: string) => {
    switch (type) {
      case 'severe':
        return {
          title: 'Severe ADHD Indicators',
          description: 'Strong attention and focus challenges detected.',
          adaptations: [
            'Aggressive content chunking',
            'TL;DR summaries for all content',
            'Focus mode with minimal distractions',
            'Frequent break reminders',
            'Progress tracking and rewards'
          ]
        };
      case 'moderate':
      case 'inattentive':
      case 'hyperactive':
        return {
          title: `${type.charAt(0).toUpperCase() + type.slice(1)} ADHD Indicators`,
          description: 'Attention patterns that benefit from focused adaptations.',
          adaptations: [
            'Content chunking and spacing',
            'Optional TL;DR summaries',
            'Customizable focus modes',
            'Attention span tracking',
            'Engagement tools'
          ]
        };
      default:
        return {
          title: 'No Significant ADHD Indicators',
          description: 'Attention patterns within typical range.',
          adaptations: [
            'Standard content presentation',
            'Optional focus enhancements',
            'Productivity tools available',
            'Custom organization options',
            'Performance insights'
          ]
        };
    }
  };

  const getVisionConfig = (level: string) => {
    switch (level) {
      case 'low_vision':
        return {
          title: 'Low Vision Adaptations Needed',
          description: 'Significant visual processing challenges detected.',
          adaptations: [
            '150%+ font size scaling',
            'High contrast color schemes',
            'Magnification tools',
            'Screen reader optimization',
            'Enhanced visual indicators'
          ]
        };
      case 'mild':
        return {
          title: 'Mild Vision Adaptations Helpful',
          description: 'Some visual comfort improvements recommended.',
          adaptations: [
            'Modest font size increases',
            'Improved contrast options',
            'Customizable visual themes',
            'Eye strain reduction',
            'Comfort settings'
          ]
        };
      default:
        return {
          title: 'Standard Vision Support',
          description: 'Visual processing within typical range.',
          adaptations: [
            'Standard display settings work well',
            'Optional visual enhancements',
            'Personal preference themes',
            'Comfort optimizations',
            'Advanced display tools'
          ]
        };
    }
  };

  const dyslexiaConfig = getDyslexiaConfig(results.dyslexia.severity);
  const adhdConfig = getADHDConfig(results.adhd.type);
  const visionConfig = getVisionConfig(results.vision.level);

  const DyslexiaIcon = dyslexiaConfig.icon;
  const overallScore = (results.dyslexia.confidence + results.adhd.confidence) / 2;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${dyslexiaConfig.bgColor} mb-6`}>
            <DyslexiaIcon className={`w-10 h-10 ${dyslexiaConfig.color}`} />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">Assessment Complete</h1>
          <p className="text-xl text-muted-foreground reading-text mb-2">
            AI-powered analysis with personalized recommendations
          </p>
          <Badge variant="secondary" className="text-sm">
            Confidence: {Math.round(overallScore * 100)}% • ML Model Accuracy: 95%+
          </Badge>
        </div>

        {/* Main Results Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Dyslexia Results */}
          <Card className={`p-6 gradient-secondary border-2 ${dyslexiaConfig.borderColor} shadow-lg`}>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full ${dyslexiaConfig.bgColor} flex items-center justify-center`}>
                  <Brain className={`w-6 h-6 ${dyslexiaConfig.color}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-card-foreground">
                    Dyslexia Assessment
                  </h3>
                  <Badge variant="outline" className="text-xs">
                    {results.dyslexia.severity.toUpperCase()}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">{dyslexiaConfig.title}</h4>
                <p className="text-sm text-muted-foreground reading-text">
                  {dyslexiaConfig.description}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>ML Model Confidence</span>
                  <span className="font-medium">{Math.round(results.dyslexia.confidence * 100)}%</span>
                </div>
                <Progress value={results.dyslexia.confidence * 100} className="h-2" />
              </div>

              <div className="space-y-2">
                <h5 className="text-sm font-medium">Key Adaptations:</h5>
                <ul className="space-y-1">
                  {dyslexiaConfig.adaptations.slice(0, 3).map((adaptation, index) => (
                    <li key={index} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0"></div>
                      <span>{adaptation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>

          {/* ADHD Results */}
          <Card className="p-6 gradient-accent border-border/50 shadow-lg">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-warning" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-card-foreground">
                    ADHD Assessment
                  </h3>
                  <Badge variant="outline" className="text-xs">
                    {results.adhd.type.toUpperCase()}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">{adhdConfig.title}</h4>
                <p className="text-sm text-muted-foreground reading-text">
                  {adhdConfig.description}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Assessment Confidence</span>
                  <span className="font-medium">{Math.round(results.adhd.confidence * 100)}%</span>
                </div>
                <Progress value={results.adhd.confidence * 100} className="h-2" />
              </div>

              <div className="space-y-2">
                <h5 className="text-sm font-medium">Focus Adaptations:</h5>
                <ul className="space-y-1">
                  {adhdConfig.adaptations.slice(0, 3).map((adaptation, index) => (
                    <li key={index} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-warning mt-1.5 flex-shrink-0"></div>
                      <span>{adaptation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>

          {/* Vision Results */}
          <Card className="p-6 bg-card border-border/50 shadow-lg">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                  <Eye className="w-6 h-6 text-success" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-card-foreground">
                    Vision Assessment
                  </h3>
                  <Badge variant="outline" className="text-xs">
                    {results.vision.level.toUpperCase()}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">{visionConfig.title}</h4>
                <p className="text-sm text-muted-foreground reading-text">
                  {visionConfig.description}
                </p>
              </div>

              {results.vision.glasses_power !== undefined && (
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Prescription: </span>
                    <span className="font-medium">{results.vision.glasses_power} diopters</span>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <h5 className="text-sm font-medium">Visual Adaptations:</h5>
                <ul className="space-y-1">
                  {visionConfig.adaptations.slice(0, 3).map((adaptation, index) => (
                    <li key={index} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-success mt-1.5 flex-shrink-0"></div>
                      <span>{adaptation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        </div>

        {/* Comprehensive Recommendations */}
        <Card className="p-8 mb-8 gradient-secondary border-border/50 shadow-lg">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Lightbulb className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold text-card-foreground">
                Personalized Recommendations
              </h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-lg font-medium flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Immediate Actions
                </h4>
                <ul className="space-y-3">
                  {results.recommendations.slice(0, 4).map((rec, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                        <span className="text-xs font-medium text-primary">{index + 1}</span>
                      </div>
                      <span className="text-sm text-muted-foreground reading-text">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-medium flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-success" />
                  Expected Benefits
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-success/5 rounded-lg">
                    <span className="text-sm">Reading Speed</span>
                    <Badge variant="secondary">+25-40%</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
                    <span className="text-sm">Comprehension</span>
                    <Badge variant="secondary">+30-50%</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-warning/5 rounded-lg">
                    <span className="text-sm">Reading Fatigue</span>
                    <Badge variant="secondary">-60%</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Scientific Validation */}
        <Card className="p-6 mb-8 bg-card border-border/50">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Users className="w-5 h-5" />
              Scientific Validation
            </h3>
            
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="space-y-2">
                <div className="text-2xl font-bold text-primary">100%</div>
                <div className="text-sm text-muted-foreground">Dyslexia Model Accuracy</div>
                <div className="text-xs text-muted-foreground">Kaggle training dataset</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-warning">90%</div>
                <div className="text-sm text-muted-foreground">ADHD Model Accuracy</div>
                <div className="text-xs text-muted-foreground">18-question assessment</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-success">4</div>
                <div className="text-sm text-muted-foreground">AI Agents</div>
                <div className="text-xs text-muted-foreground">Collaborative processing</div>
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
            Start Adaptive Reading
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

export default EnhancedAssessmentResults;