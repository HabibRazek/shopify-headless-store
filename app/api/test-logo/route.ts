import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Function to get PACKEDIN header logo - prioritize actual image files
async function getLogoBase64(): Promise<{ data: string; format: string }> {
    try {
        // Try PNG first (best React-PDF support for images)
        const pngPath = path.join(process.cwd(), 'public', 'packedin.png');
        if (fs.existsSync(pngPath)) {
            console.log('🔍 Loading packedin.png at:', pngPath);
            const logoBuffer = fs.readFileSync(pngPath);
            console.log('✅ PNG logo loaded successfully, size:', logoBuffer.length, 'bytes');
            const base64 = logoBuffer.toString('base64');
            return { data: base64, format: 'png' };
        }

        // Try JPG next (force as PNG for React-PDF)
        const jpgPath = path.join(process.cwd(), 'public', 'packedin.jpg');
        if (fs.existsSync(jpgPath)) {
            console.log('🔍 Loading packedin.jpg at:', jpgPath);
            const logoBuffer = fs.readFileSync(jpgPath);
            console.log('✅ JPG logo loaded successfully, size:', logoBuffer.length, 'bytes');
            const base64 = logoBuffer.toString('base64');
            // Force as PNG format for better React-PDF compatibility
            return { data: base64, format: 'png' };
        }

        // Try SVG as last resort (sometimes doesn't render)
        const svgPath = path.join(process.cwd(), 'public', 'packedin-logo.svg');
        if (fs.existsSync(svgPath)) {
            console.log('🔍 Loading packedin-logo.svg at:', svgPath);
            const svgContent = fs.readFileSync(svgPath, 'utf8');
            const base64 = Buffer.from(svgContent).toString('base64');
            console.log('✅ SVG logo loaded successfully, length:', base64.length);
            return { data: base64, format: 'svg' };
        }

        console.log('❌ No packedin logo files found');
        return { data: '', format: '' };
    } catch (error) {
        console.log('❌ Error loading packedin logo:', error);
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
