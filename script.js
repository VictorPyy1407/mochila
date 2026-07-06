const SUPABASE_CONFIG = {
  url: PRODUCT_CONFIG.supabaseUrl,
  key: PRODUCT_CONFIG.supabaseAnonKey,
  table: PRODUCT_CONFIG.supabaseTable
};

const trackingFired = new Set();

function initProductData() {
  document.title = PRODUCT_CONFIG.metaTitle;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.content = PRODUCT_CONFIG.metaDescription;

  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.content = PRODUCT_CONFIG.metaTitle;
  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.content = PRODUCT_CONFIG.metaDescription;

  const schemaProduct = document.getElementById('schemaProduct');
  if (schemaProduct) {
    schemaProduct.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Product",
      "name": PRODUCT_CONFIG.name,
      "description": PRODUCT_CONFIG.metaDescription,
      "image": [PRODUCT_CONFIG.images.hero, PRODUCT_CONFIG.images.banner],
      "brand": { "@type": "Brand", "name": "VG Shop Py" },
      "offers": {
        "@type": "Offer",
        "price": PRODUCT_CONFIG.price,
        "priceCurrency": PRODUCT_CONFIG.currency,
        "availability": "https://schema.org/InStock",
        "shippingDetails": {
          "@type": "OfferShippingDetail",
          "shippingDestination": { "@type": "DefinedRegion", "name": "Paraguay" }
        }
      }
    });
  }

  const setText = (id, text) => { const el = document.getElementById(id); if (el) el.innerHTML = text; };
  setText('heroTitle', PRODUCT_CONFIG.heroTitle);
  setText('heroSubtitle', PRODUCT_CONFIG.heroSubtitle);
  setText('heroPrice', formatGuarani(PRODUCT_CONFIG.price));
  setText('heroOldPrice', formatGuarani(PRODUCT_CONFIG.oldPrice));
  setText('heroDiscount', `${Math.round(100 - (PRODUCT_CONFIG.price / PRODUCT_CONFIG.oldPrice) * 100)}% Descuento`);
  setText('ctaPrice', formatGuarani(PRODUCT_CONFIG.price));
  setText('checkoutProductName', PRODUCT_CONFIG.name);
  setText('productPriceTop', formatGuarani(PRODUCT_CONFIG.price));
  setText('summaryProductName', PRODUCT_CONFIG.shortName || PRODUCT_CONFIG.name);
  setText('summaryPriceUnit', formatGuarani(PRODUCT_CONFIG.price));
  setText('footerProductName', PRODUCT_CONFIG.name);
  setText('footerProductPrice', formatGuarani(PRODUCT_CONFIG.price));
  setText('footerSummaryProductName', PRODUCT_CONFIG.shortName || PRODUCT_CONFIG.name);
  setText('footerSummaryUnitPrice', formatGuarani(PRODUCT_CONFIG.price));
  setText('confirmationProductName', PRODUCT_CONFIG.name);

  const setImg = (sel, src) => { const el = document.querySelector(sel); if (el) el.src = src; };
  setImg('#mainProductImage', PRODUCT_CONFIG.images.hero);
  setImg('#checkoutProductImage', PRODUCT_CONFIG.images.hero);
  setImg('#footerProductImage', PRODUCT_CONFIG.images.hero);

  const thumbImages = [PRODUCT_CONFIG.images.img1, PRODUCT_CONFIG.images.img2, PRODUCT_CONFIG.images.img3, PRODUCT_CONFIG.images.img4];
  const thumbsList = document.querySelectorAll('.thumb');
  thumbsList.forEach((thumb, index) => {
    if (thumbImages[index]) {
      thumb.dataset.image = thumbImages[index];
      const img = thumb.querySelector('img');
      if (img) img.src = thumbImages[index];
    }
  });

  const combosHTML = `
    <option value="1" data-price="${PRODUCT_CONFIG.price}">1 unidad - ${formatGuarani(PRODUCT_CONFIG.price)}</option>
    <option value="2" data-price="${PRODUCT_CONFIG.combo2}">2 unidades - ${formatGuarani(PRODUCT_CONFIG.combo2)}</option>
    <option value="3" data-price="${PRODUCT_CONFIG.combo3}">3 unidades - ${formatGuarani(PRODUCT_CONFIG.combo3)}</option>
  `;
  const qs1 = document.getElementById('quantitySelect');
  if (qs1) qs1.innerHTML = combosHTML;
  const qs2 = document.getElementById('footerQuantitySelect');
  if (qs2) qs2.innerHTML = combosHTML;
  updateOrderSummary();
  updateFooterSummary();
}

