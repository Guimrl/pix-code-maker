import { useState } from "react";
import { PixForm } from "@/components/PixForm";
import { PixQRCode } from "@/components/PixQRCode";
import { generatePixCode, PixData } from "@/utils/pixGenerator";
import { QrCodeIcon, Sparkles, Download, Copy } from "lucide-react";

const Index = () => {
  const [pixCode, setPixCode] = useState<string>("");
  const [pixData, setPixData] = useState<PixData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async (data: PixData) => {
    setIsGenerating(true);
    try {
      // Simulate processing time for better UX
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const code = generatePixCode(data);
      setPixCode(code);
      setPixData(data);
    } catch (error) {
      console.error("Erro ao gerar código PIX:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-pix-gradient py-8 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center mb-4">
            <QrCodeIcon className="w-12 h-12 text-white mr-3" />
            <h1 className="text-4xl font-bold text-white">
              Gerador PIX QR Code
            </h1>
          </div>
          <p className="text-white/90 text-lg max-w-2xl mx-auto">
            Crie QR Codes PIX instantaneamente para receber pagamentos de forma rápida e segura
          </p>
          <div className="flex items-center justify-center mt-4 text-white/80">
            <Sparkles className="w-5 h-5 mr-2" />
            <span className="text-sm">Gratuito • Seguro • Instantâneo</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          {/* Form */}
          <div className="w-full lg:w-auto">
            <PixForm onGenerate={handleGenerate} isGenerating={isGenerating} />
          </div>

          {/* QR Code Result */}
          {pixCode && pixData && (
            <div className="w-full lg:w-auto animate-in slide-in-from-right duration-500">
              <PixQRCode pixCode={pixCode} pixData={pixData} />
            </div>
          )}
        </div>

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="text-center p-6 rounded-xl bg-card border border-border shadow-card">
            <div className="w-12 h-12 bg-pix-gradient rounded-full flex items-center justify-center mx-auto mb-4">
              <QrCodeIcon className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">QR Code Instantâneo</h3>
            <p className="text-muted-foreground text-sm">
              Gere QR Codes PIX em segundos com todos os dados necessários
            </p>
          </div>

          <div className="text-center p-6 rounded-xl bg-card border border-border shadow-card">
            <div className="w-12 h-12 bg-pix-gradient rounded-full flex items-center justify-center mx-auto mb-4">
              <Download className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Download Gratuito</h3>
            <p className="text-muted-foreground text-sm">
              Baixe seu QR Code em alta qualidade formato PNG
            </p>
          </div>

          <div className="text-center p-6 rounded-xl bg-card border border-border shadow-card">
            <div className="w-12 h-12 bg-pix-gradient rounded-full flex items-center justify-center mx-auto mb-4">
              <Copy className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Copia e Cola</h3>
            <p className="text-muted-foreground text-sm">
              Código PIX pronto para usar em qualquer app de pagamento
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-muted py-8 px-4 mt-16">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground">
            Desenvolvido com ❤️ para facilitar seus pagamentos PIX
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;