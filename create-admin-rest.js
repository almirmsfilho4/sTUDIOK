const https = require('https');

const projectId = 'studiok-saas';
const userId = 'rR8auYyDzeU257qHW4VS60q15Mg2';

// This would require a valid access token, which is complex to get
// Let me try a different approach

console.log('User UID:', userId);
console.log('Email: almir.msfilho@hotmail.com');
console.log('');
console.log('To setup the admin user, please:');
console.log('1. Go to Firebase Console: https://console.firebase.google.com/');
console.log('2. Select project: studiok-saas');
console.log('3. Go to Firestore Database');
console.log('4. Create a collection called "users"');
console.log('5. Create a document with ID:', userId);
console.log('6. Add these fields:');
console.log('   - uid:', userId);
console.log('   - email: almir.msfilho@hotmail.com');
console.log('   - name: Almir Filho');
console.log('   - role: admin');
console.log('   - createdAt: [current timestamp]');
console.log('   - updatedAt: [current timestamp]');
console.log('');
console.log('After this, the admin panel will be accessible!');