document.addEventListener('DOMContentLoaded', initProductData);

/* ========== TRACKING ========== */
function trackingPayload(quantity = Number(document.querySelector('#quantitySelect')?.value || 1)) {
  const subtotal = getPrice(quantity);
  return {
    producto: PRODUCT_CONFIG.name,
    precio: PRODUCT_CONFIG.price,
    cantidad: quantity,
    subtotal,
    moneda: PRODUCT_CONFIG.currency,
    currency: PRODUCT_CONFIG.currency,
    value: subtotal,
    items: [{ item_name: PRODUCT_CONFIG.name, item_id: PRODUCT_CONFIG.id, price: PRODUCT_CONFIG.price, item_category: PRODUCT_CONFIG.category, quantity }],
    origen: PRODUCT_CONFIG.origin,
    url: window.location.href,
  };
}

function fireTracking(key, callback) {
  if (trackingFired.has(key)) return;
  trackingFired.add(key);
  callback();
}

function trackGA(eventName, payload = trackingPayload()) {
  if (typeof window.gtag === 'function') window.gtag('event', eventName, payload);
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...payload });
}

function trackLandingEvent(eventName, payload = trackingPayload()) {
  const events = {
    page_view: () => {
      fireTracking('ga4:page_view', () => trackGA('page_view', payload));
    },
    view_item: () => {
      fireTracking('ga4:view_item', () => trackGA('view_item', payload));
    },
    add_to_cart: () => {
      fireTracking('ga4:add_to_cart', () => trackGA('add_to_cart', payload));
    },
    begin_checkout: () => {
      fireTracking('ga4:begin_checkout', () => trackGA('begin_checkout', payload));
    },
    lead: () => {
      fireTracking('ga4:generate_lead', () => trackGA('generate_lead', payload));
    },
    purchase: () => {
      trackGA('purchase', payload);
    },
  };
  events[eventName]?.();
}

/* ========== GALLERY ========== */
const thumbs = document.querySelectorAll('.thumb');
const mainImage = document.querySelector('#mainProductImage');

thumbs.forEach((thumb) => {
  thumb.addEventListener('click', () => {
    thumbs.forEach((item) => item.classList.remove('active'));
    thumb.classList.add('active');
    if (mainImage) mainImage.src = thumb.dataset.image;
  });
});

document.querySelector('.gallery-arrow-right')?.addEventListener('click', () => {
  const active = document.querySelector('.thumb.active');
  const items = Array.from(thumbs);
  const idx = items.indexOf(active);
  const next = items[(idx + 1) % items.length];
  if (next) next.click();
});

document.querySelector('.gallery-arrow-left')?.addEventListener('click', () => {
  const active = document.querySelector('.thumb.active');
  const items = Array.from(thumbs);
  const idx = items.indexOf(active);
  const prev = items[(idx - 1 + items.length) % items.length];
  if (prev) prev.click();
});

/* ========== VIEWER COUNT ========== */
const viewerCount = document.querySelector('#viewerCount');
const stockCount = document.querySelector('#stockCount');

function updateViewerCount() {
  if (!viewerCount) return;
  viewerCount.textContent = String(Math.floor(Math.random() * 12) + 9);
  if (stockCount && Math.random() > 0.7) {
    const current = parseInt(stockCount.textContent, 10);
    if (current > 3) stockCount.textContent = String(current - 1);
  }
}
setInterval(updateViewerCount, 6500);

/* ========== FORMATTING ========== */
function formatGuarani(value) {
  return `Gs. ${Number(value).toLocaleString('es-PY')}`;
}

