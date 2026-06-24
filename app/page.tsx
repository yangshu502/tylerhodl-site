'use client'

import { Shield, TrendingUp, FlaskConical, BookOpen, ArrowUpRight, Zap, Sun, Moon, MessageCircle, ExternalLink, X } from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode } from 'react'

type Tool = {
  icon: typeof Shield
  name: string
  nameNode?: ReactNode
  desc: string
  href: string | undefined
  tag: string
  article?: { title: string; href: string }
}

const TOOLS: Tool[] = [
  {
    icon: Shield,
    name: '硬件钱包 · 选择器',
    nameNode: <><span className="text-neon">硬件钱包</span>{' · 选择器'}</>,
    desc: '挑选更适合你的硬件钱包，直达官方，Tyler 全程 1v1 答疑',
    href: '/wallet/',
    tag: 'Web3 生存',
  },
  {
    icon: TrendingUp,
    name: '多资产监控面板',
    desc: '加密货币、美股、港股/A 股，一个页面，查看仓位变化和市场异动',
    href: '/monitor/',
    tag: '投研工具',
  },
  {
    icon: BookOpen,
    name: '投研工作台',
    desc: '信号追踪、赛道图谱，把零散信息变成有用的投研框架',
    href: '/research/',
    tag: '投研工具',
    article: { title: '我用 AI 给自己搭了一个投资工作台', href: 'https://mp.weixin.qq.com/s/GtRzSkOdZKKbGDlkEeT8-g' },
  },
  {
    icon: FlaskConical,
    name: 'MSX 研究院追踪池',
    desc: '麦通前瞻标的表现追踪 + 机会温度计',
    href: undefined,
    tag: '量化研究',
  },
]

const SCENARIOS = [
  {
    title: '我刚开始了解 Web3',
    desc: '了解钱包、私钥、助记词和链上安全，从最基础的内容开始。',
    cta: '进入 Web3 生存手册 →',
    href: '/wallet',
  },
  {
    title: '我准备长期保管资产',
    desc: '比较硬件钱包、使用场景和预算，找到适合自己的方案。',
    cta: '开始选择硬件钱包 →',
    href: '/wallet',
  },
  {
    title: '我已经开始投资',
    desc: '查看行情、管理仓位，并建立自己的研究和复盘框架。',
    cta: '打开投资工具 →',
    href: '/monitor',
  },
]

