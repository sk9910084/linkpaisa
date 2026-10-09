# 🔗 LinkPaisa — Link Shorten Karo, Paisa Kamao

GitHub Pages par hosted **free link shortener** with **OGAds earning**.
ShrinkEarn-jaisa model, par dual-earning ke saath:

| Kaun | Kaise kamata hai |
|---|---|
| **Link banane wala (user)** | Apni OGAds locker link se — har offer complete par earning **seedha uske OGAds account me**, weekly payout (PayPal/Crypto/Wire) |
| **Site owner (tum)** | Countdown page par ads (Monetag/AdSense) + OGAds referral commission |

## Kaise kaam karta hai (technical)

Pure static site — koi server/database nahi:

1. User long URL + (optional) OGAds locker URL daalta hai
2. Site `go/?to=<base64url-encoded-destination>` jaisa link banati hai
3. Visitor countdown page (5 sec, owner ke ads) dekhta hai → auto-redirect destination/locker par
4. "Aur chhota karo" button free **is.gd API** se super-short link banata hai
5. "Mere Links" browser ke localStorage me save rehte hain

## Setup (sirf 2 cheez bharni hai)

### 1. OGAds referral link
1. Phone par **ogads.com** kholo → free signup karo (approval me 1-2 din lag sakte hain)
2. Dashboard me apna **referral link** nikalo (jaise `https://ogads.com/?r=12345`)
3. `assets/config.js` me `OGADS_REFERRAL` ki value replace kar do

### 2. Countdown page par ads (owner ki earning)
1. **Monetag** (ya AdSense) me nayi site add karo: `https://<tumhara-username>.github.io/linkpaisa/`
2. Jo ad script tag mile, use `go/index.html` me diye gaye comment wali jagah paste kar do

### 3. Deploy
GitHub Pages on karo (Settings → Pages → Deploy from branch → main). Bas — site live!

## Files

- `index.html` — landing + shortener tool
- `go/index.html` — 5-sec countdown/redirect page (+ ad slot)
- `assets/config.js` — **OGAds referral link yahan**
- `assets/app.js`, `assets/go.js`, `assets/style.css`
- `404.html`

## Zaroori note (imaandaari)

- Ye **poora ShrinkEarn clone nahi hai**: GitHub Pages static hai, isliye user accounts, click-stats dashboard, aur site-se-payout system isme nahi hai. Creator ko **OGAds seedha pay karta hai** — isme trust-issue zero hai.
- Earnings OGAds ke terms par depend karti hain (country/offer/traffic quality). Koi earning guarantee mat do.
- Spam/malware/phishing links sakht mana hain.
