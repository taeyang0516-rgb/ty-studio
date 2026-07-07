// TY Studio - Service Worker (오프라인 캐싱)
const CACHE_NAME = "ty-studio-v1";

// 설치될 때: 기본 파일들을 미리 저장
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

// 활성화될 때: 오래된 캐시 정리
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// 페이지 요청이 올 때: 네트워크 먼저, 안 되면 캐시에서 꺼내기
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