export default function Home() {
  const [isDark, setIsDark] = useState(true)
  const [avatarErr, setAvatarErr] = useState(false)
  const [wxOpen, setWxOpen] = useState(false)
  const [wxPersonalOpen, setWxPersonalOpen] = useState(false)
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)
  const wxRef = useRef<HTMLDivElement>(null)
  const wxPersonalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'))
  }, [])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wxRef.current && !wxRef.current.contains(e.target as Node)) setWxOpen(false)
      if (wxPersonalRef.current && !wxPersonalRef.current.contains(e.target as Node)) setWxPersonalOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const toggleTheme = () => {
    const next = !isDark
    setIsDark(next)
    document.documentElement.classList[next ? 'add' : 'remove']('dark')
    try { localStorage.setItem('tylerhodl_theme', next ? 'dark' : 'light') } catch {}
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">

      {/* ── QR Lightbox ─────────────────────────────────────────────── */}
      {lightboxSrc && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-6"
          style={{ background: 'rgba(0,0,0,.88)', backdropFilter: 'blur(6px)' }}
          onClick={() => setLightboxSrc(null)}
        >
          <div className="relative bg-white rounded-2xl p-5 shadow-2xl w-72 max-w-full" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setLightboxSrc(null)}
              className="absolute -top-3.5 -right-3.5 w-8 h-8 rounded-full bg-black text-white text-lg font-bold flex items-center justify-center hover:bg-gray-800 transition-colors"
            >×</button>
            <img src={lightboxSrc} className="w-full h-auto rounded-xl block" alt="二维码" />
            <p className="text-center text-xs text-gray-400 mt-3">对准摄像头扫码 · 或长按识别</p>
          </div>
        </div>
      )}

      {/* ── Header ──────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto max-w-screen-xl px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Zap size={17} className="text-neon" />
            <span className="font-bold text-sm tracking-tight text-neon">TylerHodl</span>
            <span className="hidden sm:block text-[11px] tracking-[0.28em] text-muted-foreground/50 ml-2 uppercase select-none">
              Build in Web3
            </span>
          </div>

          <div className="flex items-center gap-1.5">

            {/* Personal WeChat */}
            <div ref={wxPersonalRef} className="relative">
              <button
                onClick={() => { setWxPersonalOpen(v => !v); setWxOpen(false) }}
                title="加我个人微信"
                className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-full border text-[10px] sm:text-xs font-medium transition-all ${
                  wxPersonalOpen
                    ? 'border-[#07C160]/60 bg-[#07C160]/10 text-[#07C160]'
                    : 'border-border bg-secondary/40 text-muted-foreground hover:border-[#07C160]/40 hover:text-[#07C160]'
                }`}
              >
                <MessageCircle size={10} />
                <span className="hidden sm:inline">加微信</span>
              </button>
              {wxPersonalOpen && (
                <div className="absolute right-0 top-full mt-2 z-50 w-44 rounded-2xl border border-border bg-card p-4 shadow-2xl">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] text-muted-foreground font-medium">个人微信</span>
                    <button onClick={() => setWxPersonalOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                      <X size={11} />
                    </button>
                  </div>
                  <div className="w-full aspect-square rounded-xl overflow-hidden bg-white mb-3 flex items-center justify-center">
                    <img src="/wechat-personal.jpg" alt="TylerHodl个人微信"
                      className="w-full h-full object-contain transition-transform duration-150 hover:scale-105"
                      style={{ cursor: 'zoom-in' }}
                      onClick={() => setLightboxSrc('/wechat-personal.jpg')}
                      onError={(e) => {
                        e.currentTarget.parentElement!.innerHTML =
                          '<p class="text-[9px] text-gray-400 text-center px-2">图片加载失败</p>'
                      }} />
                  </div>
                  <p className="text-center text-xs font-bold text-foreground">TylerHodl</p>
                  <p className="text-center text-[10px] text-muted-foreground mt-0.5">扫码加好友</p>
                </div>
              )}
            </div>

            {/* Public WeChat */}
            <div ref={wxRef} className="relative">
              <button
                onClick={() => { setWxOpen(v => !v); setWxPersonalOpen(false) }}
                title="微信公众号"
                className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-full border text-[10px] sm:text-xs font-medium transition-all ${
                  wxOpen
                    ? 'border-[#07C160]/60 bg-[#07C160]/10 text-[#07C160]'
                    : 'border-border bg-secondary/40 text-muted-foreground hover:border-[#07C160]/40 hover:text-[#07C160]'
                }`}
              >
                <MessageCircle size={10} />
                <span className="hidden sm:inline">公众号</span>
              </button>
              {wxOpen && (
                <div className="absolute right-0 top-full mt-2 z-50 w-44 rounded-2xl border border-border bg-card p-4 shadow-2xl">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] text-muted-foreground font-medium">微信公众号</span>
                    <button onClick={() => setWxOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                      <X size={11} />
                    </button>
                  </div>
                  <div className="w-full aspect-square rounded-xl overflow-hidden bg-white mb-3 flex items-center justify-center">
                    <img src="/qrcode-wechat.jpg" alt="扫码关注TylerWeb3"
                      className="w-full h-full object-contain transition-transform duration-150 hover:scale-105"
                      style={{ cursor: 'zoom-in' }}
                      onClick={() => setLightboxSrc('/qrcode-wechat.jpg')}
                      onError={(e) => {
                        e.currentTarget.parentElement!.innerHTML =
                          '<p class="text-[9px] text-gray-400 text-center px-2">将二维码图片存至<br/>/public/qrcode-wechat.jpg</p>'
                      }} />
                  </div>
                  <p className="text-center text-xs font-bold text-foreground">TylerWeb3</p>
                  <p className="text-center text-[10px] text-muted-foreground mt-0.5">微信扫码关注</p>
                </div>
              )}
            </div>

            {/* Twitter/X avatar */}
            <a href="https://x.com/tylerhodl2049" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 group" title="@tylerhodl2049">
              <div className="relative h-7 w-7 sm:h-8 sm:w-8 shrink-0">
                <div className="h-full w-full rounded-full overflow-hidden border-2 border-neon/30 group-hover:border-neon/70 bg-neon/10 transition-colors flex items-center justify-center">
                  {!avatarErr ? (
                    <img src="/avatar-tyler.jpg" alt="太乐Tyler" className="h-full w-full object-cover" onError={() => setAvatarErr(true)} />
                  ) : (
                    <span className="text-neon font-bold text-xs">T</span>
                  )}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-neon border-2 border-background" />
              </div>
              <div className="hidden lg:block leading-tight">
                <div className="flex items-center gap-0.5 text-xs font-semibold text-foreground group-hover:text-neon transition-colors">
                  太乐Tyler
                  <ExternalLink size={9} className="opacity-0 group-hover:opacity-50 transition-opacity" />
                </div>
                <div className="text-[10px] text-muted-foreground/70">@tylerhodl2049</div>
              </div>
            </a>

            <div className="h-4 w-px bg-border/60 mx-0.5" />

            {/* Theme toggle */}
            <button onClick={toggleTheme} title={isDark ? '切换为白天模式' : '切换为黑夜模式'}
              className="flex items-center justify-center w-7 h-7 rounded-md border border-border bg-secondary/40 text-muted-foreground hover:text-foreground transition-colors">
              {isDark ? <Sun size={13} /> : <Moon size={13} />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-screen-xl w-full px-6 pt-8 pb-12 flex flex-col items-center text-center">
        <h1
          className="text-[clamp(3rem,10vw,7rem)] font-black tracking-tight text-neon leading-none mb-4 select-none"
          style={{ textShadow: '0 0 80px #F7931A30, 0 0 20px #F7931A18' }}
        >
          太乐 Tyler
        </h1>

        <p className="text-xl sm:text-2xl font-semibold text-foreground/90 mb-3 select-none">
          把 Web3 讲明白，把投资工具做简单
        </p>

        <p className="text-base text-muted-foreground font-light tracking-widest">
          Coding工具 × Web3 实操 × 投资探索
        </p>

        <div className="flex items-center gap-3 mt-6">
          <a
            href="#tools"
            className="px-5 py-2.5 rounded-lg bg-neon text-black text-sm font-semibold hover:brightness-110 transition-all"
          >
            投研工具
          </a>
          <a
            href="#about"
            className="px-5 py-2.5 rounded-lg border border-neon/40 text-neon/80 text-sm font-medium hover:border-neon hover:text-neon transition-all"
          >
            了解 Tyler
          </a>
        </div>
      </section>

      {/* ── 从哪里开始 ───────────────────────────────────────────────── */}
      <section className="mx-auto max-w-screen-xl w-full px-6 pb-16">
        <div className="w-full flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-border" />
          <span className="text-[10px] tracking-[0.35em] text-muted-foreground/50 uppercase select-none">从哪里开始</span>
          <div className="flex-1 h-px bg-border" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {SCENARIOS.map((s) => (
            <div key={s.title} className="bg-secondary/30 rounded-xl border border-border p-5 flex flex-col gap-3">
              <h3 className="text-sm font-semibold text-foreground">{s.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed flex-1">{s.desc}</p>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-neon/70 hover:text-neon transition-colors font-medium"
              >
                {s.cta}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ── 工具矩阵 ─────────────────────────────────────────────────── */}
      <section id="tools" className="mx-auto max-w-screen-xl w-full px-6 pb-16">
        <div className="w-full flex items-center gap-4 mb-10">
          <div className="flex-1 h-px bg-border" />
          <span className="text-[10px] tracking-[0.35em] text-muted-foreground/50 uppercase select-none">工具矩阵</span>
          <div className="flex-1 h-px bg-border" />
        </div>
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {TOOLS.map((tool) => {
            const Icon = tool.icon
            const isAvailable = tool.href !== undefined
            return (
              <div
                key={tool.name}
                onClick={isAvailable ? () => window.open(tool.href, '_blank', 'noopener,noreferrer') : undefined}
                role={isAvailable ? 'link' : undefined}
                tabIndex={isAvailable ? 0 : undefined}
                onKeyDown={isAvailable ? (e) => { if (e.key === 'Enter') window.open(tool.href, '_blank', 'noopener,noreferrer') } : undefined}
                className={`group relative flex flex-col rounded-xl border bg-card p-6 text-left transition-all duration-300 ${
                  isAvailable
                    ? 'border-border hover:border-neon/40 hover:shadow-[0_0_40px_#F7931A0D] cursor-pointer'
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
                  <div className="font-semibold text-sm text-foreground leading-tight">
                    {tool.nameNode ?? tool.name}
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-muted-foreground leading-relaxed flex-1">
                  {tool.desc}
                </p>

                {/* Related article */}
                {tool.article && (
                  <a
                    href={tool.article.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground/50 hover:text-neon transition-colors"
                  >
                    <BookOpen size={10} className="shrink-0" />
                    <span>{tool.article.title}</span>
                  </a>
                )}

                {/* CTA */}
                <div className="mt-5 pt-4 border-t border-border/50">
                  <span className={`text-xs font-semibold transition-colors ${isAvailable ? 'text-neon/70 group-hover:text-neon' : 'text-muted-foreground/30'}`}>
                    {isAvailable ? '前往 →' : '开发中…'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── 关于 Tyler ───────────────────────────────────────────────── */}
      <section id="about" className="mx-auto max-w-screen-xl w-full px-6 pb-20">
        <div className="w-full flex items-center gap-4 mb-10">
          <div className="flex-1 h-px bg-border" />
          <span className="text-[10px] tracking-[0.35em] text-muted-foreground/50 uppercase select-none">关于 Tyler</span>
          <div className="flex-1 h-px bg-border" />
        </div>
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-neon/30 bg-neon/10 mb-5 flex items-center justify-center shrink-0">
            {!avatarErr ? (
              <img src="/avatar-tyler.jpg" alt="太乐Tyler" className="w-full h-full object-cover" onError={() => setAvatarErr(true)} />
            ) : (
              <span className="text-neon font-bold text-xl">T</span>
            )}
          </div>
          <p className="text-sm text-foreground/80 leading-relaxed max-w-md">
            Web3 独立研究员，关注加密资产、链上实操、Web3 安全、港美股、投研工具
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-md mt-2">
            长期与加密媒体、Web3 钱包、交易所、项目方等展开内容与研究合作
          </p>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <footer className="py-10 text-center select-none border-t border-border/30">
        <div className="flex items-center justify-center gap-6 mb-3">
          <div className="h-px w-20" style={{ background: 'linear-gradient(to right, transparent, #F7931A60)' }} />
          <p className="text-[13px] font-light tracking-[0.42em] text-neon/80">「不做 influencer，做 builder」</p>
          <div className="h-px w-20" style={{ background: 'linear-gradient(to left, transparent, #F7931A60)' }} />
        </div>
        <p className="mt-4 text-[11px] text-muted-foreground/25 tracking-widest">
          © 2026 TylerHodl · Build in Web3
        </p>
      </footer>

    </div>
  )
}
