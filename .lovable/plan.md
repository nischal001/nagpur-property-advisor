

## Plan: Fix Admin Panel & Enhance Property Management

### Problem
All database requests are currently failing ("Failed to fetch"), which means the admin panel, properties page, and dashboards are non-functional. Additionally, the admin panel needs better property management controls (show/hide on website).

### What will be done

**1. Fix Database Connectivity**
- The "Failed to fetch" errors on all Supabase REST calls suggest a transient connectivity issue or a misconfigured client. Will verify the Supabase URL and anon key are correctly set, and add error handling/retry logic to gracefully handle temporary outages.

**2. Enhance Admin Panel Property Management**
- Add a toggle (show/hide) for each property so the admin can control visibility on the website without fully rejecting it.
- Add a `visible` boolean column to the `properties` table (default `true` for approved properties).
- Update the Properties listing page to filter by `visible = true` in addition to `status = approved`.
- Add property detail view in admin (expandable rows showing images, documents, seller info).
- Add bulk actions (approve/reject multiple).

**3. Improve Admin Panel UX**
- Show seller name/contact alongside each property listing.
- Add search/filter within the admin properties tab (by location, type, status).
- Show property images as thumbnails in the admin list.
- Add confirmation dialogs for approve/reject actions.

### Technical Details

**Database Migration:**
```sql
ALTER TABLE properties ADD COLUMN visible boolean NOT NULL DEFAULT true;
```

**RLS:** Existing admin policies already cover updates. The properties SELECT policy will be updated:
```sql
-- Update to also check visible = true for public viewing
DROP POLICY "Approved properties are viewable by everyone" ON properties;
CREATE POLICY "Approved visible properties are viewable by everyone"
  ON properties FOR SELECT
  USING (
    (status = 'approved' AND visible = true)
    OR seller_id = auth.uid()
    OR has_role(auth.uid(), 'admin')
  );
```

**Frontend Changes:**
- `AdminPanel.tsx`: Add Switch toggle per property row for visibility, add search input, show seller info via join with profiles table, add confirmation dialog.
- `Properties.tsx`: Add `.eq('visible', true)` to the query filter.
- `PropertyDetail.tsx`: Check `visible` flag and show 404 for hidden properties (unless admin).

