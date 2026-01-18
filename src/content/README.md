# Content Management

This directory contains all your portfolio content in Markdown format. Edit these files to update your portfolio without touching code!

## File Structure

### Portfolio Hero (`portfolio/hero.md`)
Edit your name, role, description, and button text here.

**Background Image Focal Points:**
The background image uses focal points that shift as you scroll. The focal points are defined in `src/pages/index.astro` in the `focalPoints` array. Each section has a focal point defined as `{ x: percentage, y: percentage }`:
- `x: 100` = right edge, `x: 0` = left edge, `x: 50` = center
- `y: 0` = top edge, `y: 100` = bottom edge, `y: 50` = center

You can customize these focal points to control how the background image moves as users scroll through sections.

### About Section (`about/index.md`)
Write your about paragraphs here. Each paragraph should be separated by a blank line.

**Profile Image:**
- Add your photo to `public/images/profile.jpg`
- Update `imageUrl` in this file to match your filename
- The image will appear in the About section

**Stats** are still in `src/data/config.ts` under `about.stats` - you can move them here later if needed.

### Projects (`projects/`)
Each project has its own markdown file:
- `project-1.md`, `project-2.md`, etc.
- Add more projects by creating new files
- Set `featured: false` to hide a project

### Skills (`skills/`)
Each skill category has its own file:
- `frontend.md`, `backend.md`, `tools.md`
- Add more categories by creating new files

### Contact (`contact/index.md`)
Edit your contact description, email, and social links here.

## How to Edit

1. Open any `.md` file in this directory
2. Edit the frontmatter (the YAML section between `---`) for structured data
3. Edit the body (below the frontmatter) for text content
4. Save the file - changes will appear when you refresh!

## Example: Adding a New Project

Create `src/content/projects/my-new-project.md`:

```markdown
---
title: "My Awesome Project"
description: "A description of what this project does"
technologies: ["React", "TypeScript", "Node.js"]
projectUrl: "https://myproject.com"
codeUrl: "https://github.com/username/project"
featured: true
---
```

The project will automatically appear on your portfolio!

## Fallback

If Content Collections fail to load, the site will automatically fall back to `src/data/config.ts`. This ensures your site always works.
