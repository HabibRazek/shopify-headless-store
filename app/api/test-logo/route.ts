import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Function to convert packedin.jpg logo to base64
async function getLogoBase64(): Promise<string> {
    try {
        const logoPath = path.join(process.cwd(), 'public', 'packedin.jpg');
        console.log('🔍 Loading packedin.jpg logo at:', logoPath);

        if (!fs.existsSync(logoPath)) {
            console.log('❌ packedin.jpg not found at:', logoPath);
            return '';
        }

        const logoBuffer = fs.readFileSync(logoPath);
        console.log('✅ packedin.jpg loaded successfully, size:', logoBuffer.length, 'bytes');

        // Check if it's actually a JPEG file by looking at the header
        const header = logoBuffer.toString('hex', 0, 4);
        console.log('🔍 File header:', header);

        const base64 = logoBuffer.toString('base64');
        console.log('✅ Base64 conversion complete, length:', base64.length);

        // Return proper JPEG data URI
        return `image/jpeg;base64,${base64}`;
    } catch (error) {
        console.log('❌ Error loading packedin.jpg:', error);
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
