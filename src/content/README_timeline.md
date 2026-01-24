# Timeline Content

This directory contains Markdown files for the interactive timeline component.

## File Structure

Each timeline entry should be a Markdown file named with the year or "today.md" for the present day entry.

Example files:
- `2005.md` - Entry for year 2005
- `2010.md` - Entry for year 2010
- `today.md` - Current/present day entry

## Frontmatter

Each Markdown file must include frontmatter with the following fields:

```yaml
---
title: "Entry Title"
date: "2005"  # or "Today" for today.md
category: "milestone"  # milestone, career, growth, innovation, vision, current
icon: "🎯"  # Emoji or icon to display
---
```

## Content

After the frontmatter, write your narrative content using Markdown:

- Use headings (`##`, `###`) for sections
- Use lists (`-`, `*`) for key points
- Use paragraphs for descriptions
- All standard Markdown syntax is supported

## Categories

Available categories:
- `milestone` - Significant milestones
- `career` - Career-related events
- `growth` - Personal or professional growth
- `innovation` - Innovation and new technologies
- `vision` - Future plans and visions
- `current` - Current status (for today.md)

## Adding New Entries

1. Create a new `.md` file in this directory
2. Name it with the year (e.g., `2023.md`)
3. Add frontmatter with required fields
4. Write your content in Markdown
5. The timeline will automatically include it and sort by date

## Example Entry

```markdown
---
title: "Major Achievement"
date: "2023"
category: "milestone"
icon: "🏆"
---

This was a significant year for me.

## Key Achievements

- Accomplished X
- Launched Y
- Learned Z

## Impact

This experience shaped my future direction...
```