function getQuantityText(quantity) {
  return `${quantity} ${quantity === 1 ? 'unidad' : 'unidades'}`;
}

function cleanText(value, fallback = '') {
  const text = String(value || '').trim().replace(/\s+/g, ' ');
  return text || fallback;
}

function cleanReferenceNote(value, city) {
  const note = cleanText(value);
  if (!note) return '';

  const compactNote = note.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '');
  const compactCity = cleanText(city).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '');

  if (compactCity && compactNote === compactCity) return '';
  return note;
}

function getDeliveryZone(city) {
  return isCashOnDeliveryArea(city) ? 'Asunción/Central' : 'Interior';
}

/* ========== ORDER SUMMARY ========== */
const quantitySelect = document.querySelector('#quantitySelect');
const productPriceTop = document.querySelector('#productPriceTop');
const summaryQuantityText = document.querySelector('#summaryQuantityText');
const summaryPriceUnit = document.querySelector('#summaryPriceUnit');
const summaryQuantity = document.querySelector('#summaryQuantity');
const summaryTotal = document.querySelector('#summaryTotal');
const getPrice = (qty) => qty === 3 ? PRODUCT_CONFIG.combo3 : qty === 2 ? PRODUCT_CONFIG.combo2 : PRODUCT_CONFIG.price;

function updateOrderSummary() {
  if (!quantitySelect) return;
  const quantity = Number(quantitySelect.value || 1);
  const price = getPrice(quantity);
  const qText = getQuantityText(quantity);
  const totalText = formatGuarani(price);
  if (productPriceTop) productPriceTop.textContent = totalText;
  if (summaryQuantityText) summaryQuantityText.textContent = qText;
  if (summaryPriceUnit) summaryPriceUnit.textContent = formatGuarani(PRODUCT_CONFIG.price);
  if (summaryQuantity) summaryQuantity.textContent = qText;
  if (summaryTotal) summaryTotal.textContent = totalText;
}

function updateFooterSummary() {
  const footerQty = document.querySelector('#footerQuantitySelect');
  const footerSummaryQty = document.querySelector('#footerSummaryQuantity');
  const footerSummaryUnitPrice = document.querySelector('#footerSummaryUnitPrice');
  const footerSummaryQtyText = document.querySelector('#footerSummaryQty');
  const footerSummaryTotal = document.querySelector('#footerSummaryTotal');
  if (!footerQty) return;
  const quantity = Number(footerQty.value || 1);
  const price = getPrice(quantity);
  const qText = getQuantityText(quantity);
  const totalText = formatGuarani(price);
  if (footerSummaryQty) footerSummaryQty.textContent = qText;
  if (footerSummaryUnitPrice) footerSummaryUnitPrice.textContent = formatGuarani(PRODUCT_CONFIG.price);
  if (footerSummaryQtyText) footerSummaryQtyText.textContent = qText;
  if (footerSummaryTotal) footerSummaryTotal.textContent = totalText;
}

/* ========== DELIVERY NOTICE ========== */
function isCashOnDeliveryArea(value) {
  const city = value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const areas = ['asuncion', 'central', 'san lorenzo', 'fernando de la mora', 'luque', 'capitata', 'capiata', 'lambare', 'mariano roque alonso', 'nemby', 'ñemby', 'villa elisa', 'san antonio', 'limpio', 'itaugua', 'ita', 'aregua', 'ypane', 'yaguaron'];
  return areas.some((a) => city.includes(a.normalize('NFD').replace(/[\u0300-\u036f]/g, '')));
}

function setDeliveryNoticeText(notice, value) {
  if (!notice) return;
  const isCOD = value && isCashOnDeliveryArea(value);
  notice.classList.toggle('delivery-ok', Boolean(isCOD));
  notice.classList.toggle('delivery-interior', Boolean(value && !isCOD));
  if (!value) {
    notice.textContent = 'Asunción y Central: envío gratis y pago contra entrega. Interior: se coordina una seña previa antes del despacho.';
    return;
  }
  notice.textContent = isCOD
    ? 'Zona habilitada para envío gratis y pago contra entrega. No abonás nada ahora.'
    : 'Para envíos al interior se coordina una seña previa antes del despacho.';
}

