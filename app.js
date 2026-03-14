/* ======================================
   ANGEL KITCHEN — MAIN APP JS
   ====================================== */

const FOODS = [
  { id:1, name:"Classic Cheeseburger", price:2500, emoji:"classicburger.jpg", desc:"Juicy beef patty, melted cheddar, fresh lettuce, tomato & our secret sauce.", cat:"burgers", badge:"Popular", rating:4.9, reviews:124 },
  { id:2, name:"Spicy Chicken Burger", price:2800, emoji:"spicedburger.jpg", desc:"Crispy fried chicken with jalapeño mayo, pickles & sriracha drizzle.", cat:"burgers", badge:"Hot", rating:4.8, reviews:89 },
  { id:3, name:"Chocolate Lava Cake", price:3500, emoji:"chococake.jpg", desc:"Rich moist chocolate sponge with warm melting center. A true indulgence.", cat:"cakes", badge:"Bestseller", rating:5.0, reviews:201 },
  { id:4, name:"Vanilla Birthday Cake", price:4500, emoji:"birthday.jpg", desc:"Multi-layer vanilla sponge with buttercream frosting, custom decorations.", cat:"cakes", badge:"Custom", rating:4.9, reviews:156 },
  { id:5, name:"Puff Puff Pack (10pcs)", price:800, emoji:"puff.jpg", desc:"Traditional Nigerian deep-fried dough balls. Crispy outside, fluffy inside.", cat:"snacks", badge:"Nigerian", rating:4.9, reviews:312 },
  { id:6, name:"Meat Pie (4pcs)", price:1200, emoji:"meatpie.jpg", desc:"Flaky pastry filled with seasoned minced meat, potatoes & carrots.", cat:"pastries", badge:"", rating:4.8, reviews:98 },
  { id:7, name:"Chicken Shawarma", price:2200, emoji:"shawarma.jpg", desc:"Grilled chicken, cabbage slaw, tomatoes & special garlic sauce in warm wrap.", cat:"sandwich", badge:"Trending", rating:4.7, reviews:77 },
  { id:8, name:"Club Sandwich", price:1800, emoji:"sandwich.jpg", desc:"Triple-decker with turkey, bacon, egg, lettuce, tomato & mayo.", cat:"sandwich", badge:"", rating:4.6, reviews:54 },
  { id:9, name:"Jollof Rice + Chicken", price:2000, emoji:"jollof.jpg", desc:"Party-style jollof rice cooked with tomatoes & spices, served with grilled chicken.", cat:"nigerian", badge:"Nigerian", rating:5.0, reviews:289 },
  { id:10, name:"Egusi Soup + Eba", price:1800, emoji:"eba.jpg", desc:"Hearty melon seed soup with assorted meat & stockfish, served with soft eba.", cat:"nigerian", badge:"Nigerian", rating:4.9, reviews:167 },
  { id:11, name:"Fried Rice & Plantain", price:1900, emoji:"friedrice.jpg", desc:"Nigerian fried rice with mixed vegetables & sweet fried ripe plantain.", cat:"nigerian", badge:"", rating:4.8, reviews:143 },
  { id:12, name:"Vanilla Cupcakes (6pcs)", price:2500, emoji:"vanilla.jpg", desc:"Light, fluffy vanilla cupcakes with swirled buttercream frosting.", cat:"cakes", badge:"", rating:4.7, reviews:82 },
  { id:13, name:"Strawberry Smoothie", price:1500, emoji:"smoothie.jpg", desc:"Blended fresh strawberries, banana, yogurt & honey. No added sugar.", cat:"drinks", badge:"Fresh", rating:4.8, reviews:91 },
  { id:14, name:"Pineapple Smoothie", price:1400, emoji:"smoothie2.jpg", desc:"Fresh pineapple blended with coconut milk, ginger & lime.", cat:"drinks", badge:"", rating:4.7, reviews:63 },
  { id:15, name:"Suya (Beef Skewers)", price:1500, emoji:"suya.jpg", desc:"Thinly sliced beef marinated in suya spice blend, grilled to perfection.", cat:"nigerian", badge:"🔥 Hot", rating:4.9, reviews:198 },
  { id:16, name:"Chin Chin (Large Pack)", price:1000, emoji:"chinchin.jpg", desc:"Crunchy fried snack made with flour, milk & sugar. Addictively good.", cat:"snacks", badge:"Snack", rating:4.6, reviews:74 },
  { id:17, name:"Sausage Roll (6pcs)", price:1200, emoji:"roll.jpg", desc:"Seasoned sausage wrapped in flaky puff pastry, baked golden brown.", cat:"pastries", badge:"", rating:4.7, reviews:86 },
  { id:18, name:"Moi Moi (4 wraps)", price:1600, emoji:"moimoi.jpg", desc:"Steamed bean pudding with fish, eggs & peppers. Nigerian classic.", cat:"nigerian", badge:"Nigerian", rating:4.8, reviews:109 },
];

