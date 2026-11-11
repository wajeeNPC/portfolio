import { SKILL } from '../data/skills'
import SkillsDiagram from './skills/SkillsDiagram'

function Skills() {
  return (
    <div>
      {/* Screen readers get one plain list; the diagram repeats it visually. */}
      <ul className="sr-only">
        {Object.values(SKILL).map((skill) => (
          <li key={skill.id}>
            {skill.name}
            {skill.usedIn && `, used in ${skill.usedIn.join(', ')}`}
          </li>
        ))}
      </ul>
      <div aria-hidden="true">
        <SkillsDiagram />
      </div>
    </div>
  )
}

export default Skills
