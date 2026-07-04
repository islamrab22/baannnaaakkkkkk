# GitHub Upload Version

This version keeps the original public homepage and adds a fully frontend Admin Panel at:

- `/#/admin`

Included additions:

- Arabic / English switch
- RTL support
- Dark mode
- Admin dashboard
- Products
- News
- Campaigns
- Branches
- Messages
- Loan requests
- Card requests
- Users
- Settings
- Profile
- Three login methods: National ID, Debit Card, Account Info
- Demo OTP step
- LocalStorage persistence
- CSV export

No PHP/MySQL is required for the GitHub frontend version.

Run locally:

```bash
npm install
npm run build:static
npm run preview:static
```

For GitHub Pages, build with:

```bash
npm run build:static
```

## Visitor submissions -> Admin Panel

This version is prepared for Render/full-stack deployment:

- Public website login/registration events are sent safely to `POST /api/visitor-event`.
- Contact form submissions use `POST /api/contact`.
- Loan inquiries use `POST /api/loan-inquiry`.
- Card inquiries use `POST /api/card-inquiry`.
- Admin Panel reads them from:
  - `/admin/messages`
  - `/admin/loan-requests`
  - `/admin/card-requests`

Security note: passwords, OTP codes, PINs, and full card numbers are intentionally not stored or displayed. Only safe fields like username, email, phone, method, and last 4 digits are stored.

Default seeded admin login after running the seed:

```txt
admin@bankofpalestine.test
Admin@12345
```


## All Submissions Admin Panel

تمت إضافة نظام يجمع كل فورم يرسله الزائر في صفحة واحدة داخل الأدمن:

- Public endpoint: `POST /api/submissions`
- Admin endpoint: `GET /api/admin/submissions`
- Admin page: `/admin/submissions`

مهم: النظام لا يحفظ Password / OTP / PIN / CVV / Token، ويحوّل أرقام البطاقة/الحساب/الهوية إلى آخر 4 أرقام فقط.
