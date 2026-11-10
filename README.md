# 💰 FinWise - Google AdSense Ready Web Application

A clean, responsive, high-performing financial calculator & wealth guides website built specifically to meet all **Google AdSense Publisher Quality Standards**.

---

## 📁 Project Structure

```
Google adsenc/
├── index.html                   # Homepage (Hero, tool showcase, guides, ad slots)
├── favicon.svg                  # SVG site icon
├── ads.txt                      # Google AdSense authorized seller verification file
├── robots.txt                   # Search crawler directives
├── sitemap.xml                  # Search engine sitemap for Google Search Console
├── css/
│   └── style.css                # Responsive, modern styling with light/dark variables
├── js/
│   ├── main.js                  # Mobile navigation drawer & UI helpers
│   └── calculators.js           # 100% Client-side mathematical engines
├── tools/
│   ├── compound-interest.html   # Compound Interest Calculator + Growth Schedule
│   ├── loan-calculator.html     # Loan & Mortgage EMI Calculator + Amortization
│   ├── budget-planner.html      # 50/30/20 Budget Rule Calculator
│   └── retirement-calc.html     # Retirement & FIRE (Rule of 25) Calculator
├── blog/
│   ├── index.html               # Articles directory
│   ├── compound-interest-guide.html # Deep educational article on compounding
│   ├── debt-payoff-strategies.html  # Snowball vs. Avalanche comparison
│   ├── emergency-fund-guide.html    # Emergency cushion roadmap
│   └── passive-income-streams.html  # 7 realistic passive income streams
└── pages/
    ├── about.html               # Editorial standards & mission (AdSense Trust requirement)
    ├── contact.html             # Interactive contact form
    ├── privacy-policy.html      # Complete AdSense, DART Cookie, CCPA, & GDPR disclosures
    ├── terms.html               # Terms of Service
    └── disclaimer.html          # Financial educational disclaimer (YMYL protection)
```

---

## 🚀 How to Run Locally

### Option 1: Python HTTP Server (Already Tested)
In PowerShell inside this directory:
```powershell
python -m http.server 8080
```
Then open your browser to: [http://localhost:8080](http://localhost:8080)

### Option 2: Directly Open
Double-click `index.html` to open it in Google Chrome, Microsoft Edge, or any modern web browser.

---

## 🌐 Free Deployment Options (Get Online in 5 Minutes)

You need to host this website on the public internet with a custom domain before applying to Google AdSense.

### Choice A: GitHub Pages (100% Free)
1. Create a free account at [github.com](https://github.com).
2. Create a repository named `finance-tools` (or anything you like).
3. Push these files to GitHub.
4. Go to **Repository Settings** > **Pages** > Select branch `main` and save.
5. Your site is live!

### Choice B: Cloudflare Pages / Vercel / Netlify (Free & Lightning Fast)
1. Drag and drop the `Google adsenc` folder onto [Netlify Drop](https://app.netlify.com/drop) or connect via GitHub on [Vercel](https://vercel.com) or [Cloudflare Pages](https://pages.cloudflare.com).
2. It will deploy worldwide in 30 seconds with automatic free SSL/HTTPS.

---

## 🎯 Step-by-Step Google AdSense Approval Checklist

### Step 1: Connect a Custom Domain
* Buy an inexpensive domain (e.g. `.com`, `.org`, or `.net` for ~$10/year on Namecheap, Cloudflare Registrar, or Porkbun).
* Connect the domain to your free host (Vercel/Cloudflare/GitHub Pages).
* *Note: Google rarely approves free subdomains (like `mysite.netlify.app`), so a custom domain is strongly recommended.*

### Step 2: Index Your Website on Google
1. Go to [Google Search Console](https://search.google.com/search-console).
2. Add your custom domain property.
3. Submit your sitemap URL: `https://yourdomain.com/sitemap.xml`.
4. Wait 1 to 2 weeks for Google to index all pages and start seeing organic impressions.

### Step 3: Apply for Google AdSense
1. Visit [https://adsense.google.com](https://adsense.google.com).
2. Sign in with your Google Account and click **Get Started**.
3. Enter your website URL.
4. Copy your unique **AdSense code snippet**:
   ```html
   <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossorigin="anonymous"></script>
   ```
5. Paste it into the `<head>` of `index.html` and the other HTML files (there are labeled placeholders ready for you).
6. Update `ads.txt` with your `pub-XXXXXXXXXXXXXXXX` publisher ID.
7. Click **Request Review** in the AdSense dashboard.

### Step 4: Turn On Auto Ads or Place Ad Units
* Once approved (typically takes 24 hours to 14 days), Google will start serving ads.
* You can turn on **Auto Ads** (Google automatically tests and places ads in high-earning spots) or replace the designated placeholder slots in this code with manual ad unit codes.

