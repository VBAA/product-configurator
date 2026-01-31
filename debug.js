/**
 * Debug script to analyze the actual DOM structure
 */

const puppeteer = require('puppeteer');
const fs = require('fs');

const TARGET_URL = 'https://tablechairetc.auinno.site/product/4-channel-back-with-headroll/';

function getChromePath() {
    const platform = process.platform;
    const chromePaths = {
        win32: [
            'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
            process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe',
        ],
        darwin: [
            '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        ],
        linux: [
            '/usr/bin/google-chrome',
            '/usr/bin/chromium-browser',
            '/usr/bin/chromium',
        ]
    };

    const paths = chromePaths[platform] || [];
    for (const path of paths) {
        if (fs.existsSync(path)) {
            return path;
        }
    }
    return null;
}

async function debugPage() {
    console.log('🔍 Starting debug analysis...');
    console.log(`📍 Target: ${TARGET_URL}`);
    console.log('');

    const chromePath = getChromePath();
    console.log(`🌐 Using Chrome: ${chromePath || 'Puppeteer bundled'}`);

    const browser = await puppeteer.launch({
        headless: false, // Show browser for debugging
        executablePath: chromePath || undefined,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
        ],
        defaultViewport: { width: 1920, height: 1080 }
    });

    try {
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

        console.log('⏳ Loading page...');
        await page.goto(TARGET_URL, {
            waitUntil: 'networkidle2',
            timeout: 60000
        });

        // Wait a bit for dynamic content
        await page.waitForTimeout(5000);

        console.log('✅ Page loaded, analyzing DOM...\n');

        // Analyze the page structure
        const analysis = await page.evaluate(() => {
            const result = {
                // 1. Check for various selectors
                selectors: {},

                // 2. Product title
                productTitle: '',

                // 3. Price
                price: '',

                // 4. Variation tables
                variationTables: [],

                // 5. All forms
                forms: [],

                // 6. All scripts that might contain data
                dataScripts: [],

                // 7. Image elements
                images: []
            };

            // Check product title
            result.productTitle = document.querySelector('.product_title')?.textContent ||
                               document.querySelector('h1')?.textContent || '';

            // Check price
            result.price = document.querySelector('.price')?.textContent || '';

            // Check for variations table
            const variationsTable = document.querySelector('table.variations');
            result.selectors.variationsTable = !!variationsTable;
            if (variationsTable) {
                const rows = variationsTable.querySelectorAll('tr');
                rows.forEach(row => {
                    const label = row.querySelector('.label')?.textContent?.trim();
                    const valueCell = row.querySelector('.value');
                    const swatches = valueCell?.querySelectorAll('.wd-swatch, .swatch, .variation-swatch')?.length || 0;
                    const select = valueCell?.querySelector('select');
                    const options = select ? Array.from(select.options).map(o => o.value) : [];

                    result.variationTables.push({
                        label,
                        hasSwatches: swatches > 0,
                        swatchCount: swatches,
                        selectOptions: options
                    });
                });
            }

            // Check for wd-swatches
            const wdSwatches = document.querySelectorAll('.wd-swatches-product');
            result.selectors.wdSwatchesContainers = wdSwatches.length;
            wdSwatches.forEach(container => {
                const dataId = container.dataset.id || container.getAttribute('data-id');
                const swatches = Array.from(container.querySelectorAll('.wd-swatch')).map(s => ({
                    value: s.dataset.value,
                    ariaLabel: s.getAttribute('aria-label'),
                    hasImage: !!s.querySelector('img'),
                    imgSrc: s.querySelector('img')?.src
                }));
                result.variationTables.push({
                    type: 'wd-swatches',
                    dataId,
                    swatches
                });
            });

            // Check for other swatch types
            const otherSwatches = document.querySelectorAll('[class*="swatch"]');
            result.selectors.otherSwatches = otherSwatches.length;

            // Get all forms
            const forms = document.querySelectorAll('form');
            forms.forEach(form => {
                const className = form.className;
                const productVariations = form.dataset.product_variations;
                result.forms.push({
                    className,
                    hasVariationsData: !!productVariations,
                    variationsPreview: productVariations ? productVariations.substring(0, 200) : null
                });
            });

            // Find scripts with data
            const scripts = Array.from(document.querySelectorAll('script'));
            scripts.forEach(script => {
                const text = script.textContent;
                if (text.includes('variation') || text.includes('layer') || text.includes('jckpc')) {
                    const preview = text.substring(0, 300);
                    result.dataScripts.push({
                        className: script.className,
                        preview
                    });
                }
            });

            // Get product images
            const images = document.querySelectorAll('.woocommerce-product-gallery img, .product-gallery img');
            images.forEach(img => {
                result.images.push({
                    src: img.src?.substring(0, 100),
                    class: img.className,
                    alt: img.alt
                });
            });

            return result;
        });

        console.log('📊 ANALYSIS RESULTS:');
        console.log('='.repeat(60));
        console.log(JSON.stringify(analysis, null, 2));
        console.log('='.repeat(60));

        // Save full HTML for manual inspection
        const html = await page.content();
        fs.writeFileSync('page_source.html', html, 'utf8');
        console.log('\n💾 Full HTML saved to: page_source.html');

        console.log('\n⏸️  Browser will stay open for 30 seconds for manual inspection...');
        console.log('   Please check the page and note any variation elements you see.');
        await page.waitForTimeout(30000);

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await browser.close();
    }
}

debugPage().catch(console.error);
