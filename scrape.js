/**
 * WooCommerce Product Variation Scraper
 * Target: https://tablechairetc.auinno.site/product/4-channel-back-with-headroll/
 *
 * This script extracts product customization options including:
 * - Product name and base price
 * - Frame, Cushion, and Backrest variations
 * - Swatch thumbnail images
 * - Layer images (if accessible)
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Configuration
const TARGET_URL = 'https://tablechairetc.auinno.site/product/4-channel-back-with-headroll/';
const OUTPUT_FILE = path.join(__dirname, 'product_data.json');

// User-Agent rotation to avoid detection
const USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
];

/**
 * Find Chrome executable path on different platforms
 */
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
    for (const chromePath of paths) {
        if (fs.existsSync(chromePath)) {
            return chromePath;
        }
    }

    return null; // Will use Puppeteer's bundled Chrome
}

/**
 * Extract product basic information (name, price)
 */
async function extractProductInfo(page) {
    console.log('📋 Extracting product basic info...');

    const productInfo = await page.evaluate(() => {
        // Get product name - try multiple selectors
        let productName = '';
        const titleSelectors = [
            '.product_title.entry-title',
            'h1.product_title',
            '.product_title',
            'h1'
        ];

        for (const selector of titleSelectors) {
            const el = document.querySelector(selector);
            if (el && el.textContent) {
                productName = el.textContent.trim();
                break;
            }
        }

        // Get base price
        let basePrice = 0;
        const priceSelectors = [
            '.price .amount',
            '.price ins .amount',
            '.price',
            '.woocommerce-Price-amount'
        ];

        for (const selector of priceSelectors) {
            const el = document.querySelector(selector);
            if (el && el.textContent) {
                const priceText = el.textContent.replace(/[^0-9.]/g, '');
                basePrice = parseFloat(priceText) || 0;
                if (basePrice > 0) break;
            }
        }

        return {
            productName,
            basePrice
        };
    });

    console.log(`   ✓ Product: ${productInfo.productName}`);
    console.log(`   ✓ Price: $${productInfo.basePrice}`);

    return productInfo;
}

/**
 * Extract variation swatches for a specific attribute
 */
async function extractVariationSwatches(page, attributeName) {
    console.log(`🎨 Extracting ${attributeName} swatches...`);

    try {
        const swatches = await page.evaluate((attr) => {
            // Find the container for this attribute
            const container = document.querySelector('.wd-swatches-product[data-id="pa_' + attr + '"]');
            if (!container) {
                console.log('Container not found for: pa_' + attr);
                return [];
            }

            const swatchElements = container.querySelectorAll('.wd-swatch');
            const results = [];

            for (let i = 0; i < swatchElements.length; i++) {
                const swatch = swatchElements[i];

                // Get value from data attribute
                const value = swatch.getAttribute('data-value') || '';

                // Get label from aria-label
                const label = swatch.getAttribute('aria-label') || value;

                // Get image
                const img = swatch.querySelector('img');
                const swatchUrl = img ? (img.src || img.getAttribute('data-src') || '') : '';

                if (value) {
                    results.push({
                        id: value,
                        name: label,
                        swatchUrl: swatchUrl
                    });
                }
            }

            return results;
        }, attributeName);

        console.log(`   ✓ Found ${swatches.length} ${attributeName} options`);
        return swatches;

    } catch (error) {
        console.error(`   ✗ Error extracting ${attributeName}:`, error.message);
        return [];
    }
}

/**
 * Extract layer image data from Iconic Product Composer
 */