function getCurrency() {
  try { const u = JSON.parse(localStorage.getItem('ak_user')||'null'); if(u&&u.country){const m={Nigeria:'₦',USA:'$',UK:'£',Canada:'CA$',Ghana:'₵'};return m[u.country]||'₦';} } catch(e){}
  return '₦';
}
function fmt(p){return getCurrency()+p.toLocaleString();}
function getCart(){try{return JSON.parse(localStorage.getItem('ak_cart')||'[]');}catch{return[];}}
function saveCart(c){localStorage.setItem('ak_cart',JSON.stringify(c));updateBadge();}
function getUser(){try{return JSON.parse(localStorage.getItem('ak_user')||'null');}catch{return null;}}

function addToCart(id){
  const food=FOODS.find(f=>f.id===id); if(!food)return;
  const cart=getCart(); const idx=cart.findIndex(i=>i.id===id);
  if(idx>-1){cart[idx].qty++;}else{cart.push({...food,qty:1});}
  saveCart(cart); notify(food.name+' added to cart!');
}
function removeFromCart(id){saveCart(getCart().filter(i=>i.id!==id));renderCart();}
function updateQty(id,d){
  const cart=getCart(); const idx=cart.findIndex(i=>i.id===id); if(idx<0)return;
  cart[idx].qty=Math.max(0,cart[idx].qty+d);
  if(cart[idx].qty===0)cart.splice(idx,1);
  saveCart(cart); renderCart();
}
function updateBadge(){
  const n=getCart().reduce((s,i)=>s+i.qty,0);
  document.querySelectorAll('#cartCount').forEach(el=>{el.textContent=n;el.style.display=n?'flex':'none';});
}
function notify(msg){
  const el=document.getElementById('cartNotification'); if(!el)return;
  el.textContent=msg; el.classList.add('show');
  clearTimeout(el._t); el._t=setTimeout(()=>el.classList.remove('show'),3000);
}

function cardHTML(f){
  return `<div class="food-card" data-cat="${f.cat}">
    ${f.badge?`<div class="food-badge">${f.badge}</div>`:''}
    <div class="food-img"><img src="${f.emoji}"></div>
    <div class="food-body">
      <div class="food-name">${f.name}</div>
      <div class="food-desc">${f.desc}</div>
      <div class="food-meta">
        <div class="food-price">${fmt(f.price)}</div>
        <div class="food-rating"><span class="star">★</span> ${f.rating} (${f.reviews})</div>
      </div>
      <button class="add-to-cart" onclick="addToCart(${f.id})">
        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>Add to Cart
      </button>
    </div>
  </div>`;
}
function popHTML(f){
  return `<div class="pop-card">
    <div class="pop-emoji"> <img src="${f.emoji}"></div>
    <div class="pop-info"><div class="pop-name">${f.name}</div><div class="pop-desc"><span style="color:var(--accent)">★</span> ${f.rating} · ${f.reviews} reviews</div></div>
    <div class="pop-right"><div class="pop-price">${fmt(f.price)}</div><button class="btn-outline" style="padding:7px 14px;font-size:0.78rem" onclick="addToCart(${f.id})">Add</button></div>
  </div>`;
}

function initHome(){
  const fg=document.getElementById('featuredGrid'); const pg=document.getElementById('popularGrid');
  if(fg){const feat=FOODS.filter(f=>f.badge).slice(0,8); fg.innerHTML=feat.map(cardHTML).join('');}
  if(pg){const pop=[...FOODS].sort((a,b)=>b.reviews-a.reviews).slice(0,6); pg.innerHTML=pop.map(popHTML).join('');}
  document.querySelectorAll('.cat-chip').forEach(btn=>{
    btn.addEventListener('click',function(){
      document.querySelectorAll('.cat-chip').forEach(b=>b.classList.remove('active')); this.classList.add('active');
      const cat=this.dataset.cat;
      if(fg){const f=cat==='all'?FOODS.filter(x=>x.badge).slice(0,8):FOODS.filter(x=>x.cat===cat).slice(0,8); fg.innerHTML=f.length?f.map(cardHTML).join(''):`<p style="color:var(--text-muted);padding:2rem">No items in this category.</p>`;}
    });
  });
}

