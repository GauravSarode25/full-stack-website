import http from 'http';
import { Socket } from 'net';

console.log('================================================================');
console.log('CAFE LOVE BYTE — FULL PRODUCTION-READINESS AUDIT');
console.log('================================================================\n');

process.env.PORT = '5001';
process.env.NODE_ENV = 'production';
process.env.MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cafe_love_byte';
process.env.JWT_SECRET = 'audit_secret_key_love_byte_2026';

const { default: app } = await import('./backend/server.js');

let pass = 0;
let fail = 0;

function report(condition, testName, details = '') {
  if (condition) {
    console.log(`✓ [PASS] ${testName}`);
    pass++;
  } else {
    console.error(`❌ [FAIL] ${testName} ${details ? '— ' + details : ''}`);
    fail++;
  }
}

// In-process Express Dispatcher with native Node http.IncomingMessage & http.ServerResponse
function dispatch(app, { method = 'GET', url = '/', headers = {}, body = null }) {
  return new Promise((resolve) => {
    const socket = new Socket();
    const req = new http.IncomingMessage(socket);
    const res = new http.ServerResponse(req);

    const bodyStr = body ? JSON.stringify(body) : '';
    req.method = method.toUpperCase();
    req.url = url;
    req.headers = {
      'host': 'localhost:5000',
      'content-type': 'application/json',
      'content-length': String(Buffer.byteLength(bodyStr)),
      ...headers
    };

    const chunks = [];
    const origWrite = res.write.bind(res);
    const origEnd = res.end.bind(res);

    res.write = function (chunk, ...args) {
      if (chunk) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      return origWrite(chunk, ...args);
    };

    res.end = function (chunk, ...args) {
      if (chunk) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      origEnd(chunk, ...args);

      const resBuffer = Buffer.concat(chunks);
      const resText = resBuffer.toString('utf-8');
      let data = null;
      try {
        data = JSON.parse(resText);
      } catch {
        data = resText;
      }
      resolve({
        status: res.statusCode,
        ok: res.statusCode >= 200 && res.statusCode < 300,
        headers: res.getHeaders(),
        data
      });
    };

    app(req, res);

    if (bodyStr) {
      req.push(Buffer.from(bodyStr));
    }
    req.push(null);
  });
}

// Wait for storage init
await new Promise(r => setTimeout(r, 600));

console.log('--- 1. Testing Health & Server Startup ---');
const health = await dispatch(app, { url: '/api/health' });
report(health.status === 200 && health.data?.status === 'online', 'Server Startup & /api/health online', JSON.stringify(health.data));

console.log('\n--- 2. Testing Menu API ---');
const menu = await dispatch(app, { url: '/api/menu' });
report(menu.status === 200 && menu.data?.success && Array.isArray(menu.data.data), 'GET /api/menu returns items array', `Count: ${menu.data?.data?.length}`);
const sampleItemId = menu.data?.data?.[0]?.id || 'item-1';
const menuItem = await dispatch(app, { url: `/api/menu/${sampleItemId}` });
report(menuItem.status === 200 && menuItem.data?.success, `GET /api/menu/${sampleItemId} returns single item`);

console.log('\n--- 3. Testing Blog API ---');
const blogs = await dispatch(app, { url: '/api/blogs' });
report(blogs.status === 200 && blogs.data?.success && Array.isArray(blogs.data.data), 'GET /api/blogs returns articles', `Count: ${blogs.data?.data?.length}`);
const sampleSlug = blogs.data?.data?.[0]?.slug || 'first-date-coffee-guide';
const singleBlog = await dispatch(app, { url: `/api/blogs/${sampleSlug}` });
report(singleBlog.status === 200 && singleBlog.data?.success, `GET /api/blogs/${sampleSlug} returns single article`);

console.log('\n--- 4. Testing Gallery API ---');
const gallery = await dispatch(app, { url: '/api/gallery' });
report(gallery.status === 200 && gallery.data?.success && Array.isArray(gallery.data.data), 'GET /api/gallery returns photos', `Count: ${gallery.data?.data?.length}`);

console.log('\n--- 5. Testing Feedback & Testimonials API ---');
const feedback = await dispatch(app, { url: '/api/feedback' });
report(feedback.status === 200 && feedback.data?.success && Array.isArray(feedback.data.data), 'GET /api/feedback returns testimonials', `Count: ${feedback.data?.data?.length}`);

