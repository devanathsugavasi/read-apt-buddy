import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, Brain, Volume2, Settings, ArrowRight, Eye, Lightbulb } from "lucide-react";

interface LandingPageProps {
  onNavigate: (section: 'assessment' | 'textInput' | 'demo') => void;
}

const LandingPage = ({ onNavigate }: LandingPageProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-secondary/30">
      {/* Header */}
      <header className="container mx-auto px-6 py-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">ReadApt</h1>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-5xl font-bold text-foreground leading-tight">
              Reading Made{" "}
              <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                Accessible
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto reading-text">
              Personalized reading adaptations for dyslexia, ADHD, and vision difficulties. 
              Transform any text into a comfortable reading experience.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <Card className="p-6 hover:shadow-lg transition-smooth border-border/50 gradient-secondary">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-card-foreground">Smart Assessment</h3>
                <p className="text-sm text-muted-foreground reading-text">
                  Quick assessment to understand your reading preferences and challenges
                </p>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-smooth border-border/50 gradient-accent">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mx-auto">
                  <Eye className="w-6 h-6 text-success" />
                </div>
                <h3 className="text-lg font-semibold text-card-foreground">Text Adaptation</h3>
                <p className="text-sm text-muted-foreground reading-text">
                  AI-powered text formatting with optimal spacing, fonts, and highlighting
                </p>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-smooth border-border/50 bg-card">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center mx-auto">
                  <Volume2 className="w-6 h-6 text-warning" />
                </div>
                <h3 className="text-lg font-semibold text-card-foreground">Text-to-Speech</h3>
                <p className="text-sm text-muted-foreground reading-text">
                  Natural voice synthesis to support auditory learning
                </p>
              </div>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <Button 
              size="lg" 
              className="gradient-primary text-white hover:scale-105 transition-bounce shadow-lg"
              onClick={() => onNavigate('assessment')}
            >
              <Lightbulb className="w-5 h-5 mr-2" />
              Start Assessment
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="border-primary text-primary hover:bg-primary/5 transition-smooth"
              onClick={() => onNavigate('textInput')}
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Adapt Text Now
            </Button>
            
            <Button 
              variant="secondary" 
              size="lg"
              className="hover:bg-secondary/80 transition-smooth"
              onClick={() => onNavigate('demo')}
            >
              <Volume2 className="w-5 h-5 mr-2" />
              Try Demo
            </Button>
          </div>

          {/* Benefits Section */}
          <div className="mt-20 grid md:grid-cols-2 gap-8 text-left">
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-foreground">For Everyone</h3>
              <ul className="space-y-3 text-muted-foreground reading-text">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                  <span>Students with dyslexia or ADHD</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                  <span>Professionals who read extensive documents</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                  <span>Anyone who wants a more comfortable reading experience</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-foreground">Key Features</h3>
              <ul className="space-y-3 text-muted-foreground reading-text">
                <li className="flex items-start gap-3">
                  <Settings className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Personalized reading preferences</span>
                </li>
                <li className="flex items-start gap-3">
                  <Brain className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>AI-powered text optimization</span>
                </li>
                <li className="flex items-start gap-3">
                  <Volume2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>High-quality text-to-speech</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;