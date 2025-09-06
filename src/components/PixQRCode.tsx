import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Copy, Download, RefreshCw } from "lucide-react";

interface PixQRCodeProps {
  pixCode: string;
  pixData: {
    recipientName: string;
    amount?: number;
  };
}

export function PixQRCode({ pixCode, pixData }: PixQRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    generateQRCode();
  }, [pixCode]);

  const generateQRCode = async () => {
    if (!canvasRef.current || !pixCode) return;
    
    setIsGenerating(true);
    try {
      await QRCode.toCanvas(canvasRef.current, pixCode, {
        width: 280,
        margin: 2,
        color: {
          dark: "#1a1a1a",
          light: "#ffffff",
        },
        errorCorrectionLevel: "M",
      });
    } catch (error) {
      console.error("Erro ao gerar QR Code:", error);
      toast({
        title: "Erro",
        description: "Falha ao gerar o QR Code. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyPixCode = async () => {
    try {
      await navigator.clipboard.writeText(pixCode);
      toast({
        title: "Sucesso!",
        description: "Código PIX copiado para a área de transferência",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao copiar código PIX",
        variant: "destructive",
      });
    }
  };

  const downloadQRCode = () => {
    if (!canvasRef.current) return;
    
    try {
      const link = document.createElement("a");
      link.download = `qr-code-pix-${pixData.recipientName.replace(/\s+/g, "-").toLowerCase()}.png`;
      link.href = canvasRef.current.toDataURL("image/png", 1.0);
      link.click();
      
      toast({
        title: "Sucesso!",
        description: "QR Code baixado com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao baixar QR Code",
        variant: "destructive",
      });
    }
  };

  if (!pixCode) return null;

  return (
    <Card className="w-full max-w-md bg-card border-border shadow-card">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-xl font-bold text-foreground">
          QR Code PIX Gerado
        </CardTitle>
        <p className="text-muted-foreground text-sm">
          {pixData.recipientName}
          {pixData.amount && (
            <span className="block font-semibold text-primary mt-1">
              R$ {pixData.amount.toFixed(2).replace(".", ",")}
            </span>
          )}
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* QR Code */}
        <div className="flex justify-center p-6 bg-white rounded-xl border-2 border-dashed border-border">
          <div className="relative">
            {isGenerating && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg">
                <RefreshCw className="w-8 h-8 animate-spin text-primary" />
              </div>
            )}
            <canvas
              ref={canvasRef}
              className="max-w-full h-auto"
              style={{ imageRendering: "pixelated" }}
            />
          </div>
        </div>

        {/* Download Button */}
        <Button
          onClick={downloadQRCode}
          className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold py-3 rounded-lg transition-all duration-300"
        >
          <Download className="w-5 h-5 mr-2" />
          Baixar QR Code
        </Button>

        {/* PIX Code */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">PIX Copia e Cola</Label>
          <div className="relative">
            <Textarea
              value={pixCode}
              readOnly
              className="pr-12 text-xs font-mono bg-muted border-border resize-none"
              rows={4}
            />
            <Button
              onClick={copyPixCode}
              size="sm"
              className="absolute top-2 right-2 h-8 w-8 p-0 bg-primary hover:bg-primary/90"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Cole este código em qualquer aplicativo de pagamento PIX
          </p>
        </div>
      </CardContent>
    </Card>
  );
}