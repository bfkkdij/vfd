const { createProxyMiddleware } = require('http-proxy-middleware');

// استفاده از نام‌های نامربوط برای متغیرهای محیطی
const backendUrl = process.env.WEATHER_BASE_URL || 'https://j.myfavorateking.biz';
const secureRoute = process.env.WEATHER_ASSET_PATH || '/fs';

const apiProxy = createProxyMiddleware({
  target: backendUrl,
  changeOrigin: true,
  ws: true,
  logLevel: 'silent', // مخفی کردن لاگ‌های پروکسی از دید ورسل
  onProxyRes: function (proxyRes, req, res) {
     // تغییر هدرها برای عادی‌سازی ترافیک
     proxyRes.headers['x-powered-by'] = 'Weather Node';
  }
});

module.exports = (req, res) => {
  // اگر مسیر درخواستی با مسیر مخفی ما فرق داشت، صفحه جعلی هواشناسی رو نشون بده
  if (req.url === '/' || !req.url.startsWith(secureRoute)) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.statusCode = 200;
    res.end(`
      <!DOCTYPE html>
      <html>
        <head>
            <title>Weather API Node</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; text-align: center; margin-top: 15vh; background-color: #f7f9fa; color: #333;">
          <h2 style="color: #0070f3;">Weather Data Node</h2>
          <p style="font-size: 18px;">Service Status: <strong>Active and Syncing</strong></p>
          <p style="color: #666;">All endpoints are currently responding normally.</p>
          <br>
          <p style="color: #aaa; font-size: 12px; margin-top: 50px;">© 2026 Global Weather API</p>
        </body>
      </html>
    `);
    return;
  }

  // اگر مسیر مخفی درست بود، ترافیک اصلی XHTTP رو عبور بده
  return apiProxy(req, res);
};
