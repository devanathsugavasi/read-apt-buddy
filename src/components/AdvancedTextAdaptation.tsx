import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ChevronLeft, 
  Type, 
  Palette, 
  Volume2, 
  Download, 
  Settings,
  Play,
  Pause,
  RotateCcw,
  Wand2,
  Brain,
  Loader2
} from "lucide-react";
import { ReadAptAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface AdvancedTextAdaptationProps {
  onBack: () => void;
  userProfile?: any;
}

const AdvancedTextAdaptation = ({ onBack, userProfile }: AdvancedTextAdaptationProps) => {
  const [inputText, setInputText] = useState("");
  const [adaptedText, setAdaptedText] = useState("");
  const [isAdapting, setIsAdapting] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPreset, setCurrentPreset] = useState("auto");
  const [availablePresets, setAvailablePresets] = useState<any[]>([]);
  const { toast } = useToast();
  
  // Advanced adaptation settings
  const [fontSize, setFontSize] = useState([18]);
  const [lineHeight, setLineHeight] = useState([1.6]);
  const [letterSpacing, setLetterSpacing] = useState([0.05]);
  const [wordSpacing, setWordSpacing] = useState([0.1]);
  const [paragraphSpacing, setParagraphSpacing] = useState([1.5]);
  
  // Feature toggles
  const [highlightKeywords, setHighlightKeywords] = useState(true);
  const [syllableBreaks, setSyllableBreaks] = useState(false);
  const [sentenceChunking, setSentenceChunking] = useState(false);
  const [tldrMode, setTldrMode] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  
  // Color and visual settings
  const [colorScheme, setColorScheme] = useState("warm");
  const [contrast, setContrast] = useState([1.0]);
  const [backgroundOpacity, setBackgroundOpacity] = useState([0.95]);
  
  // TTS settings
  const [ttsSpeed, setTtsSpeed] = useState([1.0]);
  const [ttsPitch, setTtsPitch] = useState([1.0]);
  const [ttsVoice, setTtsVoice] = useState("default");

  const sampleTexts = {
    academic: `Cognitive load theory describes how the human brain processes information. When reading complex text, our working memory can become overwhelmed by too many simultaneous cognitive demands. This theory has significant implications for how we design educational materials and reading interfaces.`,
    
    article: `Recent studies have shown that personalized reading adaptations can improve comprehension by up to 40% for individuals with dyslexia. The research involved over 500 participants and utilized machine learning algorithms to optimize text presentation based on individual reading patterns and preferences.`,
    
    technical: `The ReadApt system employs a multi-agent architecture with four specialized AI agents: AssessmentAgent for user evaluation, PersonalizationAgent for configuration generation, ContentAgent for text processing, and MonitoringAgent for performance tracking. Each agent utilizes the Gemini API for intelligent processing with OpenAI fallbacks.`
  };

  useEffect(() => {
    loadPresets();
    
    // Apply user profile settings if available
    if (userProfile) {
      applyUserProfile(userProfile);
    }
  }, [userProfile]);

  const loadPresets = async () => {
    try {
      const presets = await ReadAptAPI.getAdaptationPresets();
      setAvailablePresets(presets || []);
    } catch (error) {
      console.error('Failed to load presets:', error);
      // Use default presets
      setAvailablePresets([
        { id: 'auto', name: 'Auto (Recommended)', description: 'AI-optimized based on your profile' },
        { id: 'dyslexia_heavy', name: 'Dyslexia Support', description: 'Heavy spacing and clear fonts' },
        { id: 'adhd_focus', name: 'ADHD Focus', description: 'Chunked content and summaries' },
        { id: 'low_vision', name: 'Low Vision', description: 'Large text and high contrast' },
        { id: 'speed_reading', name: 'Speed Reading', description: 'Optimized for fast comprehension' }
      ]);
    }
  };

  const applyUserProfile = (profile: any) => {
    if (profile.dyslexia?.severity === 'severe') {
      setLetterSpacing([0.1]);
      setWordSpacing([0.15]);
      setSyllableBreaks(true);
      setTtsSpeed([0.8]);
    }
    
    if (profile.adhd?.type !== 'normal') {
      setSentenceChunking(true);
      setTldrMode(true);
      setFocusMode(true);
    }
    
    if (profile.vision?.level === 'low_vision') {
      setFontSize([24]);
      setContrast([1.5]);
      setColorScheme('high_contrast');
    }
  };

  const handleAdaptText = async () => {
    if (!inputText.trim()) {
      toast({
        title: "No text provided",
        description: "Please enter some text to adapt.",
        variant: "destructive"
      });
      return;
    }

    setIsAdapting(true);
    try {
      const adaptationRequest = {
        text: inputText,
        dyslexia_level: userProfile?.dyslexia?.severity,
        adhd_level: userProfile?.adhd?.type,
        vision_level: userProfile?.vision?.level,
        preferences: {
          font_size: fontSize[0],
          line_height: lineHeight[0],
          letter_spacing: letterSpacing[0],
          word_spacing: wordSpacing[0],
          highlight_keywords: highlightKeywords,
          syllable_breaks: syllableBreaks,
          sentence_chunking: sentenceChunking,
          tldr_mode: tldrMode,
          focus_mode: focusMode,
          color_scheme: colorScheme,
          contrast: contrast[0]
        }
      };

      const result = await ReadAptAPI.adaptText(adaptationRequest);
      setAdaptedText(result.adapted_text || result.text);
      
      toast({
        title: "Text adapted successfully",
        description: "Your text has been optimized for better readability.",
      });
    } catch (error) {
      console.error('Adaptation failed:', error);
      toast({
        title: "Adaptation failed",
        description: "Using local processing as fallback.",
        variant: "destructive"
      });
      
      // Fallback local adaptation
      setAdaptedText(applyLocalAdaptation(inputText));
    } finally {
      setIsAdapting(false);
    }
  };

  const applyLocalAdaptation = (text: string): string => {
    let adapted = text;
    
    if (highlightKeywords) {
      const keywords = ['important', 'key', 'main', 'primary', 'significant', 'crucial', 'essential'];
      keywords.forEach(keyword => {
        const regex = new RegExp(`\\b(${keyword})\\b`, 'gi');
        adapted = adapted.replace(regex, '<mark class="bg-highlight px-1 rounded font-medium">$1</mark>');
      });
    }
    
    if (syllableBreaks) {
      adapted = adapted.replace(/\b(\w{6,})\b/g, (word) => {
        return word.replace(/(.{3})/g, '$1•').replace(/•$/, '');
      });
    }
    
    if (sentenceChunking) {
      adapted = adapted.replace(/([.!?])\s+/g, '$1\n\n');
    }
    
    if (focusMode) {
      adapted = `<div class="focus-mode bg-card/50 p-4 rounded-lg border-l-4 border-primary">${adapted}</div>`;
    }
    
    return adapted;
  };

  const handlePlayAudio = async () => {
    if (!adaptedText) return;
    
    setIsPlaying(!isPlaying);
    
    if (!isPlaying) {
      try {
        // Try backend TTS first
        const ttsRequest = {
          text: adaptedText.replace(/<[^>]*>/g, ''), // Strip HTML
          condition: userProfile?.dyslexia?.severity || 'normal',
          voice_config: {
            rate: ttsSpeed[0],
            pitch: ttsPitch[0],
            voice: ttsVoice
          }
        };
        
        await ReadAptAPI.textToSpeech(ttsRequest);
      } catch (error) {
        // Fallback to browser TTS
        const utterance = new SpeechSynthesisUtterance(adaptedText.replace(/<[^>]*>/g, ''));
        utterance.rate = ttsSpeed[0];
        utterance.pitch = ttsPitch[0];
        utterance.onend = () => setIsPlaying(false);
        speechSynthesis.speak(utterance);
      }
    } else {
      speechSynthesis.cancel();
    }
  };

  const handlePresetChange = (presetId: string) => {
    setCurrentPreset(presetId);
    
    // Apply preset configurations
    switch (presetId) {
      case 'dyslexia_heavy':
        setFontSize([20]);
        setLineHeight([1.8]);
        setLetterSpacing([0.1]);
        setWordSpacing([0.15]);
        setSyllableBreaks(true);
        setHighlightKeywords(true);
        break;
      case 'adhd_focus':
        setSentenceChunking(true);
        setTldrMode(true);
        setFocusMode(true);
        setFontSize([16]);
        break;
      case 'low_vision':
        setFontSize([24]);
        setContrast([1.5]);
        setColorScheme('high_contrast');
        break;
      case 'speed_reading':
        setFontSize([16]);
        setLineHeight([1.4]);
        setHighlightKeywords(true);
        setFocusMode(true);
        break;
    }
  };

  const getTextStyle = () => ({
    fontSize: `${fontSize[0]}px`,
    lineHeight: lineHeight[0],
    letterSpacing: `${letterSpacing[0]}em`,
    wordSpacing: `${wordSpacing[0]}em`,
    filter: `contrast(${contrast[0]})`,
    backgroundColor: colorScheme === 'warm' ? 'hsl(var(--reading-bg))' : 
                     colorScheme === 'cool' ? 'hsl(200 20% 95%)' : 
                     colorScheme === 'high_contrast' ? 'hsl(0 0% 100%)' :
                     'hsl(var(--background))',
    color: colorScheme === 'high_contrast' ? 'hsl(0 0% 0%)' : 'hsl(var(--reading-text))'
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
            <h1 className="text-3xl font-bold text-foreground">AI-Powered Text Adaptation</h1>
            <p className="text-muted-foreground reading-text">
              Transform any text with advanced accessibility features and personalized adaptations
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Input Section */}
          <Card className="lg:col-span-1 p-6 gradient-secondary border-border/50">
            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="input-text" className="text-base font-medium flex items-center gap-2">
                  <Type className="w-4 h-4" />
                  Input Text
                </Label>
                <Textarea
                  id="input-text"
                  placeholder="Paste your text here or select a sample..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-[200px] reading-text"
                />
                
                {/* Sample text buttons */}
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Quick samples:</Label>
                  <div className="grid gap-2">
                    {Object.entries(sampleTexts).map(([key, text]) => (
                      <Button
                        key={key}
                        variant="outline"
                        size="sm"
                        onClick={() => setInputText(text)}
                        className="justify-start text-xs"
                      >
                        {key.charAt(0).toUpperCase() + key.slice(1)} Text
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Adaptation Presets */}
              <div className="space-y-3">
                <Label className="text-base font-medium flex items-center gap-2">
                  <Wand2 className="w-4 h-4" />
                  Adaptation Preset
                </Label>
                <Select value={currentPreset} onValueChange={handlePresetChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availablePresets.map((preset) => (
                      <SelectItem key={preset.id} value={preset.id}>
                        {preset.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handleAdaptText}
                disabled={isAdapting || !inputText.trim()}
                className="w-full gradient-primary text-white hover:scale-105 transition-bounce"
              >
                {isAdapting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Adapting...
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4 mr-2" />
                    AI Adapt Text
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Settings Panel */}
          <Card className="lg:col-span-1 p-6 bg-card border-border/50">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Adaptation Settings
              </h3>
              
              {/* Typography Settings */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-muted-foreground">Typography</h4>
                
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label className="text-sm">Font Size: {fontSize[0]}px</Label>
                    <Slider
                      value={fontSize}
                      onValueChange={setFontSize}
                      max={32}
                      min={12}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Line Height: {lineHeight[0]}</Label>
                    <Slider
                      value={lineHeight}
                      onValueChange={setLineHeight}
                      max={2.5}
                      min={1.2}
                      step={0.1}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Letter Spacing: {letterSpacing[0]}em</Label>
                    <Slider
                      value={letterSpacing}
                      onValueChange={setLetterSpacing}
                      max={0.3}
                      min={0}
                      step={0.01}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Word Spacing: {wordSpacing[0]}em</Label>
                    <Slider
                      value={wordSpacing}
                      onValueChange={setWordSpacing}
                      max={0.5}
                      min={0}
                      step={0.01}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Feature Toggles */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-muted-foreground">Features</h4>
                
                <div className="space-y-3">
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
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="chunking" className="text-sm">Sentence Chunking</Label>
                    <Switch
                      id="chunking"
                      checked={sentenceChunking}
                      onCheckedChange={setSentenceChunking}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="tldr" className="text-sm">TL;DR Mode</Label>
                    <Switch
                      id="tldr"
                      checked={tldrMode}
                      onCheckedChange={setTldrMode}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="focus" className="text-sm">Focus Mode</Label>
                    <Switch
                      id="focus"
                      checked={focusMode}
                      onCheckedChange={setFocusMode}
                    />
                  </div>
                </div>
              </div>

              {/* Visual Settings */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-muted-foreground">Visual</h4>
                
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label className="text-sm">Color Scheme</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'warm', label: 'Warm', icon: '🌅' },
                        { id: 'cool', label: 'Cool', icon: '🌊' },
                        { id: 'high_contrast', label: 'High Contrast', icon: '⚫' },
                        { id: 'neutral', label: 'Neutral', icon: '⚪' }
                      ].map((scheme) => (
                        <Button
                          key={scheme.id}
                          variant={colorScheme === scheme.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => setColorScheme(scheme.id)}
                          className="text-xs"
                        >
                          {scheme.icon} {scheme.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Contrast: {contrast[0].toFixed(1)}</Label>
                    <Slider
                      value={contrast}
                      onValueChange={setContrast}
                      max={2.0}
                      min={0.5}
                      step={0.1}
                      className="w-full"
                    />
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
                className="min-h-[500px] p-6 rounded-lg border border-border/50 reading-text overflow-auto"
                style={getTextStyle()}
                dangerouslySetInnerHTML={{ 
                  __html: adaptedText || '<span class="text-muted-foreground">AI-adapted text will appear here...</span>' 
                }}
              />

              {/* TTS Controls */}
              {adaptedText && (
                <Card className="p-4 gradient-accent">
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <Volume2 className="w-4 h-4" />
                      Text-to-Speech Settings
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs">Speed: {ttsSpeed[0].toFixed(1)}x</Label>
                        <Slider
                          value={ttsSpeed}
                          onValueChange={setTtsSpeed}
                          max={2.0}
                          min={0.5}
                          step={0.1}
                          className="w-full"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-xs">Pitch: {ttsPitch[0].toFixed(1)}</Label>
                        <Slider
                          value={ttsPitch}
                          onValueChange={setTtsPitch}
                          max={2.0}
                          min={0.5}
                          step={0.1}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {isPlaying && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground animate-pulse">
                  <Volume2 className="w-4 h-4" />
                  Playing audio with condition-specific optimizations...
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdvancedTextAdaptation;