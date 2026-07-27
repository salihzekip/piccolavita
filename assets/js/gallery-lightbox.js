/* Tıkla-büyüt lightbox: tüm *-galeri.html sayfalarında ortak.
   Sayfa, kendi <script> bloğunun sonunda window.PVGallery'yi (idx/total/getItem/setIdx) tanımlar. */
(function () {
  function init() {
    var PV = window.PVGallery;
    var gImg = document.getElementById('gImg');
    if (!PV || !gImg) return;

    var style = document.createElement('style');
    style.textContent =
      '.pv-lb{position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.94);display:none;align-items:center;justify-content:center;touch-action:none;}' +
      '.pv-lb.pv-lb-open{display:flex;}' +
      '.pv-lb-stage{width:100%;height:100%;display:flex;align-items:center;justify-content:center;overflow:hidden;}' +
      '.pv-lb-img{max-width:94vw;max-height:90vh;object-fit:contain;touch-action:none;transition:transform .06s linear;will-change:transform;user-select:none;-webkit-user-drag:none;}' +
      '.pv-lb-close{position:absolute;top:16px;right:16px;width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.25);color:#fff;font-size:24px;line-height:1;display:flex;align-items:center;justify-content:center;z-index:2;}' +
      '.pv-lb-nav{position:absolute;top:50%;transform:translateY(-50%);width:46px;height:46px;border-radius:50%;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.25);color:#fff;font-size:24px;display:flex;align-items:center;justify-content:center;z-index:2;}' +
      '.pv-lb-prev{left:12px;} .pv-lb-next{right:12px;}' +
      '.pv-lb-counter{position:absolute;bottom:18px;left:50%;transform:translateX(-50%);font:600 12px/1 Montserrat,system-ui,sans-serif;letter-spacing:.08em;color:rgba(255,255,255,.7);}' +
      '.pv-lb-hint{position:absolute;bottom:44px;left:50%;transform:translateX(-50%);font:500 11px/1 Montserrat,system-ui,sans-serif;color:rgba(255,255,255,.4);white-space:nowrap;}' +
      '@media(max-width:640px){.pv-lb-nav{width:38px;height:38px;font-size:19px;} .pv-lb-hint{display:none;}}';
    document.head.appendChild(style);

    var overlay = document.createElement('div');
    overlay.className = 'pv-lb';
    overlay.innerHTML =
      '<button class="pv-lb-close" aria-label="Kapat">&times;</button>' +
      '<button class="pv-lb-nav pv-lb-prev" aria-label="Önceki">&lsaquo;</button>' +
      '<div class="pv-lb-stage"><img class="pv-lb-img" alt=""></div>' +
      '<button class="pv-lb-nav pv-lb-next" aria-label="Sonraki">&rsaquo;</button>' +
      '<div class="pv-lb-counter"></div>' +
      '<div class="pv-lb-hint">Yakınlaştırmak için çift dokunun</div>';
    document.body.appendChild(overlay);

    var lbImg = overlay.querySelector('.pv-lb-img');
    var counter = overlay.querySelector('.pv-lb-counter');
    var btnClose = overlay.querySelector('.pv-lb-close');
    var btnPrev = overlay.querySelector('.pv-lb-prev');
    var btnNext = overlay.querySelector('.pv-lb-next');

    var scale = 1, panX = 0, panY = 0, isOpen = false;

    function applyTransform() {
      lbImg.style.transform = 'translate(' + panX + 'px,' + panY + 'px) scale(' + scale + ')';
    }
    function resetZoom() { scale = 1; panX = 0; panY = 0; applyTransform(); }

    function renderLB() {
      var item = PV.getItem(PV.idx);
      lbImg.src = item.src;
      counter.textContent = (PV.idx + 1) + ' / ' + PV.total;
      resetZoom();
    }

    function skipToImage(dir) {
      var item = PV.getItem(PV.idx);
      var guard = 0;
      while (item.type === 'video' && guard < PV.total) {
        PV.setIdx(PV.idx + dir);
        item = PV.getItem(PV.idx);
        guard++;
      }
      renderLB();
    }

    function open(startIdx) {
      var item = PV.getItem(startIdx);
      if (item.type === 'video') return;
      PV.setIdx(startIdx);
      renderLB();
      overlay.classList.add('pv-lb-open');
      document.body.style.overflow = 'hidden';
      isOpen = true;
    }
    function close() {
      overlay.classList.remove('pv-lb-open');
      document.body.style.overflow = '';
      isOpen = false;
    }
    function next() { PV.setIdx(PV.idx + 1); skipToImage(1); }
    function prev() { PV.setIdx(PV.idx - 1); skipToImage(-1); }

    gImg.style.cursor = 'zoom-in';
    gImg.addEventListener('click', function () { open(PV.idx); });

    btnClose.addEventListener('click', close);
    btnPrev.addEventListener('click', function (e) { e.stopPropagation(); prev(); });
    btnNext.addEventListener('click', function (e) { e.stopPropagation(); next(); });
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });

    document.addEventListener('keydown', function (e) {
      if (!isOpen) return;
      if (e.key === 'Escape') { e.stopImmediatePropagation(); close(); }
      else if (e.key === 'ArrowRight') { e.stopImmediatePropagation(); next(); }
      else if (e.key === 'ArrowLeft') { e.stopImmediatePropagation(); prev(); }
    }, true);

    function dist(a, b) { return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY); }

    var t = null;
    overlay.addEventListener('touchstart', function (e) {
      if (e.touches.length === 2) {
        t = { mode: 'pinch', startDist: dist(e.touches[0], e.touches[1]), startScale: scale };
      } else if (e.touches.length === 1) {
        t = {
          mode: scale > 1 ? 'pan' : 'swipe',
          x0: e.touches[0].clientX, y0: e.touches[0].clientY,
          panX0: panX, panY0: panY, t0: Date.now(),
        };
      }
    }, { passive: true });

    overlay.addEventListener('touchmove', function (e) {
      if (!t) return;
      if (t.mode === 'pinch' && e.touches.length === 2) {
        var d = dist(e.touches[0], e.touches[1]);
        scale = Math.min(4, Math.max(1, t.startScale * (d / t.startDist)));
        applyTransform();
        e.preventDefault();
      } else if (t.mode === 'pan' && e.touches.length === 1) {
        panX = t.panX0 + (e.touches[0].clientX - t.x0);
        panY = t.panY0 + (e.touches[0].clientY - t.y0);
        applyTransform();
        e.preventDefault();
      }
    }, { passive: false });

    var lastTap = 0;
    overlay.addEventListener('touchend', function (e) {
      if (t && t.mode === 'swipe') {
        var dx = e.changedTouches[0].clientX - t.x0;
        var dt = Date.now() - t.t0;
        if (Math.abs(dx) > 50 && dt < 600) {
          if (dx < 0) next(); else prev();
        } else if (Math.abs(dx) < 10 && dt < 300) {
          var now = Date.now();
          if (now - lastTap < 300) {
            scale > 1 ? resetZoom() : (scale = 2.5, applyTransform());
          }
          lastTap = now;
        }
      }
      if (scale < 1.02) resetZoom();
      t = null;
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
