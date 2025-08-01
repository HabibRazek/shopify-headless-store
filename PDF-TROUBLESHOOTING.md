# PDF Generation Troubleshooting Guide

## 🔧 Production PDF Issues

### Common Issues and Solutions

#### 1. "Failed to load PDF document" Error

**Symptoms:**
- PDF downloads in localhost work fine
- PDF downloads in production fail to open
- Browser shows "Failed to load PDF document"

**Causes:**
- Corrupted PDF buffer in serverless environment
- Missing Chrome/Chromium in Vercel
- Memory limitations in serverless functions
- Font rendering issues

**Solutions Applied:**

1. **Enhanced Puppeteer Configuration:**
   ```javascript
   // Added production-specific browser args
   '--single-process',
   '--disable-extensions',
   '--disable-plugins',
   '--font-render-hinting=none'
   ```

2. **PDF Buffer Validation:**
   ```javascript
   // Validate PDF header
   const pdfHeader = pdfBuffer.slice(0, 4).toString();
   if (pdfHeader !== '%PDF') {
       throw new Error('Generated buffer is not a valid PDF');
   }
   ```

3. **Vercel Function Configuration:**
   ```json
   {
     "functions": {
       "app/api/admin/invoices/[id]/pdf/route.ts": {
         "maxDuration": 60,
         "memory": 3008
       }
     }
   }
   ```

#### 2. Environment Variables for Production

Add these to your Vercel environment variables:

```bash
# Optional: Custom Chrome path for Puppeteer
PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

# Ensure production mode
NODE_ENV=production
```

#### 3. Alternative Solutions

If Puppeteer continues to fail in production:

1. **Use Playwright instead of Puppeteer:**
   ```bash
   npm install playwright
   ```

2. **Use external PDF service:**
   - PDFShift
   - HTML/CSS to PDF API
   - Bannerbear

3. **Client-side PDF generation:**
   - jsPDF
   - Puppeteer in browser

### 🔍 Debugging Steps

1. **Check Vercel Function Logs:**
   ```bash
   vercel logs --follow
   ```

2. **Test PDF Generation Locally:**
   ```bash
   npm run dev
   # Test PDF download at localhost:3000
   ```

3. **Validate PDF Buffer:**
   - Check console logs for buffer size
   - Verify PDF header validation passes

### 📊 Performance Optimization

1. **Memory Usage:**
   - Increased to 3008MB for PDF generation
   - 60-second timeout for complex invoices

2. **Browser Optimization:**
   - Single process mode for serverless
   - Disabled unnecessary features
   - Optimized font rendering

### 🚀 Deployment Checklist

- [ ] Vercel function configuration updated
- [ ] Environment variables set
- [ ] PDF buffer validation enabled
- [ ] Error logging implemented
- [ ] Fallback mechanism in place

### 📞 Support

If issues persist:
1. Check Vercel function logs
2. Verify environment variables
3. Test with different invoice sizes
4. Consider alternative PDF solutions
