import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentLocation } from "../services/locationService";
import { fetchNearbyRestaurants } from "../services/nearbyRestaurantService";
import { indianFoodItems } from "../data/foodData";
import { useCart as useActualCart } from "../context/CartContext";
import { topRestaurants } from "../data/restaurantData";

const categories = ['All', 'Starters', 'Main Course', 'South Indian', 'Biryani', 'Pizza', 'Burger', 'Rolls', 'Momos', 'Chinese', 'Desserts', 'Beverages'];

const fallbackNearby = [
  {
    properties: {
      place_id: "fall_1",
      name: 'Burger Central',
      address_line2: '1.2 km away • Patna',
      formatted: '1.2 km away • Patna',
      city: 'Patna'
    }
  },
  {
    properties: {
      place_id: "fall_2",
      name: 'Dosa Plaza',
      address_line2: '2.8 km away • Patna',
      formatted: '2.8 km away • Patna',
      city: 'Patna'
    }
  },
];

const getRestaurantImage = (name, index) => {
  const images = [
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=500", // General fine dining
    "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=500", // Bistro
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=500", // Burgers
    "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&q=80&w=500", // Dosa/Indian
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=500", // Indian dining
    "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=500"  // Pizza
  ];
  const lower = name.toLowerCase();
  if (lower.includes('burger')) return images[2];
  if (lower.includes('dosa') || lower.includes('plaza')) return images[3];
  if (lower.includes('pizza')) return images[5];
  return images[index % images.length];
};

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [nearbyRestaurants, setNearbyRestaurants] = useState(fallbackNearby);
  const [loadingNearby, setLoadingNearby] = useState(false);
  const { cartItems, updateQty } = useActualCart();
  const navigate = useNavigate();

  const getDynamicRestaurantName = (item, index) => {
    const realRestros = [
      ...topRestaurants.map(r => r.name),
      ...nearbyRestaurants.map(r => r.properties.name).filter(Boolean)
    ];
    if (realRestros.length > 0) {
      return realRestros[(index + item.name.length) % realRestros.length];
    }
    return item.restaurant;
  };

  const filteredFoodItems = indianFoodItems.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getQty = (itemId) => cartItems[itemId]?.qty || 0;

  const handleUpdateQty = (item, delta) => {
    const index = indianFoodItems.indexOf(item);
    const dynamicName = getDynamicRestaurantName(item, index !== -1 ? index : 0);
    updateQty({
      id: item.id,
      name: item.name,
      price: item.price,
      img: item.img,
      isVeg: item.isVeg,
      restaurant: dynamicName,
      desc: item.desc,
    }, delta);
  };

  useEffect(() => {
    async function loadNearbyRestaurants() {
      try {
        setLoadingNearby(true);
        const location = await getCurrentLocation();
        console.log("Location:", location);

        const restaurants = await fetchNearbyRestaurants(
          location.latitude,
          location.longitude
        );

        console.log("Nearby Restaurants:", restaurants);

        if (restaurants && restaurants.length > 0) {
          setNearbyRestaurants(restaurants);
        }
      } catch (error) {
        console.error("Error loading nearby restaurants, using fallback:", error);
      } finally {
        setLoadingNearby(false);
      }
    }

    loadNearbyRestaurants();
  }, []);

  return (
    <div style={{ backgroundColor: 'var(--background)', minHeight: '100vh' }}>

      <main style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '6rem' }}>

        {/* Hero Banners - Bento Grid */}
        <section className="home-bento-grid">
          {/* Big hero */}
          <div className="home-bento-main">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuABk4Hn1_irEI-ApZmSd9_gD1oi3z0x5YfkIZEkDmrZdlqSLAOwxDMzPB0KPqsCcHf274FclsbHSkMtBbWvAReoNXmg2CE-jwQbtKpCma0TDxac3bdpMoP88P7uAxrcKy5BRUIHpFhVdpVI3m6F67XZatqIH6TBMeG5ZyIGPxcJDnAmjc1GKgMssqHJbuf4ZBUf3tF05GXv-xOaF2C2kKeWMDuBfYUgegBQH7gA0TnvIedo043Y43mTeD3v8i1cQ3wI_kFVEFyDvg"
              alt="Artisan Pizza"
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)' }}
              onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={e => e.target.style.transform = 'scale(1)'}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 65%, transparent 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '2rem' }}>
              <span style={{ color: 'var(--tertiary-fixed)', fontFamily: '"JetBrains Mono", monospace', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Editor's Choice</span>
              <h2 style={{ color: '#fff', fontSize: '1.8rem', fontWeight: '800', lineHeight: '1.3', maxWidth: '28rem', margin: 0, letterSpacing: '-0.02em' }}>Artisan Pizzas, 50% Off Today.</h2>
              <p style={{ color: 'rgba(255,255,255,0.85)', marginTop: '0.5rem', fontSize: '0.95rem', margin: '0.5rem 0 0', fontWeight: '500' }}>Experience the authentic taste of Naples delivered to your doorstep.</p>
            </div>
          </div>
          {/* Secondary hero */}
          <div className="home-bento-sub">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC31gXKw59ezIkNL3pBVH6ZiIzHwJtRPxtAMVXDv-S0H0JgoZzYHbDvvPRNN436Og_cRNEhUd4dOTnGya2q7TlQ4tD8kGdyPk_NpVz5mUXPZs2P0fQlLF09rH4HxHOaBkW1DiSRSjUIdW3rxrRf7eJiWIqK7-0YH0cqMiDqJzz30UTXHApH0kTjNgtybN0rGkvHdzaD2aHxl7FemjbQhVvFZtwcCocag7cB-aJ_xYRD0Br0xSgkR7QK_RFN9GzH_MBJZLC-AcPxyg"
              alt="Healthy Bowl"
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)' }}
              onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={e => e.target.style.transform = 'scale(1)'}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 65%, transparent 100%)' }} />
            <div style={{ position: 'absolute', inset: 0, padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ alignSelf: 'flex-start', backgroundColor: '#ffffff', backdropFilter: 'blur(8px)', padding: '0.3rem 0.8rem', borderRadius: '9999px', color: 'var(--primary)', fontWeight: '800', fontSize: '0.75rem', letterSpacing: '0.05em' }}>NEW COLLECTION</div>
              <div>
                <h3 style={{ color: '#fff', fontSize: '1.3rem', fontWeight: '800', textShadow: '0 2px 8px rgba(0,0,0,0.4)', margin: 0 }}>The Healthy Collective</h3>
                <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.85rem', fontWeight: '600', marginTop: '0.25rem', margin: '0.25rem 0 0' }}>Guilt-free indulgence starting at ₹199</p>
              </div>
            </div>
          </div>
        </section>

        {/* Top Restaurants */}
        <section style={{ marginTop: '3rem' }}>
          <div style={{ padding: '0 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: '900', color: 'var(--on-surface)', margin: 0, letterSpacing: '-0.02em' }}>Top Restaurants in Patna</h2>
              <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.95rem', margin: '0.25rem 0 0', fontWeight: '500' }}>Curated by our food experts</p>
            </div>
            <Link to="/restaurant/1" style={{ color: 'var(--primary)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.95rem' }}>
              View all <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>chevron_right</span>
            </Link>
          </div>
          <div className="hide-scrollbar" style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', padding: '0 1rem 1rem' }}>
            {topRestaurants.map(r => (
              <Link to={`/restaurant/${r.id}`} key={r.id} className="restro-card-hover" style={{ flexShrink: 0, width: '18rem', backgroundColor: '#fff', borderRadius: '1.5rem', border: '1px solid var(--border-subtle)', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden', display: 'block' }}>
                <div style={{ position: 'relative', height: '11rem', overflow: 'hidden' }}>
                  <img src={r.img} alt={r.name} className="restro-img-zoom" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: '1rem', right: '1rem', backgroundColor: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)', padding: '0.25rem 0.5rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--primary)', fontWeight: '800', fontSize: '0.8rem', boxShadow: '0 2px 6px rgba(0,0,0,0.08)' }}>
                    <span className="material-symbols-outlined filled" style={{ fontSize: '14px' }}>star</span> {r.rating}
                  </div>
                </div>
                <div style={{ padding: '1.25rem' }}>
                  <h4 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--on-surface)', marginBottom: '0.25rem' }}>{r.name}</h4>
                  <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.85rem', fontWeight: '600', marginBottom: '1rem' }}>{r.cuisine}</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--on-secondary-container)', backgroundColor: 'rgba(214,224,243,0.3)', padding: '0.25rem 0.5rem', borderRadius: '0.375rem' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>schedule</span>
                      <span style={{ fontSize: '0.8rem', fontWeight: '700' }}>{r.time}</span>
                    </div>
                    <span style={{ color: r.status === 'Open' ? 'var(--success)' : 'var(--error)', fontWeight: '800', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{r.status}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Popular Food Items */}
        <section style={{ marginTop: '3rem', padding: '0 1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: '900', color: 'var(--on-surface)', margin: 0, letterSpacing: '-0.02em' }}>Popular Dishes in India</h2>
              <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.95rem', margin: '0.25rem 0 0', fontWeight: '500' }}>The 50 most loved dishes, freshly made</p>
            </div>
            
            {/* Local Search Input for Food items */}
            <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
              <span className="material-symbols-outlined" style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--on-surface-variant)', fontSize: '18px' }}>search</span>
              <input
                type="text"
                placeholder="Search popular dishes..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: '100%', height: '2.4rem', paddingLeft: '2.5rem', paddingRight: '1rem',
                  backgroundColor: '#fff', border: '1px solid var(--border-subtle)',
                  borderRadius: '9999px', fontSize: '0.85rem', outline: 'none',
                  fontFamily: 'Inter, sans-serif', color: 'var(--on-surface)',
                  boxSizing: 'border-box', transition: 'box-shadow 0.2s, border-color 0.2s',
                }}
                onFocus={e => { e.target.style.boxShadow = '0 0 0 2px rgba(171,53,0,0.15)'; e.target.style.borderColor = 'rgba(171,53,0,0.3)'; }}
                onBlur={e => { e.target.style.boxShadow = 'none'; e.target.style.borderColor = 'var(--border-subtle)'; }}
              />
            </div>
          </div>

          {/* Categories Pill Bar for Food Items */}
          <div className="hide-scrollbar" style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', padding: '0 0 1.5rem 0', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  flexShrink: 0, padding: '0.5rem 1.25rem', borderRadius: '9999px',
                  border: activeCategory === cat ? '1px solid rgba(171,53,0,0.2)' : '1px solid var(--border-subtle)',
                  backgroundColor: activeCategory === cat ? 'var(--primary-container)' : '#fff',
                  color: activeCategory === cat ? '#fff' : 'var(--on-surface-variant)',
                  fontWeight: activeCategory === cat ? '700' : '500',
                  fontSize: '0.85rem', cursor: 'pointer', whiteSpace: 'nowrap',
                  boxShadow: activeCategory === cat ? '0 2px 8px rgba(171,53,0,0.2)' : '0 1px 3px rgba(0,0,0,0.05)',
                  transition: 'all 0.2s',
                  fontFamily: 'Inter, sans-serif',
                }}
              >{cat}</button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {filteredFoodItems.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', backgroundColor: '#fff', borderRadius: '1.5rem', border: '1px solid var(--border-subtle)' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '48px', color: 'var(--on-surface-variant)', opacity: 0.5, marginBottom: '0.5rem' }}>search_off</span>
                <p style={{ fontWeight: '600', color: 'var(--on-surface-variant)' }}>No matching dishes found. Try another search or category!</p>
              </div>
            ) : (
              filteredFoodItems.map(item => {
                const qty = getQty(item.id);
                return (
                  <div key={item.id} className="restro-card-hover" style={{
                    backgroundColor: '#fff', borderRadius: '1.5rem', padding: '1.25rem',
                    border: '1px solid var(--border-subtle)',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                    display: 'flex', gap: '1.25rem', position: 'relative', overflow: 'hidden',
                  }}>
                    {/* Food Image & Veg Badge */}
                    <div style={{ position: 'relative', width: '7.5rem', height: '7.5rem', flexShrink: 0, borderRadius: '0.85rem', overflow: 'hidden', backgroundColor: 'var(--surface-container)' }}>
                      <img src={item.img} alt={item.name} className="restro-img-zoom" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', top: '0.375rem', left: '0.375rem', backgroundColor: 'rgba(255,255,255,0.92)', padding: '0.25rem', borderRadius: '0.375rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <div style={{
                          width: '0.75rem', height: '0.75rem', border: `2px solid ${item.isVeg ? 'var(--success)' : 'var(--error)'}`,
                          borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1px'
                        }}>
                          <div style={{ width: '100%', height: '100%', backgroundColor: item.isVeg ? 'var(--success)' : 'var(--error)', borderRadius: '50%' }} />
                        </div>
                      </div>
                    </div>

                    {/* Food Details */}
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexGrow: 1 }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                          <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--on-surface)', margin: '0 0 0.25rem 0', lineHeight: '1.2' }}>{item.name}</h3>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.1rem', fontSize: '0.8rem', fontWeight: '800', color: 'var(--primary)', whiteSpace: 'nowrap' }}>
                            <span className="material-symbols-outlined filled" style={{ fontSize: '13px' }}>star</span> {item.rating}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '700', marginBottom: '0.35rem' }}>{getDynamicRestaurantName(item, indianFoodItems.indexOf(item))}</p>
                        <p style={{ fontSize: '0.85rem', color: 'var(--on-surface-variant)', margin: 0, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.desc}</p>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.75rem' }}>
                        <span style={{ fontSize: '1.15rem', fontWeight: '950', color: 'var(--primary)' }}>₹{item.price}</span>
                        
                        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--surface-container-low)', padding: '0.3rem', borderRadius: '9999px', border: '1px solid var(--border-subtle)' }}>
                          {qty > 0 ? (
                            <>
                              <button 
                                onClick={() => handleUpdateQty(item, -1)}
                                style={{ width: '1.75rem', height: '1.75rem', borderRadius: '50%', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', color: 'var(--on-surface-variant)', fontSize: '1rem' }}
                              >-</button>
                              <span style={{ padding: '0 0.5rem', fontWeight: '700', fontSize: '0.85rem' }}>{qty}</span>
                              <button 
                                onClick={() => handleUpdateQty(item, 1)}
                                style={{ width: '1.75rem', height: '1.75rem', borderRadius: '50%', border: 'none', backgroundColor: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', color: '#fff', fontSize: '1rem' }}
                              >+</button>
                            </>
                          ) : (
                            <button 
                              onClick={() => handleUpdateQty(item, 1)}
                              style={{
                                border: 'none', backgroundColor: 'var(--primary)', color: '#fff', 
                                padding: '0.35rem 1.1rem', borderRadius: '9999px', fontWeight: '700', 
                                fontSize: '0.8rem', cursor: 'pointer', transition: 'background-color 0.2s',
                                boxShadow: '0 2px 4px rgba(171,53,0,0.1)'
                              }}
                            >Add</button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>


        {/* Nearby Restaurants */}
        <section style={{ marginTop: '3rem', padding: '0 1rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: '900', color: 'var(--on-surface)', margin: 0, letterSpacing: '-0.02em' }}>Nearby Restaurants</h2>
            <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.95rem', margin: '0.25rem 0 0', fontWeight: '500' }}>Fresh food around you</p>
          </div>
          <div className="nearby-restaurants" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {nearbyRestaurants.map((restaurant, index) => {
              const placeId = restaurant.properties.place_id || `near_${index}`;
              const name = restaurant.properties.name || "Unnamed Restaurant";
              const address = restaurant.properties.address_line2 || restaurant.properties.formatted || "Address not available";
              const city = restaurant.properties.city || "Patna";

              return (
                <Link 
                  to={`/restaurant/${placeId}`} 
                  key={placeId} 
                  className="restro-card-hover"
                  style={{ textDecoration: 'none', display: 'block', height: '100%' }}
                >
                  <div className="restaurant-card" style={{ backgroundColor: '#fff', borderRadius: '1.5rem', border: '1px solid var(--border-subtle)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box' }}>
                    <div style={{ height: '10rem', width: '100%', overflow: 'hidden', position: 'relative' }}>
                      <img src={getRestaurantImage(name, index)} alt={name} className="restro-img-zoom" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', backgroundColor: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)', padding: '0.25rem 0.5rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--primary)', fontWeight: '800', fontSize: '0.75rem', boxShadow: '0 2px 6px rgba(0,0,0,0.08)' }}>
                        <span className="material-symbols-outlined filled" style={{ fontSize: '13px' }}>star</span>
                        {(4.2 + (index % 5) * 0.15).toFixed(1)}
                      </div>
                    </div>
                    
                    <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexGrow: 1 }}>
                      <div>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--on-surface)', marginBottom: '0.35rem', lineHeight: '1.2' }}>{name}</h3>
                        <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.8rem', lineHeight: 1.4, margin: 0 }}>{address}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: '600' }}>
                          {city}
                        </span>
                        <span style={{ color: 'var(--primary)', fontSize: '0.75rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.1rem' }}>
                          View Menu <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>chevron_right</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </main>

      {/* Floating AI Button */}
      <div style={{ position: 'fixed', bottom: '5.5rem', right: '1.5rem', zIndex: 50 }}>
        <button
          className="ai-pulse"
          onClick={() => navigate('/ai-suggest')}
          style={{
            backgroundColor: 'var(--primary-container)', color: '#fff', padding: '1rem 1.5rem',
            borderRadius: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.2)',
            cursor: 'pointer', backdropFilter: 'blur(12px)', transition: 'transform 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <div style={{ width: '2.5rem', height: '2.5rem', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="material-symbols-outlined filled spin-slow" style={{ color: '#fff' }}>auto_awesome</span>
          </div>
          <div style={{ textAlign: 'left' }}>
            <p style={{ fontSize: '12px', opacity: '0.8', lineHeight: 1, marginBottom: '0.25rem', fontWeight: '600' }}>Confused?</p>
            <p style={{ fontWeight: '700', fontSize: '15px', lineHeight: 1 }}>Ask AI Suggest</p>
          </div>
        </button>
      </div>

    </div>
  );
}
