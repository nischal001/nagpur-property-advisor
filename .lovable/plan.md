

## Plan: Avatar Initials, Contact Update, and Live Property Detail

### 1. User Avatar with Initials (Navbar)
Replace the plain text username in the navbar with a circular avatar showing the user's initials (first letter of first name + first letter of last name). Use the existing Avatar component from `src/components/ui/avatar.tsx`. Extract initials from `profile.name` or fall back to email. Show in both desktop and mobile views.

**Files:** `src/components/Navbar.tsx`

### 2. Update Contact Number
Change `+91 98765 43210` to `+91 72194 37006` everywhere:
- `src/components/Footer.tsx` (line 39) — phone display
- `src/components/WhatsAppButton.tsx` (line 5) — WhatsApp link (`wa.me/917219437006`)
- Any other phone references found in the codebase

**Files:** `src/components/Footer.tsx`, `src/components/WhatsAppButton.tsx`

### 3. Load Property Detail from Database
Replace the current dummy-data lookup in `PropertyDetail.tsx` with a live Supabase query. Fetch property by ID from the `properties` table. Add loading and error states. Respect visibility rules (admins can see hidden properties, public users cannot).

**Files:** `src/pages/PropertyDetail.tsx`

### 4. Admin Panel Access
The admin panel is at `/admin` but only shows in the navbar for users with the `admin` role. To access it in preview, either:
- Navigate directly to `https://id-preview--05833f69-16ed-4d9c-b960-d3c490d296d8.lovable.app/admin`
- Or after you sign up, I'll assign the admin role to your user account so the link appears in the navbar

### Technical Details
- Avatar: Use `<Avatar>` + `<AvatarFallback>` with initials extracted via `name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2)`
- Property detail query: `supabase.from('properties').select('*').eq('id', id).single()` with visibility check for non-admin users
- Add `useState`/`useEffect` for async fetch with loading skeleton

