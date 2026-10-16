// Theme toggle: flips between light and dark, remembers the choice.
(function () {
  var btn = document.querySelector(".theme-toggle");
  if (!btn) return;
  btn.addEventListener("click", function () {
    var root = document.documentElement;
    var current = root.getAttribute("data-theme");
    if (!current) current = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    var next = current === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
    document.dispatchEvent(new Event("themechange"));
  });
})();

// Hero background: passive tracers advected through a divergence-free field,
// with a slow left-to-right drift, like seeding particles on a river surface.
// The cursor adds a point vortex.
(function () {
  var canvas = document.querySelector(".flow");
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext("2d");
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  var W = 0, H = 0, dpr = 1, particles = [], t = 0;
  var mouse = { x: -1e4, y: -1e4, active: false };
  var running = false, visible = true, raf = 0;
  var rgb = "29, 27, 24";

  function readColor() {
    rgb = getComputedStyle(document.documentElement).getPropertyValue("--flow").trim() || rgb;
  }

  // Stream function psi(x, y, t); velocity is (dpsi/dy, -dpsi/dx), so the flow
  // has zero divergence and particles never bunch up or thin out.
  var K = [
    { kx: 0.0061, ky: 0.0093, w: 0.11, a: 52, p: 0.0 },
    { kx: 0.0117, ky: 0.0054, w: -0.07, a: 30, p: 1.7 },
    { kx: 0.0039, ky: 0.0151, w: 0.05, a: 22, p: 4.1 }
  ];
  function velocity(x, y) {
    var u = 0.55, v = 0;
    for (var i = 0; i < K.length; i++) {
      var k = K[i];
      var sx = Math.sin(k.kx * x + k.w * t + k.p), cx = Math.cos(k.kx * x + k.w * t + k.p);
      var sy = Math.sin(k.ky * y - k.w * t), cy = Math.cos(k.ky * y - k.w * t);
      // psi = a * sin(kx x) * sin(ky y)
      u += k.a * k.ky * sx * cy * 1.2;
      v -= k.a * k.kx * cx * sy * 1.2;
    }
    if (mouse.active) {
      var dx = x - mouse.x, dy = y - mouse.y;
      var r2 = dx * dx + dy * dy + 900;
      var s = 2600 / r2;
      u += -dy * s * 0.05;
      v += dx * s * 0.05;
    }
    return [u, v];
  }

  function spawn(p, anywhere) {
    p.x = anywhere ? Math.random() * W : -10 - Math.random() * 40;
    p.y = Math.random() * H;
    p.life = 200 + Math.random() * 400;
  }

  function resize() {
    var rect = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = rect.width; H = rect.height;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var n = Math.min(900, Math.round((W * H) / (W < 700 ? 2600 : 1700)));
    particles = [];
    for (var i = 0; i < n; i++) { var p = {}; spawn(p, true); particles.push(p); }
    ctx.clearRect(0, 0, W, H);
  }

  function step() {
    // fade old trails toward transparent rather than painting a background colour,
    // so it works on either theme
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = "rgba(0,0,0,0.075)";
    ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = "rgba(" + rgb + ", 0.32)";
    ctx.lineWidth = 0.9;
    ctx.beginPath();
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      var vel = velocity(p.x, p.y);
      var nx = p.x + vel[0], ny = p.y + vel[1];
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(nx, ny);
      p.x = nx; p.y = ny;
      if (--p.life < 0 || p.x > W + 10 || p.y < -10 || p.y > H + 10 || p.x < -60) spawn(p, p.life < 0);
    }
    ctx.stroke();
    t += 0.016;
  }

  function loop() {
    if (!running) return;
    step();
    raf = requestAnimationFrame(loop);
  }
  function start() { if (!running && visible && !document.hidden) { running = true; raf = requestAnimationFrame(loop); } }
  function stop() { running = false; cancelAnimationFrame(raf); }

  readColor();
  resize();

  if (reduce) {
    // one still frame of streaklines instead of an animation
    for (var i = 0; i < 160; i++) step();
    return;
  }

  var hero = canvas.parentElement;
  hero.addEventListener("pointermove", function (e) {
    var r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; mouse.active = true;
  });
  hero.addEventListener("pointerleave", function () { mouse.active = false; });

  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  });
  document.addEventListener("themechange", function () { readColor(); ctx.clearRect(0, 0, W, H); });
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", readColor);
  document.addEventListener("visibilitychange", function () { document.hidden ? stop() : start(); });
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      visible ? start() : stop();
    }).observe(canvas);
  }
  start();
})();
