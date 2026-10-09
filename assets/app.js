/* LinkPaisa — shortener tool logic (100% client-side, koi server nahi) */
(function () {
  "use strict";

  var $ = function (id) { return document.getElementById(id); };
  var destUrl = $("destUrl"), useOgads = $("useOgads"), ogadsBox = $("ogadsBox"),
      lockerUrl = $("lockerUrl"), result = $("result"), outLink = $("outLink"),
      tinyBtn = $("tinyBtn"), tinyOut = $("tinyOut"), tinyLink = $("tinyLink"),
      tinyHint = $("tinyHint");

  // OGAds referral links config se lagao
  var ref = (window.LINKPAISA && window.LINKPAISA.OGADS_REFERRAL) || "https://ogads.com/";
  document.querySelectorAll(".refLink").forEach(function (a) { a.href = ref; });
  var refTop = $("ogadsRefTop"); if (refTop) refTop.href = ref;

  useOgads.addEventListener("change", function () {
    ogadsBox.style.display = useOgads.checked ? "block" : "none";
  });

  function cleanUrl(v) {
    v = (v || "").trim();
    if (!v) return null;
    if (!/^https?:\/\//i.test(v)) v = "https://" + v;
    try {
      var u = new URL(v);
      if (u.protocol !== "http:" && u.protocol !== "https:") return null;
      return u.href;
    } catch (e) { return null; }
  }

  function b64urlEncode(s) {
    return btoa(unescape(encodeURIComponent(s)))
      .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }

  function saveLink(dest, link) {
    try {
      var arr = JSON.parse(localStorage.getItem("linkpaisa_links") || "[]");
      arr.unshift({ dest: dest, link: link, created: new Date().toISOString().slice(0, 10) });
      localStorage.setItem("linkpaisa_links", JSON.stringify(arr.slice(0, 100)));
      renderLinks();
    } catch (e) {}
  }

  function renderLinks() {
    var box = $("linksList"), arr = [];
    try { arr = JSON.parse(localStorage.getItem("linkpaisa_links") || "[]"); } catch (e) {}
    if (!arr.length) { box.innerHTML = '<p class="muted">Abhi koi link nahi banaya.</p>'; return; }
    box.innerHTML = "";
    arr.forEach(function (it, i) {
      var div = document.createElement("div");
      div.className = "link-item";
      var code = document.createElement("code"); code.textContent = it.link;
      var dest = document.createElement("div"); dest.className = "dest"; dest.textContent = "→ " + it.dest;
      var cp = document.createElement("button"); cp.textContent = "Copy";
      cp.onclick = function () { navigator.clipboard.writeText(it.link); cp.textContent = "Copied ✓"; setTimeout(function(){cp.textContent="Copy";},1500); };
      var del = document.createElement("button"); del.textContent = "✕";
      del.onclick = function () {
        var a2 = JSON.parse(localStorage.getItem("linkpaisa_links") || "[]");
        a2.splice(i, 1);
        localStorage.setItem("linkpaisa_links", JSON.stringify(a2));
        renderLinks();
      };
      div.appendChild(code); div.appendChild(dest); div.appendChild(cp); div.appendChild(del);
      box.appendChild(div);
    });
  }

  $("makeLink").addEventListener("click", function () {
    var dest = cleanUrl(destUrl.value);
    if (!dest) { alert("Sahi link daalo (jaise https://example.com/page)"); destUrl.focus(); return; }

    var finalDest = dest;
    if (useOgads.checked) {
      var locker = cleanUrl(lockerUrl.value);
      if (!locker) { alert("OGAds locker link daalo — ya locker wala tick hata do."); lockerUrl.focus(); return; }
      finalDest = locker;
    }

    // Interstitial (countdown) page ka link banao — destination URL ke andar encoded
    var goBase = new URL("go/", location.href).href;
    var earnLink = goBase + "?to=" + b64urlEncode(finalDest);

    outLink.value = earnLink;
    result.classList.remove("hidden");
    tinyOut.classList.add("hidden"); tinyHint.textContent = "";
    saveLink(dest, earnLink);
    result.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  $("copyBtn").addEventListener("click", function () {
    outLink.select(); navigator.clipboard.writeText(outLink.value);
    $("copyBtn").textContent = "Copied ✓"; setTimeout(function(){ $("copyBtn").textContent = "Copy"; }, 1500);
  });

  // Optional: is.gd se aur chhota link (free API, CORS allow karta hai)
  tinyBtn.addEventListener("click", function () {
    var longUrl = outLink.value;
    if (!longUrl) return;
    tinyHint.textContent = "Chhota kiya ja raha hai…";
    fetch("https://is.gd/create.php?format=simple&url=" + encodeURIComponent(longUrl))
      .then(function (r) { if (!r.ok) throw 0; return r.text(); })
      .then(function (t) {
        t = (t || "").trim();
        if (!/^https?:\/\//.test(t)) throw 0;
        tinyLink.value = t; tinyOut.classList.remove("hidden");
        tinyHint.textContent = "Ye raha super-short link — kahin bhi share karo!";
        try {
          var arr = JSON.parse(localStorage.getItem("linkpaisa_links") || "[]");
          if (arr[0]) { arr[0].link = t; localStorage.setItem("linkpaisa_links", JSON.stringify(arr)); renderLinks(); }
        } catch (e) {}
      })
      .catch(function () {
        tinyHint.textContent = "Auto-short fail hua — link copy karke is.gd par khud paste kar lo (10 second ka kaam).";
      });
  });

  $("copyTiny").addEventListener("click", function () {
    tinyLink.select(); navigator.clipboard.writeText(tinyLink.value);
    $("copyTiny").textContent = "Copied ✓"; setTimeout(function(){ $("copyTiny").textContent = "Copy"; }, 1500);
  });

  renderLinks();
})();