async function extractLayerImages(page) {
    console.log('🖼️  Attempting to extract layer image data...');

    try {
        const layerData = await page.evaluate(() => {
            // Look for script with iconic-pc-layers class
            const scripts = Array.from(document.querySelectorAll('script.iconic-pc-layers-2379, script[class*="iconic-pc-layers"]'));

            if (scripts.length > 0) {
                try {
                    // Try to parse the JSON from the script content
                    const content = scripts[0].textContent;
                    // Find JSON object in the content
                    const startIndex = content.indexOf('{');
                    const endIndex = content.lastIndexOf('}');

                    if (startIndex >= 0 && endIndex > startIndex) {
                        const jsonStr = content.substring(startIndex, endIndex + 1);
                        return JSON.parse(jsonStr);
                    }
                } catch (e) {
                    console.error('Failed to parse layer data:', e);
                }
            }

            // Try to find data in window object
            if (typeof window !== 'undefined' && window.iconic_pc_layers) {
                return window.iconic_pc_layers;
            }

            return null;
        });

        if (layerData) {
            console.log('   ✓ Layer data found!');
            return layerData;
        } else {
            console.log('   ⚠ Layer data not accessible');
            return null;
        }
    } catch (error) {
        console.log('   ⚠ Could not extract layer data:', error.message);
        return null;
    }
}

/**
 * Attempt to click each option and capture the resulting main image
 */
async function captureLayerImagesByInteraction(page, attributeName, swatches) {
    console.log(`🔄 Capturing layer images for ${attributeName} via interaction...`);

    const results = [];

    for (const swatch of swatches) {
        try {
            // Click the swatch
            const selector = '.wd-swatches-product[data-id="pa_' + attributeName + '"] .wd-swatch[data-value="' + swatch.id + '"]';
            await page.click(selector);
            await page.waitForTimeout(500);

            // Get the layer image
            const imageUrl = await page.evaluate((attr) => {
                // Try to get specific layer image
                const layerImg = document.querySelector('.iconic-pc-image--jckpc-pa_' + attr + ' img');
                if (layerImg && layerImg.src) {
                    return layerImg.src;
                }

                // Fallback to main gallery image
                const mainImg = document.querySelector('.woocommerce-product-gallery__image img');
                return mainImg ? mainImg.src : '';
            }, attributeName);

            results.push({
                ...swatch,
                layerImage: imageUrl
            });

            const preview = imageUrl.length > 60 ? imageUrl.substring(0, 60) + '...' : imageUrl;
            console.log(`   ✓ ${swatch.name}: ${preview}`);

        } catch (error) {
            console.log(`   ⚠ Failed to capture ${swatch.name}:`, error.message);
            results.push(swatch);
        }
    }

    return results;
}

/**
 * Main scraping function
 */
