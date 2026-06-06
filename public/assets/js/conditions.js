/* ==========================================================================
   GoVallecito.com — conditions painter
   Consumes the production conditions.json schema (see docs/BUILD-SPEC.md §3)
   and paints the home-page dashboard + any header conditions strip.

   Strategy for instant first paint with no "--" wait:
     1. Paint a bundled FALLBACK immediately (synchronous, no network).
     2. fetch('/data/conditions.json') in the background; repaint on success.
     3. On failure, keep the last good values already on screen.
   ========================================================================== */
(function () {
  'use strict';

  // Bundled last-resort values so the page never shows placeholders, even
  // offline / before the first fetch. Mirrors data/conditions.sample.json.
  var FALLBACK = {
    updatedFriendly: 'sample data',
    weather: { tempF: 74, desc: 'Sunny', windMph: 8, windDir: 'WSW', stale: false },
    lake:    { pct: 78, storageAf: 101200, capacityAf: 129700, stale: false },
    stream:  { combinedCfs: 142, stale: false },
    alert:   { level: 'ok', title: 'All clear', msg: 'No red-flag warnings or fire restrictions in effect.' },
    fires:   { count: 1, msg: '1 active incident within 50 mi', stale: false },
    road:    { level: 'ok', title: 'Clear', msg: 'No active CDOT alerts on the Durango access route.' }
  };

  var PILL = {
    ok:     ['pill-ok', 'dot-ok'],
    warn:   ['pill-warn', 'dot-warn'],
    danger: ['pill-danger', 'dot-danger']
  };

  function $(id) { return document.getElementById(id); }

  function setText(id, value) {
    var el = $(id);
    if (el) el.textContent = value;
  }

  function badge(id, level, title) {
    var el = $(id);
    if (!el) return;
    var c = PILL[level] || PILL.ok;
    el.innerHTML = '<span class="pill ' + c[0] + '"><span class="dot ' + c[1] + '"></span> ' +
      escapeHtml(title || '') + '</span>';
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"]/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch];
    });
  }

  // Toggle a tile's stale styling. tileId is the .tile element's id.
  function markStale(tileId, isStale) {
    var el = $(tileId);
    if (el) el.classList.toggle('is-stale', !!isStale);
  }

  function paint(d) {
    if (!d) return;

    // ----- updated timestamp -----
    setText('updTime', d.updatedFriendly || d.updated || '—');

    // ----- weather -----
    if (d.weather) {
      var w = d.weather;
      setText('wxTemp', (w.tempF != null ? w.tempF : '—') + '°');
      var desc = w.desc || '';
      if (w.windMph != null) {
        desc += (desc ? ' · ' : '') + 'wind ' + w.windMph + ' mph' + (w.windDir ? ' ' + w.windDir : '');
      }
      setText('wxDesc', desc || '—');
      if (w.source) setText('wxSrc', w.source);
      markStale('tile-weather', w.stale);
    }

    // ----- lake level -----
    if (d.lake) {
      var lk = d.lake;
      var pct = lk.pct != null ? lk.pct : 0;
      setText('lakePct', pct + '%');
      var fill = $('lakeFill');
      if (fill) fill.style.width = Math.max(0, Math.min(100, pct)) + '%';
      var store = (lk.storageAf != null ? lk.storageAf.toLocaleString() + ' af · ' : '') +
        pct + '% of full · Vallecito Reservoir';
      setText('lakeStore', store);
      markStale('tile-lake', lk.stale);
    }

    // ----- alert status -----
    if (d.alert) {
      badge('alertBig', d.alert.level, d.alert.title);
      setText('alertMsg', d.alert.msg || '');
    }

    // ----- wildfires -----
    if (d.fires) {
      setText('fireCount', d.fires.count != null ? d.fires.count : '—');
      setText('fireMsg', d.fires.msg || 'active incidents');
      markStale('tile-fire', d.fires.stale);
    }

    // ----- streamflow -----
    if (d.stream) {
      var cfs = d.stream.combinedCfs;
      setText('streamVal', (cfs != null ? cfs : '—') + ' cfs');
      setText('streamMsg', 'Vallecito Creek + Pine River, combined');
      markStale('tile-stream', d.stream.stale);
    }

    // ----- roads -----
    if (d.road) {
      badge('roadBig', d.road.level, d.road.title);
      setText('roadMsg', d.road.msg || '');
    }

    // ----- optional header conditions strip (sub-pages) -----
    if (d.weather && $('stripTemp')) {
      setText('stripTemp', (d.weather.tempF != null ? d.weather.tempF : '--') + '°');
    }
    if (d.lake && $('stripLake')) {
      setText('stripLake', (d.lake.pct != null ? d.lake.pct + '%' : '--'));
    }

    // ----- optional detailed fields (conditions.html) -----
    paintDetail(d);
  }

  // Fills the richer elements on conditions.html. Every write is guarded, so
  // this is a no-op on pages that don't have these ids.
  function paintDetail(d) {
    if (d.weather) {
      var w = d.weather;
      // secondary copies of dashboard values used in conditions.html panels
      setText('wxTemp2', (w.tempF != null ? w.tempF : '—') + '°');
      var desc2 = w.desc || '';
      if (w.windMph != null) desc2 += (desc2 ? ' · ' : '') + 'wind ' + w.windMph + ' mph' + (w.windDir ? ' ' + w.windDir : '');
      setText('wxDesc2', desc2 || '—');
      setText('wxHumidity', w.humidity != null ? w.humidity + '%' : '—');
      setText('wxWind', w.windMph != null ? w.windMph + ' mph' + (w.windDir ? ' ' + w.windDir : '') : '—');
      setText('wxHigh', w.highF != null ? w.highF + '°' : '—');
      setText('wxLow', w.lowF != null ? w.lowF + '°' : '—');
      setText('wxSource', w.source || '');
      var fcEl = $('wxForecast');
      if (fcEl && Array.isArray(w.forecast5)) {
        fcEl.innerHTML = w.forecast5.map(function (f) {
          return '<div class="fc"><b>' + escapeHtml(f.day) + '</b>' +
            '<span class="fc-ico">' + iconEmoji(f.icon) + '</span>' +
            '<span class="fc-hi">' + (f.hi != null ? f.hi + '°' : '—') + '</span>' +
            '<span class="fc-lo">' + (f.lo != null ? f.lo + '°' : '—') + '</span></div>';
        }).join('');
      }
    }

    if (d.lake) {
      var lk2 = d.lake;
      setText('lakeElev', lk2.elevationFt != null ? lk2.elevationFt.toLocaleString() + ' ft' : '—');
      setText('lakePct2', (lk2.pct != null ? lk2.pct : 0) + '%');
      var fill2 = $('lakeFill2');
      if (fill2) fill2.style.width = Math.max(0, Math.min(100, lk2.pct || 0)) + '%';
      if ($('lakeStore2')) {
        setText('lakeStore2', (lk2.storageAf != null ? lk2.storageAf.toLocaleString() + ' af · ' : '') +
          (lk2.pct != null ? lk2.pct + '% of full' : '') + ' · Vallecito Reservoir');
      }
    }

    if (d.stream && Array.isArray(d.stream.gauges)) {
      var gEl = $('streamGauges');
      if (gEl) {
        gEl.innerHTML = d.stream.gauges.map(function (g) {
          return '<li><span>' + escapeHtml(g.name) + ' <span class="muted">(USGS ' + escapeHtml(g.id) +
            ')</span></span><b>' + (g.cfs != null ? g.cfs + ' cfs' : '—') + '</b></li>';
        }).join('');
      }
    }

    if (d.fires) {
      setText('fireCount2', d.fires.count != null ? d.fires.count : '—');
      setText('fireNearest', d.fires.nearestName
        ? 'Nearest: ' + d.fires.nearestName + (d.fires.nearestMiles != null ? ' (~' + d.fires.nearestMiles + ' mi)' : '')
        : 'No named incidents nearby.');
    }

    if (d.road) {
      setText('roadMsg2', d.road.msg || '');
      badge('roadBig2', d.road.level, d.road.title);
    }

    if (d.alert) {
      var aEl = $('alertItems');
      if (aEl) {
        var its = d.alert.items || [];
        aEl.innerHTML = its.length
          ? its.map(function (i) { return '<li><b>' + escapeHtml(i.event) + '</b>' +
              (i.headline ? ' — ' + escapeHtml(i.headline) : '') + '</li>'; }).join('')
          : '<li class="muted">No active NWS alerts for the lake area.</li>';
      }
      // Fire-restriction banner (shown only when a stage is in effect).
      var banner = $('fireBanner');
      if (banner) {
        var stage = d.alert.fireRestrictionStage;
        if (stage && stage !== 'none') {
          banner.className = 'restriction-banner ' + (stage === '2' ? 'is-danger' : 'is-warn');
          banner.innerHTML = '<b>🔥 Stage ' + escapeHtml(stage) + ' fire restrictions in effect.</b> ' +
            escapeHtml(d.alert.msg || '');
          banner.hidden = false;
        } else {
          banner.hidden = true;
        }
      }
    }
  }

  function iconEmoji(icon) {
    return ({ sunny: '☀️', partly: '⛅', cloudy: '☁️', showers: '🌧️', storm: '⛈️', snow: '❄️' })[icon] || '☀️';
  }

  // 1) Instant paint from the bundle so there's never a "--" wait.
  paint(FALLBACK);

  // 2) Fetch the real data and repaint; keep last-good on failure.
  function load() {
    fetch('/data/conditions.json', { cache: 'no-store' })
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(paint)
      .catch(function () { /* keep last-painted values */ });
  }
  load();

  // 3) Auto-refresh every 15 min to match the worker cadence.
  setInterval(load, 15 * 60 * 1000);
})();
