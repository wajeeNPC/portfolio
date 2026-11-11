import type { Skill } from '../../data/skills'
import { cn } from '../../lib/utils'

/** A skill's brand logo (with its dark-mode version), or its Lucide icon in the accent colour. */
function SkillLogo({ skill, className }: { skill: Skill; className?: string }) {
  const Icon = skill.icon
  if (Icon) return <Icon className={cn('size-8 text-accent', className)} strokeWidth={1.6} aria-hidden="true" />
  return (
    <>
      <img src={skill.logo} alt="" draggable={false} className={cn('size-8', skill.logoDark && 'dark:hidden', className)} />
      {skill.logoDark && <img src={skill.logoDark} alt="" draggable={false} className={cn('hidden size-8 dark:block', className)} />}
    </>
  )
}

export default SkillLogo