async function scrapeProductOptions() {
    console.log('🚀 Starting scraper...');
    console.log(`📍 Target: ${TARGET_URL}`);
    console.log('');

    // Try to use system Chrome
    const chromePath = getChromePath();
    if (chromePath) {
        console.log(`🌐 Using system Chrome: ${chromePath}`);
    } else {
        console.log('🌐 Using Puppeteer bundled Chrome...');
    }

    const browser = await puppeteer.launch({
        headless: true,
        executablePath: chromePath || undefined,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-web-security',
            '--disable-features=IsolateOrigins,site-per-process'
        ]
    });

    try {
        const page = await browser.newPage();

        // Set random user agent
        const randomUA = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
        await page.setUserAgent(randomUA);

        // Set viewport
        await page.setViewport({ width: 1920, height: 1080 });

        // Navigate to page
        console.log('⏳ Loading page...');
        await page.goto(TARGET_URL, {
            waitUntil: 'networkidle2',
            timeout: 60000
        });

        // Wait for swatches to load
        await page.waitForSelector('.wd-swatches-product', { timeout: 15000 });
        await page.waitForTimeout(3000); // Extra wait for dynamic content

        console.log('✅ Page loaded successfully!');
        console.log('');

        // Extract product info
        const { productName, basePrice } = await extractProductInfo(page);

        // Extract all variation swatches
        const frames = await extractVariationSwatches(page, 'frame');
        const cushions = await extractVariationSwatches(page, 'cushion');
        const backrests = await extractVariationSwatches(page, 'backrest');

        console.log('');
        console.log(`📊 Summary: Found ${frames.length} frames, ${cushions.length} cushions, ${backrests.length} backrests`);

        // Try to extract layer data
        const layerData = await extractLayerImages(page);

        if (layerData) {
            console.log('');
            console.log('🔗 Merging layer data with swatches...');

            // Helper function to add layer images
            const addLayerImages = function(swatches, attrKey) {
                return swatches.map(function(swatch) {
                    if (layerData[attrKey] && layerData[attrKey][swatch.id]) {
                        const layerInfo = layerData[attrKey][swatch.id];
                        if (layerInfo.image_html) {
                            // Extract image URL from HTML
                            const imgMatch = layerInfo.image_html.match(/src=['"]([^'"]+)['"]/);
                            return {
                                id: swatch.id,
                                name: swatch.name,
                                swatchUrl: swatch.swatchUrl,
                                layerImage: imgMatch ? imgMatch[1] : null
                            };
                        }
                    }
                    return swatch;
                });
            };

            const framesWithLayers = addLayerImages(frames, 'jckpc-pa_frame');
            const cushionsWithLayers = addLayerImages(cushions, 'jckpc-pa_cushion');
            const backrestsWithLayers = addLayerImages(backrests, 'jckpc-pa_backrest');

            frames.length = 0;
            frames.push.apply(frames, framesWithLayers);
            cushions.length = 0;
            cushions.push.apply(cushions, cushionsWithLayers);
            backrests.length = 0;
            backrests.push.apply(backrests, backrestsWithLayers);
        } else {
            // Fallback: try clicking each option
            console.log('');
            console.log('⚠ Layer data not found, trying interaction method...');

            // Save initial state
            const initialFrame = await page.evaluate(function() {
                const selected = document.querySelector('.wd-swatches-product[data-id="pa_frame"] .wd-swatch[aria-checked="true"]');
                return selected ? selected.getAttribute('data-value') : '';
            });

            // Capture frame layer images
            const framesWithLayers = await captureLayerImagesByInteraction(page, 'frame', frames);
            frames.length = 0;
            frames.push.apply(frames, framesWithLayers);

            // Restore and capture cushions
            if (initialFrame) {
                await page.click('.wd-swatches-product[data-id="pa_frame"] .wd-swatch[data-value="' + initialFrame + '"]');
                await page.waitForTimeout(500);
            }

            const cushionsWithLayers = await captureLayerImagesByInteraction(page, 'cushion', cushions);
            cushions.length = 0;
            cushions.push.apply(cushions, cushionsWithLayers);

            // Restore and capture backrests
            if (initialFrame) {
                await page.click('.wd-swatches-product[data-id="pa_frame"] .wd-swatch[data-value="' + initialFrame + '"]');
                await page.waitForTimeout(500);
            }

            const backrestsWithLayers = await captureLayerImagesByInteraction(page, 'backrest', backrests);
            backrests.length = 0;
            backrests.push.apply(backrests, backrestsWithLayers);
        }

        // Build final result
        const result = {
            productName: productName,
            basePrice: basePrice,
            options: {
                frames: frames,
                cushions: cushions,
                backrests: backrests
            },
            scrapedAt: new Date().toISOString(),
            sourceUrl: TARGET_URL
        };

        // Save to file
        console.log('');
        console.log('💾 Saving results to file...');
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2), 'utf8');
        console.log(`✅ Data saved to: ${OUTPUT_FILE}`);

        // Print summary
        console.log('');
        console.log('📊 EXTRACTION SUMMARY:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('Product:        ' + productName);
        console.log('Base Price:     $' + basePrice);
        console.log('Frames:         ' + frames.length + ' options');
        console.log('Cushions:       ' + cushions.length + ' options');
        console.log('Backrests:      ' + backrests.length + ' options');

        const hasLayers = frames.some(function(f) { return f.layerImage; }) ||
                         cushions.some(function(c) { return c.layerImage; }) ||
                         backrests.some(function(b) { return b.layerImage; });
        console.log('Layer Images:   ' + (hasLayers ? '✓ Captured' : '✗ Not available'));
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        return result;

    } catch (error) {
        console.error('❌ Error during scraping:', error);
        throw error;
    } finally {
        await browser.close();
    }
}

// Run the scraper
if (require.main === module) {
    scrapeProductOptions()
        .then(function() {
            console.log('');
            console.log('✨ Scraping completed successfully!');
            process.exit(0);
        })
        .catch(function(error) {
            console.error('');
            console.error('💥 Scraping failed:', error.message);
            console.error(error.stack);
            process.exit(1);
        });
}

module.exports = { scrapeProductOptions };
