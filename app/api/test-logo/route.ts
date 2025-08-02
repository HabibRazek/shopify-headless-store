import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Function to get PACKEDIN header logo - specifically load packedin.JPG
async function getLogoBase64(): Promise<{ data: string; format: string }> {
    try {
        // Load packedin.JPG specifically as requested
        const jpgPath = path.join(process.cwd(), 'public', 'packedin.JPG');
        if (fs.existsSync(jpgPath)) {
            console.log('🔍 Loading packedin.JPG at:', jpgPath);
            const logoBuffer = fs.readFileSync(jpgPath);
            console.log('✅ JPG logo loaded successfully, size:', logoBuffer.length, 'bytes');
            const base64 = logoBuffer.toString('base64');
            return { data: base64, format: 'jpg' };
        }

        // Fallback to lowercase extension
        const jpgPathLower = path.join(process.cwd(), 'public', 'packedin.jpg');
        if (fs.existsSync(jpgPathLower)) {
            console.log('🔍 Loading packedin.jpg at:', jpgPathLower);
            const logoBuffer = fs.readFileSync(jpgPathLower);
            console.log('✅ JPG logo loaded successfully, size:', logoBuffer.length, 'bytes');
            const base64 = logoBuffer.toString('base64');
            return { data: base64, format: 'jpg' };
        }

        console.log('❌ packedin.JPG file not found');
        return { data: '', format: '' };
    } catch (error) {
        console.log('❌ Error loading packedin.JPG:', error);
        return { data: '', format: '' };
    }
}

export async function GET(request: NextRequest) {
    try {
        console.log('🧪 Testing logo loading...');
        const headerLogo = await getLogoBase64();
        const footerLogo = await getFooterLogoBase64();

        return NextResponse.json({
            success: true,
            headerLogo: {
                loaded: !!headerLogo.data,
                format: headerLogo.format,
                length: headerLogo.data.length,
                preview: headerLogo.data.substring(0, 50) + '...'
            },
            footerLogo: {
                loaded: !!footerLogo.data,
                format: footerLogo.format,
                length: footerLogo.data.length,
                preview: footerLogo.data.substring(0, 50) + '...'
            }
        });
    } catch (error) {
        console.error('❌ Error in logo test:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

// Function to get footer logo
async function getFooterLogoBase64(): Promise<{ data: string; format: string }> {
    try {
        const footerPath = path.join(process.cwd(), 'public', 'footer-logo.jpg');
        if (fs.existsSync(footerPath)) {
            console.log('🔍 Loading footer-logo.jpg at:', footerPath);
            const logoBuffer = fs.readFileSync(footerPath);
            console.log('✅ Footer logo loaded successfully, size:', logoBuffer.length, 'bytes');
            const base64 = logoBuffer.toString('base64');
            return { data: base64, format: 'jpg' };
        }

        console.log('❌ Footer logo not found');
        return { data: '', format: '' };
    } catch (error) {
        console.log('❌ Error loading footer logo:', error);
        return { data: '', format: '' };
    }
}