function setPaymentNoteText(note, value) {
  if (!note) return;
  const isCOD = value && isCashOnDeliveryArea(value);
  if (!value) {
    note.textContent = 'No pagás nada ahora. Primero registramos tu pedido y luego confirmamos datos antes de enviar.';
    return;
  }
  note.textContent = isCOD
    ? 'No pagás nada ahora, abonás al recibir cuando se concrete la entrega.'
    : 'Interior: se coordina una seña previa y el saldo al recibir.';
}

function initFormDeliveryNotices() {
  document.querySelectorAll('[data-order-form]').forEach((form) => {
    const city = form.querySelector('[name="city"]');
    const notice = form.querySelector('.delivery-notice');
    const note = form.id === 'purchaseForm' ? document.querySelector('#paymentNote') : document.querySelector('#footerPaymentNote');
    if (!city || !notice) return;
    setDeliveryNoticeText(notice, city.value.trim());
    setPaymentNoteText(note, city.value.trim());
    city.addEventListener('input', () => {
      setDeliveryNoticeText(notice, city.value.trim());
      setPaymentNoteText(note, city.value.trim());
    });
  });
}

/* ========== MAP PICKER ========== */
let map;
let mapMarker;
let selectedMapLink = '';
let activeMapInput = null;

function createGoogleMapsLink(lat, lng) {
  return `https://www.google.com/maps?q=${lat.toFixed(6)},${lng.toFixed(6)}`;
}

function updateMapLocation(lat, lng, zoom) {
  selectedMapLink = createGoogleMapsLink(lat, lng);
  const linkInput = document.querySelector('#mapLinkInput');
  const openLink = document.querySelector('#mapOpenLink');
  if (linkInput) linkInput.value = selectedMapLink;
  if (openLink) openLink.href = selectedMapLink;
  if (!map) return;
  map.setView([lat, lng], zoom || 16);
  if (!mapMarker) {
    mapMarker = L.marker([lat, lng], { draggable: true }).addTo(map);
    mapMarker.on('dragend', () => {
      const pos = mapMarker.getLatLng();
      updateMapLocation(pos.lat, pos.lng, map.getZoom());
    });
    return;
  }
  mapMarker.setLatLng([lat, lng]);
}