const newFeedback = await dispatch(app, {
  method: 'POST',
  url: '/api/feedback',
  body: {
    name: 'Production Auditor',
    rating: 5,
    tag: 'First Date',
    comment: 'The acoustic privacy and burrata sourdough flatbread were completely world class!'
  }
});
report(newFeedback.status === 201 && newFeedback.data?.success, 'POST /api/feedback creates new testimonial');

console.log('\n--- 6. Testing Contact Form Submission & Validation ---');
const badContact = await dispatch(app, {
  method: 'POST',
  url: '/api/contact',
  body: { name: '', email: 'not-an-email', message: 'hi' }
});
report(badContact.status === 400 && !badContact.data?.success, 'POST /api/contact correctly rejects invalid data (400)');

const validContact = await dispatch(app, {
  method: 'POST',
  url: '/api/contact',
  body: {
    name: 'Aarav Mehta',
    email: 'aarav.mehta@example.com',
    phone: '+91 98765 43210',
    subject: 'Table Reservation Assistance',
    message: 'We are planning a surprise anniversary dinner for 6 guests on Saturday.'
  }
});
report(validContact.status === 201 && validContact.data?.success, 'POST /api/contact accepts valid inquiry (201)');

console.log('\n--- 7. Testing Table Reservation Submission & Validation ---');
const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
const badReservation = await dispatch(app, {
  method: 'POST',
  url: '/api/reservations',
  body: {
    name: 'Test',
    email: 'test@example.com',
    phone: '1234567890',
    date: yesterday,
    time: '07:00 PM',
    guests: 0
  }
});
report(badReservation.status === 400 && !badReservation.data?.success, 'POST /api/reservations rejects past date & invalid guests (400)');

const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
const validReservation = await dispatch(app, {
  method: 'POST',
  url: '/api/reservations',
  body: {
    name: 'Pooja Sharma',
    email: 'pooja.sharma@example.com',
    phone: '+91 98111 22233',
    date: tomorrow,
    time: '07:30 PM',
    guests: 2,
    occasion: 'Date',
    seatingPreference: 'Private Space',
    specialRequest: 'Quiet candlelight booth with rose petal setup'
  }
});
report(validReservation.status === 201 && validReservation.data?.success && validReservation.data?.data?.id, 'POST /api/reservations locks in reservation (201) with tracking code');

console.log('\n--- 8. Testing Admin Auth & Protected Endpoints ---');
const badLogin = await dispatch(app, {
  method: 'POST',
  url: '/api/auth/login',
  body: { email: 'admin@cafelovebyte.com', password: 'WrongPassword' }
});
report(badLogin.status === 401 && !badLogin.data?.success, 'POST /api/auth/login rejects wrong password (401)');

const goodLogin = await dispatch(app, {
  method: 'POST',
  url: '/api/auth/login',
  body: { email: 'admin@cafelovebyte.com', password: 'LoveByteAdmin@2026' }
});
const token = goodLogin.data?.token || goodLogin.data?.data?.token;
report(goodLogin.status === 200 && Boolean(token), 'POST /api/auth/login returns JWT token (200)');

const stats = await dispatch(app, {
  url: '/api/auth/stats',
  headers: { authorization: `Bearer ${token}` }
});
report(stats.status === 200 && stats.data?.success, 'GET /api/auth/stats returns administrative metrics');

const adminReservations = await dispatch(app, {
  url: '/api/reservations',
  headers: { authorization: `Bearer ${token}` }
});
report(adminReservations.status === 200 && adminReservations.data?.success, 'GET /api/reservations returns all bookings for admin');

const adminMessages = await dispatch(app, {
  url: '/api/contact',
  headers: { authorization: `Bearer ${token}` }
});
report(adminMessages.status === 200 && adminMessages.data?.success, 'GET /api/contact returns inquiries for admin');

console.log('\n--- 9. Testing 404 Handler ---');
const notFound = await dispatch(app, { url: '/api/non-existent-route' });
report(notFound.status === 404 && !notFound.data?.success, 'Non-existent API route returns clean JSON 404');

console.log('\n================================================================');
console.log(`BACKEND AUDIT COMPLETE: ${pass} PASSED, ${fail} FAILED`);
console.log('================================================================');

process.exit(fail > 0 ? 1 : 0);
