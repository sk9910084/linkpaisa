/* LinkPaisa — countdown / redirect page (?to=<base64url>) */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };

  var ref = (window.LINKPAISA && window.LINKPAISA.OGADS_REFERRAL) || "https://ogads.com/";
  var goRef = $("goRef"); if (goRef) goRef.href = ref;

  function b64urlDecode(s) {
    s = s.replace(/-/g, "+").replace(/_/g, "/");
    while (s.length % 4) s += "=";
    return decodeURIComponent(escape(atob(s)));
  }

  var dest = null;
  try {
    var to = new URL(location.href).searchParams.get("to");
    if (to) {
      var u = new URL(b64urlDecode(to));
      if (u.protocol === "http:" || u.protocol === "https:") dest = u.href;
    }
  } catch (e) { dest = null; }

  $("loading").classList.add("hidden");
  if (!dest) { $("bad").classList.remove("hidden"); return; }

  $("ready").classList.remove("hidden");
  try { $("destHost").textContent = new URL(dest).hostname; } catch (e) {}

  var secs = 5, secsEl = $("secs"), btn = $("continueBtn"), done = false;
  function go() {
    if (done) return; done = true;
    location.href = dest;
  }
  btn.addEventListener("click", go);
  var timer = setInterval(function () {
    secs--;
    if (secs <= 0) {
      clearInterval(timer);
      secsEl.textContent = "0";
      btn.disabled = false;
      btn.textContent = "Continue → " + (function(){ try { return new URL(dest).hostname; } catch(e){ return ""; } })();
      go(); // auto-redirect
    } else {
      secsEl.textContent = secs;
    }
  }, 1000);
})();
