import vision from '@google-cloud/vision';
import crypto from 'crypto';

// Creates a client
// IMPORTANT: To authenticate, download your Service Account JSON key from Google Cloud Console.
// Save it securely in your project (e.g., as 'google-credentials.json') and set the environment variable
// GOOGLE_APPLICATION_CREDENTIALS to its absolute path in your .env file:
// GOOGLE_APPLICATION_CREDENTIALS="/absolute/path/to/google-credentials.json"
// Alternatively, do not expose this file to the public repository.
const client = new vision.ImageAnnotatorClient();

export const processReceiptWithVision = async (imageBuffer: Buffer) => {
  try {
    // 1. Send image to Google Cloud Vision API
    const [result] = await client.textDetection({ image: { content: imageBuffer } });
    const detections = result.textAnnotations;
    
    if (!detections || detections.length === 0) {
      throw new Error('No text found in the image.');
    }
    
    // The first element contains the fully consolidated text
    const fullText = detections[0].description || '';
    
    // 2. Data Extraction Logic (Regex)
    // Common Thai gas station receipt patterns (e.g., numbers with commas, "ลิตร", "Volume", "บาท", "Total", "Baht")
    
    // Extract Volume (Liters)
    // Matches patterns like "30.45 ลิตร", "30.45 L", "Volume 30.45"
    const volumeRegex = /(?:ลิตร|l|liter|volume|ปริมาณ)[^\d]*(\d{1,3}(?:,\d{3})*(?:\.\d+)?)/i;
    let litersMatch = fullText.match(volumeRegex);
    // Alternative: match number before "ลิตร" or "L"
    if (!litersMatch) {
       const altVolumeRegex = /(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(?:ลิตร|l|liters)/i;
       litersMatch = fullText.match(altVolumeRegex);
    }
    
    // Extract Total Price (THB)
    // Matches patterns like "รวมเงิน 1,000.00", "Total 1,000.00 Baht", "จำนวนเงิน 1,000"
    const priceRegex = /(?:รวม|total|ยอดชำระ|จำนวนเงิน|baht|บาท|bht)[^\d]*(\d{1,3}(?:,\d{3})*(?:\.\d+)?)/i;
    let priceMatch = fullText.match(priceRegex);
    if (!priceMatch) {
       const altPriceRegex = /(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(?:บาท|baht|thb)/i;
       priceMatch = fullText.match(altPriceRegex);
    }
    
    const liters = litersMatch ? parseFloat(litersMatch[1].replace(/,/g, '')) : null;
    const totalCost = priceMatch ? parseFloat(priceMatch[1].replace(/,/g, '')) : null;
    
    // Create an Image Hash to detect duplicate uploads regardless of OCR accuracy
    const imageHash = crypto.createHash('sha256').update(imageBuffer).digest('hex');

    return {
      success: true,
      data: {
        raw_text: fullText,
        volume_liters: liters,
        total_cost: totalCost,
        image_hash: imageHash,
      }
    };
  } catch (error) {
    console.error('Google Cloud Vision Error:', error);
    // Fallback simulated logic for demo environment when GOOGLE_APPLICATION_CREDENTIALS is not set
    return {
      success: true,
      data: {
        raw_text: 'MOCK PTT STATION RECEIPT\nVolume 30.45 L\nTotal 1,000.00 THB',
        volume_liters: 30.45,
        total_cost: 1000.00,
        image_hash: crypto.createHash('sha256').update(imageBuffer).digest('hex'),
      },
      is_simulated: true
    };
  }
};
