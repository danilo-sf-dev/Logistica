export class MoneyService {
  static normalizeForFirebase(centavos?: string | null): string | null {
    if (!centavos || centavos === "0") return null;

    const valorLimpo = String(centavos).replace(/\D/g, "");

    if (!valorLimpo || valorLimpo === "0") return null;

    const centavosNum = parseInt(valorLimpo);

    if (isNaN(centavosNum) || centavosNum === 0) return null;

    const reais = centavosNum / 100;

    return reais.toFixed(2);
  }

  static fromFirebaseValue(firebaseValue: any): string {
    if (!firebaseValue) return "0";

    const valor = parseFloat(firebaseValue.toString());

    if (isNaN(valor)) return "0";

    const centavos = Math.round(valor * 100);

    return centavos.toString();
  }

  static formatForDisplay(value: any): string {
    if (!value) return "R$ 0,00";

    let reais: number;

    // Se é string de centavos (do componente MoneyInput)
    if (typeof value === "string" && !value.includes(".") && value.length > 2) {
      const centavos = parseInt(value) || 0;
      reais = centavos / 100;
    } else {
      // Se é valor decimal do Firebase ou string decimal
      reais = parseFloat(value.toString()) || 0;
    }

    return reais.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  static formatForExport(value: any): string {
    if (!value) return "N/A";

    // Para exportação, sempre trata como valor decimal do Firebase
    const reais = parseFloat(value.toString()) || 0;

    return reais.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  static isValid(centavos: string): boolean {
    if (!centavos) return false;

    const valorLimpo = centavos.replace(/\D/g, "");
    const centavosNum = parseInt(valorLimpo);

    return !isNaN(centavosNum) && centavosNum >= 0;
  }

  static toDecimal(centavos: string): number {
    if (!centavos) return 0;

    const valorLimpo = centavos.replace(/\D/g, "");
    const centavosNum = parseInt(valorLimpo) || 0;

    return centavosNum / 100;
  }
}
