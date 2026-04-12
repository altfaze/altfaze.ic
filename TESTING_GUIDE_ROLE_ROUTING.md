# 🧪 TESTING GUIDE - Role-Based Routing Fix

## 🚀 QUICK START
```bash
npm run dev
# or
yarn dev
```

---

## 📋 COMPLETE FLOW TEST

### **Step 1: Register New Account**
1. Go to http://localhost:3000/register
2. Fill in:
   - Name: Test User
   - Email: testuser@example.com
   - Password: Password123
3. Click "Sign Up"
4. Should redirect to /onboard automatically

### **Step 2: Select Role**
1. On the onboard page, you should see two buttons:
   - "I'm a Client"
   - "I'm a Freelancer"
2. Click one of them (try CLIENT first)
3. You should see a loading state
4. Check browser console for logs starting with 🔵, 🟢, ✅

### **Step 3: Verify Role Selection**
- Check console for: `✅ [ONBOARD_FRONTEND] Role verified in database! Safe to redirect.`
- Should see: `🟢 [ONBOARD_FRONTEND] Redirecting to dashboard: /client/dashboard`

### **Step 4: Dashboard Should Load**
- For CLIENT: Should redirect to `/client/dashboard` 
- For FREELANCER: Should redirect to `/freelancer/my-dashboard`
- Dashboard should render WITHOUT "404 Not Found" error

---

## 🔍 CONSOLE LOGGING INDICATORS

### ✅ Expected Logs (CLIENT Role)
```
🔵 [ONBOARD_FRONTEND] Role selection clicked: CLIENT
🔵 [ONBOARD_FRONTEND] Sending role to API: CLIENT
🔵 [ONBOARD_FRONTEND] Response status: 200
🟢 [ONBOARD_FRONTEND] Success: [object Object]
🔄 [ONBOARD_FRONTEND] Waiting for server to sync role update...
🔄 [ONBOARD_FRONTEND] Refreshing session with new role...
🔄 [ONBOARD_FRONTEND] Session update result: true
🔄 [ONBOARD_FRONTEND] Verifying role update in database...
🔵 [ONBOARD_FRONTEND] Database verify attempt 1: { dbRole: 'CLIENT', expectedRole: 'CLIENT', verified: true }
✅ [ONBOARD_FRONTEND] Role verified in database! Safe to redirect.
🟢 [ONBOARD_FRONTEND] Redirecting to dashboard: /client/dashboard
[CLIENT_LAYOUT] User retrieved: [object Object]
[CLIENT_LAYOUT] ✅ CLIENT role verified - rendering dashboard
```

### ❌ Expected Warning (if JWT not synced yet)
```
🟡 [ONBOARD_FRONTEND] Role not verified after 5 attempts - proceeding anyway...
[MIDDLEWARE] No role set for authenticated user - redirecting to onboard
[ONBOARD_FRONTEND] Attempting again...
```
This is actually OK - the system will retry automatically.

---

## 🛠️ DEBUG ENDPOINTS

### Check Entire Routing Status
```bash
curl http://localhost:3000/api/debug/routing
```

**Response Example:**
```json
{
  "authenticated": true,
  "sessionUser": {
    "id": "user123",
    "email": "test@example.com",
    "name": "Test User",
    "role": "CLIENT"
  },
  "dbUser": {
    "id": "user123",
    "email": "test@example.com",
    "name": "Test User",
    "role": "CLIENT",
    "hasClient": true,
    "hasFreelancer": false
  },
  "recommendedDashboard": "/client/dashboard",
  "recommendations": ["All good! Go to /client/dashboard"]
}
```

### Verify Role in Database
```bash
curl http://localhost:3000/api/auth/verify-role
```

**Response Example:**
```json
{
  "role": "CLIENT",
  "verified": true,
  "message": "Role verified: CLIENT",
  "user": {
    "id": "user123",
    "email": "test@example.com",
    "name": "Test User"
  }
}
```

---

## 🧪 TEST SCENARIOS

### Scenario 1: CLIENT Role Flow ✅
1. Register new account
2. Select "I'm a Client" on onboard
3. Should see `/client/dashboard` load
4. Sidebar should appear
5. Should see client-specific content