function initMapInstance() {
  if (map || typeof L === 'undefined') return;
  const defaultLoc = [-25.2637, -57.5759];
  map = L.map('mapPicker', { zoomControl: true }).setView(defaultLoc, 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
  map.on('click', (e) => updateMapLocation(e.latlng.lat, e.latlng.lng, map.getZoom()));
  updateMapLocation(defaultLoc[0], defaultLoc[1], 13);
}

function openMapModal(event) {
  const modal = document.querySelector('#mapModal');
  if (!modal) return;
  activeMapInput = document.querySelector(`#${event?.currentTarget?.dataset?.mapTarget || 'mapsInput'}`) || document.querySelector('#mapsInput');
  modal.classList.remove('hidden');
  initMapInstance();
  setTimeout(() => { if (map) map.invalidateSize(); }, 100);
}

function closeMapModal() {
  document.querySelector('#mapModal')?.classList.add('hidden');
}

async function searchMapLocation() {
  const search = document.querySelector('#mapSearch');
  const error = document.querySelector('#mapError');
  const query = search?.value.trim();
  if (!query) { if (error) error.textContent = 'Escribí una dirección o lugar para buscar.'; return; }
  if (error) error.textContent = 'Buscando ubicación...';
  try {
    const r = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query + ', Paraguay')}`);
    const data = await r.json();
    if (!data.length) { if (error) error.textContent = 'No encontramos esa dirección.'; return; }
    updateMapLocation(Number(data[0].lat), Number(data[0].lon), 17);
    if (error) error.textContent = 'Arrastrá el pin para ajustar la ubicación exacta.';
  } catch { if (error) error.textContent = 'No se pudo buscar. Tocá el mapa para marcar.'; }
}

function initMapPicker() {
  document.querySelectorAll('[data-open-map]').forEach((button) => button.addEventListener('click', openMapModal));
  document.querySelectorAll('[data-close-map]').forEach((b) => b.addEventListener('click', closeMapModal));
  document.querySelector('#mapModal')?.addEventListener('click', (e) => { if (e.target.id === 'mapModal') closeMapModal(); });
  document.querySelector('#mapSearchButton')?.addEventListener('click', searchMapLocation);
  document.querySelector('#mapSearch')?.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); searchMapLocation(); } });
  document.querySelector('#mapLinkInput')?.addEventListener('input', (e) => {
    selectedMapLink = e.target.value.trim();
    const openLink = document.querySelector('#mapOpenLink');
    if (openLink) openLink.href = selectedMapLink || 'https://www.google.com/maps';
  });
  document.querySelector('#mapConfirm')?.addEventListener('click', () => {
    const link = document.querySelector('#mapLinkInput')?.value.trim() || selectedMapLink;
    if (activeMapInput) activeMapInput.value = link;
    closeMapModal();
  });
}

/* ========== CHECKOUT NAV ========== */
const productPage = document.querySelector('[data-page="product"]');
const checkoutPage = document.querySelector('[data-page="checkout"]');
const buyButton = document.querySelector('#pedido');
const backLink = document.querySelector('.back-link');
const closeCheckout = document.querySelector('.checkout-close');
const confirmation = document.querySelector('#confirmation');
const orderNumberEl = document.querySelector('#orderNumber');
const confirmationPhone = document.querySelector('#confirmationPhone');
const confirmationPaymentText = document.querySelector('#confirmationPaymentText');
const formError = document.querySelector('#formError');

function showCheckout() {
  if (!productPage || !checkoutPage) return;
  const payload = trackingPayload();
  trackLandingEvent('begin_checkout', payload);
  window.VisitorTracker?.trackEcommerce('begin_checkout', {
    productName: PRODUCT_CONFIG.name,
    productPrice: PRODUCT_CONFIG.price,
    revenue: payload.value,
  });
  productPage.hidden = true;
  checkoutPage.hidden = false;
  document.body.classList.add('checkout-open');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showProduct() {
  if (!productPage || !checkoutPage) return;
  checkoutPage.hidden = true;
  productPage.hidden = false;
  document.body.classList.remove('checkout-open');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.querySelectorAll('a[href="#checkout"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    showCheckout();
  });
});
backLink?.addEventListener('click', (e) => { e.preventDefault(); showProduct(); });
closeCheckout?.addEventListener('click', showProduct);

/* ========== ORDER ========== */
function generateOrderNumber() {
  return `#PY${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 90 + 10)}`;
}

function saveOrder(order) {
  const orders = JSON.parse(localStorage.getItem('mochilaOrders') || '[]');
  orders.push(order);
  localStorage.setItem('mochilaOrders', JSON.stringify(orders));
}

async function saveOrderToSupabase(order) {
  const response = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/${SUPABASE_CONFIG.table}`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_CONFIG.key,
      Authorization: `Bearer ${SUPABASE_CONFIG.key}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(order),
  });
  if (!response.ok) {
    const msg = await response.text().catch(() => '');
    throw new Error(msg || 'Error guardando pedido en Supabase.');
  }
}

function showConfirmation(order) {
  if (orderNumberEl) orderNumberEl.textContent = order.id;
  if (confirmationPhone) confirmationPhone.textContent = order.phone || '---';
  if (confirmationPaymentText) {
    confirmationPaymentText.innerHTML = order.paymentMode === 'cash_on_delivery'
      ? `Recordá que el pago se realiza al recibir el producto. Te contactaremos al número <strong>${order.phone || '---'}</strong>.`
      : `Para envíos al interior coordinaremos una seña previa. Te contactaremos al número <strong>${order.phone || '---'}</strong>.`;
  }
  if (productPage) productPage.hidden = true;
  if (checkoutPage) checkoutPage.hidden = false;
  confirmation?.classList.remove('hidden');
  document.body.classList.add('checkout-open');
  document.documentElement.style.overflow = 'hidden';
}

