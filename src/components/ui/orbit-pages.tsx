"use client"

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { gsap } from "gsap"
import { arcPath } from "./dish-orbit-carousel"
import { ALL_DISHES, CHEF_PROFILES, IMG_WALL, type ChefProfile, type ExtendedDish } from "./dish-data"

export type PageId = "showcase" | "menu" | "tasting" | "chefs" | "reserve"

export type CartItem = {
  dish: ExtendedDish
  qty: number
}

const HIDE_1 = "inset(0% 0% 0% 100%)"
const HIDE_2 = "inset(0% 100% 0% 0%)"
const SHOW = "inset(0% 0% 0% 0%)"

/* -------------------------------------------------------------------------- */
/*  Shared Theme Primitives (Exact DishOrbitCarousel DNA)                      */
/* -------------------------------------------------------------------------- */

export function RatingBadge({ rating, accent, scale = 1 }: { rating: number; accent: string; scale?: number }) {
  return (
    <div
      className="relative select-none"
      style={{
        width: 58 * scale,
        height: 62 * scale,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 46 * scale,
          height: 62 * scale,
          borderRadius: 10 * scale,
          background: accent,
          transition: "background 0.45s ease",
        }}
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          style={{
            position: "absolute",
            left: 17 * scale,
            bottom: 9 * scale,
            width: 12 * scale,
            height: 12 * scale,
            fill: "var(--color-foreground)",
            opacity: 0.8,
          }}
        >
          <path d="m12 2.5 2.9 6 6.6.8-4.9 4.6 1.3 6.6L12 17.2l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z" />
        </svg>
      </div>
      <span
        aria-label={`Rated ${rating.toFixed(1)} out of 5`}
        style={{
          position: "absolute",
          left: 10 * scale,
          top: 4 * scale,
          fontSize: 36 * scale,
          fontWeight: 700,
          letterSpacing: "-0.04em",
          lineHeight: 1,
        }}
      >
        {rating.toFixed(1)}
      </span>
    </div>
  )
}

export function TwoWeightHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  maxSize = 54,
  triggerKey,
}: {
  eyebrow?: string
  title: string
  subtitle: string
  align?: "left" | "center"
  maxSize?: number
  triggerKey?: string | number
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null)

  useLayoutEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const eye = el.querySelector(".tw-eye")
    const t1 = el.querySelector(".tw-t1")
    const t2 = el.querySelector(".tw-t2")
    const tl = gsap.timeline()
    if (eye) {
      tl.fromTo(eye, { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" }, 0)
    }
    if (t1) {
      tl.fromTo(t1, { clipPath: HIDE_1 }, { clipPath: SHOW, duration: 0.7, ease: "power3.out" }, 0.05)
    }
    if (t2) {
      tl.fromTo(t2, { clipPath: HIDE_2 }, { clipPath: SHOW, duration: 0.7, ease: "power3.out" }, 0.12)
    }
    return () => {
      tl.kill()
    }
  }, [title, subtitle, triggerKey])

  return (
    <div ref={wrapRef} className={align === "center" ? "text-center" : "text-left"}>
      {eyebrow ? (
        <p className="tw-eye mb-1.5 text-[12.5px] font-semibold tracking-[0.01em] opacity-85">{eyebrow}</p>
      ) : null}
      <h2 className="m-0 font-inherit">
        <span
          className="tw-t1 dsh-display-t1"
          style={{ fontSize: `clamp(28px, 4.5vw, ${maxSize}px)` }}
        >
          {title}
        </span>
        <span
          className="tw-t2 dsh-display-t2 mt-1"
          style={{ fontSize: `clamp(32px, 5vw, ${maxSize + 6}px)` }}
        >
          {subtitle}
        </span>
      </h2>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  OrbitDishCard: Exact .dsh-card aesthetic + GSAP orbital plate swing        */
/* -------------------------------------------------------------------------- */

export function OrbitDishCard({
  dish,
  index,
  onPlay,
  onOrder,
  onSelectInOrbit,
}: {
  dish: ExtendedDish
  index: number
  onPlay: (dish: ExtendedDish) => void
  onOrder: (dish: ExtendedDish) => void
  onSelectInOrbit: (dish: ExtendedDish, index: number) => void
}) {
  const [tab, setTab] = useState<"overview" | "ingredients" | "steps">("overview")
  const [liked, setLiked] = useState(false)
  const [disliked, setDisliked] = useState(false)

  const plateWrapRef = useRef<HTMLDivElement | null>(null)
  const arcPathRef = useRef<SVGPathElement | null>(null)
  const arcSpan = useRef({ a0: 44, a1: 118 })

  const updateArc = () => {
    arcPathRef.current?.setAttribute("d", arcPath(arcSpan.current.a0, arcSpan.current.a1, 160, -90, 220, 48, 36))
  }

  useLayoutEffect(() => {
    updateArc()
  }, [])

  const onMouseEnter = () => {
    if (plateWrapRef.current) {
      gsap.to(plateWrapRef.current, {
        rotation: 14,
        scale: 1.06,
        y: -4,
        duration: 0.65,
        ease: "power3.out",
      })
    }
    gsap.to(arcSpan.current, {
      a0: 32,
      a1: 138,
      duration: 0.6,
      ease: "power2.out",
      onUpdate: updateArc,
    })
  }

  const onMouseLeave = () => {
    if (plateWrapRef.current) {
      gsap.to(plateWrapRef.current, {
        rotation: 0,
        scale: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
      })
    }
    gsap.to(arcSpan.current, {
      a0: 44,
      a1: 118,
      duration: 0.65,
      ease: "power3.out",
      onUpdate: updateArc,
    })
  }

  return (
    <article
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="dsh-glass-card group relative flex flex-col overflow-hidden p-5 transition-transform duration-500 hover:-translate-y-1"
    >
      {/* Orbital Pastel Arc behind the plate */}
      <svg
        className="pointer-events-none absolute -top-2 left-0 h-[230px] w-full overflow-visible"
        viewBox="0 0 320 220"
        aria-hidden="true"
      >
        <path ref={arcPathRef} fill={dish.accent} style={{ opacity: 0.36 }} />
      </svg>

      {/* Top Row: Category Pill + Price Badge */}
      <div className="relative z-10 flex items-center justify-between gap-2">
        <span className="dsh-pill font-semibold tracking-wide">{dish.eyebrow ?? `#${index + 1} Dish`}</span>
        <span
          className="rounded-full px-3 py-1 text-xs font-bold tracking-tight"
          style={{
            background: dish.accent,
            color: "#18181b",
          }}
        >
          ${dish.price}
        </span>
      </div>

      {/* Center Stage: Top-Down Cutout Plate + Rating Badge */}
      <div className="relative z-10 my-4 flex items-center justify-between gap-3">
        <div
          ref={plateWrapRef}
          onClick={() => onSelectInOrbit(dish, index)}
          title="Click to spin in Orbit Showcase"
          className="relative h-[138px] w-[138px] shrink-0 cursor-pointer select-none"
          style={{ transformOrigin: "58% -60%" }}
        >
          <img
            src={dish.image}
            alt={`${dish.title} ${dish.subtitle}`}
            width={138}
            height={138}
            draggable={false}
            className="dsh-plate-shadow h-full w-full object-contain"
          />
        </div>

        <div className="flex flex-1 flex-col items-end text-right">
          <RatingBadge rating={dish.rating} accent={dish.accent} scale={0.88} />
          <p className="mt-2.5 text-[15px] font-semibold tracking-[-0.01em]">{dish.chef}</p>
          <p className="text-[11px] text-[var(--color-muted-foreground)]">{dish.kitchen}</p>
          <div className="mt-2 flex flex-wrap justify-end gap-1.5">
            <span className="dsh-pill">{dish.prepTime}</span>
            <span className="dsh-pill">{dish.calories}</span>
          </div>
        </div>
      </div>

      {/* Two-Weight Uppercase Dish Heading */}
      <div className="relative z-10 mb-3">
        <h3 className="m-0">
          <span className="dsh-display-t1 text-[28px]">{dish.title}</span>
          <span className="dsh-display-t2 mt-0.5 text-[32px]">{dish.subtitle}</span>
        </h3>
      </div>

      {/* Card Tabs: Overview | Ingredients | Prep (Exact .dsh-tabs pattern) */}
      <div
        className="relative z-10 mb-3 flex items-center gap-5 border-b pb-2 text-[12px]"
        style={{ borderColor: "color-mix(in oklab, var(--color-foreground) 8%, transparent)" }}
        role="tablist"
      >
        {(["overview", "ingredients", "steps"] as const).map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className="cursor-pointer border-0 bg-transparent p-0 capitalize transition-colors"
            style={{
              color: tab === t ? "var(--color-foreground)" : "var(--color-muted-foreground)",
              fontWeight: tab === t ? 600 : 500,
            }}
          >
            {t === "steps" ? "Method" : t}
          </button>
        ))}
      </div>

      {/* Tab Body */}
      <div className="relative z-10 min-h-[76px] flex-1">
        {tab === "overview" && (
          <div>
            <p className="m-0 text-[12.5px] leading-[1.45] opacity-90">{dish.description}</p>
            {dish.pairing && (
              <p className="mt-2 text-[11px] text-[var(--color-muted-foreground)]">
                Sommelier Pairing: <strong className="text-[var(--color-foreground)]">{dish.pairing}</strong>
              </p>
            )}
          </div>
        )}
        {tab === "ingredients" && (
          <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0">
            {dish.ingredients?.map((ing) => (
              <li key={ing} className="dsh-pill">
                {ing}
              </li>
            ))}
          </ul>
        )}
        {tab === "steps" && (
          <ol className="m-0 space-y-1.5 pl-4 text-[11.5px] leading-[1.4] opacity-90">
            {(dish.steps ?? []).slice(0, 3).map((s, idx) => (
              <li key={idx}>{s}</li>
            ))}
          </ol>
        )}
      </div>

      {/* Bottom Actions: Like/Meh + Play Video + Order Food */}
      <div
        className="relative z-10 mt-4 flex items-center justify-between gap-2 border-t pt-3.5"
        style={{ borderColor: "color-mix(in oklab, var(--color-foreground) 7%, transparent)" }}
      >
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            aria-pressed={liked}
            onClick={() => {
              setLiked((v) => !v)
              setDisliked(false)
            }}
            className="dsh-pill-btn !h-[32px] !px-3 !text-[11px]"
            style={liked ? { background: dish.accent, color: "#18181b", borderColor: "transparent" } : undefined}
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8">
              <path d="M7 10v10H3.5V10zM7 10l4-7c1.6 0 2.6 1.2 2.2 2.8L12.6 9H19a2 2 0 0 1 2 2.3l-1.3 7A2 2 0 0 1 17.7 20H7" />
            </svg>
            {dish.likes + (liked ? 1 : 0)}
          </button>
          <button
            type="button"
            aria-pressed={disliked}
            aria-label="Not for me"
            onClick={() => {
              setDisliked((v) => !v)
              setLiked(false)
            }}
            className="dsh-pill-btn !h-[32px] !w-[32px] !justify-center !p-0"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill={disliked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8">
              <path d="M17 14V4h3.5v10zM17 14l-4 7c-1.6 0-2.6-1.2-2.2-2.8l.6-3.2H5a2 2 0 0 1-2-2.3l1.3-7A2 2 0 0 1 6.3 4H17" />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onPlay(dish)}
            className="dsh-pill-btn !h-[32px] !px-3 !text-[11.5px]"
          >
            <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24">
              <path d="M6 3.5v17l14-8.5z" />
            </svg>
            Video
          </button>
          <button
            type="button"
            onClick={() => onOrder(dish)}
            className="dsh-pill-btn !h-[32px] !px-3.5 !text-[11.5px] !font-semibold"
            style={{
              background: "var(--color-foreground)",
              color: "var(--color-background)",
            }}
          >
            <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24">
              <path d="M12 5 3 15h18zM3 18h18v2.5H3z" />
            </svg>
            Order
          </button>
        </div>
      </div>
    </article>
  )
}

