import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Function to get PACKEDIN logo - try SVG first (React-PDF compatible), then original
async function getLogoBase64(): Promise<string> {
    try {
        // Try SVG logo first (React-PDF handles SVG well)
        const svgPath = path.join(process.cwd(), 'public', 'packedin-logo.svg');
        if (fs.existsSync(svgPath)) {
            console.log('🔍 Loading packedin-logo.svg at:', svgPath);
            const svgContent = fs.readFileSync(svgPath, 'utf8');
            const base64 = Buffer.from(svgContent).toString('base64');
            console.log('✅ SVG logo loaded successfully, length:', base64.length);
            return `image/svg+xml;base64,${base64}`;
        }

        // Fallback to original packedin.jpg
        const logoPath = path.join(process.cwd(), 'public', 'packedin.jpg');
        console.log('🔍 Loading packedin.jpg logo at:', logoPath);

        if (!fs.existsSync(logoPath)) {
            console.log('❌ No logo files found');
            return '';
        }

        const logoBuffer = fs.readFileSync(logoPath);
        console.log('✅ packedin.jpg loaded successfully, size:', logoBuffer.length, 'bytes');

        const base64 = logoBuffer.toString('base64');
        console.log('✅ Base64 conversion complete, length:', base64.length);

        // Return as JPEG MIME type
        return `image/jpeg;base64,${base64}`;
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
