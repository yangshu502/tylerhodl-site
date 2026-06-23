'use client'

import { Shield, TrendingUp, FlaskConical, Github, ArrowUpRight, Zap } from 'lucide-react'

const TOOLS: { icon: typeof Shield; name: string; nameEn: string; desc: string; href: string | undefined; tag: string }[] = [
  {
    icon: Shield,
    name: '硬件钱包筛选器',
    nameEn: 'Hardware Wallet Picker',
    desc: '主流冷钱包横向对比，帮你选对第一个硬件钱包',
    href: '/wallet',
    tag: 'Web3 安全',
  },
  {
    icon: TrendingUp,
    name: '好好赚钱监控面板',
    nameEn: 'Portfolio Monitor',
    desc: '多资产投资组合收益追踪 + 纪律信号备忘录',
    href: '/monitor',
    tag: '投资追踪',
  },
  {
    icon: FlaskConical,
    name: 'MSX 研究院追踪池',
    nameEn: 'MSX Research Tracker',
    desc: '麦通前瞻标的表现追踪 + 机会温度计',
    href: undefined,
    tag: '量化研究',
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">

      {/* ── Header ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto max-w-screen-xl px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Zap size={17} className="text-neon" />
            <span className="font-bold text-sm tracking-tight text-neon">TylerHodl</span>
            <span className="hidden sm:block text-[11px] tracking-[0.28em] text-muted-foreground/50 ml-2 uppercase select-none">
              Build in Web3
            </span>
          </div>
          <a
            href="https://github.com/tylerhodl"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-8 h-8 rounded-md border border-border bg-secondary/40 text-muted-foreground hover:text-foreground hover:border-neon/50 transition-all"
          >
            <Github size={14} />
          </a>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────────────────── */}
      <section className="flex-1 mx-auto max-w-screen-xl w-full px-6 pt-24 pb-16 flex flex-col items-center text-center">

        {/* Badge */}
        <div className="mb-10 inline-flex items-center gap-2 rounded-full border border-neon/25 bg-neon/5 px-4 py-1.5 text-xs text-neon/80">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-neon animate-pulse shrink-0" />
          Web3 Builder · Crypto Investor · Content Creator
        </div>

        {/* Title */}
        <h1
          className="text-[clamp(3rem,10vw,7rem)] font-black tracking-tighter text-neon leading-none mb-6 select-none"
          style={{ textShadow: '0 0 80px #C2E03A30, 0 0 20px #C2E03A18' }}
        >
          TYLERHODL
        </h1>

        {/* Subtitle */}
        <p className="text-base text-muted-foreground font-light tracking-widest mb-5">
          投资工具 &times; Web3 研究 &times; 内容运营
        </p>

        {/* Motto */}
        <p className="text-[13px] tracking-[0.4em] italic text-neon/60 mb-14 select-none">
          「不做 influencer，做 builder」
        </p>

        {/* Stats row */}
        <div className="flex items-center gap-10 mb-20">
          {[
            { value: '3', label: '公开工具' },
            { value: 'BTC', label: '主要资产' },
            { value: '2024', label: '入场年份' },
          ].map((stat, i) => (
            <div key={i} className="flex items-center gap-10">
              {i > 0 && <div className="h-8 w-px bg-border" />}
              <div className="text-center">
                <div className="text-2xl font-mono font-bold tabular-nums">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Section divider */}
        <div className="w-full flex items-center gap-4 mb-12">
          <div className="flex-1 h-px bg-border" />
          <span className="text-[10px] tracking-[0.35em] text-muted-foreground/50 uppercase select-none">工具矩阵</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* ── Tools Grid ─────────────────────────────────────────────── */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-5">
          {TOOLS.map((tool) => {
            const Icon = tool.icon
            const isAvailable = tool.href !== null
            const Wrapper = isAvailable ? 'a' : 'div'
            return (
              <Wrapper
                key={tool.name}
                {...(isAvailable ? { href: tool.href } : {})}
                className={`group relative flex flex-col rounded-xl border bg-card p-6 text-left transition-all duration-300 ${
                  isAvailable
                    ? 'border-border hover:border-neon/40 hover:shadow-[0_0_40px_#C2E03A0D] cursor-pointer'
                    : 'border-border/40 opacity-50 cursor-not-allowed'
                }`}
              >
                {/* Top row */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground/50 border border-border/70 rounded px-2 py-0.5">
                    {tool.tag}
                  </span>
                  {isAvailable ? (
                    <ArrowUpRight size={14} className="text-muted-foreground/30 group-hover:text-neon group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
                  ) : (
                    <span className="text-[10px] text-muted-foreground/40 border border-border/40 rounded px-2 py-0.5">即将上线</span>
                  )}
                </div>

                {/* Icon + Name */}
                <div className="flex items-center gap-3 mb-3">
                  <div className={`flex items-center justify-center w-9 h-9 rounded-lg border shrink-0 transition-colors ${isAvailable ? 'bg-neon/8 border-neon/15 group-hover:bg-neon/15' : 'bg-muted/30 border-border/30'}`}>
                    <Icon size={16} className={isAvailable ? 'text-neon' : 'text-muted-foreground/40'} />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-foreground leading-tight">{tool.name}</div>
                    <div className="text-[11px] text-muted-foreground/50 mt-0.5">{tool.nameEn}</div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-muted-foreground leading-relaxed flex-1">
                  {tool.desc}
                </p>

                {/* CTA */}
                <div className="mt-5 pt-4 border-t border-border/50">
                  <span className={`text-xs font-semibold transition-colors ${isAvailable ? 'text-neon/70 group-hover:text-neon' : 'text-muted-foreground/30'}`}>
                    {isAvailable ? '启动工具 →' : '开发中…'}
                  </span>
                </div>
              </Wrapper>
            )
          })}
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer className="py-10 text-center select-none border-t border-border/30">
        <div className="flex items-center justify-center gap-6 mb-3">
          <div className="h-px w-20" style={{ background: 'linear-gradient(to right, transparent, #C2E03A60)' }} />
          <p className="text-[13px] font-light tracking-[0.42em] text-neon/80">无财作力，少有斗智，既饶争时</p>
          <div className="h-px w-20" style={{ background: 'linear-gradient(to left, transparent, #C2E03A60)' }} />
        </div>
        <p className="text-[10px] tracking-[0.3em] text-muted-foreground/40">——《史记·货殖列传》</p>
        <p className="mt-4 text-[11px] text-muted-foreground/25 tracking-widest">
          © 2026 TylerHodl · Build in Web3
        </p>
      </footer>

    </div>
  )
}