function closeConfirmation() {
  confirmation?.classList.add('hidden');
  document.documentElement.style.overflow = '';
  showProduct();
}

document.querySelector('[data-close-confirmation]')?.addEventListener('click', closeConfirmation);
confirmation?.addEventListener('click', (e) => { if (e.target.id === 'confirmation') closeConfirmation(); });

/* ========== VALIDATION ========== */
function isParaguayanPhone(value) {
  const cleaned = value.replace(/[\s\-\(\)]/g, '');
  return /^(?:\+595|0)?\d{9,10}$/.test(cleaned);
}

/* ========== FORM SUBMISSION ========== */
const orderForms = document.querySelectorAll('[data-order-form]');

orderForms.forEach((form) => form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const quantity = Number(formData.get('quantity') || 1);
  const submitButton = form.querySelector('button[type="submit"]');
  const btnText = submitButton?.querySelector('.btn-text');
  const btnLoader = submitButton?.querySelector('.btn-loader');
  const currentFormError = form.querySelector('.form-error') || formError;

  const name = cleanText(formData.get('name'));
  const phone = cleanText(formData.get('phone'));
  const city = cleanText(formData.get('city'));
  const department = cleanText(formData.get('department') || formData.get('departamento'), getDeliveryZone(city));
  const address = cleanText(formData.get('address'), 'No informado');
  const neighborhood = cleanText(formData.get('neighborhood'));
  const notes = cleanReferenceNote(formData.get('notes'), city);
  const mapUrl = cleanText(formData.get('map'), 'No informado');

  if (currentFormError) currentFormError.textContent = '';

  if (!name || !phone || !city) {
    if (currentFormError) currentFormError.textContent = 'Completá nombre completo, teléfono y ciudad para confirmar tu pedido.';
    return;
  }

  if (!isParaguayanPhone(phone)) {
    if (currentFormError) currentFormError.textContent = 'Ingresá un número de teléfono válido (ej: 0981 123 456).';
    return;
  }

  const subtotal = getPrice(quantity);
  const orderId = generateOrderNumber();
  const paymentMode = isCashOnDeliveryArea(city) ? 'cash_on_delivery' : 'deposit_required_for_interior';
  const referenceParts = [`Combo: ${getQuantityText(quantity)}`, 'Color: Negro'];
  if (neighborhood) referenceParts.push(`Barrio: ${neighborhood}`);
  if (notes) referenceParts.push(`Referencia: ${notes}`);
  referenceParts.push(paymentMode === 'cash_on_delivery' ? 'Pago contra entrega' : 'Interior: coordinar abono previo');

  const order = {
    id: orderId,
    producto: PRODUCT_CONFIG.name,
    precio: PRODUCT_CONFIG.price,
    cantidad: quantity,
    subtotal,
    ganancia: 0,
    nombre: name,
    telefono: phone,
    correo: cleanText(formData.get('email'), 'No informado'),
    ci: cleanText(formData.get('ci'), 'No informado'),
    departamento: department,
    ciudad: city,
    direccion: address,
    referencia: referenceParts.join(' | '),
    ubicacion_maps: mapUrl,
    estado: 'Pendiente',
    origen: PRODUCT_CONFIG.origin,
    created_at: new Date().toISOString(),
  };

  if (submitButton) {
    submitButton.disabled = true;
    if (btnText) btnText.classList.add('hidden');
    if (btnLoader) btnLoader.classList.remove('hidden');
  }

  try {
    saveOrder(order);
    await saveOrderToSupabase(order);
    const payload = { ...trackingPayload(quantity), transaction_id: orderId, value: subtotal };
    trackLandingEvent('lead', payload);
    trackLandingEvent('purchase', payload);
    window.VisitorTracker?.trackEcommerce('generate_lead', {
      productName: PRODUCT_CONFIG.name,
      productPrice: PRODUCT_CONFIG.price,
      orderId,
      revenue: subtotal,
    });
    window.VisitorTracker?.trackEcommerce('purchase', {
      productName: PRODUCT_CONFIG.name,
      productPrice: PRODUCT_CONFIG.price,
      orderId,
      revenue: subtotal,
    });
  } catch (error) {
    console.error(error);
    if (currentFormError) currentFormError.textContent = 'No se pudo guardar el pedido. Revisá la conexión o intentá de nuevo.';
    if (submitButton) {
      submitButton.disabled = false;
      if (btnText) btnText.classList.remove('hidden');
      if (btnLoader) btnLoader.classList.add('hidden');
    }
    return;
  }

  form.reset();
  updateOrderSummary();
  updateFooterSummary();
  setDeliveryNoticeText(form.querySelector('.delivery-notice'), '');
  setPaymentNoteText(form.id === 'purchaseForm' ? document.querySelector('#paymentNote') : document.querySelector('#footerPaymentNote'), '');
  if (submitButton) {
    submitButton.disabled = false;
    if (btnText) btnText.classList.remove('hidden');
    if (btnLoader) btnLoader.classList.add('hidden');
  }
  showConfirmation({ id: orderId, phone: phone, paymentMode: paymentMode });
}));

