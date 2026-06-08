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

  // We NEVER hard-code an optimistic status (e.g. "All clear"). The page paints
  // only real data: the last-good reading cached in localStorage (instant, for
  // repeat visitors), then the live feed. On total failure with no cache we show
  // "Data temporarily unavailable" — never a fake safe state.
  var LG_KEY = 'gv_conditions_lastgood';
  function readLastGood() { try { return JSON.parse(localStorage.getItem(LG_KEY)); } catch (e) { return null; } }
  function writeLastGood(d) { try { localStorage.setItem(LG_KEY, JSON.stringify(d)); } catch (e) {} }

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

  // ----- site-wide alert banner (the condbar strip) -----
  // The slim "Live now" strip exists on EVERY page. When alert.level is "danger"
  // (Red Flag Warning, Stage 2 fire restrictions) we transform that strip in
  // place into a loud, full-width, solid-red warning banner — impossible to miss.
  // We capture the original markup + href once so the normal strip can be
  // restored verbatim when the alert clears.
  var _bar = document.querySelector('.condbar');
  var _barLink = _bar ? _bar.querySelector('a') : null;
  var _barHTML = _barLink ? _barLink.innerHTML : null;   // normal strip (has #stripTemp/#stripLake)
  var _barHref = _barLink ? _barLink.getAttribute('href') : null;

  function paintStrip(d) {
    if (!_bar || !_barLink) return;
    var danger = !!(d && d.alert && d.alert.level === 'danger');
    if (danger) {
      var title = (d.alert.title || 'Warning').toUpperCase();
      var tag = d.alert.redFlag ? 'extreme fire danger · no open fires'
                                : 'extreme conditions — see details';
      var base = (_barHref || 'conditions.html').split('#')[0];   // respects ../ on subdir pages
      _barLink.setAttribute('href', base + '#alerts');
      _barLink.innerHTML = '🔴 <b>' + escapeHtml(title) + '</b> — ' + escapeHtml(tag) +
        ' <span class="condbar-more">details →</span>';
      _bar.classList.add('condbar-danger');
      _bar.setAttribute('aria-live', 'polite');   // screen readers announce the warning
    } else {
      _bar.classList.remove('condbar-danger');
      _bar.removeAttribute('aria-live');
      if (_barHref) _barLink.setAttribute('href', _barHref);
      if (_barHTML != null && _barLink.innerHTML !== _barHTML) _barLink.innerHTML = _barHTML;
    }
  }

  function paint(d) {
    if (!d) return;

    // ----- updated timestamp -----
    setText('updTime', 'Updated ' + (d.updatedFriendly || d.updated || ''));

    // ----- weather -----
    if (d.weather) {
      var w = d.weather;
      // Label the source plainly: marina PWS only when the live PWS feed is used.
      setText('wxLabel', w.sourceType === 'pws' ? 'at the marina' : 'near the lake — NWS');
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
        pct + '% of full · Vallecito Reservoir' + (lk.asOf ? ' · updated ' + rel(lk.asOf) : '');
      setText('lakeStore', store);
      markStale('tile-lake', lk.stale);
    }

    // ----- alert status -----
    // The whole alert tile is a link to the full alert detail (#alerts), so the
    // message text is always clickable; we also expose the full text via title +
    // aria-label so a long/clipped message is never permanently cut off.
    if (d.alert) {
      badge('alertBig', d.alert.level, d.alert.title);
      var amsg = d.alert.msg || '';
      setText('alertMsg', amsg);
      var amEl = $('alertMsg');
      if (amEl) { amEl.title = amsg; amEl.classList.add('is-link'); }
      var aTile = $('tile-alert');
      if (aTile && amsg) aTile.setAttribute('aria-label',
        'Alert status: ' + (d.alert.title || '') + '. ' + amsg + ' — open full alert detail.');
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
      var sof = d.stream.outflow;
      if (sof && sof.cfs != null) {
        setText('streamVal', 'In ' + (cfs != null ? cfs : '—') + ' · Out ' + sof.cfs + ' cfs');
        setText('streamMsg', '🏞️ Inflow (Vallecito Creek + Pine River) · outflow at the dam' + (d.stream.asOf ? ' · updated ' + rel(d.stream.asOf) : ''));
      } else {
        setText('streamVal', (cfs != null ? cfs : '—') + ' cfs');
        setText('streamMsg', '🌊 Vallecito Creek + Pine River' + (d.stream.asOf ? ' · updated ' + rel(d.stream.asOf) : ', combined'));
      }
      markStale('tile-stream', d.stream.stale);
    }

    // ----- roads -----
    if (d.road) {
      badge('roadBig', d.road.level, d.road.title);
      setText('roadMsg', d.road.msg || '');
    }

    // ----- header conditions strip / site-wide danger banner -----
    // paintStrip() runs FIRST so it can restore the normal strip markup (which
    // contains #stripTemp / #stripLake) when an alert has cleared, before we
    // repopulate those values below. When danger, the strip becomes a banner and
    // those ids no longer exist — the guarded setText calls simply no-op.
    paintStrip(d);
    if (d.weather && $('stripTemp')) {
      setText('stripTemp', (d.weather.tempF != null ? d.weather.tempF : '--') + '°');
    }
    if (d.lake && $('stripLake')) {
      setText('stripLake', (d.lake.pct != null ? d.lake.pct + '%' : '--'));
    }

    // ----- per-tile trust line: Source · Updated (local time) · (stale) -----
    paintSources(d);

    // ----- optional detailed fields (conditions.html) -----
    paintDetail(d);
  }

  // Short, honest source label per feed (derived from the feed when it varies).
  function srcLabel(kind, feed) {
    if (kind === 'weather') return feed && feed.sourceType === 'pws' ? 'Marina weather station' : 'NWS';
    if (kind === 'lake') {
      var s = (feed && feed.source || '').toLowerCase();
      if (s.indexOf('hydrodata') >= 0) return 'USBR Hydrodata';
      if (s.indexOf('cwms') >= 0 || s.indexOf('usace') >= 0) return 'USACE';
      if (s.indexOf('rise') >= 0 || s.indexOf('usbr') >= 0) return 'USBR';
      return 'USACE/USBR';
    }
    return { stream: 'USGS', alert: 'NWS · San Juan NF', fire: 'NIFC', road: 'CDOT/COtrip' }[kind] || '';
  }

  // Write "Source: X · Updated 10:15 AM MDT (stale)" into a tile's .src footer.
  // Tiles are whole-card links, so the source name is plain text (no nested <a>);
  // the How-We-Verify page is reachable from the footer + the conditions hero.
  function tileMeta(tileId, label, timeStr, stale) {
    var tile = $(tileId);
    if (!tile) return;
    var el = tile.querySelector('.src');
    if (!el) return;
    el.innerHTML = 'Source: ' + escapeHtml(label) +
      (timeStr ? ' · Updated ' + escapeHtml(timeStr) : '') +
      (stale ? ' <span class="stale-badge" title="showing last good reading">(stale)</span>' : '');
  }

  function paintSources(d) {
    var g = d.updatedFriendly || fmtClock(d.updated) || '';
    if (d.weather) tileMeta('tile-weather', srcLabel('weather', d.weather), g, d.weather.stale);
    if (d.lake)    tileMeta('tile-lake', srcLabel('lake', d.lake), fmtClock(d.lake.asOf) || g, d.lake.stale);
    if (d.alert)   tileMeta('tile-alert', srcLabel('alert'), g, false);
    if (d.fires)   tileMeta('tile-fire', srcLabel('fire'), g, d.fires.stale);
    if (d.stream)  tileMeta('tile-stream', srcLabel('stream'), fmtClock(d.stream.asOf) || g, d.stream.stale);
    if (d.road)    tileMeta('tile-road', srcLabel('road'), fmtClock(d.road.asOf) || g, d.road.stale);
  }

  // Fills the richer elements on conditions.html. Every write is guarded, so
  // this is a no-op on pages that don't have these ids.
  function paintDetail(d) {
    if (d.weather) {
      var w = d.weather;
      setText('wxDesc2', w.desc || '—');
      setText('wxHigh', w.highF != null ? w.highF + '°' : '—');
      setText('wxLow', w.lowF != null ? w.lowF + '°' : '—');
      setText('wxSource', w.source || '');
      // "Right now" field grid — render only the fields the station reports.
      var t = function (v) { return v != null ? v + '°' : null; };
      var rows = [
        ['Temp', t(w.tempF)],
        ['Feels like', t(w.feelsLikeF)],
        ['Dew point', t(w.dewpointF)],
        ['Humidity', w.humidity != null ? w.humidity + '%' : null],
        ['Wind', w.windMph != null ? w.windMph + ' mph' + (w.windDir ? ' ' + w.windDir : '') : null],
        ['Gust', w.windGustMph != null ? w.windGustMph + ' mph' : null],
        ['Pressure', w.pressureInHg != null ? w.pressureInHg + ' inHg' : null],
        ['Visibility', w.visibilityMi != null ? w.visibilityMi + ' mi' : null],
        ['UV index', w.uv != null ? String(w.uv) : null],
        ['Solar', w.solarWm2 != null ? w.solarWm2 + ' W/m²' : null],
        ['Precip rate', w.precipRateIn != null ? w.precipRateIn + ' in/hr' : null],
        ['Precip today', w.precipTotalIn != null ? w.precipTotalIn + ' in' : null],
        ['Station elev', w.stationElevFt != null ? w.stationElevFt.toLocaleString() + ' ft' : null]
      ].filter(function (r) { return r[1] != null; });
      var fEl = $('wxFields');
      if (fEl) fEl.innerHTML = rows.map(function (r) {
        return '<div><b>' + escapeHtml(r[1]) + '</b><span>' + escapeHtml(r[0]) + '</span></div>';
      }).join('');
      if ($('wxObs') && w.obsTime) setText('wxObs', 'Observed ' + (rel(w.obsTime) || w.obsTime));
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
        var rows = d.stream.gauges.map(function (g) {
          return '<li><span>🌊 ' + escapeHtml(g.name) + ' <span class="muted">(USGS ' + escapeHtml(g.id) +
            (g.asOf ? ' · ' + escapeHtml(rel(g.asOf)) : '') + ')</span></span><b>💧 ' +
            (g.cfs != null ? g.cfs + ' cfs' : '—') + '</b></li>';
        });
        var so = d.stream.outflow;
        if (so && so.cfs != null) {
          rows.push('<li><span>🏞️ Outflow — Vallecito Dam → Pine River <span class="muted">(' +
            escapeHtml(so.source || 'USACE CWMS') + (so.asOf ? ' · ' + escapeHtml(rel(so.asOf)) : '') + ')</span>' +
            (so.stale ? ' <span class="stale-badge">· may be a few days old</span>' : '') +
            '</span><b>💧 ' + so.cfs + ' cfs</b></li>');
        }
        gEl.innerHTML = rows.join('');
      }
    }

    if (d.fires) {
      setText('fireCount2', d.fires.count != null ? d.fires.count : '—');
      setText('fireNearest', d.fires.nearestName
        ? 'Nearest: ' + d.fires.nearestName + (d.fires.nearestMiles != null ? ' (~' + d.fires.nearestMiles + ' mi)' : '')
        : 'No named incidents nearby.');
    }

    if (d.road) {
      setText('roadMsg2', (d.road.msg || '') + (d.road.note ? ' ' + d.road.note : ''));
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

    // ----- Red Flag Warning lead notice + fire-restriction detail (#alerts) -----
    // A6: while alert.redFlag is true, the RFW is the GOVERNING notice at the top
    // of #alerts and the Stage block is demoted to one baseline line. When NWS
    // drops the RFW (redFlag false), the Stage block automatically leads again —
    // purely render-order driven by the live JSON, no manual toggle.
    var rfw = !!(d.alert && d.alert.redFlag);
    var stageNum = (d.restriction && d.restriction.stage && d.restriction.stage !== 'none')
      ? d.restriction.stage
      : (d.alert && d.alert.fireRestrictionStage && d.alert.fireRestrictionStage !== 'none'
          ? d.alert.fireRestrictionStage : null);

    var leadEl = $('rfwLead');
    if (leadEl) {
      if (rfw) {
        var endsTxt = rfwEnds(d);
        leadEl.innerHTML = '<div class="restriction-card is-danger">' +
          '<div class="rc-head">🔴 Red Flag Warning — extreme fire danger' +
            (endsTxt ? ' (through ' + escapeHtml(endsTxt) + ')' : '') + '</div>' +
          '<p class="rc-meta">Treat this as a no-burn period: no open flames of any kind, ' +
            'including campfires in developed rings. Propane/gas stoves and lanterns with ' +
            'shut-off valves only.</p></div>';
      } else {
        leadEl.innerHTML = '';
      }
    }

    // The fire-restriction detail (driven by restrictions.json). While the RFW
    // leads, this is demoted to a single baseline line; otherwise it shows the
    // full Stage card (or the no-restrictions card).
    var rEl = $('fire-restrictions');
    if (rEl) {
      if (rfw && stageNum) {
        rEl.innerHTML = '<p class="muted rc-demoted">Stage ' + escapeHtml(stageNum) +
          ' fire restrictions remain in effect as the baseline and resume as the lead ' +
          'notice when this warning ends.</p>';
      } else if (d.restriction) {
        var r = d.restriction;
        if (r.stage && r.stage !== 'none') {
          var cls = r.stage === '3' ? 'is-danger' : r.stage === '2' ? 'is-orange' : 'is-warn';
          var meta = [];
          if (r.issuedBy) meta.push(escapeHtml(r.issuedBy));
          if (r.effective) meta.push('effective ' + escapeHtml(r.effective));
          if (r.scope) meta.push(escapeHtml(r.scope));
          var cols = '';
          if (Array.isArray(r.prohibited) && r.prohibited.length) {
            cols += '<div><h4>🚫 Prohibited</h4><ul>' + r.prohibited.map(function (x) { return '<li>' + escapeHtml(x) + '</li>'; }).join('') + '</ul></div>';
          }
          if (Array.isArray(r.allowed) && r.allowed.length) {
            cols += '<div><h4>✅ Allowed</h4><ul>' + r.allowed.map(function (x) { return '<li>' + escapeHtml(x) + '</li>'; }).join('') + '</ul></div>';
          }
          rEl.innerHTML = '<div class="restriction-card ' + cls + '">' +
            '<div class="rc-head">🔥 Stage ' + escapeHtml(r.stage) + ' Fire Restrictions — in effect</div>' +
            (meta.length ? '<p class="rc-meta">' + meta.join(' · ') + '</p>' : '') +
            (cols ? '<div class="rc-cols">' + cols + '</div>' : '') +
            (r.penalty ? '<p class="rc-penalty">⚖️ ' + escapeHtml(r.penalty) + '</p>' : '') +
            resourceLinks(r.resources) + '</div>';
        } else {
          rEl.innerHTML = '<div class="restriction-card is-ok">' +
            '<div class="rc-head">✅ No fire restrictions currently in effect</div>' +
            '<p class="rc-meta">Always check before you burn.</p>' +
            resourceLinks(r.resources) + '</div>';
        }
      }
    }
  }

  // Latest end time among active Red Flag Warning items, formatted in lake-local
  // time (e.g. "Tue, Jun 9, 10:00 PM MDT"). Returns null if none parseable.
  function rfwEnds(d) {
    if (!d || !d.alert || !Array.isArray(d.alert.items)) return null;
    var ts = d.alert.items
      .filter(function (i) { return /red flag/i.test(i.event || ''); })
      .map(function (i) { return Date.parse(i.ends); })
      .filter(function (t) { return !isNaN(t); });
    if (!ts.length) return null;
    try {
      return new Date(Math.max.apply(null, ts)).toLocaleString('en-US', {
        timeZone: 'America/Denver', weekday: 'short', month: 'short', day: 'numeric',
        hour: 'numeric', minute: '2-digit', hour12: true, timeZoneName: 'short' });
    } catch (e) { return null; }
  }

  function iconEmoji(icon) {
    return ({ sunny: '☀️', partly: '⛅', cloudy: '☁️', showers: '🌧️', storm: '⛈️', snow: '❄️' })[icon] || '☀️';
  }

  // Absolute clock in lake-local time, e.g. "10:15 AM MDT". For per-tile "Updated".
  function fmtClock(iso) {
    if (!iso) return null;
    var t = Date.parse(iso);
    if (isNaN(t)) return null;
    try {
      return new Date(t).toLocaleString('en-US', { timeZone: 'America/Denver',
        hour: 'numeric', minute: '2-digit', hour12: true, timeZoneName: 'short' });
    } catch (e) { return null; }
  }

  // Relative time from an ISO string, e.g. "20 min ago", "3 hr ago", "2 days ago".
  function rel(iso) {
    if (!iso) return '';
    var t = Date.parse(iso);
    if (isNaN(t)) return '';
    var mins = Math.round((Date.now() - t) / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return mins + ' min ago';
    var hrs = Math.round(mins / 60);
    if (hrs < 24) return hrs + ' hr ago';
    var days = Math.round(hrs / 24);
    return days + ' day' + (days > 1 ? 's' : '') + ' ago';
  }

  function resourceLinks(res) {
    if (!Array.isArray(res) || !res.length) return '';
    var items = res.map(function (x) {
      if (x.url) return '<a href="' + escapeHtml(x.url) + '" rel="noopener">' + escapeHtml(x.label) + ' →</a>';
      if (x.phone) return '<span>' + escapeHtml(x.label) + ': <a href="tel:' + x.phone.replace(/[^0-9+]/g, '') + '">' + escapeHtml(x.phone) + '</a></span>';
      return '<span>' + escapeHtml(x.label) + '</span>';
    }).join('');
    return '<div class="rc-links"><h4>Official sources</h4>' + items + '</div>';
  }

  function setDataNote(msg) { setText('dataNote', msg || ''); }
  function markUnavailable() {
    // No live data and no cache: a neutral unavailable state, never a fake "ok".
    setText('updTime', 'Data temporarily unavailable');
    setDataNote('⚠ Check back shortly — the live feed didn\'t respond.');
  }

  // Live feed served by the Cloudflare Worker from KV (CORS enabled), refreshed
  // every 15 min by its cron. On pages.dev there is no same-origin worker route
  // yet, so we read the worker URL directly. When the custom domain + worker
  // route go live, switch DATA_URL back to same-origin '/data/conditions.json'.
  var DATA_URL = 'https://govallecito-conditions.dkontje.workers.dev/data/conditions.json';

  // 1) Instant paint from the cached last-good reading (real data) if present;
  //    otherwise the static HTML stays neutral ("Checking current conditions…").
  var lastGood = readLastGood();
  if (lastGood) paint(lastGood);

  // 2) Fetch the live feed; repaint + cache on success; explain on failure.
  function load() {
    fetch(DATA_URL, { cache: 'no-store' })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function (d) { lastGood = d; writeLastGood(d); paint(d); setDataNote(''); })
      .catch(function () {
        if (lastGood) {
          setDataNote('⚠ Data temporarily unavailable — last reading ' +
            (lastGood.updatedFriendly || lastGood.updated || 'earlier') + '.');
        } else {
          markUnavailable();
        }
      });
  }
  load();

  // 3) Auto-refresh every 15 min to match the worker cadence.
  setInterval(load, 15 * 60 * 1000);

  // 4) Refetch when the user returns to a tab that's been backgrounded/open a
  //    while (the realistic "left it open overnight" case): a slim strip could be
  //    showing yesterday's all-clear while a Red Flag Warning is now in effect.
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible') load();
  });
})();
