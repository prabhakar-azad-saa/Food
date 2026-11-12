"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import DishOrbitCarousel, { type Dish } from "@/components/ui/dish-orbit-carousel"
import { ALL_DISHES, IMG_WALL, type ExtendedDish } from "@/components/ui/dish-data"
import {
  ChefsAtelierSection,
  InteractiveTastingStage,
  MenuNavDrawer,
  OrbitDishCard,
  OrbitFooter,
  OrderDrawer,
  ReservationSection,
  SearchModal,
  TwoWeightHeading,
  VideoRecipeModal,
  type CartItem,
  type PageId,
} from "@/components/ui/orbit-pages"

export const DEMO_DISHES: Dish[] = ALL_DISHES

export function DishOrbitCarouselDemo() {
  const [activePage, setActivePage] = useState<PageId>("showcase")
  const [orbitIndex, setOrbitIndex] = useState(0)
  const [dark, setDark] = useState(false)

  // Menu page filters
  const [menuCategory, setMenuCategory] = useState<string>("All")
  const [menuSort, setMenuSort] = useState<"featured" | "rating" | "price-asc" | "likes">("featured")
  const [menuQuery, setMenuQuery] = useState("")

  // Modals & Drawers
  const [searchOpen, setSearchOpen] = useState(false)
  const [menuDrawerOpen, setMenuDrawerOpen] = useState(false)
  const [orderDrawerOpen, setOrderDrawerOpen] = useState(false)
  const [videoDish, setVideoDish] = useState<ExtendedDish | null>(null)

  // Cart & Toast
  const [cart, setCart] = useState<CartItem[]>([
    { dish: ALL_DISHES[0], qty: 1 },
  ])
  const [toast, setToast] = useState<string | null>(null)
  const menuSectionRef = useRef<HTMLDivElement | null>(null)

  // Sync dark mode class on <html>
  useEffect(() => {
    const root = document.documentElement
    if (dark) root.classList.add("dark")
    else root.classList.remove("dark")
  }, [dark])

  // Keyboard shortcut ⌘K / Ctrl+K for Search
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setSearchOpen((v) => !v)
      } else if (e.key === "Escape") {
        setSearchOpen(false)
        setMenuDrawerOpen(false)
        setOrderDrawerOpen(false)
        setVideoDish(null)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  const showToast = (msg: string) => {
    setToast(msg)
  }

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3200)
    return () => clearTimeout(t)
  }, [toast])

  const addToOrder = (dish: ExtendedDish) => {
    setCart((prev) => {
      const found = prev.find((x) => x.dish.id === dish.id)
      if (found) {
        return prev.map((x) => (x.dish.id === dish.id ? { ...x, qty: x.qty + 1 } : x))
      }
      return [...prev, { dish, qty: 1 }]
    })
    showToast(`Added "${dish.title} ${dish.subtitle}" ($${dish.price}) to Kitchen Ticket`)
  }

  const addFullTasting = (courses: ExtendedDish[]) => {
    setCart((prev) => {
      const next = [...prev]
      for (const c of courses) {
        const found = next.find((x) => x.dish.id === c.id)
        if (found) found.qty += 1
        else next.push({ dish: c, qty: 1 })
      }
      return [...next]
    })
    setOrderDrawerOpen(true)
    showToast("Added 5-Course Tasting Odyssey to Kitchen Ticket")
  }

  const updateCartQty = (dishId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((x) => (x.dish.id === dishId ? { ...x, qty: x.qty + delta } : x))
        .filter((x) => x.qty > 0)
    )
  }

  const handleNavigate = (page: PageId) => {
    setActivePage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleSelectDishInOrbit = (_dish: ExtendedDish, index: number) => {
    setActivePage("showcase")
    setOrbitIndex(index)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const activeDish = ALL_DISHES[orbitIndex] ?? ALL_DISHES[0]
  const totalCartItems = cart.reduce((sum, item) => sum + item.qty, 0)

  const filteredMenuDishes = useMemo(() => {
    const q = menuQuery.trim().toLowerCase()
    const list = ALL_DISHES.filter((d) => {
      if (menuCategory !== "All" && d.category !== menuCategory) return false
      if (!q) return true
      return [d.title, d.subtitle, d.chef, d.kitchen, d.description, ...(d.ingredients ?? [])]
        .join(" ")
        .toLowerCase()
        .includes(q)
    })
    if (menuSort === "rating") return [...list].sort((a, b) => b.rating - a.rating)
    if (menuSort === "price-asc") return [...list].sort((a, b) => a.price - b.price)
    if (menuSort === "likes") return [...list].sort((a, b) => b.likes - a.likes)
    return list
  }, [menuCategory, menuSort, menuQuery])

  const renderMenuSection = (isDedicatedPage = false) => (
    <section ref={menuSectionRef} className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <TwoWeightHeading
          eyebrow={isDedicatedPage ? "Full Smart-Kitchen Directory" : "Curated Plates • Same Orbital DNA"}
          title="Seasonal"
          subtitle="Menu"
          triggerKey={menuCategory}
        />

        {/* Inline Search & Sort Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="dsh-glass-card flex items-center gap-2 px-3.5 py-1.5">
            <svg className="h-3.5 w-3.5 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="6.5" />
              <path d="m16 16 4 4" />
            </svg>
            <input
              type="text"
              value={menuQuery}
              onChange={(e) => setMenuQuery(e.target.value)}
              placeholder="Filter dishes or ingredients..."
              className="w-40 border-0 bg-transparent text-xs outline-none sm:w-48"
              style={{ color: "var(--color-foreground)" }}
            />
            {menuQuery && (
              <button
                type="button"
                onClick={() => setMenuQuery("")}
                className="cursor-pointer border-0 bg-transparent p-0 text-xs opacity-60"
              >
                ✕
              </button>
            )}
          </div>

          <select
            value={menuSort}
            onChange={(e) => setMenuSort(e.target.value as typeof menuSort)}
            aria-label="Sort dishes"
            className="dsh-pill-btn !h-8 !px-3 !text-xs outline-none"
          >
            <option value="featured">Sort: Featured</option>
            <option value="rating">Sort: Highest Rated</option>
            <option value="likes">Sort: Most Loved</option>
            <option value="price-asc">Sort: Price (Low → High)</option>
          </select>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="mb-8 flex flex-wrap items-center gap-2">
        {["All", "Signature", "Mains", "Seafood", "Botanical", "Dessert"].map((cat) => {
          const count = cat === "All" ? ALL_DISHES.length : ALL_DISHES.filter((d) => d.category === cat).length
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setMenuCategory(cat)}
              className="dsh-pill-btn"
              data-active={menuCategory === cat}
            >
              <span>{cat}</span>
              <span className="rounded-full px-1.5 py-0.5 text-[10px] opacity-70">{count}</span>
            </button>
          )
        })}
      </div>

      {/* Cards Grid */}
      {filteredMenuDishes.length === 0 ? (
        <div className="dsh-glass-card py-16 text-center">
          <p className="text-sm font-semibold">No dishes match "{menuQuery}"</p>
          <button
            type="button"
            onClick={() => {
              setMenuCategory("All")
              setMenuQuery("")
            }}
            className="dsh-pill-btn mt-3"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredMenuDishes.map((dish) => {
            const origIndex = ALL_DISHES.findIndex((d) => d.id === dish.id)
            return (
              <OrbitDishCard
                key={dish.id}
                dish={dish}
                index={origIndex >= 0 ? origIndex : 0}
                onPlay={(d) => setVideoDish(d)}
                onOrder={(d) => addToOrder(d)}
                onSelectInOrbit={handleSelectDishInOrbit}
              />
            )
          })}
        </div>
      )}
    </section>
  )

  return (
    <div className="min-h-screen w-full selection:bg-[#e8a598] selection:text-zinc-900">
      {/* Floating Smart-Kitchen Top Navigation Bar */}
      <header className="fixed left-0 right-0 top-3 z-40 mx-auto max-w-6xl px-3 sm:px-6 pointer-events-none">
        <nav
          aria-label="Primary Navigation"
          className="dsh-glass-card pointer-events-auto flex items-center justify-between gap-2 px-3.5 py-2 sm:px-5"
        >
          {/* Brand Logo */}
          <button
            type="button"
            onClick={() => handleNavigate("showcase")}
            className="flex cursor-pointer items-center gap-2.5 border-0 bg-transparent p-0 text-left"
            style={{ color: "var(--color-foreground)" }}
          >
            <img
              src={activeDish.image}
              alt=""
              className="dsh-plate-shadow h-8 w-8 object-contain transition-transform duration-500 hover:rotate-45"
            />
            <div className="leading-none">
              <span className="block text-[10px] font-light uppercase tracking-widest opacity-70">Atelier</span>
              <span className="block text-sm font-extrabold uppercase tracking-tight">Orbit</span>
            </div>
          </button>

          {/* Center Page Links */}
          <div className="hidden items-center gap-1 md:flex">
            {(
              [
                { id: "showcase", label: "Orbit Showcase" },
                { id: "menu", label: "Menu" },
                { id: "tasting", label: "Tasting Odyssey" },
                { id: "chefs", label: "Chefs" },
                { id: "reserve", label: "Reserve Table" },
              ] as { id: PageId; label: string }[]
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleNavigate(tab.id)}
                className="dsh-pill-btn !h-8 !border-0 !px-3.5 !text-xs"
                style={
                  activePage === tab.id
                    ? {
                        background: activeDish.accent,
                        color: "#18181b",
                        fontWeight: 700,
                      }
                    : { background: "transparent" }
                }
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Right Quick Utilities: Search, Theme, Order Ticket, Drawer */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="dsh-pill-btn !h-8 !px-3 !text-xs"
              aria-label="Search dishes"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="6.5" />
                <path d="m16 16 4 4" />
              </svg>
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden rounded px-1 text-[10px] opacity-60 lg:inline">⌘K</kbd>
            </button>

            <button
              type="button"
              onClick={() => setDark((d) => !d)}
              className="dsh-pill-btn !h-8 !w-8 !justify-center !p-0"
              aria-label="Toggle color theme"
              title="Toggle Light / Dark Kitchen Theme"
            >
              {dark ? "☀" : "☾"}
            </button>

            <button
              type="button"
              onClick={() => setOrderDrawerOpen(true)}
              className="dsh-pill-btn !h-8 !px-3 !text-xs !font-semibold"
              style={{
                background: "var(--color-foreground)",
                color: "var(--color-background)",
              }}
            >
              <span>Order</span>
              <span
                className="flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[10px] font-extrabold"
                style={{ background: activeDish.accent, color: "#18181b" }}
              >
                {totalCartItems}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setMenuDrawerOpen(true)}
              className="dsh-pill-btn !h-8 !w-8 !justify-center !p-0 md:hidden"
              aria-label="Open navigation menu"
            >
              ☰
            </button>
          </div>
        </nav>
      </header>

      {/* Main Content Area */}
      {activePage === "showcase" ? (
        <>
          {/* Hero Orbit Carousel (loop=false so scrolling progresses naturally into the sections below!) */}
          <div className="relative">
            <DishOrbitCarousel
              dishes={ALL_DISHES}
              backdrop={IMG_WALL}
              loop={false}
              activeIndex={orbitIndex}
              onChange={(idx) => setOrbitIndex(idx)}
              onPlay={(_dish, idx) => setVideoDish(ALL_DISHES[idx] ?? ALL_DISHES[0])}
              onOrder={(_dish, idx) => addToOrder(ALL_DISHES[idx] ?? ALL_DISHES[0])}
              onSearchClick={() => setSearchOpen(true)}
              onMenuClick={() => setMenuDrawerOpen(true)}
            />

            {/* Floating Quick-Jump Pill Dock at Bottom-Right of Viewport */}
            <div className="fixed bottom-4 right-4 z-30 flex items-center gap-2">
              <button
                type="button"
                onClick={() => menuSectionRef.current?.scrollIntoView({ behavior: "smooth" })}
                className="dsh-glass-card dsh-pill-btn !h-9 !px-4 !text-xs !font-semibold shadow-lg"
              >
                <span>Explore Full Menu & Pages</span>
                <span>↓</span>
              </button>
            </div>
          </div>

          {/* Seamless Scroll Sections Below the Hero Orbit */}
          <div className="relative z-10">
            {renderMenuSection(false)}
            <InteractiveTastingStage
              onPlay={(d) => setVideoDish(d)}
              onOrder={(d) => addToOrder(d)}
              onOrderFullTasting={addFullTasting}
            />
            <ChefsAtelierSection
              onSelectDishInOrbit={handleSelectDishInOrbit}
              onPlayDish={(d) => setVideoDish(d)}
            />
            <ReservationSection />
          </div>
        </>
      ) : (
        /* Dedicated Individual Page View (Instant Demo Access without scrolling past Hero) */
        <div className="relative min-h-screen pt-20">
          {/* Keep DishOrbitCarousel font-face loaded even when on a subpage */}
          <div className="hidden" aria-hidden="true">
            <DishOrbitCarousel dishes={ALL_DISHES.slice(0, 1)} loop={false} />
          </div>

          <div className="mx-auto max-w-6xl px-4 pt-4 sm:px-6">
            <button
              type="button"
              onClick={() => handleNavigate("showcase")}
              className="dsh-pill-btn !h-8 !px-3.5 !text-xs"
            >
              ← Back to 360° Orbit Showcase
            </button>
          </div>

          {activePage === "menu" && renderMenuSection(true)}
          {activePage === "tasting" && (
            <InteractiveTastingStage
              onPlay={(d) => setVideoDish(d)}
              onOrder={(d) => addToOrder(d)}
              onOrderFullTasting={addFullTasting}
            />
          )}
          {activePage === "chefs" && (
            <ChefsAtelierSection
              onSelectDishInOrbit={handleSelectDishInOrbit}
              onPlayDish={(d) => setVideoDish(d)}
            />
          )}
          {activePage === "reserve" && <ReservationSection />}
        </div>
      )}

      {/* Theme-Matched Footer */}
      <OrbitFooter
        activeAccent={activeDish.accent}
        onNavigate={handleNavigate}
        onSelectDishInOrbit={handleSelectDishInOrbit}
        onOpenSearch={() => setSearchOpen(true)}
      />

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2">
          <div className="dsh-glass-strong flex items-center gap-3 px-4 py-2.5 text-xs font-semibold shadow-xl">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: activeDish.accent }} />
            <span>{toast}</span>
            <button
              type="button"
              onClick={() => {
                setToast(null)
                setOrderDrawerOpen(true)
              }}
              className="dsh-pill-btn !h-6 !px-2.5 !text-[11px] !font-bold"
              style={{ background: activeDish.accent, color: "#18181b", borderColor: "transparent" }}
            >
              View Ticket →
            </button>
          </div>
        </div>
      )}

      {/* Modals & Drawers */}
      <SearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectDishInOrbit={handleSelectDishInOrbit}
        onPlayDish={(d) => setVideoDish(d)}
        onOrderDish={(d) => addToOrder(d)}
      />

      <VideoRecipeModal
        dish={videoDish}
        onClose={() => setVideoDish(null)}
        onOrder={(d) => addToOrder(d)}
      />

      <OrderDrawer
        open={orderDrawerOpen}
        onClose={() => setOrderDrawerOpen(false)}
        cart={cart}
        onUpdateQty={updateCartQty}
        onClearCart={() => setCart([])}
      />

      <MenuNavDrawer
        open={menuDrawerOpen}
        onClose={() => setMenuDrawerOpen(false)}
        activePage={activePage}
        onNavigate={handleNavigate}
        onSelectDishInOrbit={handleSelectDishInOrbit}
        dark={dark}
        onToggleDark={() => setDark((d) => !d)}
      />
    </div>
  )
}

export default DishOrbitCarouselDemo
