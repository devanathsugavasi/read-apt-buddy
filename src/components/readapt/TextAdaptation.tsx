import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { 
  ChevronLeft, 
  Type, 
  Palette, 
  Volume2, 
  Download, 
  Settings,
  Play,
  Pause,
  RotateCcw
} from "lucide-react";

interface TextAdaptationProps {
  onBack: () => void;
  initialPreferences?: any;
}

const TextAdaptation = ({ onBack, initialPreferences }: TextAdaptationProps) => {
  const [inputText, setInputText] = useState("");
  const [adaptedText, setAdaptedText] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Adaptation settings
  const [fontSize, setFontSize] = useState([18]);
  const [lineHeight, setLineHeight] = useState([1.6]);
  const [letterSpacing, setLetterSpacing] = useState([0.05]);
  const [highlightKeywords, setHighlightKeywords] = useState(true);
  const [syllableBreaks, setSyllableBreaks] = useState(false);
  const [colorScheme, setColorScheme] = useState("warm");

  const sampleText = `Reading is a complex cognitive process of decoding symbols to derive meaning. It involves several skills including word recognition, comprehension, fluency, and motivation. For individuals with dyslexia or other reading difficulties, specialized formatting and presentation can significantly improve reading comprehension and reduce fatigue.`;

  const handleAdaptText = () => {
    const text = inputText || sampleText;
    
    // Simple adaptation logic (in real app, this would call the backend API)
    let adapted = text;
    
    if (highlightKeywords) {
      // Highlight important words
      adapted = adapted.replace(/\b(reading|comprehension|cognitive|process)\b/gi, 
        '<mark class="bg-highlight px-1 rounded">$1</mark>');
    }
    
    if (syllableBreaks) {
      // Add syllable breaks (simplified)
      adapted = adapted.replace(/\b(\w{6,})\b/g, (word) => {
        return word.replace(/(.{3})/g, '$1•');
      });
    }
    
    setAdaptedText(adapted);
  };

  const handlePlayAudio = () => {
    setIsPlaying(!isPlaying);
    // In real app, this would trigger TTS API
    if (!isPlaying) {
      // Simulate audio playback
      setTimeout(() => setIsPlaying(false), 3000);
    }
  };

  const getTextStyle = () => ({
    fontSize: `${fontSize[0]}px`,
    lineHeight: lineHeight[0],
    letterSpacing: `${letterSpacing[0]}em`,
    backgroundColor: colorScheme === 'warm' ? 'hsl(var(--reading-bg))' : 
                     colorScheme === 'cool' ? 'hsl(200 20% 95%)' : 
                     'hsl(var(--background))',
    color: 'hsl(var(--reading-text))'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-6">
      <div className="max-w-7xl mx-auto">
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
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Text Adaptation</h1>
            <p className="text-muted-foreground reading-text">
              Paste your text and customize the reading experience to your preferences
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <Card className="lg:col-span-1 p-6 gradient-secondary border-border/50">
            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="input-text" className="text-base font-medium">
                  Input Text
                </Label>
                <Textarea
                  id="input-text"
                  placeholder="Paste your text here or try our sample text..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-[200px] reading-text"
                />
              </div>

              <Button 
                onClick={handleAdaptText}
                className="w-full gradient-primary text-white hover:scale-105 transition-bounce"
              >
                <Type className="w-4 h-4 mr-2" />
                Adapt Text
              </Button>

              <div className="pt-4 border-t border-border">
                <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Adaptation Settings
                </h3>
                
                <div className="space-y-6">
                  {/* Font Size */}
                  <div className="space-y-2">
                    <Label className="text-sm">Font Size: {fontSize[0]}px</Label>
                    <Slider
                      value={fontSize}
                      onValueChange={setFontSize}
                      max={24}
                      min={12}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  {/* Line Height */}
                  <div className="space-y-2">
                    <Label className="text-sm">Line Height: {lineHeight[0]}</Label>
                    <Slider
                      value={lineHeight}
                      onValueChange={setLineHeight}
                      max={2.0}
                      min={1.2}
                      step={0.1}
                      className="w-full"
                    />
                  </div>

                  {/* Letter Spacing */}
                  <div className="space-y-2">
                    <Label className="text-sm">Letter Spacing: {letterSpacing[0]}em</Label>
                    <Slider
                      value={letterSpacing}
                      onValueChange={setLetterSpacing}
                      max={0.2}
                      min={0}
                      step={0.01}
                      className="w-full"
                    />
                  </div>

                  {/* Toggles */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="highlight" className="text-sm">Highlight Keywords</Label>
                      <Switch
                        id="highlight"
                        checked={highlightKeywords}
                        onCheckedChange={setHighlightKeywords}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="syllables" className="text-sm">Syllable Breaks</Label>
                      <Switch
                        id="syllables"
                        checked={syllableBreaks}
                        onCheckedChange={setSyllableBreaks}
                      />
                    </div>
                  </div>

                  {/* Color Scheme */}
                  <div className="space-y-2">
                    <Label className="text-sm">Color Scheme</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {['warm', 'cool', 'neutral'].map((scheme) => (
                        <Button
                          key={scheme}
                          variant={colorScheme === scheme ? "default" : "outline"}
                          size="sm"
                          onClick={() => setColorScheme(scheme)}
                          className="capitalize"
                        >
                          <Palette className="w-3 h-3 mr-1" />
                          {scheme}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Output Section */}
          <Card className="lg:col-span-2 p-6 bg-card border-border/50">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Adapted Text</h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePlayAudio}
                    disabled={!adaptedText}
                    className="hover:bg-secondary/50"
                  >
                    {isPlaying ? (
                      <Pause className="w-4 h-4 mr-2" />
                    ) : (
                      <Play className="w-4 h-4 mr-2" />
                    )}
                    {isPlaying ? 'Pause' : 'Play Audio'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!adaptedText}
                    className="hover:bg-secondary/50"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAdaptedText("")}
                    disabled={!adaptedText}
                    className="hover:bg-secondary/50"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div 
                className="min-h-[400px] p-6 rounded-lg border border-border/50 reading-text"
                style={getTextStyle()}
                dangerouslySetInnerHTML={{ 
                  __html: adaptedText || '<span class="text-muted-foreground">Adapted text will appear here...</span>' 
                }}
              />

              {isPlaying && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Volume2 className="w-4 h-4 animate-pulse" />
                  Playing audio...
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TextAdaptation;