import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Function to convert logo to base64
async function getLogoBase64(): Promise<string> {
    try {
        // Try PNG first, then JPG
        const pngPath = path.join(process.cwd(), 'public', 'packedin.png');
        const jpgPath = path.join(process.cwd(), 'public', 'packedin.jpg');
        
        let logoPath = '';
        let mimeType = '';
        
        if (fs.existsSync(pngPath)) {
            logoPath = pngPath;
            mimeType = 'image/png';
            console.log('🔍 Using PNG logo at:', logoPath);
        } else if (fs.existsSync(jpgPath)) {
            logoPath = jpgPath;
            mimeType = 'image/jpeg';
            console.log('🔍 Using JPG logo at:', logoPath);
        } else {
            console.log('❌ No logo file found (tried PNG and JPG)');
            return '';
        }
        
        const logoBuffer = fs.readFileSync(logoPath);
        console.log('✅ Logo loaded successfully, size:', logoBuffer.length, 'bytes');
        const base64 = logoBuffer.toString('base64');
        console.log('✅ Base64 conversion complete, length:', base64.length);
        return `${mimeType};base64,${base64}`;
    } catch (error) {
        console.log('❌ Error loading logo:', error);
        return '';
    }
}

export async function GET(request: NextRequest) {
    try {
        console.log('🧪 Testing logo loading...');
        const logoBase64 = await getLogoBase64();
        
        return NextResponse.json({
            success: true,
            logoLoaded: !!logoBase64,
            logoLength: logoBase64.length,
            logoPreview: logoBase64.substring(0, 100) + '...',
            fullLogo: logoBase64
        });
    } catch (error) {
        console.error('❌ Error in logo test:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
