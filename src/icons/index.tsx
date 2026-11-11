import type { SVGProps } from 'react'
import { SOLAR } from './solar-data'

/**
 * Site icons: Solar (Linear, outlined), bundled locally from src/icons/solar-data.ts, so nothing loads from the web.
 * They use currentColor, so set the colour with a text-* class.
 * To add one: map it in scripts/build-solar-icons.mjs, run the script, and export it below.
 */
export type IconProps = Omit<SVGProps<SVGSVGElement>, 'ref'> & {
  /** Width and height in px (like lucide's `size`). A size-* class overrides it. */
  size?: number | string
  /** Accepted for drop-in compatibility with lucide; Solar sets its own line width, so it has no effect. */
  strokeWidth?: number | string
}
export type IconComponent = (props: IconProps) => React.JSX.Element

function make(name: keyof typeof SOLAR): IconComponent {
  const { body, width, height } = SOLAR[name]
  const Icon = ({ size = 24, strokeWidth: _strokeWidth, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${width} ${height}`}
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      {...props}
      dangerouslySetInnerHTML={{ __html: body }}
    />
  )
  Icon.displayName = `Solar(${name})`
  return Icon
}

export const BookOpen = make('BookOpen')
export const BookCheck = make('BookCheck')
export const Bookmark = make('Bookmark')
export const User = make('User')
export const UserRound = make('UserRound')
export const Mail = make('Mail')
export const MessageSquare = make('MessageSquare')
export const MessageCircle = make('MessageCircle')
export const Send = make('Send')
export const Check = make('Check')
export const Copy = make('Copy')
export const Download = make('Download')
export const ArrowRight = make('ArrowRight')
export const ChevronLeft = make('ChevronLeft')
export const ChevronRight = make('ChevronRight')
export const X = make('X')
export const Play = make('Play')
export const Pause = make('Pause')
export const RotateCcw = make('RotateCcw')
export const Volume2 = make('Volume2')
export const VolumeX = make('VolumeX')
export const Sun = make('Sun')
export const Moon = make('Moon')
export const Briefcase = make('Briefcase')
export const FlaskConical = make('FlaskConical')
export const Newspaper = make('Newspaper')
export const Bot = make('Bot')
export const Cpu = make('Cpu')
export const Gauge = make('Gauge')
export const Plug = make('Plug')
export const Building2 = make('Building2')
export const FileSearch = make('FileSearch')
export const Sparkles = make('Sparkles')
export const Clover = make('Clover')
export const Tuning = make('Tuning')
export const Layers = make('Layers')
export const Transmission = make('Transmission')