function initMenu(){
  const grid=document.getElementById('menuGrid'); const si=document.getElementById('searchInput');
  if(!grid)return;
  let cat='all',q='';
  function render(){
    let items=FOODS;
    if(cat!=='all')items=items.filter(f=>f.cat===cat);
    if(q)items=items.filter(f=>f.name.toLowerCase().includes(q)||f.desc.toLowerCase().includes(q));
    grid.innerHTML=items.length?items.map(cardHTML).join(''):`<div class="no-results">😕 No results for "<strong>${q}</strong>"</div>`;
  }
  render();
  document.querySelectorAll('.cat-chip').forEach(btn=>{
    btn.addEventListener('click',function(){
      document.querySelectorAll('.cat-chip').forEach(b=>b.classList.remove('active')); this.classList.add('active');
      cat=this.dataset.cat; render();
    });
  });
  if(si)si.addEventListener('input',function(){q=this.value.toLowerCase().trim();render();});
  const p=new URLSearchParams(window.location.search); const cp=p.get('cat');
  if(cp){cat=cp; const b=document.querySelector(`.cat-chip[data-cat="${cp}"]`);if(b){document.querySelectorAll('.cat-chip').forEach(x=>x.classList.remove('active'));b.classList.add('active');}render();}
}

function renderCart(){
  const wrap=document.getElementById('cartWrap'); if(!wrap)return;
  const cart=getCart();
  if(!cart.length){
    wrap.innerHTML=`<div class="empty-cart"><div class="ec-emoji">🛒</div><h3>Your cart is empty</h3><p>Start by adding something delicious!</p><a href="menu.html" class="btn-primary" style="margin-top:1rem">Browse Menu</a></div>`;
    return;
  }
  const sub=cart.reduce((s,i)=>s+i.price*i.qty,0); const del=500;
  wrap.innerHTML=`<div class="cart-layout">
    <div class="cart-items">${cart.map(item=>`
      <div class="cart-item">
        <div class="ci-emoji"><img src="${item.emoji}"></div>
        <div class="ci-info"><div class="ci-name">${item.name}</div><div class="ci-price">${fmt(item.price*item.qty)}</div></div>
        <div class="ci-qty">
          <button class="qty-btn" onclick="updateQty(${item.id},-1)">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="updateQty(${item.id},1)">+</button>
        </div>
        <button class="ci-remove" onclick="removeFromCart(${item.id})">✕</button>
      </div>`).join('')}
    </div>
    <div class="cart-summary">
      <div class="cs-title">Order Summary</div>
      <div class="cs-row"><span>Subtotal</span><span>${fmt(sub)}</span></div>
      <div class="cs-row"><span>Delivery Fee</span><span>${fmt(del)}</span></div>
      <div class="cs-row total"><span>Total</span><span>${fmt(sub+del)}</span></div>
      <button class="checkout-btn" onclick="window.location.href='checkout.html'">Proceed to Checkout →</button>
    </div>
  </div>`;
}

