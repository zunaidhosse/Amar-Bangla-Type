const CACHE_NAME = 'bengali-phonetic-translator-v1';
const urlsToCache = [
    '/AmarBangla/', // রুট পাথটি রেপোজিটরির নাম সহ নির্দিষ্ট করুন
    '/AmarBangla/index.html',
    '/AmarBangla/manifest.json',
    '/AmarBangla/icon-192x192.png',
    '/AmarBangla/icon-512x512.png',
    'https://cdn.tailwindcss.com', // Tailwind CSS CDN
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Noto+Sans+Bengali:wght@300;400;500;600;700&display=swap', // Google Fonts CSS
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css' // Font Awesome CSS
    // আপনি অফলাইনে ব্যবহারের জন্য অন্য যেকোনো গুরুত্বপূর্ণ সম্পদ এখানে যোগ করতে পারেন
];

// ইনস্টল ইভেন্ট: সমস্ত স্ট্যাটিক সম্পদ ক্যাশ করে
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('ক্যাশ খোলা হয়েছে');
                return cache.addAll(urlsToCache);
            })
            .catch(error => {
                console.error('ইনস্টল করার সময় সম্পদ ক্যাশ করতে ব্যর্থ হয়েছে:', error);
            })
    );
});

// ফেচ ইভেন্ট: প্রথমে ক্যাশ করা বিষয়বস্তু পরিবেশন করে, তারপর নেটওয়ার্কে ফিরে আসে
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // ক্যাশ হিট - প্রতিক্রিয়া ফেরত দিন
                if (response) {
                    return response;
                }
                // ক্যাশ হিট হয়নি - নেটওয়ার্ক থেকে আনুন
                return fetch(event.request).catch(() => {
                    // এটি নেটওয়ার্ক অনুপলব্ধ হলে ক্যাচ করার জন্য
                    console.log('নেটওয়ার্ক অনুরোধ ব্যর্থ হয়েছে, এবং এর জন্য কোনো ক্যাশ ম্যাচ নেই:', event.request.url);
                    // প্রয়োজনে আপনি এখানে একটি নির্দিষ্ট অফলাইন পেজ ফেরত দিতে পারেন
                    // return caches.match('/AmarBangla/offline.html'); // যদি আপনার একটি offline.html ফাইল থাকে
                    return new Response('<h1>আপনি অফলাইনে আছেন!</h1><p>এই অ্যাপটি কাজ করার জন্য ইন্টারনেট সংযোগ প্রয়োজন।</p>', {
                        headers: { 'Content-Type': 'text/html' }
                    });
                });
            })
    );
});

// অ্যাক্টিভেট ইভেন্ট: পুরানো ক্যাশ পরিষ্কার করে
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
