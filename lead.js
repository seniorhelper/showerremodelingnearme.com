/* Quote form: posts to the Eye To Ad lead server (saves the lead, then alerts by email).
   Honeypot + minimum fill time stop most bots. Nothing is sent anywhere else. */
(function () {
  "use strict";
  var LEAD = "https://clients.eyetoad.com/lead/send.php";
  var shown = Date.now();
  var form = document.getElementById("quote");
  if (!form) { return; }
  var msg = document.getElementById("form-msg");
  var btn = form.querySelector("button[type=submit]");

  function say(text, bad) {
    msg.textContent = text;
    msg.className = bad ? "msg bad" : "msg ok";
    msg.focus();
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    var fd = new FormData(form);
    if (String(fd.get("_honey") || "").trim() || Date.now() - shown < 3000) {
      window.location.href = "/thank-you/"; return;
    }
    fd.delete("_honey");
    var site = location.hostname.replace(/^www\./, "");
    fd.append("site", site);
    fd.append("page", location.pathname.slice(0, 200));
    fd.append("_t", String(shown));
    fd.append("_subject", "New lead - " + site);
    fd.append("consent_text", document.getElementById("consent-text").textContent.replace(/\s+/g, " ").trim());
    fd.append("consent_at", new Date().toISOString());
    try {
      var q = new URLSearchParams(location.search);
      ["utm_source", "utm_medium", "utm_campaign", "gclid"].forEach(function (k) {
        var v = q.get(k); if (v) { fd.append("lead_" + k, v.slice(0, 120)); }
      });
    } catch (err) { /* ignore */ }
    btn.disabled = true;
    btn.textContent = "Sending…";
    function post() {
      return fetch(LEAD, { method: "POST", body: fd, headers: { "Accept": "application/json" }, credentials: "omit" })
        .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) {
          if (r.ok && j && j.ok) { return j; } throw new Error("status " + r.status);
        }); });
    }
    post().catch(function () { return new Promise(function (res) { setTimeout(res, 1200); }).then(post); })
      .then(function () { window.location.href = "/thank-you/"; })
      .catch(function () {
        btn.disabled = false;
        btn.textContent = "Try again";
        say("Sorry, that didn't go through. Please call " + form.getAttribute("data-phone") + " and we'll take it by phone.", true);
      });
  });
})();
