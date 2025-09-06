import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PixData } from "@/utils/pixGenerator";
import { QrCodeIcon } from "lucide-react";

interface PixFormProps {
  onGenerate: (data: PixData) => void;
  isGenerating: boolean;
}

export function PixForm({ onGenerate, isGenerating }: PixFormProps) {
  const [formData, setFormData] = useState<PixData>({
    pixKey: "",
    recipientName: "",
    amount: undefined,
    description: "",
    city: "SAO PAULO",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.pixKey || !formData.recipientName) return;
    onGenerate(formData);
  };

  const handleAmountChange = (value: string) => {
    const numValue = parseFloat(value);
    setFormData(prev => ({
      ...prev,
      amount: isNaN(numValue) ? undefined : numValue
    }));
  };

  return (
    <Card className="w-full max-w-md bg-card border-border shadow-card">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl font-bold bg-pix-gradient bg-clip-text text-transparent">
          Gerador PIX
        </CardTitle>
        <p className="text-muted-foreground text-sm">
          Preencha os dados para gerar seu QR Code PIX
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pixKey" className="text-sm font-medium">
              Chave PIX *
            </Label>
            <Input
              id="pixKey"
              placeholder="CPF, email, telefone ou chave aleatória"
              value={formData.pixKey}
              onChange={(e) =>
                setFormData(prev => ({ ...prev, pixKey: e.target.value }))
              }
              className="border-border focus:ring-primary"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="recipientName" className="text-sm font-medium">
              Nome do Beneficiário *
            </Label>
            <Input
              id="recipientName"
              placeholder="Nome completo"
              value={formData.recipientName}
              onChange={(e) =>
                setFormData(prev => ({ ...prev, recipientName: e.target.value }))
              }
              className="border-border focus:ring-primary"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium">
              Valor (R$)
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0,00 (opcional)"
              value={formData.amount || ""}
              onChange={(e) => handleAmountChange(e.target.value)}
              className="border-border focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Descrição
            </Label>
            <Textarea
              id="description"
              placeholder="Descrição do pagamento (opcional)"
              value={formData.description}
              onChange={(e) =>
                setFormData(prev => ({ ...prev, description: e.target.value }))
              }
              className="border-border focus:ring-primary min-h-[80px]"
              maxLength={140}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="city" className="text-sm font-medium">
              Cidade
            </Label>
            <Input
              id="city"
              placeholder="São Paulo"
              value={formData.city}
              onChange={(e) =>
                setFormData(prev => ({ ...prev, city: e.target.value }))
              }
              className="border-border focus:ring-primary"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-pix-gradient hover:opacity-90 text-white font-semibold py-3 rounded-lg transition-all duration-300 hover:shadow-glow"
            disabled={isGenerating || !formData.pixKey || !formData.recipientName}
          >
            <QrCodeIcon className="w-5 h-5 mr-2" />
            {isGenerating ? "Gerando..." : "Gerar QR Code PIX"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}