function initCheckout(){
  const form=document.getElementById('checkoutForm'); if(!form)return;
  const cart=getCart(); const sub=cart.reduce((s,i)=>s+i.price*i.qty,0); const del=500;
  const se=document.getElementById('checkoutSummary');
  if(se){se.innerHTML=`<div class="cs-title">Your Order</div>${cart.map(i=>`<div class="cs-row"><span><img src="${i.emoji}" style="width: 5%;"> ${i.name} ×${i.qty}</span><span>${fmt(i.price*i.qty)}</span></div>`).join('')}<div class="divider"></div><div class="cs-row"><span>Delivery</span><span>${fmt(del)}</span></div><div class="cs-row total"><span>Total</span><span>${fmt(sub+del)}</span></div>`;}
  document.querySelectorAll('.pay-opt').forEach(o=>{o.addEventListener('click',function(){document.querySelectorAll('.pay-opt').forEach(x=>x.classList.remove('selected'));this.classList.add('selected');});});
  form.addEventListener('submit',function(e){
    e.preventDefault();
    const pay=document.querySelector('.pay-opt.selected')?.dataset.pay;
    if(!pay){alert('Please select a payment method.');return;}
    const name=document.getElementById('fullName').value;
    const phone=document.getElementById('phone').value;
    const address=document.getElementById('address').value;
    const notes=document.getElementById('notes')?.value||'';
    const items=cart.map(i=>`• ${i.name} ×${i.qty} = ${fmt(i.price*i.qty)}`).join('%0A');
    const wam=`Hello Lois Cousine Kitchen! 👋%0A%0ANew Order from ${encodeURIComponent(name)}%0APhone: ${encodeURIComponent(phone)}%0AAddress: ${encodeURIComponent(address)}%0A${notes?'Notes: '+encodeURIComponent(notes)+'%0A':''}%0AOrder:%0A${items}%0A%0ATotal: ${fmt(sub+del)}%0APayment: ${pay}`;
    const waBtn=document.getElementById('whatsappOrderBtn'); if(waBtn)waBtn.href=`https://wa.me/2348026823212?text=${wam}`;
    const orders=JSON.parse(localStorage.getItem('ak_orders')||'[]');
    const order={id:'AK'+Date.now(),items:cart,name,phone,address,payment:pay,status:'received',total:sub+del,date:new Date().toISOString()};
    orders.unshift(order); localStorage.setItem('ak_orders',JSON.stringify(orders));
    localStorage.setItem('ak_last_order',order.id);
    localStorage.removeItem('ak_cart'); updateBadge();
    const modal=document.getElementById('successModal'); if(modal)modal.style.display='flex';
  });
}

function initTracking(){
  const inp=document.getElementById('trackInput'); const btn=document.getElementById('trackBtn'); if(!btn)return;
  const stages=['received','preparing','delivery','delivered'];
  const si={received:{l:'Order Received',i:'📋',d:'We got your order and are confirming details.'},preparing:{l:'Preparing Your Food',i:'👨‍🍳',d:'Our chef is cooking your meal fresh right now.'},delivery:{l:'Out for Delivery',i:'🏍',d:"Your order is on its way — estimated 20-30 mins!"},delivered:{l:'Delivered! 🎉',i:'✅',d:'Your order has been delivered. Enjoy your meal!'}};
  function renderTrack(id){
    const orders=JSON.parse(localStorage.getItem('ak_orders')||'[]');
    const o=orders.find(x=>x.id===id);
    const el=document.getElementById('trackResult'); if(!el)return;
    if(!o){el.innerHTML=`<div class="msg-error">Order not found. Please check your Order ID.</div>`;return;}
    const ci=stages.indexOf(o.status);
    el.innerHTML=`<div class="track-card"><div style="margin-bottom:20px"><strong style="font-size:1.05rem">Order #${o.id}</strong><div style="color:var(--text-muted);font-size:0.85rem;margin-top:4px">Placed ${new Date(o.date).toLocaleDateString()} · ${fmt(o.total)}</div></div>
    <div class="track-stages">${stages.map((s,i)=>{const done=i<ci,active=i===ci;return`<div class="track-stage ${done?'done':''} ${active?'active':''}"><div class="ts-dot">${si[s].i}</div><div class="ts-info"><strong>${si[s].l}</strong><small>${si[s].d}</small></div></div>`;}).join('')}</div></div>`;
  }
  const last=localStorage.getItem('ak_last_order');
  if(last&&inp){inp.value=last;renderTrack(last);}
  btn.addEventListener('click',()=>{if(inp?.value.trim())renderTrack(inp.value.trim());});
  if(inp)inp.addEventListener('keydown',e=>{if(e.key==='Enter'&&inp.value.trim())renderTrack(inp.value.trim());});
}

function initSignup(){
  const form=document.getElementById('signupForm'); if(!form)return;
  form.addEventListener('submit',function(e){
    e.preventDefault();
    const name=document.getElementById('name').value;
    const email=document.getElementById('email').value;
    const country=document.getElementById('country').value;
    const pass=document.getElementById('password').value;
    const conf=document.getElementById('confirmPassword').value;
    const msg=document.getElementById('authMsg');
    if(pass!==conf){msg.innerHTML='<div class="msg-error">Passwords do not match.</div>';return;}
    localStorage.setItem('ak_user',JSON.stringify({name,email,country,token:'ak_'+Date.now()}));
    msg.innerHTML='<div class="msg-success">Account created! Redirecting...</div>';
    setTimeout(()=>window.location.href='index.html',1200);
  });
}

