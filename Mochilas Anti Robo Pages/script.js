const CONFIG = {
  productName: 'Mochila Antirrobo con Puerto USB',
  productPrice: 210000,
  supabaseUrl: 'https://roruinqorwgolcrhhmpm.supabase.co',
  supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvcnVpbnFvcndnb2xjcmhobXBtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI2NTU0MDcsImV4cCI6MjA5ODIzMTQwN30.VzNSqYUM6amTOToZUsJ7Emjapy-y9Y44hDmbC1XG9Eg',
  supabaseTable: 'cleanpro',
};

/* ========== META PIXEL ========== */
(function(f,b,e,v,n,t,s){
  if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)
})(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '2412226475899711');
fbq('track', 'PageView');
fbq('track', 'ViewContent', {
  content_name: CONFIG.productName,
  content_category: 'Mochilas',
  value: CONFIG.productPrice,
  currency: 'PYG',
});

/* ========== GOOGLE TAG MANAGER ========== */
(function(w,d,s,l,i){
  w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
  var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
  j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
  f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXXXXX');

(function(){if(!window.dataLayer)return;window.dataLayer.push({event:'view_item',ecommerce:{items:[{item_name:CONFIG.productName,item_id:'TPS-41531',price:CONFIG.productPrice,item_category:'Mochilas',quantity:1}],value:CONFIG.productPrice,currency:'PYG'}})})();

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

/* ========== TIMER ========== */
const offerDuration = 10 * 60;
let remaining = offerDuration;
const minutesEl = document.querySelector('#minutes');
const secondsEl = document.querySelector('#seconds');

function updateTimer() {
  const m = Math.floor(remaining / 60);
  const s = remaining % 60;
  if (minutesEl) minutesEl.textContent = String(m).padStart(2, '0');
  if (secondsEl) secondsEl.textContent = String(s).padStart(2, '0');
  remaining = remaining > 0 ? remaining - 1 : offerDuration;
}
updateTimer();
setInterval(updateTimer, 1000);

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

/* ========== ORDER SUMMARY ========== */
const quantitySelect = document.querySelector('#quantitySelect');
const productPriceTop = document.querySelector('#productPriceTop');
const summaryQuantityText = document.querySelector('#summaryQuantityText');
const summaryPriceUnit = document.querySelector('#summaryPriceUnit');
const summaryQuantity = document.querySelector('#summaryQuantity');
const summaryTotal = document.querySelector('#summaryTotal');
const pricesByQuantity = { 1: 210000, 2: 420000, 3: 630000 };

function updateOrderSummary() {
  if (!quantitySelect) return;
  const quantity = Number(quantitySelect.value || 1);
  const price = pricesByQuantity[quantity] || pricesByQuantity[1];
  const qText = getQuantityText(quantity);
  const totalText = formatGuarani(price);
  if (productPriceTop) productPriceTop.textContent = totalText;
  if (summaryQuantityText) summaryQuantityText.textContent = qText;
  if (summaryPriceUnit) summaryPriceUnit.textContent = formatGuarani(CONFIG.productPrice);
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
  const price = pricesByQuantity[quantity] || pricesByQuantity[1];
  const qText = getQuantityText(quantity);
  const totalText = formatGuarani(price);
  if (footerSummaryQty) footerSummaryQty.textContent = qText;
  if (footerSummaryUnitPrice) footerSummaryUnitPrice.textContent = formatGuarani(CONFIG.productPrice);
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
    notice.textContent = 'Asunción y Central: envío gratis y pago contra entrega. Interior: se coordina una seña previa por WhatsApp.';
    return;
  }
  notice.textContent = isCOD
    ? 'Zona habilitada para envío gratis y pago contra entrega. No abonás nada ahora.'
    : 'Para envíos al interior se coordina una seña previa por WhatsApp antes del despacho.';
}

function initFormDeliveryNotices() {
  document.querySelectorAll('[data-order-form]').forEach((form) => {
    const city = form.querySelector('[name="city"]');
    const notice = form.querySelector('.delivery-notice');
    if (!city || !notice) return;
    setDeliveryNoticeText(notice, city.value.trim());
    city.addEventListener('input', () => setDeliveryNoticeText(notice, city.value.trim()));
  });
}

/* ========== MAP PICKER ========== */
let map;
let mapMarker;
let selectedMapLink = '';

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

function openMapModal() {
  const modal = document.querySelector('#mapModal');
  if (!modal) return;
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
  document.querySelector('[data-open-map]')?.addEventListener('click', openMapModal);
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
    const input = document.querySelector('#mapsInput');
    if (input) input.value = link;
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
  productPage.hidden = true;
  checkoutPage.hidden = false;
  document.body.classList.add('checkout-open');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  fbq('track', 'InitiateCheckout', { content_name: CONFIG.productName, value: CONFIG.productPrice, currency: 'PYG' });
  dataLayer?.push({ event: 'begin_checkout', ecommerce: { items: [{ item_name: CONFIG.productName, item_id: 'TPS-41531', price: CONFIG.productPrice, quantity: 1 }], currency: 'PYG' } });
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
  const response = await fetch(`${CONFIG.supabaseUrl}/rest/v1/${CONFIG.supabaseTable}`, {
    method: 'POST',
    headers: {
      apikey: CONFIG.supabaseAnonKey,
      Authorization: `Bearer ${CONFIG.supabaseAnonKey}`,
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
      ? `Recordá que el pago se realiza al recibir el producto. Te hablaremos al número <strong>${order.phone || '---'}</strong>.`
      : `Para envíos al interior coordinaremos una seña previa por WhatsApp. Te hablaremos al número <strong>${order.phone || '---'}</strong>.`;
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

  const name = String(formData.get('name') || '').trim();
  const phone = String(formData.get('phone') || '').trim();
  const departamento = String(formData.get('departamento') || '').trim();
  const city = String(formData.get('city') || '').trim();
  const address = String(formData.get('address') || '').trim();
  const notes = String(formData.get('notes') || '').trim();
  const mapUrl = String(formData.get('map') || '').trim();

  if (currentFormError) currentFormError.textContent = '';

  if (!name || !phone || !city) {
    if (currentFormError) currentFormError.textContent = 'Completá nombre completo, WhatsApp y ciudad para confirmar tu pedido.';
    return;
  }

  if (!isParaguayanPhone(phone)) {
    if (currentFormError) currentFormError.textContent = 'Ingresá un número de WhatsApp válido (ej: 0981 123 456).';
    return;
  }

  const subtotal = pricesByQuantity[quantity] || pricesByQuantity[1];
  const orderId = generateOrderNumber();
  const paymentMode = isCashOnDeliveryArea(city) ? 'cash_on_delivery' : 'deposit_required_for_interior';

  const order = {
    id: orderId,
    product: CONFIG.productName,
    cantidad: quantity,
    precio: CONFIG.productPrice,
    subtotal: subtotal,
    nombre: name,
    telefono: phone,
    departamento: departamento,
    ciudad: city,
    direccion: address,
    referencia: notes,
    ubicacion_maps: mapUrl,
    correo: 'No informado',
    color: 'Negro',
    estado: 'pending_confirmation',
    ip: '',
    user_agent: navigator.userAgent,
    origen: 'mochila_antirrobo',
    created_at: new Date().toISOString(),
  };

  const supabaseOrder = {
    id: orderId,
    product: CONFIG.productName,
    combo: `${getQuantityText(quantity)} | Color: Negro`,
    quantity: quantity,
    total: subtotal,
    customer_name: name,
    customer_phone: phone,
    city: city,
    address: address || 'No informado',
    neighborhood: departamento || 'No informado',
    reference: `${notes || 'Sin referencia'} | ${paymentMode === 'deposit_required_for_interior' ? 'Interior: coordinar seña previa' : 'Pago contra entrega'} | Origen: Landing Mochila Antirrobo`,
    maps_url: mapUrl || '',
    status: 'pending_confirmation',
    created_at: new Date().toISOString(),
  };

  if (submitButton) {
    submitButton.disabled = true;
    if (btnText) btnText.classList.add('hidden');
    if (btnLoader) btnLoader.classList.remove('hidden');
  }

  try {
    saveOrder(order);
    await saveOrderToSupabase(supabaseOrder);
    fbq('track', 'Purchase', { value: subtotal, currency: 'PYG', content_name: CONFIG.productName, content_type: 'product' });
    dataLayer?.push({ event: 'purchase', ecommerce: { transaction_id: orderId, value: subtotal, currency: 'PYG', items: [{ item_name: CONFIG.productName, item_id: 'TPS-41531', price: CONFIG.productPrice, quantity }] } });
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
