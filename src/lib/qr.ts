import QRCode from 'qrcode';

export async function generateQrDataUrl(
  text: string,
  options?: {
    darkColor?: string;
    lightColor?: string;
    width?: number;
    margin?: number;
  }
): Promise<string> {
  try {
    const url = await QRCode.toDataURL(text, {
      width: options?.width || 320,
      margin: options?.margin !== undefined ? options.margin : 2,
      color: {
        dark: options?.darkColor || '#000000',
        light: options?.lightColor || '#ffffff',
      },
      errorCorrectionLevel: 'M',
    });
    return url;
  } catch (err) {
    console.error('Error generating QR Code:', err);
    // Fallback simple SVG data URI
    return '';
  }
}