function initLogin(){
  const form=document.getElementById('loginForm'); if(!form)return;
  form.addEventListener('submit',function(e){
    e.preventDefault();
    const email=document.getElementById('email').value;
    const msg=document.getElementById('authMsg');
    localStorage.setItem('ak_user',JSON.stringify({name:email.split('@')[0],email,country:'Nigeria',token:'ak_'+Date.now()}));
    msg.innerHTML='<div class="msg-success">Welcome back! Redirecting...</div>';
    setTimeout(()=>window.location.href='index.html',1200);
  });
}

function initNavbar(){
  const nb=document.getElementById('navbar');
  const hb=document.getElementById('hamburger');
  const nl=document.getElementById('navLinks');
  if(nb){window.addEventListener('scroll',()=>nb.classList.toggle('scrolled',window.scrollY>40));if(window.scrollY>40)nb.classList.add('scrolled');}
  if(hb&&nl){hb.addEventListener('click',()=>nl.classList.toggle('open'));document.addEventListener('click',e=>{if(nb&&!nb.contains(e.target))nl.classList.remove('open');});}
  const user=getUser();
  if(user){const ll=document.querySelector('.nav-link[href="login.html"]');if(ll){ll.textContent=user.name.split(' ')[0];ll.href='#';}}
}

function initAdmin(){
  if(!document.querySelector('.admin-layout'))return;
  const orders=JSON.parse(localStorage.getItem('ak_orders')||'[]');
  const rev=orders.reduce((s,o)=>s+(o.total||0),0);
  const gel=id=>document.getElementById(id);
  if(gel('statRevenue'))gel('statRevenue').textContent=fmt(rev);
  if(gel('statOrders'))gel('statOrders').textContent=orders.length;
  if(gel('statItems'))gel('statItems').textContent=FOODS.length;
  if(gel('statCustomers'))gel('statCustomers').textContent=Math.max(orders.length+50,50);
  const tbody=gel('ordersBody');
  if(tbody){tbody.innerHTML=orders.length?orders.slice(0,20).map(o=>`<tr><td><strong>${o.id}</strong></td><td>${o.name||'—'}</td><td>${o.items?.length||0} item(s)</td><td>${fmt(o.total)}</td><td><span class="status-badge status-${o.status}">${o.status}</span></td><td>${new Date(o.date).toLocaleDateString()}</td></tr>`).join(''):'<tr><td colspan="6" style="text-align:center;padding:2rem;color:var(--text-muted)">No orders yet.</td></tr>';}
  const pb=gel('productsBody');
  if(pb){pb.innerHTML=FOODS.map(f=>`<tr><td><img src="${f.emoji}"> <strong>${f.name}</strong></td><td>${f.cat}</td><td>${fmt(f.price)}</td><td><span style="color:var(--accent)">★</span> ${f.rating}</td><td><button style="padding:4px 10px;font-size:0.75rem;border:1px solid var(--primary);border-radius:6px;background:rgba(232,67,26,0.08);color:var(--primary-light);cursor:pointer;margin-right:6px">Edit</button><button style="padding:4px 10px;font-size:0.75rem;border:1px solid rgba(239,68,68,0.3);border-radius:6px;background:rgba(239,68,68,0.08);color:#EF4444;cursor:pointer">Del</button></td></tr>`).join('');}
  document.querySelectorAll('.admin-tab').forEach(t=>{t.addEventListener('click',function(){document.querySelectorAll('.admin-tab').forEach(x=>x.classList.remove('active'));document.querySelectorAll('.tab-content').forEach(x=>x.classList.remove('active'));this.classList.add('active');const el=gel(this.dataset.tab);if(el)el.classList.add('active');});});
  const pf=gel('productForm');
  if(pf){pf.addEventListener('submit',function(e){e.preventDefault();const m=gel('productMsg');m.innerHTML='<div class="msg-success">✅ Product saved!</div>';setTimeout(()=>m.innerHTML='',3000);pf.reset();});}
}

document.addEventListener('DOMContentLoaded',()=>{
  initNavbar(); updateBadge(); initHome(); initMenu();
  renderCart(); initCheckout(); initTracking();
  initSignup(); initLogin(); initAdmin();
  const waBtn=document.getElementById('whatsappBtn');
  if(waBtn){const cart=getCart();if(cart.length){const items=cart.map(i=>`${i.name} x${i.qty}`).join(', ');const tot=cart.reduce((s,i)=>s+i.price*i.qty,0);waBtn.href=`https://wa.me/2348026823212?text=Hello!%20I'd%20like%20to%20order:%20${encodeURIComponent(items)}%20Total:${fmt(tot)}`;}}
});