/* ========== EVENT BINDINGS ========== */
quantitySelect?.addEventListener('change', updateOrderSummary);
document.querySelector('#footerQuantitySelect')?.addEventListener('change', updateFooterSummary);
updateOrderSummary();
updateFooterSummary();
initMapPicker();
initFormDeliveryNotices();
trackLandingEvent('page_view');
trackLandingEvent('view_item');

/* ========== INTERSECTION OBSERVER ANIMATIONS ========== */
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-up').forEach((el) => observer.observe(el));

// Visitor tracking
(function () {
  const SUPABASE_URL = SUPABASE_CONFIG.url;
  const SUPABASE_KEY = SUPABASE_CONFIG.key;
  const TRACK_URL = `${SUPABASE_URL}/functions/v1/track-visitor`;
  let sessionId = sessionStorage.getItem('lp_session_id') || 'sess_' + Math.random().toString(36).substring(2, 15) + '_' + Date.now().toString(36);
  sessionStorage.setItem('lp_session_id', sessionId);
  let hbInterval = null;
  let hidden = false;

  function send(event, extra = {}) {
    if (!SUPABASE_URL || !SUPABASE_KEY) return;
    const params = new URLSearchParams(window.location.search);
    fetch(TRACK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` },
      body: JSON.stringify({
        event, sessionId, pageUrl: location.href, pageTitle: document.title,
        referrer: document.referrer, userAgent: navigator.userAgent,
        screenResolution: `${screen.width}x${screen.height}`, viewport: `${innerWidth}x${innerHeight}`,
        landingPage: PRODUCT_CONFIG.origin, timestamp: new Date().toISOString(),
        utmSource: params.get('utm_source'), utmMedium: params.get('utm_medium'),
        utmCampaign: params.get('utm_campaign'), utmContent: params.get('utm_content'),
        utmTerm: params.get('utm_term'), ...extra
      }),
      keepalive: event === 'page_hide'
    }).catch(() => { });
  }

  function startHb() { if (!hbInterval) hbInterval = setInterval(() => { if (!hidden && document.visibilityState === 'visible') send('heartbeat'); }, 30000); }
  function stopHb() { if (hbInterval) { clearInterval(hbInterval); hbInterval = null; } }
  document.addEventListener('visibilitychange', () => { hidden = document.hidden; if (hidden) { send('page_hide'); stopHb(); } else { send('page_view'); startHb(); } });
  window.addEventListener('beforeunload', () => send('page_hide'));
  window.addEventListener('pagehide', () => send('page_hide'));

  send('page_view');
  startHb();

  window.VisitorTracker = { trackEvent: send, trackEcommerce: (evt, data) => send(evt, { productName: data?.productName || PRODUCT_CONFIG.name, productPrice: data?.productPrice || PRODUCT_CONFIG.price, orderId: data?.orderId, revenue: data?.revenue }), getSessionId: () => sessionId };
})();