/* -------------------------------------------------------------------------- */
/*  Interactive 5-Course Tasting Journey (Same Orbit Swing + Wipe Mechanics)  */
/* -------------------------------------------------------------------------- */

const TASTING_COURSE_IDS = ["salad", "truffle-egg", "halibut", "ribeye", "matcha-torte"]

export function InteractiveTastingStage({
  onPlay,
  onOrder,
  onOrderFullTasting,
}: {
  onPlay: (dish: ExtendedDish) => void
  onOrder: (dish: ExtendedDish) => void
  onOrderFullTasting: (courses: ExtendedDish[]) => void
}) {
  const courses = useMemo(
    () =>
      TASTING_COURSE_IDS.map((id) => ALL_DISHES.find((d) => d.id === id)!).filter(Boolean),
    []
  )
  const [courseIdx, setCourseIdx] = useState(0)
  const prevIdx = useRef(0)
  const plateRef = useRef<HTMLDivElement | null>(null)
  const arcRef = useRef<SVGPathElement | null>(null)
  const arcAngles = useRef({ a0: 45, a1: 115 })

  const activeCourse = courses[courseIdx] ?? courses[0]

  const drawArc = () => {
    arcRef.current?.setAttribute("d", arcPath(arcAngles.current.a0, arcAngles.current.a1, 210, -140, 340, 74, 44))
  }

  useLayoutEffect(() => {
    const dir = courseIdx >= prevIdx.current ? 1 : -1
    prevIdx.current = courseIdx
    drawArc()
    const tl = gsap.timeline()
    if (plateRef.current) {
      tl.fromTo(
        plateRef.current,
        { rotation: -38 * dir, autoAlpha: 0.2, scale: 0.9 },
        { rotation: 0, autoAlpha: 1, scale: 1, duration: 0.85, ease: "power3.out" },
        0
      )
    }
    tl.to(
      arcAngles.current,
      { a0: 34, a1: 142, duration: 0.35, ease: "power2.inOut", onUpdate: drawArc },
      0
    ).to(
      arcAngles.current,
      {
        a0: 44 + (courseIdx % 3) * 6,
        a1: 112 + (courseIdx % 2) * 14,
        duration: 0.65,
        ease: "power3.out",
        onUpdate: drawArc,
      },
      0.35
    )
    if (arcRef.current) {
      tl.to(arcRef.current, { fill: activeCourse.accent, duration: 0.7, ease: "power2.out" }, 0)
    }
    return () => {
      tl.kill()
    }
  }, [courseIdx, activeCourse])

  return (
    <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <TwoWeightHeading
          eyebrow="Chef's Five-Act Progression"
          title="Tasting"
          subtitle="Odyssey"
          triggerKey={courseIdx}
        />
        <div className="flex flex-wrap items-center gap-3">
          <div className="dsh-glass-card flex items-center gap-3 px-4 py-2.5 text-xs">
            <span className="opacity-70">5 Courses + Wine Flight</span>
            <strong className="text-sm font-bold">$165 / guest</strong>
          </div>
          <button
            type="button"
            onClick={() => onOrderFullTasting(courses)}
            className="dsh-pill-btn !h-10 !px-5 !text-xs !font-semibold"
            style={{ background: "var(--color-foreground)", color: "var(--color-background)" }}
          >
            <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 5 3 15h18zM3 18h18v2.5H3z" />
            </svg>
            Order All 5 Courses
          </button>
        </div>
      </div>

      {/* Course Selector Strip (Like .dsh-strip thumbnails) */}
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {courses.map((c, i) => {
          const active = i === courseIdx
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setCourseIdx(i)}
              className="dsh-glass-card flex items-center gap-3 p-3 text-left transition-all cursor-pointer"
              style={
                active
                  ? {
                      borderColor: c.accent,
                      boxShadow: `0 12px 28px -14px ${c.accent}`,
                      transform: "translateY(-2px)",
                    }
                  : { opacity: 0.72 }
              }
            >
              <img src={c.image} alt="" className="dsh-plate-shadow h-12 w-12 shrink-0 object-contain" />
              <div className="min-w-0">
                <span className="block text-[10px] font-bold uppercase tracking-wider opacity-65">
                  Act 0{i + 1}
                </span>
                <span className="block truncate text-xs font-semibold">
                  {c.title} {c.subtitle}
                </span>
              </div>
            </button>
          )
        })}
      </div>

      {/* Active Course Orbital Showcase Stage */}
      <div className="dsh-glass-strong relative overflow-hidden p-6 sm:p-10">
        <svg
          className="pointer-events-none absolute left-0 top-0 h-full w-full overflow-visible"
          viewBox="0 0 800 420"
          aria-hidden="true"
        >
          <path ref={arcRef} fill={activeCourse.accent} style={{ opacity: 0.34 }} />
        </svg>

        <div className="relative z-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
          {/* Swinging Cutout Plate */}
          <div className="flex flex-col items-center justify-center lg:col-span-4">
            <div
              ref={plateRef}
              style={{ transformOrigin: "65% -150%" }}
              className="relative h-[220px] w-[220px] sm:h-[245px] sm:w-[245px]"
            >
              <img
                src={activeCourse.image}
                alt={`${activeCourse.title} ${activeCourse.subtitle}`}
                className="dsh-plate-shadow h-full w-full object-contain"
                draggable={false}
              />
            </div>

            <div className="mt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setCourseIdx((v) => (v - 1 + courses.length) % courses.length)}
                className="dsh-pill-btn !h-9 !w-9 !justify-center !p-0"
                aria-label="Previous course"
              >
                ←
              </button>
              <span className="text-xs font-semibold tracking-wide">
                Course 0{courseIdx + 1} of 0{courses.length}
              </span>
              <button
                type="button"
                onClick={() => setCourseIdx((v) => (v + 1) % courses.length)}
                className="dsh-pill-btn !h-9 !w-9 !justify-center !p-0"
                aria-label="Next course"
              >
                →
              </button>
            </div>
          </div>

          {/* Center Two-Weight Title & Story */}
          <div className="lg:col-span-5">
            <TwoWeightHeading
              eyebrow={`Course 0${courseIdx + 1} • ${activeCourse.kitchen}`}
              title={activeCourse.title}
              subtitle={activeCourse.subtitle}
              maxSize={48}
              triggerKey={`stage-${activeCourse.id}`}
            />
            <p className="mt-4 text-sm leading-relaxed opacity-90">{activeCourse.description}</p>

            {/* Step-by-step culinary method */}
            <div className="mt-5 space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-wider opacity-60">Plating & Execution</p>
              {(activeCourse.steps ?? []).map((step, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs leading-relaxed">
                  <span
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                    style={{ background: activeCourse.accent, color: "#18181b" }}
                  >
                    {idx + 1}
                  </span>
                  <span className="opacity-90">{step}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button type="button" onClick={() => onPlay(activeCourse)} className="dsh-pill-btn">
                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M6 3.5v17l14-8.5z" />
                </svg>
                Play Masterclass ({activeCourse.videoLength ?? "02:30"})
              </button>
              <button
                type="button"
                onClick={() => onOrder(activeCourse)}
                className="dsh-pill-btn !font-semibold"
                style={{ background: activeCourse.accent, color: "#18181b", borderColor: "transparent" }}
              >
                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 5 3 15h18zM3 18h18v2.5H3z" />
                </svg>
                Order Dish (${activeCourse.price})
              </button>
            </div>
          </div>

          {/* Right Inspector Card (Exact .dsh-card structure) */}
          <div className="dsh-glass-card p-5 lg:col-span-3">
            <div className="mb-3 flex items-start justify-between">
              <RatingBadge rating={activeCourse.rating} accent={activeCourse.accent} />
              <span className="dsh-pill font-semibold">{activeCourse.category}</span>
            </div>
            <p className="text-lg font-semibold">{activeCourse.chef}</p>
            <p className="text-xs text-[var(--color-muted-foreground)]">{activeCourse.kitchen}</p>

            <div className="my-4 space-y-2 border-y py-3 text-xs" style={{ borderColor: "color-mix(in oklab, var(--color-foreground) 8%, transparent)" }}>
              <div className="flex justify-between">
                <span className="opacity-65">Prep Window</span>
                <span className="font-semibold">{activeCourse.prepTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-65">Energy</span>
                <span className="font-semibold">{activeCourse.calories}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="opacity-65">Pairing</span>
                <span className="text-right font-semibold">{activeCourse.pairing}</span>
              </div>
            </div>

            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider opacity-65">Key Elements</p>
            <div className="flex flex-wrap gap-1.5">
              {activeCourse.ingredients?.map((ing) => (
                <span key={ing} className="dsh-pill">
                  {ing}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Master Chefs & Kitchens Page                                              */
/* -------------------------------------------------------------------------- */

export function ChefsAtelierSection({
  onSelectDishInOrbit,
  onPlayDish,
}: {
  onSelectDishInOrbit: (dish: ExtendedDish, index: number) => void
  onPlayDish: (dish: ExtendedDish) => void
}) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <TwoWeightHeading
          eyebrow="Five Partner Kitchens • One Smart Display"
          title="Culinary"
          subtitle="Masters"
        />
        <p className="max-w-md text-xs leading-relaxed text-[var(--color-muted-foreground)]">
          Every dish in the Orbit Carousel is crafted by a specialist brigade—from open-hearth white oak grilling to
          hyper-seasonal hydroponic botanicals.
        </p>
      </div>

      {/* Live Kitchen Telemetry Bar */}
      <div className="dsh-glass-card mb-8 grid grid-cols-2 gap-4 p-4 sm:grid-cols-4">
        {[
          { label: "White Oak Hearth", val: "450°C Active", dot: "#e8a598" },
          { label: "Tonkotsu Kettle", val: "18h Emulsion", dot: "#e8c589" },
          { label: "Rooftop Botanicals", val: "Harvested 06:00", dot: "#a8d5ba" },
          { label: "Alba Truffle Vault", val: "12°C Humidity 82%", dot: "#d9c2e8" },
        ].map((stat) => (
          <div key={stat.label} className="flex items-center gap-3">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: stat.dot }} />
            <div>
              <p className="text-[11px] text-[var(--color-muted-foreground)]">{stat.label}</p>
              <p className="text-xs font-semibold">{stat.val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Chef Cards Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {CHEF_PROFILES.map((chef: ChefProfile) => {
          const sigIndex = ALL_DISHES.findIndex((d) => d.id === chef.signatureDishId)
          const sigDish = ALL_DISHES[sigIndex >= 0 ? sigIndex : 0]
          return (
            <div key={chef.name} className="dsh-glass-card relative flex flex-col justify-between overflow-hidden p-6">
              <svg
                className="pointer-events-none absolute -right-8 -top-6 h-[180px] w-[260px] overflow-visible"
                viewBox="0 0 260 180"
                aria-hidden="true"
              >
                <path d={arcPath(36, 128, 150, -40, 160, 42, 32)} fill={chef.accent} style={{ opacity: 0.34 }} />
              </svg>

              <div>
                <div className="relative z-10 flex items-start justify-between gap-4">
                  <RatingBadge rating={chef.rating} accent={chef.accent} scale={0.9} />
                  <span className="dsh-pill font-semibold">{chef.kitchen}</span>
                </div>

                <div className="relative z-10 mt-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wider opacity-65">{chef.role}</p>
                  <h3 className="mt-0.5 text-xl font-bold tracking-tight">{chef.name}</h3>
                  <p className="mt-1 text-[11px] font-medium" style={{ color: "var(--color-muted-foreground)" }}>
                    {chef.awards}
                  </p>
                  <p className="mt-3 text-xs leading-relaxed opacity-90">{chef.bio}</p>
                </div>
              </div>

              {/* Signature Dish Preview Box */}
              {sigDish && (
                <div
                  className="relative z-10 mt-5 flex items-center justify-between gap-3 rounded-2xl p-3"
                  style={{ background: "color-mix(in oklab, var(--color-foreground) 5%, transparent)" }}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={sigDish.image}
                      alt={sigDish.subtitle}
                      className="dsh-plate-shadow h-14 w-14 shrink-0 object-contain"
                    />
                    <div>
                      <span className="block text-[10px] font-semibold uppercase opacity-60">Signature Plate</span>
                      <span className="block text-xs font-bold">
                        {sigDish.title} {sigDish.subtitle}
                      </span>
                      <span className="block text-[11px] opacity-75">${sigDish.price} • {sigDish.prepTime}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <button
                      type="button"
                      onClick={() => onSelectDishInOrbit(sigDish, sigIndex >= 0 ? sigIndex : 0)}
                      className="dsh-pill-btn !h-7 !px-2.5 !text-[10.5px] !font-semibold"
                      style={{ background: chef.accent, color: "#18181b", borderColor: "transparent" }}
                    >
                      Orbit ↗
                    </button>
                    <button
                      type="button"
                      onClick={() => onPlayDish(sigDish)}
                      className="dsh-pill-btn !h-7 !px-2.5 !text-[10.5px]"
                    >
                      Recipe
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Interactive Table & Chef's Counter Reservation Page                       */
/* -------------------------------------------------------------------------- */

const DINING_ZONES = [
  {
    id: "counter",
    name: "Chef's Orbit Counter",
    seats: "Front-row kitchen bar • Interactive smart menu",
    accent: "#e8a598",
    dishIdx: 0,
  },
  {
    id: "hearth",
    name: "Ember & Oak Salon",
    seats: "Open-fire dining room • Warm cedar acoustics",
    accent: "#f5c489",
    dishIdx: 3,
  },
  {
    id: "botanical",
    name: "Verde Glasshouse",
    seats: "Biodynamic conservatory • Natural daylight & mist",
    accent: "#a8d5ba",
    dishIdx: 1,
  },
  {
    id: "cellar",
    name: "Sommelier Truffle Vault",
    seats: "Intimate private table • Rare vintage pairings",
    accent: "#d9c2e8",
    dishIdx: 4,
  },
]

export function ReservationSection() {
  const [zoneId, setZoneId] = useState("counter")
  const [guests, setGuests] = useState(2)
  const [date, setDate] = useState("2026-11-14")
  const [time, setTime] = useState("19:30")
  const [name, setName] = useState("")
  const [notes, setNotes] = useState("")
  const [confirmed, setConfirmed] = useState<null | { code: string; zone: string; guests: number; date: string; time: string }>(null)

  const activeZone = DINING_ZONES.find((z) => z.id === zoneId) ?? DINING_ZONES[0]
  const previewDish = ALL_DISHES[activeZone.dishIdx] ?? ALL_DISHES[0]

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault()
    setConfirmed({
      code: "ORB-" + Math.floor(1000 + Math.random() * 9000),
      zone: activeZone.name,
      guests,
      date,
      time,
    })
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <TwoWeightHeading
          eyebrow="Smart Kitchen Hospitality"
          title="Reserve"
          subtitle="Chef's Table"
          triggerKey={zoneId}
        />
        <p className="max-w-md text-xs leading-relaxed text-[var(--color-muted-foreground)]">
          Choose your dining atmosphere and pre-sync your table's interactive Dish Orbit display before arrival.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left: Interactive Zone Picker + Orbital Dish Preview */}
        <div className="space-y-4 lg:col-span-5">
          {DINING_ZONES.map((z) => {
            const selected = z.id === zoneId
            const dish = ALL_DISHES[z.dishIdx]
            return (
              <button
                key={z.id}
                type="button"
                onClick={() => {
                  setZoneId(z.id)
                  setConfirmed(null)
                }}
                className="dsh-glass-card relative flex w-full cursor-pointer items-center justify-between gap-4 overflow-hidden p-4 text-left transition-all"
                style={
                  selected
                    ? {
                        borderColor: z.accent,
                        boxShadow: `0 14px 32px -16px ${z.accent}`,
                      }
                    : { opacity: 0.78 }
                }
              >
                <div className="flex items-center gap-3.5">
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold"
                    style={{ background: z.accent, color: "#18181b" }}
                  >
                    0{DINING_ZONES.indexOf(z) + 1}
                  </span>
                  <div>
                    <p className="text-sm font-bold">{z.name}</p>
                    <p className="text-[11px] text-[var(--color-muted-foreground)]">{z.seats}</p>
                  </div>
                </div>
                {dish && (
                  <img
                    src={dish.image}
                    alt=""
                    className="dsh-plate-shadow h-12 w-12 shrink-0 object-contain transition-transform duration-500"
                    style={{ transform: selected ? "scale(1.1) rotate(12deg)" : "scale(0.95)" }}
                  />
                )}
              </button>
            )
          })}
        </div>

        {/* Right: Booking Glass Card */}
        <div className="dsh-glass-strong relative overflow-hidden p-6 sm:p-8 lg:col-span-7">
          <svg
            className="pointer-events-none absolute -right-10 -top-10 h-[280px] w-[380px] overflow-visible"
            viewBox="0 0 380 280"
            aria-hidden="true"
          >
            <path d={arcPath(38, 134, 220, -40, 220, 56, 36)} fill={activeZone.accent} style={{ opacity: 0.32 }} />
          </svg>

          {confirmed ? (
            <div className="relative z-10 py-6 text-center">
              <div
                className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl text-2xl font-bold"
                style={{ background: activeZone.accent, color: "#18181b" }}
              >
                ✓
              </div>
              <p className="text-xs font-semibold uppercase tracking-widest opacity-65">Table Confirmed</p>
              <h3 className="mt-1 text-2xl font-extrabold">{confirmed.zone}</h3>
              <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">
                Reservation Pass <strong className="text-[var(--color-foreground)]">#{confirmed.code}</strong>
              </p>

              <div className="dsh-glass-card mx-auto my-6 grid max-w-md grid-cols-3 gap-2 p-4 text-xs">
                <div>
                  <span className="block opacity-60">Date</span>
                  <strong>{confirmed.date}</strong>
                </div>
                <div>
                  <span className="block opacity-60">Seating</span>
                  <strong>{confirmed.time}</strong>
                </div>
                <div>
                  <span className="block opacity-60">Party</span>
                  <strong>{confirmed.guests} Guests</strong>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setConfirmed(null)}
                className="dsh-pill-btn !px-5"
              >
                Modify Reservation
              </button>
            </div>
          ) : (
            <form onSubmit={handleBook} className="relative z-10 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider opacity-65">Selected Zone</span>
                  <h3 className="text-xl font-bold">{activeZone.name}</h3>
                </div>
                <RatingBadge rating={previewDish.rating} accent={activeZone.accent} scale={0.82} />
              </div>

              {/* Guest Count */}
              <div>
                <label className="mb-2 block text-xs font-semibold">Party Size</label>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5, 6, 8].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setGuests(n)}
                      className="dsh-pill-btn !h-9 !px-3.5"
                      style={
                        guests === n
                          ? { background: activeZone.accent, color: "#18181b", borderColor: "transparent", fontWeight: 700 }
                          : undefined
                      }
                    >
                      {n} {n === 1 ? "Guest" : "Guests"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-xl border px-3.5 py-2 text-xs outline-none"
                    style={{
                      background: "color-mix(in oklab, var(--color-foreground) 5%, transparent)",
                      borderColor: "color-mix(in oklab, var(--color-foreground) 12%, transparent)",
                      color: "var(--color-foreground)",
                    }}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold">Seating Window</label>
                  <div className="flex flex-wrap gap-1.5">
                    {["18:00", "19:30", "20:45", "22:00"].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTime(t)}
                        className="dsh-pill-btn !h-8 !px-3 !text-[11px]"
                        style={
                          time === t
                            ? { background: "var(--color-foreground)", color: "var(--color-background)" }
                            : undefined
                        }
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Guest Name & Notes */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold">Guest Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aarav Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border px-3.5 py-2.5 text-xs outline-none"
                    style={{
                      background: "color-mix(in oklab, var(--color-foreground) 5%, transparent)",
                      borderColor: "color-mix(in oklab, var(--color-foreground) 12%, transparent)",
                      color: "var(--color-foreground)",
                    }}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold">Dietary or Celebration Note</label>
                  <input
                    type="text"
                    placeholder="Allergies, wine preference, occasion..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full rounded-xl border px-3.5 py-2.5 text-xs outline-none"
                    style={{
                      background: "color-mix(in oklab, var(--color-foreground) 5%, transparent)",
                      borderColor: "color-mix(in oklab, var(--color-foreground) 12%, transparent)",
                      color: "var(--color-foreground)",
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-[var(--color-muted-foreground)]">
                  Complimentary welcome yuzu aperitif included
                </span>
                <button
                  type="submit"
                  className="dsh-pill-btn !h-10 !px-6 !text-xs !font-bold"
                  style={{ background: activeZone.accent, color: "#18181b", borderColor: "transparent" }}
                >
                  Confirm Table Reservation
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Smart Kitchen Search Modal (⌘K + Live Orbital Plate Preview)              */
/* -------------------------------------------------------------------------- */

const POPULAR_INGREDIENTS = [
  "Prime Ribeye",
  "Black Truffle",
  "Yuzu Citrus",
  "Pacific Halibut",
  "Maine Lobster",
  "Uji Matcha",
  "18h Tonkotsu Broth",
  "Blood Orange",
]

export function SearchModal({
  open,
  onClose,
  onSelectDishInOrbit,
  onPlayDish,
  onOrderDish,
}: {
  open: boolean
  onClose: () => void
  onSelectDishInOrbit: (dish: ExtendedDish, index: number) => void
  onPlayDish: (dish: ExtendedDish) => void
  onOrderDish: (dish: ExtendedDish) => void
}) {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState<string>("All")
  const [previewId, setPreviewId] = useState<string>(ALL_DISHES[0].id)
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return ALL_DISHES.filter((d) => {
      if (category !== "All" && d.category !== category) return false
      if (!q) return true
      const hay = [
        d.title,
        d.subtitle,
        d.chef,
        d.kitchen,
        d.description,
        d.category,
        ...(d.ingredients ?? []),
      ]
        .join(" ")
        .toLowerCase()
      return hay.includes(q)
    })
  }, [query, category])

  const previewDish = useMemo(
    () => filtered.find((d) => d.id === previewId) ?? filtered[0] ?? ALL_DISHES[0],
    [filtered, previewId]
  )

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(10, 10, 14, 0.55)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        className="dsh-glass-strong relative max-h-[88vh] w-full max-w-4xl overflow-hidden p-5 sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Search Input */}
        <div className="flex items-center gap-3 border-b pb-4" style={{ borderColor: "color-mix(in oklab, var(--color-foreground) 10%, transparent)" }}>
          <svg className="h-5 w-5 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="6.5" />
            <path d="m16 16 4 4" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search dishes, chefs, kitchens, or ingredients (e.g. Truffle, Ribeye, Matcha)..."
            className="flex-1 border-0 bg-transparent text-sm font-medium outline-none"
            style={{ color: "var(--color-foreground)" }}
          />
          {query && (
            <button type="button" onClick={() => setQuery("")} className="dsh-pill-btn !h-7 !px-2.5 !text-[11px]">
              Clear
            </button>
          )}
          <button type="button" onClick={onClose} className="dsh-pill-btn !h-8 !px-3 !text-xs">
            ESC
          </button>
        </div>

        {/* Category + Ingredient Quick Pills */}
        <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
          {["All", "Signature", "Mains", "Seafood", "Botanical", "Dessert"].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className="dsh-pill-btn !h-7 !px-3 !text-[11px]"
              data-active={category === cat}
            >
              {cat}
            </button>
          ))}
          <span className="mx-1 text-xs opacity-30">|</span>
          {POPULAR_INGREDIENTS.map((ing) => (
            <button
              key={ing}
              type="button"
              onClick={() => setQuery((q) => (q === ing ? "" : ing))}
              className="dsh-pill cursor-pointer border-0 hover:opacity-100"
              style={
                query.toLowerCase() === ing.toLowerCase()
                  ? { background: previewDish.accent, color: "#18181b", fontWeight: 600 }
                  : { opacity: 0.75 }
              }
            >
              #{ing}
            </button>
          ))}
        </div>

        {/* Results + Live Orbital Preview Pane */}
        <div className="mt-5 grid max-h-[58vh] grid-cols-1 gap-5 overflow-y-auto md:grid-cols-12">
          {/* Left: Matching Dishes */}
          <div className="space-y-2 md:col-span-7">
            {filtered.length === 0 ? (
              <div className="py-12 text-center text-xs opacity-65">
                No dishes matched "{query}". Try another ingredient or chef.
              </div>
            ) : (
              filtered.map((d) => {
                const origIdx = ALL_DISHES.findIndex((x) => x.id === d.id)
                const active = previewDish.id === d.id
                return (
                  <div
                    key={d.id}
                    onMouseEnter={() => setPreviewId(d.id)}
                    onClick={() => {
                      onSelectDishInOrbit(d, origIdx >= 0 ? origIdx : 0)
                      onClose()
                    }}
                    className="dsh-glass-card flex cursor-pointer items-center justify-between gap-3 p-3 transition-all"
                    style={
                      active
                        ? { borderColor: d.accent, background: "color-mix(in oklab, var(--color-foreground) 7%, transparent)" }
                        : undefined
                    }
                  >
                    <div className="flex items-center gap-3">
                      <img src={d.image} alt="" className="dsh-plate-shadow h-12 w-12 shrink-0 object-contain" />
                      <div>
                        <p className="text-xs font-bold uppercase tracking-tight">
                          <span className="font-light">{d.title}</span> {d.subtitle}
                        </p>
                        <p className="text-[11px] text-[var(--color-muted-foreground)]">
                          {d.chef} • {d.kitchen}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="rounded-lg px-2 py-1 text-[11px] font-bold"
                        style={{ background: d.accent, color: "#18181b" }}
                      >
                        ★ {d.rating.toFixed(1)}
                      </span>
                      <span className="text-xs font-bold">${d.price}</span>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Right: Live Orbital Preview Card */}
          <div className="dsh-glass-card relative hidden flex-col justify-between overflow-hidden p-5 md:flex md:col-span-5">
            <svg
              className="pointer-events-none absolute -top-4 left-0 h-[200px] w-full overflow-visible"
              viewBox="0 0 300 200"
              aria-hidden="true"
            >
              <path d={arcPath(42, 128, 150, -70, 190, 44, 32)} fill={previewDish.accent} style={{ opacity: 0.38 }} />
            </svg>

            <div className="relative z-10">
              <div className="flex items-start justify-between">
                <RatingBadge rating={previewDish.rating} accent={previewDish.accent} scale={0.85} />
                <img
                  src={previewDish.image}
                  alt=""
                  className="dsh-plate-shadow h-28 w-28 object-contain transition-transform duration-500"
                />
              </div>

              <div className="mt-3">
                <span className="dsh-display-t1 text-2xl">{previewDish.title}</span>
                <span className="dsh-display-t2 text-3xl">{previewDish.subtitle}</span>
              </div>
              <p className="mt-2 text-xs leading-relaxed opacity-85">{previewDish.description}</p>

              <div className="mt-3 flex flex-wrap gap-1">
                {previewDish.ingredients?.map((i) => (
                  <span key={i} className="dsh-pill">
                    {i}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative z-10 mt-5 flex flex-wrap gap-2 pt-3 border-t" style={{ borderColor: "color-mix(in oklab, var(--color-foreground) 8%, transparent)" }}>
              <button
                type="button"
                onClick={() => {
                  const idx = ALL_DISHES.findIndex((x) => x.id === previewDish.id)
                  onSelectDishInOrbit(previewDish, idx >= 0 ? idx : 0)
                  onClose()
                }}
                className="dsh-pill-btn flex-1 !justify-center !text-[11px] !font-semibold"
                style={{ background: previewDish.accent, color: "#18181b", borderColor: "transparent" }}
              >
                Spin in Orbit
              </button>
              <button
                type="button"
                onClick={() => {
                  onClose()
                  onPlayDish(previewDish)
                }}
                className="dsh-pill-btn !text-[11px]"
              >
                Video
              </button>
              <button
                type="button"
                onClick={() => {
                  onOrderDish(previewDish)
                  onClose()
                }}
                className="dsh-pill-btn !text-[11px] !font-semibold"
              >
                + ${previewDish.price}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Chef Masterclass Video & Step-by-Step Recipe Modal (onPlay)               */
/* -------------------------------------------------------------------------- */

export function VideoRecipeModal({
  dish,
  onClose,
  onOrder,
}: {
  dish: ExtendedDish | null
  onClose: () => void
  onOrder: (dish: ExtendedDish) => void
}) {
  const [activeStep, setActiveStep] = useState(0)
  const [playing, setPlaying] = useState(true)

  useEffect(() => {
    setActiveStep(0)
    setPlaying(true)
  }, [dish])

  useEffect(() => {
    if (!dish || !playing) return
    const stepsCount = dish.steps?.length ?? 4
    const timer = setInterval(() => {
      setActiveStep((s) => (s + 1) % stepsCount)
    }, 3600)
    return () => clearInterval(timer)
  }, [dish, playing])

  if (!dish) return null

  const steps = dish.steps ?? [
    "Prepare fresh seasonal ingredients to room temperature.",
    "Sear with precision over controlled kitchen heat.",
    "Emulsify signature reduction and finish tableside.",
  ]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(10, 10, 14, 0.6)", backdropFilter: "blur(10px)" }}
      onClick={onClose}
    >
      <div
        className="dsh-glass-strong relative max-h-[90vh] w-full max-w-3xl overflow-y-auto p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <svg
          className="pointer-events-none absolute left-0 top-0 h-[280px] w-full overflow-visible"
          viewBox="0 0 700 280"
          aria-hidden="true"
        >
          <path d={arcPath(38, 142, 200, -100, 290, 68, 40)} fill={dish.accent} style={{ opacity: 0.36 }} />
        </svg>

        <div className="relative z-10 flex items-center justify-between gap-4">
          <span className="dsh-pill font-semibold">
            Smart Kitchen Masterclass • {dish.videoLength ?? "02:45"}
          </span>
          <button type="button" onClick={onClose} className="dsh-pill-btn !h-8 !px-3">
            Close ✕
          </button>
        </div>

        <div className="relative z-10 mt-6 grid grid-cols-1 items-center gap-8 md:grid-cols-12">
          {/* Animated Rotating Plate Preview */}
          <div className="flex flex-col items-center md:col-span-5">
            <div className="relative h-48 w-48">
              <img
                src={dish.image}
                alt={dish.subtitle}
                className="dsh-plate-shadow h-full w-full object-contain transition-transform duration-700"
                style={{
                  transform: `rotate(${activeStep * 28}deg) scale(${playing ? 1.04 : 0.98})`,
                }}
              />
            </div>
            <div className="mt-4 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPlaying((p) => !p)}
                className="dsh-pill-btn !h-8 !px-4 !text-xs !font-semibold"
                style={{ background: dish.accent, color: "#18181b", borderColor: "transparent" }}
              >
                {playing ? "❚❚ Pause" : "▶ Resume"}
              </button>
              <span className="dsh-pill">
                Step {activeStep + 1} / {steps.length}
              </span>
            </div>
          </div>

          {/* Recipe Info & Interactive Steps */}
          <div className="md:col-span-7">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="dsh-display-t1 text-3xl">{dish.title}</span>
                <span className="dsh-display-t2 text-4xl">{dish.subtitle}</span>
                <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">
                  Guided by <strong className="text-[var(--color-foreground)]">{dish.chef}</strong> • {dish.kitchen}
                </p>
              </div>
              <RatingBadge rating={dish.rating} accent={dish.accent} scale={0.85} />
            </div>

            <div className="mt-5 space-y-2.5">
              {steps.map((step, i) => {
                const current = i === activeStep
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveStep(i)}
                    className="dsh-glass-card flex w-full cursor-pointer items-start gap-3 p-3 text-left transition-all"
                    style={
                      current
                        ? { borderColor: dish.accent, boxShadow: `0 8px 20px -10px ${dish.accent}` }
                        : { opacity: 0.65 }
                    }
                  >
                    <span
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                      style={{
                        background: current ? dish.accent : "color-mix(in oklab, var(--color-foreground) 10%, transparent)",
                        color: "#18181b",
                      }}
                    >
                      {i + 1}
                    </span>
                    <span className="text-xs leading-relaxed">{step}</span>
                  </button>
                )
              })}
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 pt-3 border-t" style={{ borderColor: "color-mix(in oklab, var(--color-foreground) 8%, transparent)" }}>
              <div className="text-xs">
                <span className="opacity-65">Prep: </span>
                <strong>{dish.prepTime}</strong>
                <span className="mx-2 opacity-30">•</span>
                <span className="opacity-65">Energy: </span>
                <strong>{dish.calories}</strong>
              </div>
              <button
                type="button"
                onClick={() => {
                  onOrder(dish)
                  onClose()
                }}
                className="dsh-pill-btn !h-9 !px-5 !text-xs !font-bold"
                style={{ background: "var(--color-foreground)", color: "var(--color-background)" }}
              >
                Order This Plate (${dish.price})
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Smart Kitchen Order & Live Prep Telemetry Drawer (onOrder)                */
/* -------------------------------------------------------------------------- */

export function OrderDrawer({
  open,
  onClose,
  cart,
  onUpdateQty,
  onClearCart,
}: {
  open: boolean
  onClose: () => void
  cart: CartItem[]
  onUpdateQty: (dishId: string, delta: number) => void
  onClearCart: () => void
}) {
  const [diningMode, setDiningMode] = useState<"Table 04" | "Chef Counter" | "Takeaway">("Table 04")
  const [orderStage, setOrderStage] = useState<number | null>(null)

  useEffect(() => {
    if (orderStage === null || orderStage >= 3) return
    const t = setTimeout(() => setOrderStage((s) => (s !== null ? s + 1 : null)), 2200)
    return () => clearTimeout(t)
  }, [orderStage])

  if (!open) return null

  const subtotal = cart.reduce((acc, item) => acc + item.dish.price * item.qty, 0)

  const handleCheckout = () => {
    setOrderStage(0)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      style={{ background: "rgba(10, 10, 14, 0.5)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <aside
        className="dsh-glass-strong relative flex h-full w-full max-w-md flex-col justify-between rounded-none sm:rounded-l-3xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: "color-mix(in oklab, var(--color-foreground) 10%, transparent)" }}>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider opacity-60">Smart Kitchen Ticket</p>
              <h3 className="text-xl font-extrabold">Your Dining Order</h3>
            </div>
            <button type="button" onClick={onClose} className="dsh-pill-btn !h-8 !px-3">
              ✕
            </button>
          </div>

          {/* Service Mode Selector */}
          <div className="mt-4 flex gap-1.5">
            {(["Table 04", "Chef Counter", "Takeaway"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setDiningMode(m)}
                className="dsh-pill-btn flex-1 !justify-center !h-8 !text-[11px]"
                data-active={diningMode === m}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Cart Items or Live Kitchen Tracker */}
        <div className="my-4 flex-1 overflow-y-auto pr-1">
          {orderStage !== null ? (
            <div className="py-8 text-center">
              <div className="dsh-glass-card mx-auto mb-6 p-5">
                <p className="text-xs font-bold uppercase tracking-widest opacity-60">Live Kitchen Telemetry</p>
                <h4 className="mt-1 text-lg font-extrabold">{diningMode} • Ticket #K-804</h4>
                <div className="mt-5 space-y-3 text-left">
                  {[
                    "Ticket synced with Smart Kitchen Display",
                    "Brigade firing over white oak embers",
                    "Chef plating & garnish inspection",
                    "Ready for tableside service",
                  ].map((label, idx) => {
                    const done = orderStage >= idx
                    return (
                      <div key={label} className="flex items-center gap-3 text-xs">
                        <span
                          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
                          style={{
                            background: done ? "#a8d5ba" : "color-mix(in oklab, var(--color-foreground) 10%, transparent)",
                            color: "#18181b",
                          }}
                        >
                          {done ? "✓" : idx + 1}
                        </span>
                        <span className={done ? "font-semibold" : "opacity-50"}>{label}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setOrderStage(null)
                  onClearCart()
                  onClose()
                }}
                className="dsh-pill-btn !px-6"
              >
                Done & Start New Ticket
              </button>
            </div>
          ) : cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center opacity-70">
              <p className="text-sm font-semibold">Your kitchen ticket is empty</p>
              <p className="mt-1 max-w-xs text-xs">
                Click "Order food" on any dish in the Orbit Carousel or Menu to add plates.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map(({ dish, qty }) => (
                <div key={dish.id} className="dsh-glass-card flex items-center justify-between gap-3 p-3">
                  <div className="flex items-center gap-3">
                    <img src={dish.image} alt="" className="dsh-plate-shadow h-14 w-14 shrink-0 object-contain" />
                    <div>
                      <p className="text-xs font-bold uppercase">
                        {dish.title} {dish.subtitle}
                      </p>
                      <p className="text-[11px] text-[var(--color-muted-foreground)]">{dish.kitchen}</p>
                      <p className="mt-0.5 text-xs font-semibold">${dish.price * qty}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onUpdateQty(dish.id, -1)}
                      className="dsh-pill-btn !h-7 !w-7 !justify-center !p-0"
                    >
                      −
                    </button>
                    <span className="w-5 text-center text-xs font-bold">{qty}</span>
                    <button
                      type="button"
                      onClick={() => onUpdateQty(dish.id, 1)}
                      className="dsh-pill-btn !h-7 !w-7 !justify-center !p-0"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Checkout */}
        {cart.length > 0 && orderStage === null && (
          <div className="border-t pt-4" style={{ borderColor: "color-mix(in oklab, var(--color-foreground) 10%, transparent)" }}>
            <div className="mb-2 flex justify-between text-xs">
              <span className="opacity-70">Sourdough & Cultured Butter</span>
              <span className="font-semibold">Complimentary</span>
            </div>
            <div className="mb-4 flex justify-between text-sm font-bold">
              <span>Total ({cart.reduce((a, b) => a + b.qty, 0)} plates)</span>
              <span>${subtotal}</span>
            </div>
            <button
              type="button"
              onClick={handleCheckout}
              className="dsh-pill-btn w-full !h-11 !justify-center !text-xs !font-bold"
              style={{ background: "var(--color-foreground)", color: "var(--color-background)" }}
            >
              Send Order to Smart Kitchen →
            </button>
          </div>
        )}
      </aside>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Menu Navigation Drawer (Wired to DishOrbitCarousel's hamburger button)    */
/* -------------------------------------------------------------------------- */

export function MenuNavDrawer({
  open,
  onClose,
  activePage,
  onNavigate,
  onSelectDishInOrbit,
  dark,
  onToggleDark,
}: {
  open: boolean
  onClose: () => void
  activePage: PageId
  onNavigate: (page: PageId) => void
  onSelectDishInOrbit: (dish: ExtendedDish, index: number) => void
  dark: boolean
  onToggleDark: () => void
}) {
  if (!open) return null

  const pages: { id: PageId; title: string; subtitle: string; desc: string }[] = [
    { id: "showcase", title: "Orbit", subtitle: "Showcase", desc: "Interactive 360° dish carousel & full experience" },
    { id: "menu", title: "Culinary", subtitle: "Menu", desc: "All 8 signature plates, filters & ingredient tabs" },
    { id: "tasting", title: "Tasting", subtitle: "Odyssey", desc: "5-course progression with wine pairings" },
    { id: "chefs", title: "Master", subtitle: "Chefs", desc: "Meet the 5 partner kitchens & live telemetry" },
    { id: "reserve", title: "Reserve", subtitle: "Table", desc: "Book Chef's Orbit Counter or private salon" },
  ]

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      style={{ background: "rgba(10, 10, 14, 0.55)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        className="dsh-glass-strong flex h-full w-full max-w-md flex-col justify-between overflow-y-auto rounded-none sm:rounded-l-3xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: "color-mix(in oklab, var(--color-foreground) 10%, transparent)" }}>
            <span className="text-xs font-bold uppercase tracking-widest opacity-70">Atelier Orbit Navigation</span>
            <div className="flex items-center gap-2">
              <button type="button" onClick={onToggleDark} className="dsh-pill-btn !h-8 !px-3 !text-xs">
                {dark ? "☀ Light" : "☾ Dark"}
              </button>
              <button type="button" onClick={onClose} className="dsh-pill-btn !h-8 !px-3">
                ✕
              </button>
            </div>
          </div>

          <div className="mt-5 space-y-2.5">
            {pages.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  onNavigate(p.id)
                  onClose()
                }}
                className="dsh-glass-card flex w-full cursor-pointer items-center justify-between p-3.5 text-left transition-all"
                style={
                  activePage === p.id
                    ? { borderColor: "#e8a598", background: "color-mix(in oklab, var(--color-foreground) 8%, transparent)" }
                    : undefined
                }
              >
                <div>
                  <p className="text-sm uppercase">
                    <span className="font-light">{p.title}</span>{" "}
                    <strong className="font-extrabold">{p.subtitle}</strong>
                  </p>
                  <p className="text-[11px] text-[var(--color-muted-foreground)]">{p.desc}</p>
                </div>
                <span className="text-xs font-bold">→</span>
              </button>
            ))}
          </div>

          <div className="mt-6">
            <p className="mb-2.5 text-[11px] font-bold uppercase tracking-wider opacity-60">
              Quick Jump to Dish in Orbit
            </p>
            <div className="grid grid-cols-2 gap-2">
              {ALL_DISHES.map((d, i) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => {
                    onSelectDishInOrbit(d, i)
                    onClose()
                  }}
                  className="dsh-glass-card flex cursor-pointer items-center gap-2 p-2 text-left"
                >
                  <img src={d.image} alt="" className="h-9 w-9 shrink-0 object-contain" />
                  <span className="truncate text-[11px] font-semibold">
                    {d.title} {d.subtitle}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-[11px] text-[var(--color-muted-foreground)]">
          Smart Kitchen Display System • Press ⌘K to Search
        </p>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Theme-Matched Footer with Orbital Arc & Tasting Club                      */
/* -------------------------------------------------------------------------- */

export function OrbitFooter({
  activeAccent,
  onNavigate,
  onSelectDishInOrbit,
  onOpenSearch,
}: {
  activeAccent: string
  onNavigate: (page: PageId) => void
  onSelectDishInOrbit: (dish: ExtendedDish, index: number) => void
  onOpenSearch: () => void
}) {
  const [email, setEmail] = useState("")
  const [joined, setJoined] = useState(false)

  return (
    <footer className="relative mt-16 overflow-hidden border-t pt-16 pb-12" style={{ borderColor: "color-mix(in oklab, var(--color-foreground) 9%, transparent)" }}>
      {/* Backdrop Wall & Orbital Arc */}
      <img src={IMG_WALL} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-35" />
      <svg
        className="pointer-events-none absolute -top-24 right-0 h-[420px] w-[720px] overflow-visible"
        viewBox="0 0 720 420"
        aria-hidden="true"
      >
        <path
          d={arcPath(35, 135, 420, -90, 380, 92, 48)}
          fill={activeAccent}
          style={{ opacity: 0.3, transition: "fill 0.8s ease" }}
        />
      </svg>

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Brand Column */}
          <div className="lg:col-span-5">
            <p className="text-xs font-semibold uppercase tracking-widest opacity-70">Smart Kitchen Gastronomy</p>
            <h2 className="mt-1">
              <span className="dsh-display-t1 text-4xl">Atelier</span>
              <span className="dsh-display-t2 text-5xl">Orbit</span>
            </h2>
            <p className="mt-3 max-w-sm text-xs leading-relaxed text-[var(--color-muted-foreground)]">
              An interactive culinary display uniting five Michelin-caliber kitchens—where every plate swings into
              focus with live telemetry, sommelier pairings, and step-by-step chef masterclasses.
            </p>

            {/* Tasting Club Signup Card */}
            <div className="dsh-glass-card mt-6 max-w-md p-4">
              <p className="text-xs font-bold">Join the Chef's Seasonal Tasting Dispatch</p>
              <p className="mt-0.5 text-[11px] text-[var(--color-muted-foreground)]">
                Receive priority chef's counter releases & secret off-menu plates.
              </p>
              {joined ? (
                <p className="mt-3 text-xs font-semibold" style={{ color: "#4a7c3f" }}>
                  ✓ Welcome to the Atelier Orbit Tasting Club!
                </p>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    if (email.trim()) setJoined(true)
                  }}
                  className="mt-3 flex gap-2"
                >
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="chef@atelierorbit.com"
                    className="flex-1 rounded-full border px-3.5 py-1.5 text-xs outline-none"
                    style={{
                      background: "color-mix(in oklab, var(--color-foreground) 5%, transparent)",
                      borderColor: "color-mix(in oklab, var(--color-foreground) 12%, transparent)",
                      color: "var(--color-foreground)",
                    }}
                  />
                  <button
                    type="submit"
                    className="dsh-pill-btn !h-8 !px-4 !text-xs !font-bold"
                    style={{ background: activeAccent, color: "#18181b", borderColor: "transparent" }}
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Pages Links */}
          <div className="lg:col-span-2">
            <p className="mb-3 text-xs font-bold uppercase tracking-wider opacity-65">Experience</p>
            <ul className="m-0 list-none space-y-2 p-0 text-xs">
              {[
                { id: "showcase" as PageId, label: "Orbit Showcase" },
                { id: "menu" as PageId, label: "Full Culinary Menu" },
                { id: "tasting" as PageId, label: "5-Course Odyssey" },
                { id: "chefs" as PageId, label: "Master Chefs" },
                { id: "reserve" as PageId, label: "Table Reservations" },
              ].map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => onNavigate(item.id)}
                    className="cursor-pointer border-0 bg-transparent p-0 text-left opacity-80 transition-opacity hover:opacity-100"
                    style={{ color: "var(--color-foreground)" }}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={onOpenSearch}
                  className="cursor-pointer border-0 bg-transparent p-0 text-left opacity-80 transition-opacity hover:opacity-100"
                  style={{ color: "var(--color-foreground)" }}
                >
                  Search Dishes (⌘K)
                </button>
              </li>
            </ul>
          </div>

          {/* All 8 Orbit Dishes Quick Links */}
          <div className="lg:col-span-3">
            <p className="mb-3 text-xs font-bold uppercase tracking-wider opacity-65">Signature Plates</p>
            <ul className="m-0 grid grid-cols-1 gap-2 list-none p-0 text-xs">
              {ALL_DISHES.slice(0, 6).map((d, i) => (
                <li key={d.id}>
                  <button
                    type="button"
                    onClick={() => onSelectDishInOrbit(d, i)}
                    className="flex cursor-pointer items-center gap-2 border-0 bg-transparent p-0 text-left opacity-80 transition-opacity hover:opacity-100"
                    style={{ color: "var(--color-foreground)" }}
                  >
                    <span className="h-2 w-2 rounded-full" style={{ background: d.accent }} />
                    <span>
                      {d.title} <strong>{d.subtitle}</strong>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Hours & Kitchen Status */}
          <div className="lg:col-span-2">
            <p className="mb-3 text-xs font-bold uppercase tracking-wider opacity-65">Service Hours</p>
            <div className="space-y-2 text-xs opacity-85">
              <p className="m-0">
                <strong className="block">Tue – Thu</strong>
                17:30 – 22:30
              </p>
              <p className="m-0">
                <strong className="block">Fri – Sun</strong>
                17:00 – 23:45
              </p>
              <p className="m-0">
                <strong className="block">Chef's Counter</strong>
                Two Seatings Nightly
              </p>
            </div>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold" style={{ background: "color-mix(in oklab, var(--color-foreground) 7%, transparent)" }}>
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Hearth Live
            </div>
          </div>
        </div>

        <div
          className="mt-10 flex flex-col items-center justify-between gap-4 border-t pt-6 text-[11px] text-[var(--color-muted-foreground)] sm:flex-row"
          style={{ borderColor: "color-mix(in oklab, var(--color-foreground) 8%, transparent)" }}
        >
          <p className="m-0">© {new Date().getFullYear()} Atelier Orbit Smart Kitchen. Crafted with GSAP Orbital Motion.</p>
          <div className="flex flex-wrap gap-3">
            <span>Ember & Oak</span>
            <span>•</span>
            <span>Verde Botanicals</span>
            <span>•</span>
            <span>Tide & Table</span>
            <span>•</span>
            <span>Soleil Bistro</span>
            <span>•</span>
            <span>Osteria Bosco</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
