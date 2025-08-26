export interface SessionInfo {
  ip: string;
  device: string;
  browser: string;
  os: string;
  userAgent: string;
  timestamp: Date;
}

export class SessionService {
  // Detectar informações do dispositivo
  static getDeviceInfo(): Omit<SessionInfo, "ip" | "timestamp"> {
    const userAgent = navigator.userAgent;

    // Padrão: Mapeamento de detectores
    const browserDetectors = [
      { pattern: "Chrome", name: "Chrome" },
      { pattern: "Firefox", name: "Firefox" },
      { pattern: "Safari", name: "Safari" },
      { pattern: "Edge", name: "Edge" },
      { pattern: "Opera", name: "Opera" },
    ];

    const osDetectors = [
      { pattern: "Windows", name: "Windows" },
      { pattern: "Mac", name: "macOS" },
      { pattern: "Linux", name: "Linux" },
      { pattern: "Android", name: "Android" },
      { pattern: "iOS", name: "iOS" },
    ];

    const deviceDetectors = [
      { pattern: "Mobile", name: "Mobile" },
      { pattern: "Tablet", name: "Tablet" },
    ];

    // Função helper para detectar usando padrões
    const detect = (
      detectors: Array<{ pattern: string; name: string }>,
      defaultValue: string = "Desconhecido",
    ) => {
      const detector = detectors.find((d) => userAgent.includes(d.pattern));
      return detector?.name || defaultValue;
    };

    return {
      browser: detect(browserDetectors),
      os: detect(osDetectors),
      device: detect(deviceDetectors, "Desktop"),
      userAgent,
    };
  }

  // Capturar IP do usuário
  static async getIPAddress(): Promise<string> {
    try {
      // Usar serviço gratuito para obter IP
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error("Erro ao obter IP:", error);
      return "Não disponível";
    }
  }

  // Obter informações completas da sessão
  static async getSessionInfo(): Promise<SessionInfo> {
    const deviceInfo = this.getDeviceInfo();
    const ip = await this.getIPAddress();

    return {
      ...deviceInfo,
      ip,
      timestamp: new Date(),
    };
  }

  // Formatar informações para exibição
  static formatSessionInfo(sessionInfo: SessionInfo): {
    ip: string;
    device: string;
    browser: string;
    os: string;
  } {
    return {
      ip: sessionInfo.ip,
      device: `${sessionInfo.browser} - ${sessionInfo.os}`,
      browser: sessionInfo.browser,
      os: sessionInfo.os,
    };
  }
}

export default SessionService;