### Scenario 2: FREELANCER Role Flow ✅
1. Register new account
2. Select "I'm a Freelancer" on onboard
3. Should see `/freelancer/my-dashboard` load
4. Sidebar should appear
5. Should see freelancer-specific content

### Scenario 3: Role Switch ✅
1. CLIENT tries to access `/freelancer/my-dashboard`
   - Should redirect to `/client/dashboard` ✓
2. FREELANCER tries to access `/client/dashboard`
   - Should redirect to `/freelancer/my-dashboard` ✓

### Scenario 4: Unauthenticated Access ✅
1. Clear cookies/logout
2. Try to access `/client/dashboard`
   - Should redirect to `/login` ✓
3. Try to access `/freelancer/my-dashboard`
   - Should redirect to `/login` ✓

### Scenario 5: Missing Role ✅
1. Somehow access system without role set
2. Try to access any dashboard
   - Should redirect to `/onboard` ✓

---

## 🔐 MIDDLEWARE CHECK

### Verify Middleware is Running
```bash
# Watch the server logs while testing
# Should see logs like:
# [MIDDLEWARE] ✅ CLIENT role verified for /client route
# [MIDDLEWARE] ✅ FREELANCER role verified for /freelancer route
```

---

## 📊 FILE STRUCTURE VERIFICATION

### Required Routes
- ✅ `/login` → `app/(auth)/login/page.tsx`
- ✅ `/register` → `app/(auth)/register/page.tsx`
- ✅ `/onboard` → `app/onboard/page.tsx`
- ✅ `/client/dashboard` → `app/(client)/dashboard/page.tsx`
- ✅ `/freelancer/my-dashboard` → `app/(freelancer)/my-dashboard/page.tsx`

### Required Layouts
- ✅ `app/(client)/layout.tsx` → validates CLIENT role
- ✅ `app/(freelancer)/layout.tsx` → validates FREELANCER role

### Required API Routes
- ✅ `/api/users/onboard` → sets role in database
- ✅ `/api/auth/verify-role` → confirms role in database
- ✅ `/api/debug/routing` → debugging endpoint

---

## 🚨 TROUBLESHOOTING

### Issue: Still seeing 404 after role selection
**Solution:**
1. Check browser console for error logs
2. Open `/api/debug/routing` to see current state
3. Check that role was actually set: `/api/auth/verify-role`
4. Clear browser cache/cookies and try again
5. Check server logs for any database errors

### Issue: Stuck on onboard page
**Solution:**
1. Check if role was actually saved
2. Visit `/api/auth/verify-role` to confirm
3. If role is set but not redirecting, refresh the page
4. Check browser dev tools → Network tab for any failed API calls

### Issue: Wrong dashboard loading
**Solution:**
1. This should not happen with the fixes applied
2. If it does, check `/api/debug/routing` endpoint
3. Verify role in database vs session matches the layout checking
4. Check browser console for middleware logs

### Issue: Logout then login shows wrong role
**Solution:**
1. This is expected if you haven't changed roles
2. Use `/api/debug/routing` to verify current role
3. If role is wrong, you may need to reset and re-onboard

---

## ✅ FINAL VERIFICATION CHECKLIST

- [ ] New user registration works
- [ ] User can select CLIENT role
- [ ] User can select FREELANCER role
- [ ] CLIENT dashboard loads without 404
- [ ] FREELANCER dashboard loads without 404
- [ ] Error messages are clear and helpful
- [ ] Console logs match expected output
- [ ] Debug endpoints return correct data
- [ ] Role switching redirects correctly
- [ ] Middleware validation working (check server logs)
- [ ] No TypeScript errors during build
- [ ] No runtime errors in browser console

---

## 📞 SUPPORT

If issues persist after applying these fixes:
1. Check the server logs for database errors
2. Verify PostgreSQL database is running
3. Ensure all migrations have been run
4. Check `.env` file has correct DATABASE_URL
5. Review `FIXES_APPLIED_ROLE_ROUTING.md` for detailed changes

---

**Last Updated**: 2026-04-12
**Status**: ✅ READY FOR TESTING
